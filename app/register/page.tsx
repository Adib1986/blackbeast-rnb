import RegisterForm from "@/components/register-form";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black px-6 py-16 text-white">
      <div className="mx-auto max-w-md">
        <RegisterForm />
      </div>
    </main>
  );
}
