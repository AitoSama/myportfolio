import { getDocs, query, orderBy } from "firebase/firestore";
import type { SocialLink } from "@/types/database";
import {
  mapSocialLink,
  socialLinksCollection,
} from "@/lib/data-access/shared";

export async function getSocialLinks(): Promise<SocialLink[]> {
  const snapshot = await getDocs(
    query(socialLinksCollection, orderBy("order", "asc")),
  );

  return snapshot.docs.map((document) =>
    mapSocialLink(document.ref, document.data()),
  );
}
