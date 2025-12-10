"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type Img = { url: string; id: string };

export default function ImageDropzone({ max = 5 }: { max?: number }) {
  const [images, setImages] = useState<Img[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  function onFiles(files: FileList | null) {
    if (!files?.length) return;
    const allowed = Array.from(files).slice(0, max - images.length);
    const next = allowed.map((f) => ({ url: URL.createObjectURL(f), id: crypto.randomUUID() }));
    setImages((s) => [...s, ...next]);
  }

  function remove(id: string) {
    const img = images.find((i) => i.id === id);
    if (img) URL.revokeObjectURL(img.url);
    setImages((s) => s.filter((i) => i.id !== id));
  }

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        className="border-2 border-dashed rounded-lg p-8 text-center bg-white"
        onClick={() => inputRef.current?.click()}
      >
        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-600">Drag & drop photos here</p>
        <p className="text-xs text-gray-500">or click to select (max {max})</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => onFiles(e.target.files)}
        />
      </div>

      {/* Thumbs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {images.map((img) => (
          <div key={img.id} className="relative h-24 rounded-lg overflow-hidden border bg-gray-50">
            <Image src={img.url} alt="" fill className="object-cover" />
            <button
              type="button"
              onClick={() => remove(img.id)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
              aria-label="remove"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
        {Array.from({ length: Math.max(0, max - images.length) }).map((_, i) => (
          <div key={`ph-${i}`} className="h-24 rounded-lg border-2 border-dashed bg-gray-50" />
        ))}
      </div>

      <div className="text-xs text-gray-500">Max {max} photos, .JPG/.PNG only</div>
      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={() => inputRef.current?.click()}>Upload photos</Button>
        <Button type="button" variant="ghost" onClick={() => setImages([])}>Clear</Button>
      </div>
    </div>
  );
}
