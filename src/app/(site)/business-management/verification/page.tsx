"use client"
import React from 'react'
import { useGetRequiredDocuments } from '@/hooks/useBusiness'
import BusinessHeader from "@/components/business/business-header";
import Container from "@/components/container";
import { VerificationForm } from "@/components/forms/verification-form";

const VerificationPage = () => {
    const { data: requiredDocuments, isLoading, error } = useGetRequiredDocuments();

    const documents = requiredDocuments;

    if (isLoading) {
        return (
            <div className="py-10 bg-gray-50 min-h-screen">
                <Container>
                    <div className="max-w-4xl mx-auto">
                        <div className="animate-pulse">
                            <div className="h-8 bg-gray-300 rounded mb-4 w-3/4"></div>
                            <div className="h-4 bg-gray-300 rounded mb-8 w-1/2"></div>
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="h-32 bg-gray-300 rounded"></div>
                                ))}
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