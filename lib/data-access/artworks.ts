import {
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import type { Artwork } from "@/types/database";
import {
  artworksCollection,
  mapArtwork,
} from "@/lib/data-access/shared";

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
