import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Badge, Card } from "@/components/ui";
import { getLesson } from "@/lib/lessons";

export const metadata = { title: "Мой класс — VibeSchool" };

type PromptRow = {
  id: number;
  user_id: string;
  lesson_slug: string | null;
  language: string;
  prompt: string;
  created_at: string;
};

export default async function TeacherPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/teacher");

  const { data: me } = await supabase
    .from("profiles")
    .select("role, class_code, display_name")
    .eq("id", user.id)
    .single();

  if (!me || me.role !== "teacher") {
    return (
      <Card className="mx-auto max-w-md p-6 text-center">
        <div className="mb-2 text-3xl">🔒</div>
        <p className="font-semibold">Этот раздел доступен только учителям.</p>
        <p className="mt-2 text-sm text-ink/60">
          Если ты учитель — зарегистрируй аккаунт с ролью «Учитель».
        </p>
      </Card>
    );
  }

  const { data: students } = await supabase
    .from("profiles")
    .select("id, display_name, created_at")
    .eq("class_code", me.class_code)
    .eq("role", "student")
    .order("display_name");

  const studentIds = (students ?? []).map((s) => s.id);

  let prompts: PromptRow[] = [];
  if (studentIds.length > 0) {
    const { data } = await supabase
      .from("prompts")
      .select("id, user_id, lesson_slug, language, prompt, created_at")
      .in("user_id", studentIds)
      .order("created_at", { ascending: false })
      .limit(100);
    prompts = (data as PromptRow[]) ?? [];
  }

  const byStudent = new Map<string, PromptRow[]>();
  for (const p of prompts) {
    const list = byStudent.get(p.user_id) ?? [];
    if (list.length < 3) list.push(p);
    byStudent.set(p.user_id, list);
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">Мой класс</h1>
          <p className="text-sm text-ink/60">
            Код класса: <span className="font-mono font-bold">{me.class_code}</span> — ученики
            указывают его при регистрации.
          </p>
        </div>
        <Badge color="lime">{students?.length ?? 0} учеников · {prompts.length} промптов</Badge>
      </div>

      {!students?.length ? (
        <Card className="p-8 text-center">
          <div className="mb-2 text-3xl">🎒</div>
          <p className="font-semibold">Пока никто не присоединился.</p>
          <p className="mt-2 text-sm text-ink/60">
            Дай ученикам код класса <span className="font-mono font-bold">{me.class_code}</span> —
            они вводят его при регистрации, и их работы появятся здесь.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {students.map((s) => {
            const sp = byStudent.get(s.id) ?? [];
            return (
              <Card key={s.id} className="p-5">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <div className="font-display font-bold">{s.display_name || "Без имени"}</div>
                  <span className="text-xs text-ink/50">
                    {sp.length ? `последняя активность: ${new Date(sp[0].created_at).toLocaleString("ru-RU")}` : "ещё не было промптов"}
                  </span>
                </div>
                {sp.length ? (
                  <ul className="space-y-2">
                    {sp.map((p) => (
                      <li key={p.id} className="rounded-xl border-2 border-ink/15 bg-paper px-3 py-2">
                        <div className="mb-1 flex flex-wrap items-center gap-2 text-xs">
                          <Badge color="ink">{p.language === "python" ? "Python" : "JS"}</Badge>
                          {p.lesson_slug && (
                            <span className="text-violet-dark">
                              {getLesson(p.lesson_slug)?.title ?? p.lesson_slug}
                            </span>
                          )}
                          <span className="text-ink/40">
                            {new Date(p.created_at).toLocaleString("ru-RU")}
                          </span>
                        </div>
                        <p className="text-sm">{p.prompt}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-ink/50">
                    Ученик зарегистрировался, но ещё не сгенерировал ни одной программы.
                  </p>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
