"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getLesson } from "@/lib/lessons";
import { Badge, Button, Card, Label, StepChip, Textarea } from "@/components/ui";

const CodeEditor = dynamic(() => import("@/components/CodeEditor"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[380px] items-center justify-center rounded-xl bg-ink text-sm text-paper/60">
      Загружаем редактор…
    </div>
  ),
});

type Lang = "python" | "javascript";
type RunResult = { stdout: string; stderr: string; exitCode: number | null } | null;

function Studio() {
  const params = useSearchParams();
  const lesson = getLesson(params.get("lesson") ?? "");

  const [language, setLanguage] = useState<Lang>(lesson?.language ?? "python");
  const [prompt, setPrompt] = useState(lesson?.starterPrompt ?? "");
  const [code, setCode] = useState("");
  const [stdin, setStdin] = useState("");
  const [generating, setGenerating] = useState(false);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [demoMode, setDemoMode] = useState(false);
  const [result, setResult] = useState<RunResult>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (lesson) {
      setLanguage(lesson.language);
      setPrompt(lesson.starterPrompt);
    }
  }, [lesson]);

  const generate = useCallback(async () => {
    setError(null);
    setResult(null);
    setGenerating(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, language }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Что-то пошло не так. Попробуй ещё раз.");
        return;
      }
      setCode(data.code);
      setDemoMode(Boolean(data.demo));

      // Сохраняем промпт и код — учитель увидит их в дашборде
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("prompts").insert({
          user_id: user.id,
          lesson_slug: lesson?.slug ?? null,
          language,
          prompt,
          generated_code: data.code,
        });
      }
    } catch {
      setError("Сеть не отвечает. Проверь интернет.");
    } finally {
      setGenerating(false);
    }
  }, [prompt, language, lesson]);

  const run = useCallback(async () => {
    setError(null);
    setRunning(true);
    setResult(null);
    try {
      const res = await fetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language, stdin }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Песочница не ответила.");
        return;
      }
      setResult({ stdout: data.stdout, stderr: data.stderr, exitCode: data.exitCode });
      setTimeout(() => outputRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 50);
    } catch {
      setError("Сеть не отвечает. Проверь интернет.");
    } finally {
      setRunning(false);
    }
  }, [code, language, stdin]);

  const needsInput = /input\(|readline/.test(code);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold">Студия</h1>
        {lesson && (
          <Link href={`/lessons/${lesson.slug}`} className="text-sm font-bold text-violet-dark underline">
            ← к уроку «{lesson.title}»
          </Link>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Шаг 1: промпт */}
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <StepChip n={1} label="Опиши программу" />
            <div className="flex gap-1">
              {(["python", "javascript"] as Lang[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLanguage(l)}
                  className={`rounded-lg border-2 border-ink px-2.5 py-1 text-xs font-bold ${
                    language === l ? "bg-violet text-white shadow-popSm" : "bg-white hover:bg-violet-soft"
                  }`}
                >
                  {l === "python" ? "Python" : "JS"}
                </button>
              ))}
            </div>
          </div>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={7}
            maxLength={800}
            placeholder="Например: игра «Камень, ножницы, бумага» против компьютера, счёт до трёх побед…"
          />
          <div className="mt-1 text-right text-xs text-ink/40">{prompt.length}/800</div>
          <Button onClick={generate} disabled={generating || prompt.trim().length < 10} className="mt-2 w-full">
            {generating ? "ИИ думает…" : "✨ Сгенерировать код"}
          </Button>
          {demoMode && (
            <p className="mt-3 rounded-xl border-2 border-ink bg-lime/30 px-3 py-2 text-xs">
              <strong>Демо-режим:</strong> ключи YandexGPT не настроены, показан пример. Промпт сохранён.
            </p>
          )}
        </Card>

        {/* Шаг 2: код */}
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b-2 border-ink px-5 py-3">
            <StepChip n={2} label="Код" />
            <Badge color="ink">{language === "python" ? "main.py" : "main.js"}</Badge>
          </div>
          <CodeEditor value={code} language={language} onChange={setCode} />
        </Card>
      </div>

      {/* Шаг 3: запуск */}
      <Card className="p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <StepChip n={3} label="Запусти и проверь" />
          <Button variant="lime" onClick={run} disabled={running || !code.trim()}>
            {running ? "Выполняем…" : "▶ Запустить"}
          </Button>
        </div>

        {needsInput && (
          <div className="mb-4">
            <Label htmlFor="stdin">Что программа «введёт с клавиатуры» (каждый ответ — с новой строки)</Label>
            <Textarea
              id="stdin"
              value={stdin}
              onChange={(e) => setStdin(e.target.value)}
              rows={3}
              placeholder={"Маша\n10\n15"}
              className="font-mono text-sm"
            />
            <p className="mt-1 text-xs text-ink/50">
              Песочница не умеет ждать ввода по очереди, поэтому все ответы пишем заранее.
            </p>
          </div>
        )}

        {error && (
          <p className="mb-4 rounded-xl border-2 border-ink bg-coral/20 px-3 py-2 text-sm font-semibold">{error}</p>
        )}

        <div ref={outputRef}>
          {result ? (
            <div className="rounded-xl border-2 border-ink bg-ink p-4 font-mono text-sm">
              {result.stdout && <pre className="whitespace-pre-wrap text-paper">{result.stdout}</pre>}
              {result.stderr && <pre className="mt-2 whitespace-pre-wrap text-coral">{result.stderr}</pre>}
              {!result.stdout && !result.stderr && (
                <span className="text-paper/50">Программа отработала, но ничего не вывела.</span>
              )}
              <div className="mt-3 border-t border-paper/20 pt-2 text-xs text-paper/50">
                {result.exitCode === 0
                  ? "✅ Завершилось без ошибок"
                  : `⚠️ Код завершения: ${result.exitCode ?? "—"} — прочитай красный текст выше, это подсказка`}
              </div>
            </div>
          ) : (
            <div className="rounded-xl border-2 border-dashed border-ink/30 p-6 text-center text-sm text-ink/40">
              Здесь появится результат работы программы
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

export default function StudioPage() {
  return (
    <Suspense>
      <Studio />
    </Suspense>
  );
}
