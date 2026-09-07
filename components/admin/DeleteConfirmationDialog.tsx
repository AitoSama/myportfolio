"use client";

import { useEffect, useRef } from "react";

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
  const dialogRef = useRef<HTMLElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  const onCancelRef = useRef(onCancel);
  const isDeletingRef = useRef(isDeleting);

  useEffect(() => {
    onCancelRef.current = onCancel;
    isDeletingRef.current = isDeleting;
  }, [isDeleting, onCancel]);

  useEffect(() => {
    const previouslyFocused =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    cancelButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isDeletingRef.current) {
        event.preventDefault();
        onCancelRef.current();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusableElements = [cancelButtonRef.current, confirmButtonRef.current].filter(
        (element): element is HTMLButtonElement => Boolean(element && !element.disabled),
      );

      if (focusableElements.length === 0) {
        event.preventDefault();
        dialogRef.current?.focus();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);

      if (previouslyFocused?.isConnected) {
        previouslyFocused.focus();
      } else {
        document.getElementById("main-content")?.focus();
      }
    };
  }, []);

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
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
        tabIndex={-1}
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
            ref={cancelButtonRef}
            onClick={onCancel}
            disabled={isDeleting}
            className="border border-border px-4 py-2 text-sm font-medium hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            ref={confirmButtonRef}
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
