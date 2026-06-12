// Фильтр нецензурной лексики для промптов учеников.
// Нормализует латинские «двойники» кириллицы и базовый leetspeak,
// затем ищет корни как подстроки нормализованного текста.

const LOOKALIKES: Record<string, string> = {
  a: "а", b: "б", c: "с", e: "е", k: "к", m: "м", o: "о", p: "р",
  t: "т", x: "х", y: "у", h: "н", r: "г", u: "и", n: "п",
  "0": "о", "3": "е", "4": "ч", "6": "б", "@": "а", "$": "с",
};

// Корни без уменьшительных/производных — ловим по подстроке.
const BAD_ROOTS = [
  "хуй", "хуе", "хуё", "хуи", "пизд", "ебат", "ебал", "ебан", "ебуч",
  "еблан", "ёбан", "ёбну", "заеб", "заёб", "уеби", "уёби", "выеб",
  "блядь", "бляди", "блядс", "мудак", "мудил", "пидор", "пидар",
  "гондон", "долбоеб", "долбоёб", "шлюх", "сука",
  "fuck", "shit", "bitch", "cunt", "dick", "asshole",
];

export function normalizeText(input: string): string {
  let s = input.toLowerCase().replace(/ё/g, "е");
  s = s
    .split("")
    .map((ch) => LOOKALIKES[ch] ?? ch)
    .join("");
  // Убираем разделители внутри слов: "х у й", "х*й"
  s = s.replace(/[\s.\-_*+'"`~^|\\/]+/g, "");
  return s;
}

export function containsProfanity(input: string): boolean {
  const normalized = normalizeText(input);
  const compactRoots = BAD_ROOTS.map((r) => r.replace(/ё/g, "е"));
  return compactRoots.some((root) => normalized.includes(root));
}
