"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import MediaFileInput from "@/components/admin/MediaFileInput";
import type {
  Artwork,
  ArtworkFormat,
  ArtworkStatus,
  ArtworkType,
} from "@/types/database";
import type { ArtworkInput } from "@/lib/data-access/artworks";
import type { MediaSelection } from "@/lib/storage";

interface ArtworkFormProps {
  artwork?: Artwork | null;
  isSubmitting: boolean;
  error: string | null;
  onSubmit: (artwork: ArtworkInput, media: MediaSelection) => Promise<void>;
  onCancel: () => void;
  submitStatus?: string | null;
}

interface ArtworkFormState {
  slug: string;
  title: string;
  image: string;
  imagePath: string;
  thumbnailPath: string;
  publishedAt: string;
  description: string;
  format: ArtworkFormat;
  type: ArtworkType;
  tools: string;
  tags: string;
  series: string;
  status: ArtworkStatus;
  externalUrl: string;
  relatedProjects: string;
}

const formats: ArtworkFormat[] = [
  "Headshot",
  "Half Body",
  "Full Body",
  "Illustration",
  "Sticker",
  "Sketch",
];

const types: ArtworkType[] = [
  "Original",
  "Fan Art",
  "Commission",
  "Adoptable",
  "Commercial",
];

const statuses: ArtworkStatus[] = ["published", "draft", "archived"];

const emptyForm: ArtworkFormState = {
  slug: "",
  title: "",
  image: "",
  imagePath: "",
  thumbnailPath: "",
  publishedAt: "",
  description: "",
  format: "Illustration",
  type: "Original",
  tools: "",
  tags: "",
  series: "",
  status: "draft",
  externalUrl: "",
  relatedProjects: "",
};

function toFormState(artwork?: Artwork | null): ArtworkFormState {
  if (!artwork) {
    return emptyForm;
  }

  return {
    slug: artwork.slug,
    title: artwork.title,
    image: artwork.image ?? "",
    imagePath: artwork.imagePath ?? "",
    thumbnailPath: artwork.thumbnailPath ?? "",
    publishedAt: artwork.publishedAt,
    description: artwork.description,
    format: artwork.format,
    type: artwork.type,
    tools: artwork.tools.join(", "),
    tags: artwork.tags.join(", "),
    series: artwork.series ?? "",
    status: artwork.status,
    externalUrl: artwork.externalUrl ?? "",
    relatedProjects: artwork.relatedProjects.join(", "),
  };
}

function splitList(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function toArtworkInput(form: ArtworkFormState): ArtworkInput {
  return {
    slug: form.slug.trim(),
    title: form.title.trim(),
    image: form.image.trim(),
    ...(form.imagePath.trim() ? { imagePath: form.imagePath.trim() } : {}),
    ...(form.thumbnailPath.trim() ? { thumbnailPath: form.thumbnailPath.trim() } : {}),
    publishedAt: form.publishedAt.trim(),
    description: form.description.trim(),
    format: form.format,
    type: form.type,
    tools: splitList(form.tools),
    tags: splitList(form.tags),
    ...(form.series.trim() ? { series: form.series.trim() } : {}),
    status: form.status,
    ...(form.externalUrl.trim() ? { externalUrl: form.externalUrl.trim() } : {}),
    relatedProjects: splitList(form.relatedProjects),
  };
}

function validateForm(form: ArtworkFormState): string | null {
  const requiredFields: Array<[string, string]> = [
    ["slug", form.slug],
    ["title", form.title],
    ["published date", form.publishedAt],
    ["description", form.description],
  ];
  const missingField = requiredFields.find(([, value]) => !value.trim());

  if (missingField) {
    return `Please provide a ${missingField[0]}.`;
  }

  if (!form.image.trim() && !form.imagePath.trim()) {
    return "Provide an image URL or select a primary image file.";
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.slug.trim())) {
    return "Slug must use lowercase letters, numbers, and single hyphens.";
  }

  return null;
}

export default function ArtworkForm({
  artwork,
  isSubmitting,
  error,
  onSubmit,
  onCancel,
  submitStatus,
}: ArtworkFormProps) {
  const [form, setForm] = useState(() => toFormState(artwork));
  const [validationError, setValidationError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const isEditing = Boolean(artwork);
  const errorRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (validationError || error) {
      errorRef.current?.focus();
    }
  }, [error, validationError]);

  const updateField = <Field extends keyof ArtworkFormState>(
    field: Field,
    value: ArtworkFormState[Field],
  ) => {
    setForm((current) => ({ ...current, [field]: value }));
    setValidationError(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextError = validateForm(form);

    if (nextError) {
      setValidationError(nextError);
      return;
    }

    await onSubmit(toArtworkInput(form), {
      ...(imageFile ? { image: imageFile } : {}),
      ...(thumbnailFile ? { thumbnail: thumbnailFile } : {}),
    });
  };

  const handleMediaChange = (
    field: "image" | "thumbnail",
    file: File | null,
    fileError: string | null,
  ) => {
    if (field === "image") {
      setImageFile(fileError ? null : file);
    } else {
      setThumbnailFile(fileError ? null : file);
    }
    setValidationError(fileError);
  };

  return (
    <form
      onSubmit={handleSubmit}
      aria-busy={isSubmitting}
      aria-describedby={validationError || error ? "artwork-form-error" : undefined}
      className="space-y-5 border border-border bg-card p-6"
    >
      <div>
        <h2 className="text-xl font-semibold">
          {isEditing ? "Edit artwork" : "Create artwork"}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Required fields are marked with an asterisk.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <label className="space-y-2 text-sm">
          <span>Slug *</span>
          <input
            required
            value={form.slug}
            onChange={(event) => updateField("slug", event.target.value)}
            disabled={isEditing || isSubmitting}
            placeholder="artwork-title"
            className="w-full border border-input bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
          />
          {isEditing ? (
            <span className="block text-xs text-muted-foreground">
              Slugs are locked because they are document IDs.
            </span>
          ) : null}
        </label>
        <label className="space-y-2 text-sm">
          <span>Title *</span>
          <input
            required
            value={form.title}
            onChange={(event) => updateField("title", event.target.value)}
            disabled={isSubmitting}
            className="w-full border border-input bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
          />
        </label>
        <label className="space-y-2 text-sm">
          <span>Published date *</span>
          <input
            required
            value={form.publishedAt}
            onChange={(event) => updateField("publishedAt", event.target.value)}
            disabled={isSubmitting}
            placeholder="2026-09-07"
            className="w-full border border-input bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
          />
        </label>
        <label className="space-y-2 text-sm">
          <span>Status *</span>
          <select
            value={form.status}
            onChange={(event) =>
              updateField("status", event.target.value as ArtworkStatus)
            }
            disabled={isSubmitting}
            className="w-full border border-input bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2 text-sm">
          <span>Format *</span>
          <select
            value={form.format}
            onChange={(event) =>
              updateField("format", event.target.value as ArtworkFormat)
            }
            disabled={isSubmitting}
            className="w-full border border-input bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
          >
            {formats.map((format) => (
              <option key={format} value={format}>
                {format}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2 text-sm">
          <span>Type *</span>
          <select
            value={form.type}
            onChange={(event) =>
              updateField("type", event.target.value as ArtworkType)
            }
            disabled={isSubmitting}
            className="w-full border border-input bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
          >
            {types.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="block space-y-2 text-sm">
        <span>Image URL (optional when uploading)</span>
        <input
          type="url"
          value={form.image}
          onChange={(event) => updateField("image", event.target.value)}
          disabled={isSubmitting}
          className="w-full border border-input bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
        />
      </label>

      <label className="block space-y-2 text-sm">
        <span>Image storage path</span>
        <input
          value={form.imagePath}
          onChange={(event) => updateField("imagePath", event.target.value)}
          disabled={isSubmitting}
          className="w-full border border-input bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
        />
      </label>

      <div className="grid gap-5 md:grid-cols-2">
        <MediaFileInput
          label="Primary image file"
          file={imageFile}
          existingPath={form.imagePath}
          existingUrl={form.image}
          disabled={isSubmitting}
          onChange={(file, fileError) => handleMediaChange("image", file, fileError)}
        />
        <MediaFileInput
          label="Thumbnail image file (optional)"
          file={thumbnailFile}
          existingPath={form.thumbnailPath}
          disabled={isSubmitting}
          onChange={(file, fileError) => handleMediaChange("thumbnail", file, fileError)}
        />
      </div>

      <label className="block space-y-2 text-sm">
        <span>Thumbnail storage path</span>
        <input
          value={form.thumbnailPath}
          onChange={(event) => updateField("thumbnailPath", event.target.value)}
          disabled={isSubmitting}
          className="w-full border border-input bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
        />
      </label>

      <label className="block space-y-2 text-sm">
        <span>Description *</span>
        <textarea
          required
          rows={5}
          value={form.description}
          onChange={(event) => updateField("description", event.target.value)}
          disabled={isSubmitting}
          className="w-full resize-y border border-input bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
        />
      </label>

      <div className="grid gap-5 md:grid-cols-2">
        <label className="space-y-2 text-sm">
          <span>Tools</span>
          <input
            value={form.tools}
            onChange={(event) => updateField("tools", event.target.value)}
            disabled={isSubmitting}
            placeholder="Procreate, Photoshop"
            className="w-full border border-input bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
          />
        </label>
        <label className="space-y-2 text-sm">
          <span>Tags</span>
          <input
            value={form.tags}
            onChange={(event) => updateField("tags", event.target.value)}
            disabled={isSubmitting}
            placeholder="portrait, character"
            className="w-full border border-input bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
          />
        </label>
        <label className="space-y-2 text-sm">
          <span>Series</span>
          <input
            value={form.series}
            onChange={(event) => updateField("series", event.target.value)}
            disabled={isSubmitting}
            className="w-full border border-input bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
          />
        </label>
        <label className="space-y-2 text-sm">
          <span>External URL</span>
          <input
            type="url"
            value={form.externalUrl}
            onChange={(event) => updateField("externalUrl", event.target.value)}
            disabled={isSubmitting}
            className="w-full border border-input bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
          />
        </label>
      </div>

      <label className="block space-y-2 text-sm">
        <span>Related project slugs</span>
        <input
          value={form.relatedProjects}
          onChange={(event) => updateField("relatedProjects", event.target.value)}
          disabled={isSubmitting}
          placeholder="project-slug-01, project-slug-02"
          className="w-full border border-input bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
        />
      </label>

      {validationError || error ? (
        <p ref={errorRef} id="artwork-form-error" tabIndex={-1} role="alert" className="text-sm text-destructive">
          {validationError || error}
        </p>
      ) : null}
      {submitStatus ? (
        <p role="status" aria-live="polite" className="text-sm text-muted-foreground">
          {submitStatus}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="border border-foreground bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting
            ? "Saving..."
            : isEditing
              ? "Save changes"
              : "Create artwork"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="border border-border px-4 py-2 text-sm font-medium hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
