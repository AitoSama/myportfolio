import { getDocs, type DocumentData } from "firebase/firestore";
import { deletePortfolioMedia, getPortfolioMediaPath } from "@/lib/storage";
import {
  artworksCollection,
  projectsCollection,
} from "@/lib/data-access/shared";

export type MediaOwnerNamespace = "projects" | "artworks";

export class MediaCleanupError extends Error {
  readonly failedPaths: string[];
  readonly recordMutationCompleted: boolean;

  constructor(
    failedPaths: string[],
    messagePrefix = "Storage cleanup",
    recordMutationCompleted = false,
  ) {
    super(
      `${messagePrefix} failed for ${failedPaths.length} media file${
        failedPaths.length === 1 ? "" : "s"
      }.`,
    );
    this.name = "MediaCleanupError";
    this.failedPaths = failedPaths;
    this.recordMutationCompleted = recordMutationCompleted;
  }
}

export function getStoragePaths(record: unknown): string[] {
  if (typeof record !== "object" || record === null) {
    return [];
  }

  const data = record as DocumentData;
  const paths = [data.imagePath, data.thumbnailPath].filter(
    (path): path is string => typeof path === "string" && path.trim().length > 0,
  );

  if (Array.isArray(data.screenshots)) {
    for (const screenshot of data.screenshots) {
      if (
        typeof screenshot === "object" &&
        screenshot !== null &&
        typeof screenshot.path === "string" &&
        screenshot.path.trim().length > 0
      ) {
        paths.push(screenshot.path);
      }
    }
  }

  return Array.from(new Set(paths.map((path) => path.trim())));
}

function getExclusivelyOwnedMediaPaths(
  namespace: MediaOwnerNamespace,
  slug: string,
  paths: string[],
  referencedPaths: Set<string>,
): string[] {
  const ownedPaths = new Set(
    (["image", "thumbnail"] as const).map((variant) =>
      getPortfolioMediaPath(namespace, slug, variant),
    ),
  );

  return Array.from(new Set(paths.map((path) => path.trim()))).filter(
    (path) => ownedPaths.has(path) && !referencedPaths.has(path),
  );
}

export async function deleteExclusivelyOwnedMedia(
  namespace: MediaOwnerNamespace,
  slug: string,
  paths: string[],
): Promise<void> {
  if (paths.length === 0) {
    return;
  }

  const candidatePaths = new Set(paths.map((path) => path.trim()));
  const canonicalPaths = new Set(
    (["image", "thumbnail"] as const).map((variant) =>
      getPortfolioMediaPath(namespace, slug, variant),
    ),
  );
  const canonicalCandidatePaths = new Set(
    Array.from(candidatePaths).filter((path) => canonicalPaths.has(path)),
  );

  if (canonicalCandidatePaths.size === 0) {
    return;
  }

  let projectSnapshot;
  let artworkSnapshot;

  try {
    [projectSnapshot, artworkSnapshot] = await Promise.all([
      getDocs(projectsCollection),
      getDocs(artworksCollection),
    ]);
  } catch {
    throw new MediaCleanupError(
      Array.from(canonicalCandidatePaths),
      "Storage ownership verification",
    );
  }

  const referencedPaths = new Set<string>();

  for (const document of [
    ...projectSnapshot.docs,
    ...artworkSnapshot.docs,
  ]) {
    for (const path of getStoragePaths(document.data())) {
      if (canonicalCandidatePaths.has(path)) {
        referencedPaths.add(path);
      }
    }
  }

  const pathsToDelete = getExclusivelyOwnedMediaPaths(
    namespace,
    slug,
    paths,
    referencedPaths,
  );

  if (pathsToDelete.length === 0) {
    return;
  }

  const results = await Promise.allSettled(
    pathsToDelete.map(async (path) => {
      try {
        await deletePortfolioMedia(path);
      } catch (error) {
        if (
          error &&
          typeof error === "object" &&
          "code" in error &&
          error.code === "storage/object-not-found"
        ) {
          return;
        }

        throw error;
      }
    }),
  );
  const failedPaths = results.flatMap((result, index) =>
    result.status === "rejected" ? [pathsToDelete[index]] : [],
  );

  if (failedPaths.length > 0) {
    throw new MediaCleanupError(failedPaths);
  }
}
