"use client";

import { useCallback, useEffect, useState } from "react";
import AdminGuard from "@/components/admin/AdminGuard";
import ArtworkForm from "@/components/admin/ArtworkForm";
import DeleteConfirmationDialog from "@/components/admin/DeleteConfirmationDialog";
import {
  createArtwork,
  deleteArtwork,
  getArtworks,
  updateArtwork,
  type ArtworkInput,
} from "@/lib/data-access/artworks";
import type { Artwork } from "@/types/database";
import {
  deletePortfolioMedia,
  getStorageDownloadUrl,
  uploadPortfolioMediaSelection,
  type MediaSelection,
} from "@/lib/storage";

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}

export default function AdminArtworksPage() {
  return (
    <AdminGuard>
      <ArtworksManager />
    </AdminGuard>
  );
}

function ArtworksManager() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [editingArtwork, setEditingArtwork] = useState<Artwork | null>(null);
  const [artworkToDelete, setArtworkToDelete] = useState<Artwork | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [operationError, setOperationError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [submitStatus, setSubmitStatus] = useState<string | null>(null);

  const loadArtworks = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);

    try {
      setArtworks(await getArtworks());
    } catch (error) {
      console.error("Loading artworks failed:", error);
      setLoadError("Artworks could not be loaded. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadArtworks();
  }, [loadArtworks]);

  const openCreateForm = () => {
    setEditingArtwork(null);
    setOperationError(null);
    setNotice(null);
    setSubmitStatus(null);
    setIsCreating(true);
  };

  const openEditForm = (artwork: Artwork) => {
    setEditingArtwork(artwork);
    setOperationError(null);
    setNotice(null);
    setSubmitStatus(null);
    setIsCreating(false);
  };

  const closeForm = () => {
    setEditingArtwork(null);
    setIsCreating(false);
    setOperationError(null);
    setSubmitStatus(null);
  };

  const handleSubmit = async (artwork: ArtworkInput, media: MediaSelection) => {
    setIsSubmitting(true);
    setOperationError(null);
    setNotice(null);
    setSubmitStatus("Preparing media...");
    let uploadedPaths: Partial<Record<"image" | "thumbnail", string>> = {};
    let saved = false;

    try {
      setSubmitStatus("Uploading media...");
      uploadedPaths = await uploadPortfolioMediaSelection("artworks", artwork.slug, media);
      const artworkWithMedia: ArtworkInput = {
        ...artwork,
        ...(uploadedPaths.image
          ? { image: await getStorageDownloadUrl(uploadedPaths.image) }
          : {}),
        ...(uploadedPaths.image ? { imagePath: uploadedPaths.image } : {}),
        ...(uploadedPaths.thumbnail ? { thumbnailPath: uploadedPaths.thumbnail } : {}),
      };

      setSubmitStatus("Saving metadata...");
      if (editingArtwork) {
        await updateArtwork(editingArtwork.slug, artworkWithMedia);
        setNotice("Artwork updated successfully.");
      } else {
        await createArtwork(artworkWithMedia);
        setNotice("Artwork created successfully.");
      }
      saved = true;

      const replacedPaths = [
        media.image && editingArtwork?.imagePath,
        media.thumbnail && editingArtwork?.thumbnailPath,
      ].filter((path): path is string => Boolean(path));

      const cleanupResults = await Promise.allSettled(
        replacedPaths.map((path) => deletePortfolioMedia(path)),
      );
      if (cleanupResults.some((result) => result.status === "rejected")) {
        setNotice("Artwork saved, but an older image could not be removed.");
      }

      closeForm();
      await loadArtworks();
    } catch (error) {
      if (!saved) {
        const cleanupResults = await Promise.allSettled(
          Object.values(uploadedPaths).map((path) => deletePortfolioMedia(path)),
        );
        if (cleanupResults.some((result) => result.status === "rejected")) {
          setOperationError(
            "The artwork could not be saved, and temporary uploaded media could not be fully cleaned up.",
          );
          return;
        }
      }
      console.error("Saving artwork failed:", error);
      setSubmitStatus(null);
      setOperationError(
        getErrorMessage(error, "The artwork could not be saved. Please try again."),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!artworkToDelete) {
      return;
    }

    const artwork = artworkToDelete;
    setDeletingSlug(artwork.slug);
    setOperationError(null);
    setNotice(null);

    try {
      await deleteArtwork(artwork.slug);
      setArtworks((current) =>
        current.filter((item) => item.slug !== artwork.slug),
      );
      setNotice("Artwork deleted successfully.");
      setArtworkToDelete(null);
    } catch (error) {
      console.error("Deleting artwork failed:", error);
      setOperationError("The artwork could not be deleted. Please try again.");
    } finally {
      setDeletingSlug(null);
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            A1T0 / Admin
          </p>
          <h1 className="mt-2 text-3xl font-semibold">Artworks</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage artwork records stored in Firestore.
          </p>
        </div>
        {!isCreating && !editingArtwork ? (
          <button
            type="button"
            onClick={openCreateForm}
            className="border border-foreground bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-80"
          >
            Create artwork
          </button>
        ) : null}
      </div>

      {notice ? (
        <p role="status" aria-live="polite" className="mt-6 text-sm text-emerald-700">
          {notice}
        </p>
      ) : null}
      {operationError && !isCreating && !editingArtwork ? (
        <p role="alert" className="mt-6 text-sm text-destructive">
          {operationError}
        </p>
      ) : null}

      {isCreating || editingArtwork ? (
        <div className="mt-8">
          <ArtworkForm
            artwork={editingArtwork}
            isSubmitting={isSubmitting}
            error={operationError}
            submitStatus={submitStatus}
            onSubmit={handleSubmit}
            onCancel={closeForm}
          />
        </div>
      ) : (
        <section className="mt-8" aria-busy={isLoading}>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading artworks...</p>
          ) : loadError ? (
            <div className="space-y-3">
              <p role="alert" className="text-sm text-destructive">
                {loadError}
              </p>
              <button
                type="button"
                onClick={() => void loadArtworks()}
                className="border border-border px-4 py-2 text-sm font-medium hover:bg-accent"
              >
                Try again
              </button>
            </div>
          ) : artworks.length === 0 ? (
            <div className="border border-dashed border-border p-8">
              <p className="text-sm text-muted-foreground">
                No artworks found. Create the first artwork to begin.
              </p>
              <button
                type="button"
                onClick={openCreateForm}
                className="mt-4 border border-foreground bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-80"
              >
                Create your first artwork
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto border border-border">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="border-b border-border bg-accent/50">
                  <tr>
                    <th className="px-4 py-3 font-medium">Title</th>
                    <th className="px-4 py-3 font-medium">Slug</th>
                    <th className="px-4 py-3 font-medium">Format</th>
                    <th className="px-4 py-3 font-medium">Type</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {artworks.map((artwork) => (
                    <tr key={artwork.slug} className="border-b border-border last:border-0">
                      <td className="px-4 py-4 font-medium">{artwork.title}</td>
                      <td className="px-4 py-4 font-mono text-xs text-muted-foreground">
                        {artwork.slug}
                      </td>
                      <td className="px-4 py-4">{artwork.format}</td>
                      <td className="px-4 py-4">{artwork.type}</td>
                      <td className="px-4 py-4 capitalize">{artwork.status}</td>
                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEditForm(artwork)}
                            disabled={deletingSlug !== null}
                            className="border border-border px-3 py-1.5 text-xs font-medium hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => setArtworkToDelete(artwork)}
                            disabled={deletingSlug !== null}
                            className="border border-destructive px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive hover:text-destructive-foreground disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {deletingSlug === artwork.slug ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
      {artworkToDelete ? (
        <DeleteConfirmationDialog
          itemType="artwork"
          title={artworkToDelete.title}
          isDeleting={deletingSlug === artworkToDelete.slug}
          onCancel={() => setArtworkToDelete(null)}
          onConfirm={() => void handleDelete()}
        />
      ) : null}
    </div>
  );
}
