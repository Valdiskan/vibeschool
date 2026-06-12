import Link from "next/link";
import { Badge, Card } from "@/components/ui";
import { LESSONS } from "@/lib/lessons";

export const metadata = { title: "Уроки — VibeSchool" };

export default function LessonsPage() {
  return (
    <div>
      <h1 className="mb-2 font-display text-2xl font-bold">Уроки</h1>
      <p className="mb-8 max-w-xl text-ink/60">
        Демо-курс из четырёх занятий: от первой программы до второго языка. Каждый урок
        заканчивается практикой в Студии.
      </p>
      <div className="space-y-4">
        {LESSONS.map((lesson) => (
          <Link key={lesson.slug} href={`/lessons/${lesson.slug}`} className="block">
            <Card className="flex items-center gap-4 p-5 transition-transform hover:-translate-y-0.5">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 border-ink bg-violet-soft text-2xl">
                {lesson.emoji}
              </span>
              <div className="min-w-0 flex-1">
                <div className="font-display font-bold">
                  Урок {lesson.order}. {lesson.title}
                </div>
                <div className="truncate text-sm text-ink/60">{lesson.goal}</div>
              </div>
              <div className="hidden shrink-0 gap-2 sm:flex">
                <Badge>{lesson.language === "python" ? "Python" : "JavaScript"}</Badge>
                <Badge color="lime">{lesson.minutes} мин</Badge>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
