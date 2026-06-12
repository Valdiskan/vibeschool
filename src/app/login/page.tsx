"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button, Card, Input, Label } from "@/components/ui";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError("Не получилось войти. Проверь почту и пароль.");
      return;
    }
    router.push(params.get("next") || "/studio");
    router.refresh();
  }

  return (
    <Card className="mx-auto mt-10 max-w-md p-6">
      <h1 className="mb-6 font-display text-2xl font-bold">Вход</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email">Почта</Label>
          <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        </div>
        <div>
          <Label htmlFor="password">Пароль</Label>
          <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
        </div>
        {error && <p className="rounded-xl border-2 border-ink bg-coral/20 px-3 py-2 text-sm font-semibold">{error}</p>}
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Входим…" : "Войти"}
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-ink/60">
        Нет аккаунта?{" "}
        <Link href="/register" className="font-bold text-violet-dark underline">
          Зарегистрироваться
        </Link>
      </p>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
