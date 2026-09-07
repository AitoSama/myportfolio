"use client";

import { useState, type FormEvent } from "react";
import type { Project, ProjectStatus } from "@/types/database";
import type { ProjectInput } from "@/lib/data-access/projects";

interface ProjectFormProps {
  project?: Project | null;
  isSubmitting: boolean;
  error: string | null;
  onSubmit: (project: ProjectInput) => Promise<void>;
  onCancel: () => void;
}

interface ProjectFormState {
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  date: string;
  category: string;
  role: string;
  technologies: string;
  status: ProjectStatus;
  thumbnail: string;
  thumbnailPath: string;
  screenshots: string;
  liveUrl: string;
  sourceUrl: string;
  relatedArtwork: string;
}

const emptyForm: ProjectFormState = {
  slug: "",
  title: "",
  shortDescription: "",
  description: "",
  date: "",
  category: "",
  role: "",
  technologies: "",
  status: "draft",
  thumbnail: "",
  thumbnailPath: "",
  screenshots: "",
  liveUrl: "",
  sourceUrl: "",
  relatedArtwork: "",
};

function toFormState(project?: Project | null): ProjectFormState {
  if (!project) {
    return emptyForm;
  }

  return {
    slug: project.slug,
    title: project.title,
    shortDescription: project.shortDescription,
    description: project.description,
    date: project.date,
    category: project.category,
    role: project.role,
    technologies: project.technologies.join(", "),
    status: project.status,
    thumbnail: project.thumbnail,
    thumbnailPath: project.thumbnailPath ?? "",
    screenshots: project.screenshots.map((screenshot) => screenshot.url).join("\n"),
    liveUrl: project.liveUrl ?? "",
    sourceUrl: project.sourceUrl ?? "",
    relatedArtwork: project.relatedArtwork.join(", "),
  };
}

function splitList(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function toProjectInput(form: ProjectFormState): ProjectInput {
  return {
    slug: form.slug.trim(),
    title: form.title.trim(),
    shortDescription: form.shortDescription.trim(),
    description: form.description.trim(),
    date: form.date.trim(),
    category: form.category.trim(),
    role: form.role.trim(),
    technologies: splitList(form.technologies),
    status: form.status,
    thumbnail: form.thumbnail.trim(),
    ...(form.thumbnailPath.trim()
      ? { thumbnailPath: form.thumbnailPath.trim() }
      : {}),
    screenshots: form.screenshots
      .split("\n")
      .map((url) => url.trim())
      .filter(Boolean)
      .map((url) => ({ url })),
    ...(form.liveUrl.trim() ? { liveUrl: form.liveUrl.trim() } : {}),
    ...(form.sourceUrl.trim() ? { sourceUrl: form.sourceUrl.trim() } : {}),
    relatedArtwork: splitList(form.relatedArtwork),
  };
}

function validateForm(form: ProjectFormState): string | null {
  const requiredFields: Array<[string, string]> = [
    ["slug", form.slug],
    ["title", form.title],
    ["short description", form.shortDescription],
    ["description", form.description],
    ["date", form.date],
    ["category", form.category],
    ["role", form.role],
    ["thumbnail URL", form.thumbnail],
  ];
  const missingField = requiredFields.find(([, value]) => !value.trim());

  if (missingField) {
    return `Please provide a ${missingField[0]}.`;
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.slug.trim())) {
    return "Slug must use lowercase letters, numbers, and single hyphens.";
  }

  return null;
}

export default function ProjectForm({
  project,
  isSubmitting,
  error,
  onSubmit,
  onCancel,
}: ProjectFormProps) {
  const [form, setForm] = useState(() => toFormState(project));
  const [validationError, setValidationError] = useState<string | null>(null);
  const isEditing = Boolean(project);

  const updateField = <Field extends keyof ProjectFormState>(
    field: Field,
    value: ProjectFormState[Field],
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

    await onSubmit(toProjectInput(form));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 border border-border bg-card p-6">
      <div>
        <h2 className="text-xl font-semibold">{isEditing ? "Edit project" : "Create project"}</h2>
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
            placeholder="my-project"
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
          <span>Date *</span>
          <input
            required
            value={form.date}
            onChange={(event) => updateField("date", event.target.value)}
            disabled={isSubmitting}
            placeholder="2026"
            className="w-full border border-input bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
          />
        </label>
        <label className="space-y-2 text-sm">
          <span>Status *</span>
          <select
            value={form.status}
            onChange={(event) => updateField("status", event.target.value as ProjectStatus)}
            disabled={isSubmitting}
            className="w-full border border-input bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </label>
        <label className="space-y-2 text-sm">
          <span>Category *</span>
          <input
            required
            value={form.category}
            onChange={(event) => updateField("category", event.target.value)}
            disabled={isSubmitting}
            className="w-full border border-input bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
          />
        </label>
        <label className="space-y-2 text-sm">
          <span>Role *</span>
          <input
            required
            value={form.role}
            onChange={(event) => updateField("role", event.target.value)}
            disabled={isSubmitting}
            className="w-full border border-input bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
          />
        </label>
      </div>

      <label className="block space-y-2 text-sm">
        <span>Short description *</span>
        <input
          required
          value={form.shortDescription}
          onChange={(event) => updateField("shortDescription", event.target.value)}
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
          <span>Thumbnail URL *</span>
          <input
            required
            type="url"
            value={form.thumbnail}
            onChange={(event) => updateField("thumbnail", event.target.value)}
            disabled={isSubmitting}
            className="w-full border border-input bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
          />
        </label>
        <label className="space-y-2 text-sm">
          <span>Thumbnail storage path</span>
          <input
            value={form.thumbnailPath}
            onChange={(event) => updateField("thumbnailPath", event.target.value)}
            disabled={isSubmitting}
            className="w-full border border-input bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
          />
        </label>
        <label className="space-y-2 text-sm">
          <span>Live URL</span>
          <input
            type="url"
            value={form.liveUrl}
            onChange={(event) => updateField("liveUrl", event.target.value)}
            disabled={isSubmitting}
            className="w-full border border-input bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
          />
        </label>
        <label className="space-y-2 text-sm">
          <span>Source URL</span>
          <input
            type="url"
            value={form.sourceUrl}
            onChange={(event) => updateField("sourceUrl", event.target.value)}
            disabled={isSubmitting}
            className="w-full border border-input bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
          />
        </label>
      </div>

      <label className="block space-y-2 text-sm">
        <span>Technologies</span>
        <input
          value={form.technologies}
          onChange={(event) => updateField("technologies", event.target.value)}
          disabled={isSubmitting}
          placeholder="Next.js, TypeScript, Firebase"
          className="w-full border border-input bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
        />
      </label>

      <label className="block space-y-2 text-sm">
        <span>Screenshot URLs</span>
        <textarea
          rows={3}
          value={form.screenshots}
          onChange={(event) => updateField("screenshots", event.target.value)}
          disabled={isSubmitting}
          placeholder="One URL per line"
          className="w-full resize-y border border-input bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
        />
      </label>

      <label className="block space-y-2 text-sm">
        <span>Related artwork slugs</span>
        <input
          value={form.relatedArtwork}
          onChange={(event) => updateField("relatedArtwork", event.target.value)}
          disabled={isSubmitting}
          placeholder="artwork-slug-01, artwork-slug-02"
          className="w-full border border-input bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
        />
      </label>

      {validationError || error ? (
        <p role="alert" className="text-sm text-destructive">
          {validationError || error}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="border border-foreground bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : isEditing ? "Save changes" : "Create project"}
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
