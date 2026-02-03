# Headway Test Task

This is a **Next.js** project bootstrapped with  
[`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

Проєкт реалізує гру у стилі **“Who wants to be a millionaire?”**  
та використовує **Next.js (App Router)**, **TypeScript**, **ESLint (Airbnb)** і **Vitest** для юніт-тестів.

---

## Requirements

- Node.js **18+**
- npm / yarn / pnpm / bun

---

## Getting Started

### Install dependencies

npm install

---

### Run project in development mode

npm run dev

Після цього відкрий у браузері:  
http://localhost:3000

Проєкт автоматично перезбирається при зміні файлів.

---

## Available Scripts

### dev

npm run dev  
Запускає Next.js development server (hot reload, dev mode).

### build

npm run build  
Збирає production-версію застосунку.

### start

npm run start  
Запускає production build (після `build`).

### lint

npm run lint  
Запускає ESLint (Airbnb + TypeScript + Next.js).

### test

npm run test  
Запускає всі юніт-тести (Vitest + Testing Library).

### test:watch

npm run test:watch  
Запускає тести у watch-режимі.

---

## Game Configuration

Гра повністю керується **JSON-конфігом**, який описує:

- валюту
- кількість кроків
- питання
- відповіді
- правильні варіанти

Саме цей конфіг визначає **логіку гри** (single / multi select).

---

## Example Game Config

Нижче наведено **повний приклад конфігу**, який використовується у проєкті:

```json
{
  "version": 1,
  "currency": "USD",
  "steps": [
    {
      "id": "s1",
      "amount": 500,
      "question": {
        "id": "q1",
        "text": "Which planet is known as the Red Planet?",
        "answers": [
          { "id": "a", "text": "Mars" },
          { "id": "b", "text": "Venus" },
          { "id": "c", "text": "Jupiter" },
          { "id": "d", "text": "Mercury" }
        ],
        "correctAnswerIds": ["a"]
      }
    },
    {
      "id": "s2",
      "amount": 1000,
      "question": {
        "id": "q2",
        "text": "Which of these are primary colors in the RGB color model?",
        "answers": [
          { "id": "a", "text": "Red" },
          { "id": "b", "text": "Green" },
          { "id": "c", "text": "Blue" },
          { "id": "d", "text": "Yellow" }
        ],
        "correctAnswerIds": ["a", "b", "c"]
      }
    }
  ]
}
```

Можна перевірити поточний конфіг за лінком
https://headway-test-task-xi.vercel.app/data/game-confing-1.json