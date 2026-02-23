// hooks/useAuth.ts
"use client";

import { useMutation } from "@tanstack/react-query";
import { forgetPassword, login, signup } from "@/services/auth";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { setUserData } from "@/store/slices/AuthSlice";
import { toast } from "@/components/ui/toast";
import { AxiosError } from "axios";
import { ExtendedSession } from "@/types/auth";

// NEW imports for Firebase
// import { getFirebaseMessaging } from "@/lib/firebase";
// import { getToken } from "firebase/messaging";
// import { ExtendedSession } from "@/types/auth";

export const useLogin = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: login,
    onSuccess: async (data) => {
      dispatch(setUserData(data));
      localStorage.setItem("token", data.auth_token);

      toast({
        title: "Login Successful",
        description: "Welcome back! You're now logged in.",
      });

      // Redirect immediately
      router.push("/");

      // Fire-and-forget FCM token handling
      // (async () => {
      //   try {
      //     const messaging = getFirebaseMessaging();
      //     if (messaging) {
      //       const fcmToken = await getToken(messaging, {
      //         vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      //         serviceWorkerRegistration: await navigator.serviceWorker.ready,
      //       });

      //       if (fcmToken) {
      //         localStorage.setItem("fcm_token", fcmToken);
      //         await fetch(
      //           `${process.env.NEXT_PUBLIC_BASE_URL}/update-profile`,
      //           {
      //             method: "POST",
      //             headers: {
      //               "Content-Type": "application/json",
      //               Authorization: `Bearer ${data.auth_token}`,
      //             },
      //             body: JSON.stringify({ fcm_token: fcmToken }),
      //           }
      //         );
      //       }
      //     }
      //   } catch (error) {
      //     console.error("Failed to generate/send FCM token:", error);
      //   }
      // })();
    },

    onError: (err: AxiosError<{ message: string }>) => {
      toast({
        title: "Login Failed",
        description: `${err?.response?.data?.message}`,
        variant: "destructive",
      });
    },
  });
};

export const useSignup = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: signup,
    onSuccess: () => {
      toast({
        title: "Signup Successful",
        description: "Your account has been created! Please log in.",
      });
      router.push("/auth/login");
    },
    onError: (err: AxiosError<{ message: string }>) => {
      toast({
        title: "Signup Failed",
        description: `${err?.response?.data?.message}`,
        variant: "destructive",
      });
    },
  });
};

export const useHandleSessionAuth = () => {
  const dispatch = useAppDispatch();

  return (session: ExtendedSession) => {
    if (session?.socialLoginResult?.data) {
      const { auth_token, id } = session.socialLoginResult.data;
      dispatch(setUserData({ auth_token, userId: String(id) }));
    }
  };
};

export const useForgetPassword = () => {
  return useMutation({
    mutationFn: forgetPassword,
    onSuccess: () => {  
      toast({
        title: "We have emailed your password reset link!",
      });
    },
    onError: (err: AxiosError<{ message: string }>) => {
      toast({
        title: "Request Failed",
        description: err?.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    },
  });
};

// "use client"

// import { useMutation } from "@tanstack/react-query"
// import { login, signup } from "@/services/auth"
// import { useRouter } from "next/navigation"
// import { useAppDispatch } from "@/store/hooks"
// import { setUserData } from "@/store/slices/AuthSlice"
// import { toast } from "@/components/ui/toast"
// import { AxiosError } from "axios"

// export const useLogin = () => {
//   const router = useRouter()
//   const dispatch = useAppDispatch()

//   return useMutation({
//     mutationFn: login,
//     onSuccess: (data: { userId: string, auth_token: string }) => {
//       dispatch(setUserData(data))
//       toast({
//         title: "Login Successful",
//         description: "Welcome back! You're now logged in.",
//       })
//       router.push("/")
//     },
//     onError: (err: AxiosError<{ message: string }>) => {
//       toast({
//         title: "Login Failed",
//         description: `${err?.response?.data?.message}`,
//         variant: "destructive",
//       })
//     },
//   })
// }

// export const useSignup = () => {
//   const router = useRouter()

//   return useMutation({
//     mutationFn: signup,
//     onSuccess: () => {
//       toast({
//         title: "Signup Successful",
//         description: "Your account has been created! Please log in.",
//       })
//       router.push("/auth/login")
//     },
//     onError: (err: AxiosError<{ message: string }>) => {
//       toast({
//         title: "Signup Failed",
//         description: `${err?.response?.data?.message}`,
//         variant: "destructive",
//       })
//     },
//   })
// }
