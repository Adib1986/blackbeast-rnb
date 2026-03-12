import { prisma } from "@/lib/prisma";

export default async function TracksPage() {

  const songs = await prisma.song.findMany({
    orderBy: {
      createdAt: "desc"
    },
    include: {
      uploader: true
    }
  });

  return (

    <main className="min-h-screen bg-black text-white px-6 py-16">

      <div className="max-w-4xl mx-auto">

        <h1 className="text-4xl text-yellow-400 mb-10">
          Member Tracks
        </h1>

        <div className="space-y-8">

          {songs.map((song) => (

            <div key={song.id} className="bg-zinc-900 p-6 rounded-xl">

              <h2 className="text-xl text-yellow-300">
                {song.title}
              </h2>

              <p className="text-sm text-zinc-500 mb-4">
                by {song.uploader.username}
              </p>

              <audio controls src={song.fileUrl}></audio>

              <div className="mt-3">
                <a
                  href={song.fileUrl}
                  download
                  className="text-yellow-400"
                >
                  Download
                </a>
              </div>

            </div>

          ))}

        </div>

      </div>

    </main>

  );

}