import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const MAX_CODE_LENGTH = 20000;
const MAX_STDIN_LENGTH = 2000;

type Body = { code?: string; language?: string; stdin?: string };

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Войди в аккаунт, чтобы запускать код." }, { status: 401 });
  }

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Некорректный запрос." }, { status: 400 });
  }

  const code = String(body.code ?? "");
  const stdin = String(body.stdin ?? "").slice(0, MAX_STDIN_LENGTH);
  const language = body.language === "javascript" ? "javascript" : "python";

  if (!code.trim()) {
    return NextResponse.json({ error: "Сначала сгенерируй или напиши код." }, { status: 400 });
  }
  if (code.length > MAX_CODE_LENGTH) {
    return NextResponse.json({ error: "Код слишком длинный для песочницы." }, { status: 400 });
  }

  const pistonUrl = process.env.PISTON_URL || "https://emkc.org/api/v2/piston/execute";

  try {
    const res = await fetch(pistonUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language,
        version: "*",
        files: [{ name: language === "python" ? "main.py" : "main.js", content: code }],
        stdin,
        args: [],
        compile_timeout: 10000,
        run_timeout: 5000,            // таймаут 5 секунд
        run_memory_limit: 128000000,  // 128 МБ
      }),
      signal: AbortSignal.timeout(20000),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("Piston error:", res.status, detail.slice(0, 300));
      return NextResponse.json(
        { error: "Песочница занята (слишком много запусков подряд). Подожди пару секунд." },
        { status: 502 }
      );
    }

    const data = await res.json();
    const run = data?.run ?? {};
    return NextResponse.json({
      stdout: String(run.stdout ?? ""),
      stderr: String(run.stderr ?? ""),
      exitCode: typeof run.code === "number" ? run.code : null,
      signal: run.signal ?? null,
    });
  } catch (e) {
    console.error("run failed:", e);
    return NextResponse.json(
      { error: "Песочница не ответила. Попробуй ещё раз." },
      { status: 502 }
    );
  }
}
