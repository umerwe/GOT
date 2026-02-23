"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import BusinessHeader from "@/components/business/business-header";

export default function OnboardingReviewPage() {
  const router = useRouter();

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
          className="flex items-center justify-between px-5 py-4 my-0"
          style={{ backgroundColor: "#fde9b8" }}
        >
          <div>
            <h2 className="text-[17px]">Next steps</h2>
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
        <div className="bg-white px-8 py-6">
          <h2 className="text-lg mb-4">
            Submission summary
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Business */}
            <div className="border-3 border-gray-300 p-4">
              <p className="text-sm font-bold text-gray-900">Business</p>
              <p className="text-sm text-gray-600 mt-1">Example Motors LLC</p>
              <p className="text-sm text-gray-600">Trade License: TL-000000</p>
            </div>
            {/* Contact */}
            <div className="border-3 border-gray-300 p-4">
              <p className="text-sm font-bold text-gray-900">Contact</p>
              <p className="text-sm text-gray-600 mt-1">Amina Al Ali</p>
              <p className="text-sm text-gray-600">sales@examplemotors.ae</p>
            </div>
            {/* Location */}
            <div className="border-3 border-gray-300 p-4">
              <p className="text-sm font-bold text-gray-900">Location</p>
              <p className="text-sm text-gray-600 mt-1">Dubai, UAE</p>
              <p className="text-sm text-gray-600">Al Quoz</p>
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
              onClick={() => router.push("/business-management/onboarding")}
            >
              Edit application
            </Button>
            <Button
              variant="default"
              className="text-white font-semibold h-[42px]"
              onClick={() => router.push("/business-management/dashboard")}
            >
              Return to dashboard
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}