"use client";

import Link from "next/link";
import { useRef, useState } from "react";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  async function handleUpload() {
    setMessage("");

    if (!file) {
      setMessage("Bitte Datei auswählen");
      return;
    }

    try {
      setIsUploading(true);

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = (await res.json().catch(() => null)) as
        | {
            error?: string;
            success?: boolean;
            fileUrl?: string;
            trackId?: string;
            title?: string;
          }
        | null;

      if (!res.ok) {
        setMessage(data?.error || "Upload fehlgeschlagen");
        setIsUploading(false);
        return;
      }

      setMessage(
        `Upload erfolgreich: ${data?.title ?? ""} → ${data?.fileUrl ?? ""}`
      );
      setFile(null);

      if (inputRef.current) {
        inputRef.current.value = "";
      }

      setIsUploading(false);
    } catch (error) {
      console.error("UPLOAD PAGE ERROR:", error);
      setMessage("Upload fehlgeschlagen");
      setIsUploading(false);
    }
  }

  const isSuccess = message.startsWith("Upload erfolgreich");
  const isError =
    !!message &&
    !isSuccess &&
    (message.includes("fehlgeschlagen") ||
      message.includes("Bitte") ||
      message.includes("Fehler"));

  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] text-white">
      <div className="relative min-h-screen">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-120px] top-[-120px] h-[320px] w-[320px] rounded-full bg-fuchsia-700/20 blur-3xl" />
          <div className="absolute right-[-100px] top-[120px] h-[260px] w-[260px] rounded-full bg-violet-600/20 blur-3xl" />
          <div className="absolute bottom-[-120px] left-[20%] h-[280px] w-[280px] rounded-full bg-purple-900/20 blur-3xl" />
          <div className="absolute bottom-[10%] right-[10%] h-[220px] w-[220px] rounded-full bg-white/5 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.14),transparent_30%),radial-gradient(circle_at_bottom,rgba(217,70,239,0.08),transparent_35%)]" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-5xl px-6 py-8">
          <div className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_0_40px_rgba(168,85,247,0.08)] backdrop-blur-md">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.35em] text-fuchsia-300/80">
                  BlackBeast RNB
                </p>

                <h1 className="bg-gradient-to-r from-white via-fuchsia-200 to-violet-300 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent sm:text-4xl">
                  Upload Track
                </h1>

                <p className="mt-3 max-w-2xl text-sm text-zinc-300">
                  Lade MP3- oder WAV-Dateien hoch und füge sie deiner
                  Community-Sammlung hinzu.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/tracks"
                  className="inline-flex items-center justify-center rounded-2xl border border-fuchsia-400/20 bg-gradient-to-r from-fuchsia-600/20 to-violet-600/20 px-5 py-3 text-sm font-semibold text-white transition hover:border-fuchsia-300/40 hover:shadow-[0_0_25px_rgba(168,85,247,0.18)]"
                >
                  Zu den Tracks
                </Link>

                <Link
                  href="/forum"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:border-fuchsia-400/30 hover:bg-white/10"
                >
                  Back to Forum
                </Link>
              </div>
            </div>
          </div>

          <section className="rounded-[28px] border border-white/10 bg-gradient-to-br from-white/8 to-white/[0.03] p-6 shadow-[0_0_30px_rgba(168,85,247,0.08)] backdrop-blur-md sm:p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white">Neuen Track hochladen</h2>
              <p className="mt-2 text-sm text-zinc-400">
                Wähle eine Audio-Datei aus und lade sie direkt in deine
                Sammlung hoch.
              </p>
            </div>

            <input
              ref={inputRef}
              type="file"
              accept=".mp3,.wav,audio/mpeg,audio/wav,audio/x-wav"
              onChange={(event) => {
                const selectedFile = event.target.files?.[0] ?? null;
                setFile(selectedFile);
                setMessage(
                  selectedFile
                    ? `Ausgewählt: ${selectedFile.name}`
                    : "Keine Datei ausgewählt"
                );
              }}
              className="hidden"
              id="track-file-input"
            />

            <div className="space-y-6">
              <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                <p className="mb-4 text-sm font-medium text-zinc-300">
                  Datei auswählen
                </p>

                <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                  <label
                    htmlFor="track-file-input"
                    className="inline-flex cursor-pointer items-center justify-center rounded-2xl border border-fuchsia-400/20 bg-gradient-to-r from-fuchsia-600/20 to-violet-600/20 px-5 py-3 text-sm font-semibold text-white transition hover:border-fuchsia-300/40 hover:shadow-[0_0_25px_rgba(168,85,247,0.18)]"
                  >
                    Track auswählen
                  </label>

                  <div className="min-h-[52px] flex-1 rounded-2xl border border-white/10 bg-zinc-950/80 px-4 py-3 text-sm text-zinc-300">
                    {file ? file.name : "Noch keine Datei gewählt"}
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                <p className="mb-4 text-sm font-medium text-zinc-300">
                  Upload starten
                </p>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <button
                    type="button"
                    onClick={handleUpload}
                    disabled={isUploading}
                    className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-fuchsia-400/30 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isUploading ? "Lädt hoch..." : "Upload"}
                  </button>

                  <div className="text-sm text-zinc-400">
                    Erlaubt: MP3 und WAV
                  </div>
                </div>
              </div>

              {message ? (
                <div
                  className={
                    isSuccess
                      ? "rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-4 text-sm text-emerald-200"
                      : isError
                        ? "rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-4 text-sm text-red-200"
                        : "rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-zinc-200"
                  }
                >
                  {message}
                </div>
              ) : null}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}