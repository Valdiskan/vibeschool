// Подготовка пользовательского промпта перед отправкой в LLM.

export const MAX_PROMPT_LENGTH = 800;

export function sanitizePrompt(raw: string): string {
  let s = raw.normalize("NFC");
  // Управляющие символы (кроме перевода строки) и невидимые символы
  s = s.replace(/[\u0000-\u0008\u000B-\u001F\u007F\u200B-\u200F\u2028\u2029]/g, "");
  // Схлопываем повторяющиеся пробелы и переводы строк
  s = s.replace(/[ \t]{3,}/g, "  ").replace(/\n{3,}/g, "\n\n").trim();
  if (s.length > MAX_PROMPT_LENGTH) s = s.slice(0, MAX_PROMPT_LENGTH);
  return s;
}

// Извлекает код из ответа модели: берёт первый ```-блок, иначе весь текст.
export function extractCode(text: string): string {
  const fence = text.match(/```[a-zA-Z]*\n?([\s\S]*?)```/);
  if (fence) return fence[1].trim();
  return text.trim();
}
