"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const supabase = createClient();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });

    setLoading(false);
    if (error) return setErr(error.message);

    // Si tienes email confirmation activado, igual te quedas en login.
    router.push("/dashboard");
  }

  return (
    <main className="mx-auto max-w-md p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Crear cuenta</h1>

      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full border p-2 rounded" placeholder="Nombre"
          value={name} onChange={(e) => setName(e.target.value)} />
        <input className="w-full border p-2 rounded" placeholder="Email"
          value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full border p-2 rounded" placeholder="Password" type="password"
          value={password} onChange={(e) => setPassword(e.target.value)} />
        {err && <p className="text-sm text-red-600">{err}</p>}
        <button className="w-full border rounded p-2" disabled={loading}>
          {loading ? "Creando..." : "Crear cuenta"}
        </button>
      </form>

      <p className="text-sm">
        ¿Ya tienes cuenta? <a className="underline" href="/login">Entrar</a>
      </p>
    </main>
  );
}