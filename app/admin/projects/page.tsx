"use client";

import { useCallback, useEffect, useState } from "react";
import AdminGuard from "@/components/admin/AdminGuard";
import ProjectForm from "@/components/admin/ProjectForm";
import {
  createProject,
  deleteProject,
  getProjects,
  updateProject,
  type ProjectInput,
} from "@/lib/data-access/projects";
import type { Project } from "@/types/database";

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}

export default function AdminProjectsPage() {
  return (
    <AdminGuard>
      <ProjectsManager />
    </AdminGuard>
  );
}

function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [operationError, setOperationError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const loadProjects = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);

    try {
      setProjects(await getProjects());
    } catch (error) {
      console.error("Loading projects failed:", error);
      setLoadError("Projects could not be loaded. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProjects();
  }, [loadProjects]);

  const openCreateForm = () => {
    setEditingProject(null);
    setOperationError(null);
    setNotice(null);
    setIsCreating(true);
  };

  const openEditForm = (project: Project) => {
    setEditingProject(project);
    setOperationError(null);
    setNotice(null);
    setIsCreating(false);
  };

  const closeForm = () => {
    setEditingProject(null);
    setIsCreating(false);
    setOperationError(null);
  };

  const handleSubmit = async (project: ProjectInput) => {
    setIsSubmitting(true);
    setOperationError(null);
    setNotice(null);

    try {
      if (editingProject) {
        await updateProject(editingProject.slug, project);
        setNotice("Project updated successfully.");
      } else {
        await createProject(project);
        setNotice("Project created successfully.");
      }

      closeForm();
      await loadProjects();
    } catch (error) {
      console.error("Saving project failed:", error);
      setOperationError(
        getErrorMessage(error, "The project could not be saved. Please try again."),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (project: Project) => {
    if (!window.confirm(`Delete project "${project.title}"? This cannot be undone.`)) {
      return;
    }

    setDeletingSlug(project.slug);
    setOperationError(null);
    setNotice(null);

    try {
      await deleteProject(project.slug);
      setProjects((current) =>
        current.filter((item) => item.slug !== project.slug),
      );
      setNotice("Project deleted successfully.");
    } catch (error) {
      console.error("Deleting project failed:", error);
      setOperationError("The project could not be deleted. Please try again.");
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
          <h1 className="mt-2 text-3xl font-semibold">Projects</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage project records stored in Firestore.
          </p>
        </div>
        {!isCreating && !editingProject ? (
          <button
            type="button"
            onClick={openCreateForm}
            className="border border-foreground bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-80"
          >
            Create project
          </button>
        ) : null}
      </div>

      {notice ? (
        <p role="status" className="mt-6 text-sm text-emerald-700">
          {notice}
        </p>
      ) : null}
      {operationError && !isCreating && !editingProject ? (
        <p role="alert" className="mt-6 text-sm text-destructive">
          {operationError}
        </p>
      ) : null}

      {isCreating || editingProject ? (
        <div className="mt-8">
          <ProjectForm
            project={editingProject}
            isSubmitting={isSubmitting}
            error={operationError}
            onSubmit={handleSubmit}
            onCancel={closeForm}
          />
        </div>
      ) : (
        <section className="mt-8">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading projects...</p>
          ) : loadError ? (
            <div className="space-y-3">
              <p role="alert" className="text-sm text-destructive">
                {loadError}
              </p>
              <button
                type="button"
                onClick={() => void loadProjects()}
                className="border border-border px-4 py-2 text-sm font-medium hover:bg-accent"
              >
                Try again
              </button>
            </div>
          ) : projects.length === 0 ? (
            <div className="border border-dashed border-border p-8 text-sm text-muted-foreground">
              No projects found. Create the first project to begin.
            </div>
          ) : (
            <div className="overflow-x-auto border border-border">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="border-b border-border bg-accent/50">
                  <tr>
                    <th className="px-4 py-3 font-medium">Title</th>
                    <th className="px-4 py-3 font-medium">Slug</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => (
                    <tr key={project.slug} className="border-b border-border last:border-0">
                      <td className="px-4 py-4 font-medium">{project.title}</td>
                      <td className="px-4 py-4 font-mono text-xs text-muted-foreground">
                        {project.slug}
                      </td>
                      <td className="px-4 py-4 capitalize">{project.status}</td>
                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEditForm(project)}
                            disabled={deletingSlug !== null}
                            className="border border-border px-3 py-1.5 text-xs font-medium hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => void handleDelete(project)}
                            disabled={deletingSlug !== null}
                            className="border border-destructive px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive hover:text-destructive-foreground disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {deletingSlug === project.slug ? "Deleting..." : "Delete"}
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
    </div>
  );
}
