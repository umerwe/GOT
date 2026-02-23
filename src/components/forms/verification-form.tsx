"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import DocumentCard from "@/components/cards/document-card";
import { useRouter } from "next/navigation";

interface Document {
  id: number;
  name: string;
  status: number;
  is_required: number;
  has_expiry_date: number;
  created_at: string;
  updated_at: string;
}

interface VerificationFormProps {
  documents: Document[];
}

export function VerificationForm({ documents }: VerificationFormProps) {
  const router = useRouter();
  const [uploadedFiles, setUploadedFiles] = useState<Record<number, File>>({});

  const handleFileUpload = (documentId: number, file: File) => {
    setUploadedFiles(prev => ({
      ...prev,
      [documentId]: file
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required documents
    const requiredDocuments = documents.filter(doc => doc.is_required === 1);
    const missingRequiredDocs = requiredDocuments.filter(doc => !uploadedFiles[doc.id]);
    
    if (missingRequiredDocs.length > 0) {
      alert(`Please upload all required documents: ${missingRequiredDocs.map(doc => doc.name).join(', ')}`);
      return;
    }

    // Prepare form data
    const formData = {
      documents: uploadedFiles,
      timestamp: new Date().toISOString()
    };

    console.log("Verification Form Data:", formData);
  
    alert("Documents submitted successfully!");
    
    router.push("/business-management/onboarding-review");
  };

  return (
    <div className="w-full bg-white px-8 py-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Business verification documents</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {documents.map((document) => (
            <DocumentCard
              key={document.id}
              document={document}
              onFileUpload={handleFileUpload}
              uploadedFile={uploadedFiles[document.id]}
            />
          ))}
        </div>

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            className="font-semibold text-black h-[42px]"
            onClick={() => router.back()}
          >
            Back to registration
          </Button>
          <Button
            type="submit"
            variant="default"
            className="h-[42px] font-semibold"
            onClick={() => router.push("/business-management/onboarding-review")}
          >
            Submit for approval
          </Button>
        </div>
      </form>
    </div>
  );
}
