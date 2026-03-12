"use client";

import { useRef, useState } from "react";

export default function UploadPage() {

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [songUrl, setSongUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  function openFilePicker() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  }

  async function uploadSong() {

    if (!file) {
      alert("Bitte zuerst eine MP3 auswählen.");
      return;
    }

    setUploading(true);

    try {

      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });

      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) {
        alert("Upload Fehler");
        setUploading(false);
        return;
      }

      const path = uploadData.path;

      setSongUrl(path);

      // Song in Datenbank speichern
      await fetch("/api/song/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: file.name,
          fileUrl: path
        })
      });

    } catch (err) {

      console.error(err);
      alert("Upload fehlgeschlagen");

    } finally {

      setUploading(false);

    }

  }

  return (

    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">

      <div className="w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-3xl p-10 text-center shadow-2xl">

        <h1 className="text-4xl font-bold text-yellow-400 mb-6">
          🎧 Song Upload
        </h1>

        <p className="text-zinc-400 mb-8">
          Lade deinen eigenen RNB Track hoch
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept=".mp3,audio/*"
          onChange={handleFileChange}
          className="hidden"
        />

        <button
          type="button"
          onClick={openFilePicker}
          className="w-full text-lg bg-purple-600 hover:bg-purple-500 transition px-8 py-4 rounded-2xl font-semibold flex items-center justify-center gap-3"
        >
          🎵 MP3 auswählen
        </button>

        {file && (
          <div className="mt-6 text-green-400">
            ✔ Datei gewählt: {file.name}
          </div>
        )}

        <button
          type="button"
          onClick={uploadSong}
          disabled={uploading}
          className="mt-6 w-full bg-yellow-500 hover:bg-yellow-400 text-black px-8 py-4 rounded-2xl font-bold text-lg transition"
        >
          {uploading ? "Uploading..." : "⬆ Upload starten"}
        </button>

        {songUrl && (

          <div className="mt-10">

            <h2 className="text-xl text-yellow-300 mb-4">
              🎶 Dein Song
            </h2>

            <audio controls src={songUrl} className="w-full mb-4" />

            <a
              href={songUrl}
              download
              className="text-yellow-400 underline"
            >
              Download Song
            </a>

          </div>

        )}

      </div>

    </main>

  );

}