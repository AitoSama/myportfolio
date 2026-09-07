import {
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import type { Project } from "@/types/database";
import {
  mapProject,
  projectsCollection,
} from "@/lib/data-access/shared";

export async function getPublishedProjects(): Promise<Project[]> {
  const snapshot = await getDocs(
    query(projectsCollection, where("status", "==", "published")),
  );

  return snapshot.docs
    .map((document) => mapProject(document.ref, document.data()))
    .sort((first, second) => second.date.localeCompare(first.date));
}

export async function getPublishedProjectBySlug(
  slug: string,
): Promise<Project | null> {
  const document = await getDoc(doc(projectsCollection, slug));

  if (!document.exists()) {
    return null;
  }

  const project = mapProject(document.ref, document.data());
  return project.status === "published" ? project : null;
}
