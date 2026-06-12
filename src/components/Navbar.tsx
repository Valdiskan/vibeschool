import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/LogoutButton";

export default async function Navbar() {
  let email: string | null = null;
  let role: string | null = null;
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      email = user.email ?? null;
      const { data: profile } = await supabase
        .from("profiles")
        .select("role, display_name")
        .eq("id", user.id)
        .single();
      role = profile?.role ?? null;
      if (profile?.display_name) email = profile.display_name;
    }
  } catch {
    // Supabase не настроен — навбар работает в гостевом режиме
  }

  return (
    <header className="sticky top-0 z-20 border-b-2 border-ink bg-paper/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-display text-lg font-bold">
          vibe<span className="text-violet">school</span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/lessons" className="rounded-lg px-2 py-1 text-sm font-semibold hover:bg-violet-soft">
            Уроки
          </Link>
          <Link href="/studio" className="rounded-lg px-2 py-1 text-sm font-semibold hover:bg-violet-soft">
            Студия
          </Link>
          {role === "teacher" && (
            <Link href="/teacher" className="rounded-lg px-2 py-1 text-sm font-semibold hover:bg-violet-soft">
              Класс
            </Link>
          )}
          {email ? (
            <div className="flex items-center gap-2">
              <span className="hidden max-w-[140px] truncate text-sm text-ink/60 sm:block">{email}</span>
              <LogoutButton />
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-xl border-2 border-ink bg-lime px-3 py-1.5 text-sm font-bold shadow-popSm"
            >
              Войти
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
