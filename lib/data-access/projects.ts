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
  deleteExclusivelyOwnedMedia,
  getStoragePaths,
  MediaCleanupError,
} from "@/lib/data-access/media";
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

export async function getPublishedProjectsBySlugs(
  slugs: string[],
): Promise<Project[]> {
  if (slugs.length === 0) {
    return [];
  }

  const projects = await getPublishedProjects();
  const projectsBySlug = new Map(
    projects.map((project) => [project.slug, project]),
  );

  return slugs
    .map((slug) => projectsBySlug.get(slug))
    .filter((project): project is Project => project !== undefined);
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

  const existingDocument = await getDoc(projectDocument(slug));
  const previousPaths = existingDocument.exists()
    ? getStoragePaths(existingDocument.data())
    : [];

  assertProjectSlug(slug);
  await updateDoc(projectDocument(slug), {
    ...project,
    updatedAt: serverTimestamp(),
  });

  const currentPaths = new Set(getStoragePaths(project));
  try {
    await deleteExclusivelyOwnedMedia(
      "projects",
      slug,
      previousPaths.filter((path) => !currentPaths.has(path)),
    );
  } catch (error) {
    if (error instanceof MediaCleanupError) {
      throw new MediaCleanupError(
        error.failedPaths,
        "Project updated, but storage cleanup",
        true,
      );
    }

    throw error;
  }
}

export async function deleteProject(slug: string): Promise<void> {
  const document = await getDoc(projectDocument(slug));

  if (!document.exists()) {
    return;
  }

  const paths = getStoragePaths(document.data());
  await deleteDoc(projectDocument(slug));

  try {
    await deleteExclusivelyOwnedMedia("projects", slug, paths);
  } catch (error) {
    if (error instanceof MediaCleanupError) {
      throw new MediaCleanupError(
        error.failedPaths,
        "Project deleted, but storage cleanup",
        true,
      );
    }

    throw error;
  }
}
