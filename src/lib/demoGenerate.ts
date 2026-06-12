// Демо-генератор: работает без YandexGPT, чтобы приложение можно было
// показать сразу после деплоя. Подбирает шаблон по ключевым словам промпта.

type Lang = "python" | "javascript";

const T = {
  greet: {
    python: `# Программа-приветствие (демо-режим)
name = input("Как тебя зовут? ")
for i in range(1, 4):
    print("Привет, " + name + "!" * i)
print("Рад знакомству! Отличный у тебя промпт 😎")`,
    javascript: `// Программа-приветствие (демо-режим)
const readline = require("readline").createInterface({ input: process.stdin, output: process.stdout });
readline.question("Как тебя зовут? ", (name) => {
  for (let i = 1; i <= 3; i++) {
    console.log("Привет, " + name + "!".repeat(i));
  }
  console.log("Рад знакомству! Отличный у тебя промпт 😎");
  readline.close();
});`,
  },
  guess: {
    python: `# Игра «Угадай число» (демо-режим)
import random

secret = random.randint(1, 20)
attempts = 5
print("Я загадал число от 1 до 20. У тебя", attempts, "попыток!")

for attempt in range(1, attempts + 1):
    guess = int(input(f"Попытка {attempt}: ")) 
    if guess == secret:
        print(f"🎉 Угадал со {attempt}-й попытки!")
        break
    elif guess < secret:
        print("Моё число больше ⬆️")
    else:
        print("Моё число меньше ⬇️")
else:
    print("Попытки кончились. Я загадал:", secret)`,
    javascript: `// Игра «Угадай число» (демо-режим, упрощённая: компьютер играет сам)
const secret = Math.floor(Math.random() * 20) + 1;
let low = 1, high = 20;
console.log("Я загадал число от 1 до 20. Компьютер-игрок угадывает:");
for (let attempt = 1; attempt <= 5; attempt++) {
  const guess = Math.floor((low + high) / 2);
  console.log(\`Попытка \${attempt}: \${guess}\`);
  if (guess === secret) { console.log("🎉 Угадал!"); break; }
  if (guess < secret) { console.log("больше ⬆️"); low = guess + 1; }
  else { console.log("меньше ⬇️"); high = guess - 1; }
}`,
  },
  calc: {
    python: `# Калькулятор (демо-режим)
a = float(input("Первое число: "))
op = input("Действие (+, -, *, /): ")
b = float(input("Второе число: "))

if op == "+":
    print("Результат:", a + b)
elif op == "-":
    print("Результат:", a - b)
elif op == "*":
    print("Результат:", a * b)
elif op == "/":
    if b == 0:
        print("На ноль делить нельзя — даже компьютеру 🙅")
    else:
        print("Результат:", a / b)
else:
    print("Не знаю такого действия:", op)`,
    javascript: `// Калькулятор (демо-режим)
const a = 10, b = 0, op = "/";
console.log(\`Считаю: \${a} \${op} \${b}\`);
if (op === "/" && b === 0) {
  console.log("На ноль делить нельзя — даже компьютеру 🙅");
} else {
  const ops = { "+": a + b, "-": a - b, "*": a * b, "/": a / b };
  console.log("Результат:", ops[op]);
}`,
  },
  password: {
    python: `# Генератор паролей (демо-режим)
import random
import string

chars = string.ascii_letters + string.digits + "!@#$%^&*"
for n in range(1, 6):
    password = "".join(random.choice(chars) for _ in range(12))
    print(f"{n}. {password}")`,
    javascript: `// Генератор паролей (демо-режим)
const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
for (let n = 1; n <= 5; n++) {
  let password = "";
  for (let i = 0; i < 12; i++) {
    password += chars[Math.floor(Math.random() * chars.length)];
  }
  console.log(\`\${n}. \${password}\`);
}`,
  },
  fallback: {
    python: `# Демо-режим: ключи YandexGPT не настроены, поэтому показываю пример.
# Твой промпт сохранён — с настоящим ИИ код будет именно по нему!

import random

phrases = [
    "Программирование — это объяснение идей компьютеру",
    "Точный промпт — половина решения",
    "Ошибки — это подсказки, а не катастрофа",
]
print("💡 Мысль дня:", random.choice(phrases))
for i in range(1, 6):
    print("★" * i)`,
    javascript: `// Демо-режим: ключи YandexGPT не настроены, поэтому показываю пример.
// Твой промпт сохранён — с настоящим ИИ код будет именно по нему!

const phrases = [
  "Программирование — это объяснение идей компьютеру",
  "Точный промпт — половина решения",
  "Ошибки — это подсказки, а не катастрофа",
];
console.log("💡 Мысль дня:", phrases[Math.floor(Math.random() * phrases.length)]);
for (let i = 1; i <= 5; i++) {
  console.log("★".repeat(i));
}`,
  },
};

export function demoGenerate(prompt: string, language: Lang): string {
  const p = prompt.toLowerCase();
  if (/(привет|здоров|имя|знаком)/.test(p)) return T.greet[language];
  if (/(угадай|загад|попыт)/.test(p)) return T.guess[language];
  if (/(калькул|сложи|подели|умнож)/.test(p)) return T.calc[language];
  if (/(парол|password)/.test(p)) return T.password[language];
  return T.fallback[language];
}
