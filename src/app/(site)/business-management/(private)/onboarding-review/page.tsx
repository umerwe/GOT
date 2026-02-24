"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import BusinessHeader from "@/components/business-header";
import { useGetProfile } from "@/hooks/useProfile";

export default function OnboardingReviewPage() {
  const router = useRouter();
  const { data } = useGetProfile();
  
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Page Heading */}
        <BusinessHeader
          title="Thanks, your application is in review"
          description="We typically respond within 2 business days for Dubai-based accounts."
        />

        {/* Next Steps Banner */}
        <div
          className="flex items-center justify-between px-5 py-4 my-0 bg-[#fde9b8]"
        >
          <div>
            <h2 className="text-[17px]">Under Review</h2>
            <p className="text-[13px] mt-0.5">
              Our compliance team will review your documents and confirm your account status by email.
            </p>
          </div>
          <Button
            variant='secondary'
            onClick={() => router.push("/business-management/verification")}
          >
            View submitted documents
          </Button>
        </div>

        {/* Submission Summary */}
        <div className="bg-white px-8 py-8">
          <h2 className="text-lg font-semibold mb-4">
            Submission Summary
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Business */}
            <div className="border-3 border-gray-300 p-5">
              <p className="text-base font-semibold text-gray-900">Business</p>
              <p className="text-[13px] text-gray-600 mt-1 capitalize">
                {data?.name}
              </p>
            </div>

            {/* Contact */}
            <div className="border-3 border-gray-300 p-5">
              <p className="text-base font-semibold text-gray-900">Contact</p>
              <p className="text-[13px] text-gray-600 mt-1">
                {data?.email}
              </p>
              <p className="text-[13px] text-gray-600 mt-1">
                {data?.phoneNumber}
              </p>
            </div>

            {/* Location */}
            <div className="border-3 border-gray-300 p-5">
              <p className="text-base font-semibold text-gray-900">Location</p>
              <p className="text-[13px] text-gray-600 mt-1 capitalize">
                {data?.address}
              </p>
            </div>

          </div>
        </div>

        {/* What you can do now */}
        <div className="bg-white px-8 py-6">
          <h2 className="text-lg mb-3">
            What you can do now
          </h2>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 mb-6">
            <li>Prepare your inventory list and pricing for faster listing creation.</li>
            <li>Assign teammates who will manage listings and inquiries.</li>
            <li>Review platform policies for motorcycle listings in the UAE.</li>
          </ul>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="font-semibold text-gray-900 h-[42px]"
              onClick={() => router.push("/business-management/profile")}
            >
              Edit Profile
            </Button>
            <a
              href="https://new.getoutthere-app.com/login"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="default"
                className="text-white font-semibold h-[42px]"
              >
                Return to dashboard
              </Button>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}