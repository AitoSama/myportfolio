"use client";

interface DeleteConfirmationDialogProps {
  itemType: "project" | "artwork";
  title: string;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmationDialog({
  itemType,
  title,
  isDeleting,
  onCancel,
  onConfirm,
}: DeleteConfirmationDialogProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isDeleting) {
          onCancel();
        }
      }}
    >
      <section
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
        className="w-full max-w-md border border-border bg-card p-6 shadow-xl"
      >
        <h2 id="delete-dialog-title" className="text-xl font-semibold">
          Delete {itemType}?
        </h2>
        <p id="delete-dialog-description" className="mt-3 text-sm text-muted-foreground">
          This will permanently delete <strong className="text-foreground">{title}</strong>.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="border border-border px-4 py-2 text-sm font-medium hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="border border-destructive bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : `Delete ${itemType}`}
          </button>
        </div>
      </section>
    </div>
  );
}
