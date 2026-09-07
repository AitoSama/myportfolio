import {
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  deleteDoc,
} from "firebase/firestore";
import type { Project } from "@/types/database";
import {
  mapProject,
  projectsCollection,
} from "@/lib/data-access/shared";

export type ProjectInput = Omit<Project, "createdAt" | "updatedAt">;

function projectDocument(slug: string) {
  return doc(projectsCollection, slug);
}

function assertProjectSlug(slug: string): void {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error(
      "Project slug must use lowercase letters, numbers, and single hyphens.",
    );
  }
}

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

export async function getProjects(): Promise<Project[]> {
  const snapshot = await getDocs(projectsCollection);

  return snapshot.docs
    .map((document) => mapProject(document.ref, document.data()))
    .sort((first, second) => second.date.localeCompare(first.date));
}

export async function getProject(slug: string): Promise<Project | null> {
  const document = await getDoc(projectDocument(slug));

  if (!document.exists()) {
    return null;
  }

  return mapProject(document.ref, document.data());
}

export async function createProject(project: ProjectInput): Promise<void> {
  assertProjectSlug(project.slug);
  await setDoc(projectDocument(project.slug), {
    ...project,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateProject(
  slug: string,
  project: ProjectInput,
): Promise<void> {
  if (slug !== project.slug) {
    throw new Error("Project slug cannot be changed during an update.");
  }

  assertProjectSlug(slug);
  await updateDoc(projectDocument(slug), {
    ...project,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteProject(slug: string): Promise<void> {
  await deleteDoc(projectDocument(slug));
}
