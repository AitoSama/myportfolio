import { getDoc } from "firebase/firestore";
import type { Profile } from "@/types/database";
import { mapProfile, profileDocument } from "@/lib/data-access/shared";

export async function getProfile(): Promise<Profile | null> {
  const document = await getDoc(profileDocument);

  if (!document.exists()) {
    return null;
  }

  return mapProfile(document.ref, document.data());
}
