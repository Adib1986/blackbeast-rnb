type PageProps = {
  params: Promise<{
    slug: string;
    threadId: string;
  }>;
};

export default async function ThreadPage({ params }: PageProps) {
  const { slug, threadId } = await params;

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm text-zinc-400">Forum</p>
        <h1 className="mt-2 text-3xl font-bold">Thread Detail</h1>

        <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
          <p className="text-sm text-zinc-400">Slug</p>
          <p className="mb-4 text-lg font-semibold">{slug}</p>

          <p className="text-sm text-zinc-400">Thread ID</p>
          <p className="text-lg font-semibold">{threadId}</p>
        </div>
      </div>
    </main>
  );
}