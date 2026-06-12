import Link from "next/link";
import { Badge, Card } from "@/components/ui";
import { LESSONS } from "@/lib/lessons";

export default function Home() {
  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="grid items-center gap-10 pt-6 md:grid-cols-2">
        <div>
          <Badge color="lime" className="mb-4">для 5–9 классов</Badge>
          <h1 className="font-display text-4xl font-bold leading-tight md:text-5xl">
            Программируй <span className="bg-violet px-2 text-white">словами</span>
          </h1>
          <p className="mt-4 max-w-md text-lg text-ink/70">
            Опиши программу по-русски — ИИ напишет код, песочница его запустит.
            Синтаксис подтянется сам, когда появится интерес.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/register"
              className="rounded-xl border-2 border-ink bg-violet px-5 py-2.5 font-bold text-white shadow-pop transition-all hover:bg-violet-dark active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
            >
              Начать бесплатно
            </Link>
            <Link
              href="/lessons"
              className="rounded-xl border-2 border-ink bg-white px-5 py-2.5 font-bold shadow-pop transition-all hover:bg-violet-soft active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
            >
              Смотреть уроки
            </Link>
          </div>
        </div>

        {/* Промпт → код: предмет платформы как иллюстрация */}
        <Card className="overflow-hidden">
          <div className="border-b-2 border-ink bg-violet-soft px-4 py-2 font-display text-xs font-bold uppercase tracking-wide">
            Промпт ученицы, 6 класс
          </div>
          <p className="px-4 py-3 text-sm">
            «Сделай игру: программа загадывает число от 1 до 20, у меня 5 попыток,
            подсказывай — больше или меньше»
          </p>
          <div className="border-y-2 border-ink bg-ink px-4 py-3 font-mono text-xs leading-relaxed text-paper">
            <span className="text-lime"># ИИ написал код — 2 секунды</span>
            <br />
            secret = random.randint(1, 20)
            <br />
            for attempt in range(1, 6):
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;guess = int(input(f&quot;Попытка &#123;attempt&#125;: &quot;))
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;...
          </div>
          <div className="px-4 py-3 font-mono text-xs">
            <span className="font-bold text-violet-dark">▶ запуск в песочнице</span>
            <br />
            Попытка 1: 10 → Моё число больше ⬆️
            <br />
            Попытка 2: 15 → 🎉 Угадала!
          </div>
        </Card>
      </section>

      {/* Как это работает */}
      <section>
        <h2 className="mb-6 font-display text-2xl font-bold">Как проходит занятие</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["💬", "Опиши задачу", "Ученик формулирует программу обычными словами. Это и есть главный навык — промпт-инжиниринг."],
            ["🤖", "ИИ пишет код", "YandexGPT превращает описание в Python или JavaScript с комментариями на русском."],
            ["▶️", "Запусти и проверь", "Код выполняется в изолированной песочнице: таймаут 5 секунд, без доступа к сети и файлам."],
          ].map(([emoji, title, text], i) => (
            <Card key={title as string} className="p-5">
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-ink bg-lime text-xl">
                  {emoji}
                </span>
                <span className="font-display font-bold">{`${i + 1}. ${title}`}</span>
              </div>
              <p className="text-sm text-ink/70">{text}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Уроки */}
      <section>
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-display text-2xl font-bold">Уроки демо-курса</h2>
          <Link href="/lessons" className="text-sm font-bold text-violet-dark underline">
            все уроки →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {LESSONS.map((lesson) => (
            <Link key={lesson.slug} href={`/lessons/${lesson.slug}`}>
              <Card className="h-full p-4 transition-transform hover:-translate-y-1">
                <div className="mb-2 text-3xl">{lesson.emoji}</div>
                <div className="font-display text-sm font-bold">{lesson.title}</div>
                <div className="mt-2 text-xs text-ink/60">
                  {lesson.minutes} мин · {lesson.language === "python" ? "Python" : "JavaScript"}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Для учителя */}
      <section>
        <Card className="bg-ink p-6 text-paper md:p-8">
          <div className="grid items-center gap-6 md:grid-cols-[1fr_auto]">
            <div>
              <h2 className="font-display text-2xl font-bold">Учителю информатики</h2>
              <p className="mt-2 max-w-xl text-paper/70">
                Дашборд класса показывает, какие промпты пишут ученики и где они застряли.
                Промпт — это и есть ход мысли ребёнка: его видно целиком.
              </p>
            </div>
            <Link
              href="/register"
              className="rounded-xl border-2 border-paper bg-lime px-5 py-2.5 text-center font-bold text-ink shadow-[4px_4px_0_0_#FBFAF7] transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
            >
              Создать класс
            </Link>
          </div>
        </Card>
      </section>
    </div>
  );
}
