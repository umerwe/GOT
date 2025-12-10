"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NoListingsFound({ isFilterPage = true }: { isFilterPage?: boolean }) {
    return (
        <div className="mt-20 flex flex-col items-center justify-center px-4">
            <div className="w-full max-w-sm flex flex-col items-center text-center space-y-6">
                <Image
                    src="/no-result.png"
                    alt="No Listings"
                    width={150}
                    height={150}
                    className="object-contain"
                    priority
                />

                {/* Text */}
                <div className="space-y-2">
                    <h2 className="text-xl font-semibold text-gray-900">
                        No Listings Found
                    </h2>
                    <p className="text-sm text-gray-600">
                        We couldn&apos;t find any listings that match your criteria. Please
                        try adjusting your filters or consider posting a new listing.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3 justify-center">
                    <Button variant="default">
                        <Link href="/post-ad">Post a Listing</Link>
                    </Button>
                    {
                        isFilterPage &&
                        <Link href="/ads/all">
                            <Button variant="outline">
                                Reset Filters
                            </Button>
                        </Link>
                    }
                </div>

                {/* Back to Home */}
                <Link
                    href="/"
                    className="text-sm text-gray-600 hover:text-gray-900"
                >
                    ← Back to Home
                </Link>
            </div>
        </div>
    );
}
