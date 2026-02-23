"use client";

import React from "react";

interface DocumentCardProps {
  document: {
    id: number;
    name: string;
    status: number;
    is_required: number;
    has_expiry_date: number;
    created_at: string;
    updated_at: string;
  };
  onFileUpload?: (documentId: number, file: File) => void;
  uploadedFile?: File;
}

export default function DocumentCard({
  document,
  onFileUpload,
  uploadedFile,
}: DocumentCardProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onFileUpload) {
      onFileUpload(document.id, file);
    }
  };

  const getDocumentDescription = (name: string) => {
    switch (name.toLowerCase()) {
      case "license":
        return "Front and back in one file.";
      case "vehicle registration":
      case "insurance":
        return "PDF or JPG, max 10MB.";
      case "photo of vehicle":
        return "JPG or PNG, max 5MB.";
      case "w-9":
        return "PDF only, max 5MB.";
      default:
        return "PDF or JPG, max 10MB.";
    }
  };

  return (
    <div className="bg-white p-4 border-2 border-dashed border-gray-300">
      {/* Title */}
      <h3 className="text-[15px] font-bold text-gray-900 mb-1 flex items-center gap-1">
        Upload {document.name}
        {document.is_required === 1 && (
          <span className="text-red-500 text-sm font-bold">*</span>
        )}
      </h3>

      {/* Description */}
      <p className="text-[13px] text-gray-500 mb-2">
        {getDocumentDescription(document.name)}
      </p>

      <label className="cursor-pointer block w-full">
        <input
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
        />
        <div className="w-full flex items-center justify-center text-[13px] text-gray-900
         font-semibold bg-white hover:bg-gray-50 transition-colors border-2 border-gray-300 h-[38px]"
        >
          {uploadedFile ? uploadedFile.name : "Choose file"}
        </div>
      </label>
    </div>
  );
}