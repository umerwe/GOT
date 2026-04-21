"use client";

import { Loader2 } from "lucide-react";
import { useGetNotifications } from "@/hooks/useNotification";

export default function NotificationsPage() {
  const { data: notificationsResponse, isLoading } = useGetNotifications();
  const notifications = notificationsResponse?.notification_data || [];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold">Notifications</h1>
        </div>
      </div>

      <div className="space-y-5">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-yellow-400" />
          </div>
        ) : notifications.length > 0 ? (
          notifications.map((n: Notification) => (
            <div key={n.id} className="flex gap-3 items-start border-b pb-4">
              <div className="flex-1">
                <p className="font-semibold text-black">{n.data.subject}</p>
                <p className="text-sm text-gray-700">{n.data.message}</p>
                <p className="text-xs text-gray-500 mt-1">{n.created_at}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-10">No notifications found.</p>
        )}
      </div>
    </div>
  );
}
