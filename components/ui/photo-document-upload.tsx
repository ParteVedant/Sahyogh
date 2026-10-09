"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, Camera, Check, X, FileText, Image as ImageIcon } from "lucide-react";

export interface PhotoDocument {
  docType: string;
  fileName: string;
  fileDataUrl: string;
  uploadedAt: string;
}

interface PhotoDocumentUploadProps {
  label?: string;
  documentTypes?: string[];
  defaultDocType?: string;
  value?: PhotoDocument | null;
  onChange?: (doc: PhotoDocument | null) => void;
  required?: boolean;
}

const DEFAULT_DOC_TYPES = [
  "Aadhaar Card (Photo ID)",
  "PAN Card",
  "Skill / Qualification Certificate",
  "Work Completion Photo (Before/After)",
  "Issue / Damage Site Photo",
  "Driving License",
  "Address Proof Document",
  "Other Photo Document",
];

export function PhotoDocumentUpload({
  label = "PHOTO DOCUMENT UPLOAD",
  documentTypes = DEFAULT_DOC_TYPES,
  defaultDocType = DEFAULT_DOC_TYPES[0],
  value,
  onChange,
  required = false,
}: PhotoDocumentUploadProps) {
  const [selectedDocType, setSelectedDocType] = useState<string>(
    value?.docType || defaultDocType
  );
  const [previewUrl, setPreviewUrl] = useState<string | null>(value?.fileDataUrl || null);
  const [fileName, setFileName] = useState<string | null>(value?.fileName || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/") && !file.type.includes("pdf")) {
      alert("Please upload an image file (JPG, PNG, WEBP) or PDF document.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setPreviewUrl(dataUrl);
      setFileName(file.name);

      const docObj: PhotoDocument = {
        docType: selectedDocType,
        fileName: file.name,
        fileDataUrl: dataUrl,
        uploadedAt: new Date().toISOString(),
      };
      onChange?.(docObj);
    };
    reader.readAsDataURL(file);
  };

  const handleDocTypeChange = (newDocType: string) => {
    setSelectedDocType(newDocType);
    if (previewUrl && fileName) {
      onChange?.({
        docType: newDocType,
        fileName,
        fileDataUrl: previewUrl,
        uploadedAt: new Date().toISOString(),
      });
    }
  };

  const handleClear = () => {
    setPreviewUrl(null);
    setFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onChange?.(null);
  };

  return (
    <div className="space-y-3 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
      {/* Label & Dropdown Section */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-text-primary uppercase tracking-wider">
          {label} {required && <span className="text-red-500">*</span>}
        </label>

        <div className="relative">
          <select
            value={selectedDocType}
            onChange={(e) => handleDocTypeChange(e.target.value)}
            className="w-full px-3.5 py-2 rounded-lg border border-border text-xs font-bold text-text-primary bg-gray-50 focus:ring-2 focus:ring-primary focus:bg-white focus:outline-none cursor-pointer"
          >
            {documentTypes.map((type) => (
              <option key={type} value={type}>
                📄 Document Type: {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,application/pdf"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Photo Capture / Preview Box */}
      {!previewUrl ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 hover:border-primary rounded-xl p-5 text-center cursor-pointer bg-gray-50/50 hover:bg-blue-50/30 transition-colors space-y-2 group"
        >
          <div className="w-10 h-10 rounded-full bg-blue-100 text-primary flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
            <UploadCloud className="w-5 h-5" />
          </div>

          <div>
            <span className="text-xs font-bold text-text-primary block">
              Click to upload photo or document for <span className="text-primary">{selectedDocType}</span>
            </span>
            <span className="text-[11px] text-text-secondary block mt-0.5">
              Supports JPG, PNG, WEBP &amp; PDF (Max 10MB) • Camera &amp; Gallery supported
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-700 shadow-sm mt-1">
            <Camera className="w-3.5 h-3.5 text-primary" /> Select File / Take Photo
          </div>
        </div>
      ) : (
        <div className="border border-emerald-300 bg-emerald-50/60 rounded-xl p-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 overflow-hidden">
            {previewUrl.startsWith("data:image/") ? (
              <img
                src={previewUrl}
                alt="Document Preview"
                className="w-14 h-14 object-cover rounded-lg border border-emerald-300 shadow-sm shrink-0"
              />
            ) : (
              <div className="w-14 h-14 bg-emerald-200 text-emerald-800 rounded-lg flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6" />
              </div>
            )}

            <div className="min-w-0">
              <span className="px-2 py-0.5 bg-emerald-200 text-emerald-900 rounded text-[10px] font-extrabold uppercase inline-block mb-1">
                ✓ {selectedDocType}
              </span>
              <p className="text-xs font-bold text-text-primary truncate">{fileName}</p>
              <p className="text-[10px] text-emerald-800 font-medium">Photo Attached Successfully</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 py-1.5 bg-white border border-gray-300 hover:border-primary rounded-lg text-xs font-bold text-text-primary shadow-sm cursor-pointer"
            >
              Change
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg text-xs cursor-pointer"
              title="Remove document"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
