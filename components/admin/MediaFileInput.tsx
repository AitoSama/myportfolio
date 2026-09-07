"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { validateMediaFile } from "@/lib/storage";

interface MediaFileInputProps {
  label: string;
  file: File | null;
  existingPath?: string;
  disabled: boolean;
  onChange: (file: File | null, error: string | null) => void;
}

function formatFileSize(size: number): string {
  if (size < 1024 * 1024) {
    return `${Math.ceil(size / 1024)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MediaFileInput({
  label,
  file,
  existingPath,
  disabled,
  onChange,
}: MediaFileInputProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const previewUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0] ?? null;
    const fileError = nextFile ? validateMediaFile(nextFile) : null;
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }

    const nextPreviewUrl = nextFile && !fileError
      ? URL.createObjectURL(nextFile)
      : null;
    previewUrlRef.current = nextPreviewUrl;
    setPreviewUrl(nextPreviewUrl);
    onChange(nextFile, fileError);
  };

  return (
    <div className="space-y-2 text-sm">
      <label className="block space-y-2">
        <span>{label}</span>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleChange}
          disabled={disabled}
          className="block w-full border border-input bg-background px-3 py-2 text-sm file:mr-3 file:border-0 file:bg-foreground file:px-3 file:py-1.5 file:text-background disabled:opacity-60"
        />
      </label>
      {file ? (
        <div className="flex gap-3 border border-border bg-background p-2">
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt={`${file.name} preview`}
              width={64}
              height={64}
              unoptimized
              className="h-16 w-16 object-cover"
            />
          ) : null}
          <div className="min-w-0 text-xs text-muted-foreground">
            <p className="truncate font-medium text-foreground">{file.name}</p>
            <p>{file.type} · {formatFileSize(file.size)}</p>
          </div>
        </div>
      ) : existingPath ? (
        <p className="text-xs text-muted-foreground">Current path: {existingPath}</p>
      ) : (
        <p className="text-xs text-muted-foreground">No file selected.</p>
      )}
    </div>
  );
}
