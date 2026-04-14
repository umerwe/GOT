"use client";

import AuthGuard from "@/common/auth-guard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ThankYouPage() {
  const router = useRouter();

  return (
    <AuthGuard>
      <div className="bg-gray-50 py-8 flex items-center justify-center h-[calc(100vh-200px)]">        <div className="max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-3xl font-semibold text-[#000000] mb-4">
          Your ad has been posted!
        </h1>
        <p className="text-lg text-gray-600">
          You can view your ad or post another one.
        </p>

        <div className="flex justify-center gap-4 mt-8">
          <Link href="/dashboard">
            <Button
              size="lg"
              className="bg-yellow-100 hover:bg-yellow-200 hover:text-black text-black">
              View Ad
            </Button>
          </Link>
          <Button
            size="lg"
            className="bg-black hover:bg-black/80 text-white font-normal"
            onClick={() => router.replace("/dashboard/post-ad")}
          >
            Post Another Ad
          </Button>
        </div>
      </div>
      </div>
    </AuthGuard>
  );
}