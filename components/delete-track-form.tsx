"use client";

import { deleteTrackAction } from "@/app/tracks/actions";

type DeleteTrackFormProps = {
  trackId: string;
};

export default function DeleteTrackForm({
  trackId,
}: DeleteTrackFormProps) {
  return (
    <form
      action={deleteTrackAction}
      onSubmit={(event) => {
        const confirmed = window.confirm("Diesen Track wirklich löschen?");
        if (!confirmed) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="trackId" value={trackId} />

      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-2xl border border-red-400/20 bg-red-500/10 px-5 py-3 text-sm font-medium text-red-200 transition hover:border-red-300/40 hover:bg-red-500/20"
      >
        Delete
      </button>
    </form>
  );
}