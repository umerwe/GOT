import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import DocumentCard from "@/components/cards/document-card";
import { useRouter } from "next/navigation";
import { useSaveBusinessDocument } from "@/hooks/useBusiness";
import { toast } from "../ui/toast";

interface UserDocument {
  id: number;
  user_id: number;
  document_id: number;
  document_name: string;
  user_name: string;
  is_verified: number;
  expire_date: string | null;
  user_document: string;
  created_at: string;
  updated_at: string;
}

interface Document {
  id: number;
  name: string;
  status: number;
  is_required: number;
  has_expiry_date: number;
  user_document: UserDocument | null;
  created_at: string;
  updated_at: string;
}

interface VerificationFormProps {
  documents: Document[];
}

export function VerificationForm({ documents }: VerificationFormProps) {
  const router = useRouter();
  const { mutate: saveDocument } = useSaveBusinessDocument();

  const [uploadedFiles, setUploadedFiles] = useState<Record<number, File>>({});
  const [submittingIds, setSubmittingIds] = useState<Set<number>>(new Set());

  const handleFileUpload = (documentId: number, file: File) => {
    setUploadedFiles((prev) => ({ ...prev, [documentId]: file }));
  };

  const handleDocumentSubmit = (documentId: number) => {
    const file = uploadedFiles[documentId];
    if (!file) return;

    setSubmittingIds((prev) => new Set(prev).add(documentId));

    const formData = new FormData();
    formData.append("document_id", String(documentId));
    formData.append("document", file);

    saveDocument(formData, {
      onSettled: () => {
        setSubmittingIds((prev) => {
          const next = new Set(prev);
          next.delete(documentId);
          return next;
        });
      },
    });
  };

  const handleContinue = () => {
    const requiredDocs = documents.filter((doc) => doc.is_required === 1);

    const missingRequired = requiredDocs.some((doc) => {
      const alreadyUploaded = !!doc.user_document;

      const newlyUploaded = !!uploadedFiles[doc.id];

      return !alreadyUploaded && !newlyUploaded;
    });

    if (missingRequired) {
      toast({
        title: "Required Documents Missing",
        description: "Please submit all required documents before continuing.",
        variant: "destructive",
      });
      return;
    }

    router.push("/business-management/onboarding-review");
  };

  return (
    <div className="w-full bg-white px-8 py-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Business verification documents</h2>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {documents.map((document) => (
            <DocumentCard
              key={document.id}
              document={document}
              onFileUpload={handleFileUpload}
              uploadedFile={uploadedFiles[document.id]}
              onSubmit={() => handleDocumentSubmit(document.id)}
              isSubmitting={submittingIds.has(document.id)}
            />
          ))}
        </div>

        <div className="flex gap-4">
          {/* <Button
            type="button"
            variant="outline"
            className="font-semibold text-black h-[42px]"
            onClick={() => router.back()}
          >
            Back to registration
          </Button> */}
          <Button
            type="button"
            variant="default"
            className="h-[42px] font-semibold"
            onClick={handleContinue}>
            Continue to review
          </Button>
        </div>
      </div>
    </div>
  );
}