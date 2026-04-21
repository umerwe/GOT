"use client";

import { useEffect, useState } from "react";
import { getFirebaseMessaging } from "@/lib/firebase";
import {
    getToken,
    onMessage,
    isSupported,
    Messaging,
    deleteToken,
} from "firebase/messaging";

export default function NotificationProvider() {
    const [isClient, setIsClient] = useState(false);
    const [fcmToken, setFcmToken] = useState<string | null>(null);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (!isClient) return;

        const initializeNotifications = async () => {
            try {
                const supported = await isSupported();
                if (!supported) return;

                if (!("serviceWorker" in navigator) || !("Notification" in window)) return;

                if (!navigator.serviceWorker.controller) {
                    await new Promise((resolve) => window.addEventListener("load", resolve));
                }

                const messagingInstance = getFirebaseMessaging();
                if (!messagingInstance) return;

                const registration = await navigator.serviceWorker.register(
                    "/firebase-messaging-sw.js",
                    { scope: "/" }
                );

                const permission = await Notification.requestPermission();
                if (permission !== "granted") return;

                const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
                if (!vapidKey) return;

                const token = await getToken(messagingInstance, {
                    vapidKey,
                    serviceWorkerRegistration: registration,
                });

                if (token) {
                    setFcmToken(token);
                    await sendTokenToServer(token);
                }

                onMessage(messagingInstance, (payload) => {
                    const title = payload.notification?.title || "Notification";
                    const body = payload.notification?.body || "";

                    if (Notification.permission === "granted") {
                        const notification = new Notification(title, {
                            body,
                            icon: payload.notification?.icon || "/icons/icon-192.png",
                        });

                        notification.onclick = () => {
                            window.focus();
                            window.location.href = payload.data?.click_action || "/notifications";
                            notification.close();
                        };
                    }
                });

                setupTokenValidityCheck(messagingInstance, vapidKey, registration);
            } catch {
                // silently fail in production
            }
        };

        initializeNotifications();
    }, [isClient]);

    const setupTokenValidityCheck = async (
        messaging: Messaging,
        vapidKey: string,
        registration: ServiceWorkerRegistration
    ) => {
        const intervalId = setInterval(async () => {
            try {
                const currentToken = await getToken(messaging, {
                    vapidKey,
                    serviceWorkerRegistration: registration,
                });

                if (currentToken && currentToken !== fcmToken) {
                    setFcmToken(currentToken);
                    await sendTokenToServer(currentToken);
                }
            } catch {
                await handleTokenRefresh(messaging, vapidKey, registration);
            }
        }, 30 * 60 * 1000);

        return () => clearInterval(intervalId);
    };

    const handleTokenRefresh = async (
        messaging: Messaging,
        vapidKey: string,
        registration: ServiceWorkerRegistration
    ) => {
        try {
            await deleteToken(messaging);

            const newToken = await getToken(messaging, {
                vapidKey,
                serviceWorkerRegistration: registration,
            });

            if (newToken) {
                setFcmToken(newToken);
                await sendTokenToServer(newToken);
            }
        } catch {
            // silently fail in production
        }
    };

    const sendTokenToServer = async (token: string) => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/update-profile`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ fcm_token: token }),
                }
            );

            if (!response.ok) {
                throw new Error(`Failed to send token: ${response.status}`);
            }
        } catch {
            // silently fail in production
        }
    };

    return null;
}