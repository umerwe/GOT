import Notification from "@/components/pages/notification";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Notifications | Braaap'
}

export default function NotificationsPage() {
  return (
    <Notification />
  );
}