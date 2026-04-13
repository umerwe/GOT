import PostAd from "@/components/ads/post-ad";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Post Ad",
};

export default function PostAdPage() {
  return <PostAd />;
}
