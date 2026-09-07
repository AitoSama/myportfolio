import type { Artwork, Project } from "@/types/database";
import { getStorageDownloadUrl } from "@/lib/storage";
import type { MediaVariant } from "@/lib/storage";

export type ResolvedProject = Project & {
  resolvedImageUrl?: string;
  resolvedThumbnailUrl?: string;
};

export type ResolvedArtwork = Artwork & {
  resolvedImageUrl?: string;
  resolvedThumbnailUrl?: string;
};

async function resolveMediaUrl(storagePath?: string): Promise<string | undefined> {
  if (!storagePath) {
    return undefined;
  }

  try {
    return await getStorageDownloadUrl(storagePath);
  } catch {
    return undefined;
  }
}

export async function resolveProjectMedia(
  project: Project,
  variants: MediaVariant[] = ["image", "thumbnail"],
): Promise<ResolvedProject> {
  const [imageUrl, thumbnailUrl] = await Promise.all([
    variants.includes("image") ||
    (variants.includes("thumbnail") && !project.thumbnailPath)
      ? resolveMediaUrl(project.imagePath)
      : undefined,
    variants.includes("thumbnail")
      ? resolveMediaUrl(project.thumbnailPath)
      : undefined,
  ]);

  return {
    ...project,
    resolvedImageUrl: imageUrl ?? project.thumbnail ?? undefined,
    resolvedThumbnailUrl:
      thumbnailUrl ?? imageUrl ?? project.thumbnail ?? undefined,
  };
}

export async function resolveArtworkMedia(
  artwork: Artwork,
  variants: MediaVariant[] = ["image", "thumbnail"],
): Promise<ResolvedArtwork> {
  const [imageUrl, thumbnailUrl] = await Promise.all([
    variants.includes("image") ||
    (variants.includes("thumbnail") && !artwork.thumbnailPath)
      ? resolveMediaUrl(artwork.imagePath)
      : undefined,
    variants.includes("thumbnail")
      ? resolveMediaUrl(artwork.thumbnailPath)
      : undefined,
  ]);

  return {
    ...artwork,
    resolvedImageUrl: imageUrl ?? artwork.image ?? undefined,
    resolvedThumbnailUrl:
      thumbnailUrl ?? imageUrl ?? artwork.image ?? undefined,
  };
}
