import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
  type StorageReference,
} from "firebase/storage";
import { storage } from "@/lib/firebase";

export type MediaNamespace = "projects" | "artworks";
export type MediaVariant = "image" | "thumbnail";
export type MediaSelection = Partial<Record<MediaVariant, File>>;

export const MAX_MEDIA_FILE_SIZE = 10 * 1024 * 1024;
export const ALLOWED_MEDIA_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function assertSlug(slug: string): void {
  if (!slugPattern.test(slug)) {
    throw new Error(
      "Media slugs must use lowercase letters, numbers, and single hyphens.",
    );
  }
}

export function getPortfolioMediaPath(
  namespace: MediaNamespace,
  slug: string,
  variant: MediaVariant,
): string {
  assertSlug(slug);
  return `${namespace}/${slug}/${variant}`;
}

export function getStorageReference(storagePath: string): StorageReference {
  const normalizedPath = storagePath.trim();

  if (!normalizedPath) {
    throw new Error("Storage paths cannot be empty.");
  }

  return ref(storage, normalizedPath);
}

export function getPortfolioMediaReference(
  namespace: MediaNamespace,
  slug: string,
  variant: MediaVariant,
): StorageReference {
  return getStorageReference(getPortfolioMediaPath(namespace, slug, variant));
}

export function validateMediaFile(file: File): string | null {
  if (!ALLOWED_MEDIA_TYPES.includes(file.type as (typeof ALLOWED_MEDIA_TYPES)[number])) {
    return "Choose a JPEG, PNG, WebP, or GIF image.";
  }

  if (file.size > MAX_MEDIA_FILE_SIZE) {
    return "Images must be 10 MB or smaller.";
  }

  return null;
}

export async function uploadPortfolioMedia(
  namespace: MediaNamespace,
  slug: string,
  variant: MediaVariant,
  file: File,
): Promise<string> {
  const validationError = validateMediaFile(file);

  if (validationError) {
    throw new Error(validationError);
  }

  const storageReference = getPortfolioMediaReference(namespace, slug, variant);
  await uploadBytes(storageReference, file, { contentType: file.type });
  return getPortfolioMediaPath(namespace, slug, variant);
}

export async function uploadPortfolioMediaSelection(
  namespace: MediaNamespace,
  slug: string,
  media: MediaSelection,
): Promise<Partial<Record<MediaVariant, string>>> {
  const uploadedPaths: string[] = [];
  const paths: Partial<Record<MediaVariant, string>> = {};

  try {
    for (const variant of ["image", "thumbnail"] as const) {
      const file = media[variant];

      if (!file) {
        continue;
      }

      const path = await uploadPortfolioMedia(namespace, slug, variant, file);
      uploadedPaths.push(path);
      paths[variant] = path;
    }

    return paths;
  } catch (error) {
    const cleanupResults = await Promise.allSettled(
      uploadedPaths.map((path) => deletePortfolioMedia(path)),
    );
    if (cleanupResults.some((result) => result.status === "rejected")) {
      throw new Error(
        "Media upload failed and some temporary files could not be cleaned up.",
        { cause: error },
      );
    }
    throw error;
  }
}

export async function deletePortfolioMedia(storagePath: string): Promise<void> {
  await deleteObject(getStorageReference(storagePath));
}

export async function getStorageDownloadUrl(
  storagePath: string,
): Promise<string> {
  return getDownloadURL(getStorageReference(storagePath));
}
