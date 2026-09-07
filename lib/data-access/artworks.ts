import {
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import type { Artwork } from "@/types/database";
import {
  deleteExclusivelyOwnedMedia,
  getStoragePaths,
  MediaCleanupError,
} from "@/lib/data-access/media";
import {
  artworksCollection,
  mapArtwork,
} from "@/lib/data-access/shared";

export type ArtworkInput = Omit<Artwork, "createdAt" | "updatedAt">;

function artworkDocument(slug: string) {
  return doc(artworksCollection, slug);
}

function assertArtworkSlug(slug: string): void {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error(
      "Artwork slug must use lowercase letters, numbers, and single hyphens.",
    );
  }
}

export async function getPublishedArtworks(): Promise<Artwork[]> {
  const snapshot = await getDocs(
    query(artworksCollection, where("status", "==", "published")),
  );

  return snapshot.docs
    .map((document) => mapArtwork(document.ref, document.data()))
    .sort((first, second) =>
      second.publishedAt.localeCompare(first.publishedAt),
    );
}

export async function getPublishedArtworksBySlugs(
  slugs: string[],
): Promise<Artwork[]> {
  if (slugs.length === 0) {
    return [];
  }

  const artworks = await getPublishedArtworks();
  const artworksBySlug = new Map(
    artworks.map((artwork) => [artwork.slug, artwork]),
  );

  return slugs
    .map((slug) => artworksBySlug.get(slug))
    .filter((artwork): artwork is Artwork => artwork !== undefined);
}

export async function getPublishedArtworkBySlug(
  slug: string,
): Promise<Artwork | null> {
  const document = await getDoc(doc(artworksCollection, slug));

  if (!document.exists()) {
    return null;
  }

  const artwork = mapArtwork(document.ref, document.data());
  return artwork.status === "published" ? artwork : null;
}

export async function getArtworks(): Promise<Artwork[]> {
  const snapshot = await getDocs(artworksCollection);

  return snapshot.docs
    .map((document) => mapArtwork(document.ref, document.data()))
    .sort((first, second) =>
      second.publishedAt.localeCompare(first.publishedAt),
    );
}

export async function getArtwork(slug: string): Promise<Artwork | null> {
  const document = await getDoc(artworkDocument(slug));

  if (!document.exists()) {
    return null;
  }

  return mapArtwork(document.ref, document.data());
}

export async function createArtwork(artwork: ArtworkInput): Promise<void> {
  assertArtworkSlug(artwork.slug);
  await setDoc(artworkDocument(artwork.slug), {
    ...artwork,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateArtwork(
  slug: string,
  artwork: ArtworkInput,
): Promise<void> {
  if (slug !== artwork.slug) {
    throw new Error("Artwork slug cannot be changed during an update.");
  }

  const existingDocument = await getDoc(artworkDocument(slug));
  const previousPaths = existingDocument.exists()
    ? getStoragePaths(existingDocument.data())
    : [];

  assertArtworkSlug(slug);
  await updateDoc(artworkDocument(slug), {
    ...artwork,
    updatedAt: serverTimestamp(),
  });

  const currentPaths = new Set(getStoragePaths(artwork));
  try {
    await deleteExclusivelyOwnedMedia(
      "artworks",
      slug,
      previousPaths.filter((path) => !currentPaths.has(path)),
    );
  } catch (error) {
    if (error instanceof MediaCleanupError) {
      throw new MediaCleanupError(
        error.failedPaths,
        "Artwork updated, but storage cleanup",
        true,
      );
    }

    throw error;
  }
}

export async function deleteArtwork(slug: string): Promise<void> {
  const document = await getDoc(artworkDocument(slug));

  if (!document.exists()) {
    return;
  }

  const paths = getStoragePaths(document.data());
  await deleteDoc(artworkDocument(slug));

  try {
    await deleteExclusivelyOwnedMedia("artworks", slug, paths);
  } catch (error) {
    if (error instanceof MediaCleanupError) {
      throw new MediaCleanupError(
        error.failedPaths,
        "Artwork deleted, but storage cleanup",
        true,
      );
    }

    throw error;
  }
}
