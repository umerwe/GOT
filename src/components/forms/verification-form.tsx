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
  // Track which doc IDs were successfully saved in this session
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());

  const handleFileUpload = (documentId: number, file: File) => {
    setUploadedFiles((prev) => ({ ...prev, [documentId]: file }));
  };

  const handleDocumentSubmit = (documentId: number) => {
    const file = uploadedFiles[documentId];
    if (!file) return;

    setSubmittingIds((prev) => new Set(prev).add(documentId));

    const formData = new FormData();
    formData.append("document_id", String(documentId));
    formData.append("user_document", file);

    saveDocument(formData, {
      onSuccess: () => {
        // Mark this doc as successfully saved via API
        setSavedIds((prev) => new Set(prev).add(documentId));
      },
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
      // Accept if the API already has a user_document (uploaded in a previous session)
      const previouslyUploaded = !!doc.user_document;
      // Accept only if saved successfully via API in this session (not just file-selected)
      const savedThisSession = savedIds.has(doc.id);

      return !previouslyUploaded && !savedThisSession;
    });

    if (missingRequired) {
      toast({
        title: "Required Documents Missing",
        description:
          "Please upload and submit all required documents before continuing.",
        variant: "destructive",
      });
      return;
    }

    router.push("/business-management/onboarding-review");
  };

  return (
    <div className="w-full bg-white px-8 py-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          Business verification documents
        </h2>
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
          <Button
            type="button"
            variant="default"
            className="h-[42px] font-semibold"
            onClick={handleContinue}
          >
            Continue to review
          </Button>
        </div>
      </div>
    </div>
  );
}