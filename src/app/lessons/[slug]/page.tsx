import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { Badge, Card } from "@/components/ui";
import { LESSONS, getLesson } from "@/lib/lessons";

export function generateStaticParams() {
  return LESSONS.map((l) => ({ slug: l.slug }));
}

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson) notFound();

  const next = LESSONS.find((l) => l.order === lesson.order + 1);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <span className="text-4xl">{lesson.emoji}</span>
        <div>
          <div className="text-sm font-bold text-violet-dark">Урок {lesson.order} из {LESSONS.length}</div>
          <h1 className="font-display text-2xl font-bold">{lesson.title}</h1>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <Badge>{lesson.language === "python" ? "Python" : "JavaScript"}</Badge>
        <Badge color="lime">{lesson.minutes} минут</Badge>
      </div>

      <Card className="mb-6 bg-violet-soft p-4 text-sm">
        <strong>Цель урока:</strong> {lesson.goal}
      </Card>

      <article className="lesson-md">
        <ReactMarkdown>{lesson.content}</ReactMarkdown>
      </article>

      <Card className="mt-8 p-5">
        <div className="mb-2 font-display font-bold">Практика</div>
        <p className="mb-4 text-sm text-ink/70">
          Стартовый промпт уже будет в Студии — останется нажать «Сгенерировать код».
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href={`/studio?lesson=${lesson.slug}`}
            className="rounded-xl border-2 border-ink bg-violet px-5 py-2.5 font-bold text-white shadow-pop transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
          >
            Открыть в Студии →
          </Link>
          {next && (
            <Link
              href={`/lessons/${next.slug}`}
              className="rounded-xl border-2 border-ink bg-white px-5 py-2.5 font-bold shadow-pop transition-all hover:bg-violet-soft active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
            >
              Следующий урок
            </Link>
          )}
        </div>
      </Card>
    </div>
  );
}
