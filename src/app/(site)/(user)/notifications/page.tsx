"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";

interface Notification {
  id: string | number;
  title: string;
  body: string;
  created_at: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/notification-list`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({}),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch notifications");
        return res.json();
      })
      .then((data: Notification[]) => {
        setNotifications(data);
      })
      .catch((err) => console.error("Failed to load notifications:", err));
  }, []);
  
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Bell className="w-6 h-6 text-yellow-400" />
          <h1 className="text-xl font-semibold">Notifications</h1>
        </div>
      </div>

      <div className="space-y-5">
        {notifications.map((n) => (
          <div key={n.id} className="flex gap-3 items-start border-b pb-4">
            <div>
              <p className="font-semibold">{n.title}</p>
              <p className="text-xs text-gray-500">{n.created_at}</p>
              <p className="text-sm text-gray-700">{n.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// "use client";
// import { Bell, CheckCircle, Mail, Clock } from "lucide-react";
// import { Button } from "@/components/ui/button";

// export default function NotificationsPage() {
//   return (
//     <div className="max-w-3xl mx-auto px-4 py-8">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <div className="flex items-center gap-2">
//           <Bell className="w-6 h-6 text-yellow-400" />
//           <h1 className="text-xl font-semibold">Notifications</h1>
//         </div>
//         <div className="flex items-center gap-3">
//           <button className="bg-yellow-400 px-3 py-1 rounded text-sm font-medium">
//             Mark all as read
//           </button>
//         </div>
//       </div>

//       <div className="space-y-5">
//         {/* Notification 1 */}
//         <div className="flex gap-3 items-start border-b pb-4">
//           <CheckCircle className="w-5 h-5 text-yellow-400 mt-1" />
//           <div>
//             <p className="font-semibold">Your ad is live!</p>
//             <p className="text-xs text-gray-500">5 minutes ago</p>
//             <p className="text-sm text-gray-700">
//               Your ad for &quot;Vintage Leather Jacket&quot; is live and visible
//               to potential buyers.
//             </p>
//           </div>
//         </div>

//         {/* Notification 2 (Updated) */}
//         <div className="flex gap-3 items-start border-b pb-4">
//           <Mail className="w-5 h-5 text-yellow-400 mt-1" />
//           {/* 🔹 CHANGED: made flex-row with justify-between */}
//           <div className="flex-1 flex justify-between items-start">
//             <div>
//               <p className="font-semibold">New message from Sarah</p>
//               <p className="text-xs text-gray-500">10 minutes ago</p>
//               <p className="text-sm text-gray-700">
//                 A buyer Sarah has sent you a message, please check your
//                 messages.
//               </p>
//             </div>
//             <Button className="bg-yellow-400 text-black hover:bg-yellow-500 ml-3">
//               Reply
//             </Button>
//           </div>
//         </div>

//         {/* Notification 3 (Updated) */}
//         <div className="flex gap-3 items-start border-b pb-4">
//           <Clock className="w-5 h-5 text-yellow-400 mt-1" />
//           {/* 🔹 CHANGED: made flex-row with justify-between */}
//           <div className="flex-1 flex justify-between items-start">
//             <div>
//               <p className="font-semibold">Ad About to Expire</p>
//               <p className="text-xs text-gray-500">1 day ago</p>
//               <p className="text-sm text-gray-700">
//                 Your ad for &quot;Handmade&quot; is about to expire. Renew now
//                 to keep it visible.
//               </p>
//             </div>
//             <Button className="bg-yellow-400 text-black hover:bg-yellow-500 ml-3">
//               Renew
//             </Button>
//           </div>
//         </div>

//         {/* Notification 4 */}
//         <div className="flex gap-3 items-start">
//           <CheckCircle className="w-5 h-5 text-yellow-400 mt-1" />
//           <div>
//             <p className="font-semibold">Ad Approved</p>
//             <p className="text-xs text-gray-500">2 hours ago</p>
//             <p className="text-sm text-gray-700">
//               Your ad for &quot;Signed First Edition Book&quot; has been
//               approved and is now live on the platform.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
