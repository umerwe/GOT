import React from "react";
import { Button } from "@/components/ui/button";
import MyImage from "../custom/MyImage";

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

interface DocumentCardProps {
  document: {
    id: number;
    name: string;
    status: number;
    is_required: number;
    has_expiry_date: number;
    user_document: UserDocument | null;
    created_at: string;
    updated_at: string;
  };
  onFileUpload?: (documentId: number, file: File) => void;
  uploadedFile?: File;
  onSubmit?: () => void;
  isSubmitting?: boolean;
}

export default function DocumentCard({
  document,
  onFileUpload,
  uploadedFile,
  onSubmit,
  isSubmitting,
}: DocumentCardProps) {
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onFileUpload) {
      onFileUpload(document.id, file);
    }
  };

  const existingDoc = document.user_document;
  const isVerified = existingDoc?.is_verified === 1;

  return (
    <div className="bg-white p-4 border-2 border-dashed border-gray-300">
      {/* Title row */}
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-[15px] font-bold text-gray-900 flex items-center gap-1">
          Upload {document.name}
          {document.is_required === 1 && (
            <span className="text-red-500 text-sm font-bold">*</span>
          )}
        </h3>

        {/* Status badge — only when already submitted */}
        {existingDoc && (
          <span
            className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${isVerified
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
              }`}
          >
            {isVerified ? "Verified" : "Pending"}
          </span>
        )}
      </div>

      {existingDoc && !uploadedFile && (
        <div className="mb-3">
          <MyImage
            src={existingDoc.user_document}
            alt={document.name}
            width={500}
            height={500}
            className="w-full h-32 object-cover border border-gray-200 rounded"
          />
          {existingDoc.expire_date && (
            <p className="text-[12px] text-gray-400 mt-1">
              Expires: {new Date(existingDoc.expire_date).toLocaleDateString()}
            </p>
          )}
        </div>
      )}

      {/* File picker */}
      <label className="cursor-pointer block w-full">
        <input
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
        />
        <div
          className="w-full flex items-center justify-center text-[13px] text-gray-900
          font-semibold bg-white hover:bg-gray-50 transition-colors border-2 border-gray-300 h-[38px]"
        >
          {uploadedFile
            ? uploadedFile.name
            : existingDoc
              ? "Replace file"
              : "Choose file"}
        </div>
      </label>

      {/* Per-document submit — only shown when a new file is staged */}
      {uploadedFile && (
        <Button
          type="button"
          variant="default"
          className="w-full mt-3 h-[38px] text-[13px] font-semibold"
          onClick={onSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Submit document"}
        </Button>
      )}
    </div>
  );
}