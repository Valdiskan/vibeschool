"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button, Card, Input, Label } from "@/components/ui";

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<"student" | "teacher">("student");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [classCode, setClassCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const code = classCode.trim().toUpperCase();
    if (!/^[A-ZА-Я0-9-]{3,16}$/.test(code)) {
      setError("Код класса: 3–16 букв или цифр, например 7B-2026.");
      return;
    }
    if (password.length < 6) {
      setError("Пароль — минимум 6 символов.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: name.trim() || email, role, class_code: code },
      },
    });
    setLoading(false);
    if (error) {
      setError(
        error.message.includes("already registered")
          ? "Эта почта уже зарегистрирована — попробуй войти."
          : "Не получилось зарегистрироваться: " + error.message
      );
      return;
    }
    router.push("/studio");
    router.refresh();
  }

  return (
    <Card className="mx-auto mt-10 max-w-md p-6">
      <h1 className="mb-2 font-display text-2xl font-bold">Регистрация</h1>
      <p className="mb-6 text-sm text-ink/60">
        Ученики и учитель указывают один и тот же код класса — так учитель видит работы своего класса.
      </p>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label>Кто ты?</Label>
          <div className="grid grid-cols-2 gap-2">
            {(["student", "teacher"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`rounded-xl border-2 border-ink px-3 py-2 font-bold transition-colors ${
                  role === r ? "bg-lime shadow-popSm" : "bg-white hover:bg-violet-soft"
                }`}
              >
                {r === "student" ? "🎒 Ученик" : "📋 Учитель"}
              </button>
            ))}
          </div>
        </div>
        <div>
          <Label htmlFor="name">Имя (видно учителю)</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Маша П." />
        </div>
        <div>
          <Label htmlFor="classCode">Код класса</Label>
          <Input id="classCode" required value={classCode} onChange={(e) => setClassCode(e.target.value)} placeholder="7B-2026" />
        </div>
        <div>
          <Label htmlFor="email">Почта</Label>
          <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        </div>
        <div>
          <Label htmlFor="password">Пароль</Label>
          <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="минимум 6 символов" />
        </div>
        {error && <p className="rounded-xl border-2 border-ink bg-coral/20 px-3 py-2 text-sm font-semibold">{error}</p>}
        <Button type="submit" variant="lime" disabled={loading} className="w-full">
          {loading ? "Создаём аккаунт…" : "Создать аккаунт"}
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-ink/60">
        Уже есть аккаунт?{" "}
        <Link href="/login" className="font-bold text-violet-dark underline">
          Войти
        </Link>
      </p>
    </Card>
  );
}
