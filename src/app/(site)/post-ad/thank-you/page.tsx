import AuthGuard from "@/common/auth-guard";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ThankYouPage() {
  return (
   <AuthGuard>
     <div className="bg-gray-50 py-8 flex items-center justify-center min-h-screen">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-3xl font-semibold text-[#000000] mb-4">
          Your ad has been posted!
        </h1>
        <p className="text-lg text-gray-600">
          Your ad is now live and visible to potential buyers.
          You can view your ad or post another one.
        </p>

        <div className="flex justify-center gap-4 mt-8">
          <Link href="/dashboard">
            <Button
            size="lg"
            className="bg-yellow-100 hover:bg-yellow-200 text-black">
              View Ad
            </Button>
          </Link>
          <Link href="/post-ad">
            <Button
              variant="default"
              size="lg"
              className="text-black"
            >
              Post Another Ad
            </Button>
          </Link>
        </div>
      </div>
    </div>
   </AuthGuard>
  );
}
