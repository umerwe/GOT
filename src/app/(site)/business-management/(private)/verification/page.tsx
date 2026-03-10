"use client"
import React from 'react'
import { useGetRequiredDocuments } from '@/hooks/useBusiness'
import BusinessHeader from "@/components/business-header";
import Container from "@/components/container";
import { VerificationForm } from "@/components/forms/verification-form";

const VerificationPage = () => {
    const { data: requiredDocuments, isLoading, isFetching, error } = useGetRequiredDocuments();

    const documents = requiredDocuments;

    if (isLoading || isFetching) {
        return (
            <div className="py-10 bg-gray-50 min-h-screen">
                <Container>
                    <div className="max-w-4xl mx-auto">
                        <div className="animate-pulse">

                            {/* Header Skeleton */}
                            <div className="mb-6">
                                <div className="h-8 bg-gray-300 rounded w-2/3 mb-3"></div>
                                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                            </div>

                            {/* Document Grid Skeleton */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[1, 2, 3, 4].map((i) => (
                                    <div
                                        key={i}
                                        className="bg-white p-6 rounded-lg shadow-sm border space-y-4"
                                    >
                                        <div className="h-5 bg-gray-300 rounded w-1/2"></div>
                                        <div className="h-10 bg-gray-200 rounded"></div>
                                        <div className="h-10 bg-gray-300 rounded w-1/3"></div>
                                    </div>
                                ))}
                            </div>

                            {/* Buttons Skeleton */}
                            <div className="flex gap-4 mt-8">
                                <div className="h-[42px] bg-gray-300 rounded w-40"></div>
                                <div className="h-[42px] bg-gray-400 rounded w-40"></div>
                            </div>

                        </div>
                    </div>
                </Container>
            </div>
        );
    }

    if (error) {
        return (
            <div className="py-10 bg-gray-50 min-h-screen">
                <Container>
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Documents</h1>
                        <p className="text-gray-600">Failed to load required documents. Please try again later.</p>
                    </div>
                </Container>
            </div>
        );
    }

    return (
        <div className="py-10 bg-gray-50 min-h-screen">
            <Container>
                <div className="max-w-4xl mx-auto">
                    <BusinessHeader
                        title="Verify your business"
                        description="Upload the required documents to complete your business verification process."
                    />
                    <VerificationForm documents={documents} />
                </div>
            </Container>
        </div>
    )
}

export default VerificationPage