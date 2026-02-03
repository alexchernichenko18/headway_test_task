# Headway Test Task

This is a **Next.js** project bootstrapped with  
[`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

Проєкт використовує **Next.js (App Router)**, **TypeScript**, **ESLint (Airbnb)** та **Vitest** для юніт-тестів.

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

У проєкті доступні наступні npm-команди:

### dev

npm run dev

Запускає Next.js development server.

- Hot Reload
- Dev-режим
- Використовується під час розробки

---

### build

npm run build

- Збирає production-версію застосунку
- Виконує оптимізацію та перевірку типів

---

### start

npm run start

- Запускає production build
- Перед цим обовʼязково виконати `npm run build`

---

### lint

npm run lint

- Запускає ESLint для всього проєкту
- Використовується конфіг: **Airbnb + TypeScript + Next.js**

---

### test

npm run test

- Запускає всі юніт-тести
- Використовується **Vitest + Testing Library**
- Середовище виконання — `jsdom`

---

### test:watch

npm run test:watch

- Запускає тести у watch-режимі
- Тести автоматично перезапускаються при зміні файлів

---

## Configuration

### ESLint

Конфігурація ESLint знаходиться у файлах:

- `.eslintrc`
- `package.json` (extends та plugins)

За потреби правила можна змінювати або вимикати під власні потреби.

---

### Vitest

Конфігурація тестів знаходиться у файлі:

- `vitest.config.ts`
- `vitest.setup.ts`

Тут можна налаштовувати:
- environment (`jsdom`, `node`)
- setup файли
- coverage
- aliases

---

### TypeScript

Основні налаштування TypeScript:

- `tsconfig.json`

Можна змінювати strict-режими, paths, target тощо.

---

## Project Structure (high level)

- `src/components` — UI та feature-компоненти
- `src/context` — React Context (Game state)
- `src/utils` — helpers та утиліти
- `src/types` — TypeScript тип