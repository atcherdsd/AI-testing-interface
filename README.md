AI Assessment Interface
---
---

Deploy: https://ai-assessment-interface.netlify.app/

Интерфейс для многошагового опросника с загрузкой изображений и генерацией психологического отчёта.
Реализован на Next.js 15 (App Router), React, Redux Toolkit, React Hook Form + Zod, react-datepicker, date-fns. Поддерживает «боевой» режим работы с бекендом и «демо/мок» режим при недоступности сервера. Деплоится на Netlify.

---

## Содержание

- [Функциональность](#функциональность)
- [Технологии](#технологии)
- [Требования](#требования)
- [Установка и запуск локально](#установка-и-запуск-локально)
- [Переменные окружения](#переменные-окружения)
- [Сборка и деплой на Netlify](#сборка-и-деплой-на-netlify)
- [Описание ключевых частей](#описание-ключевых-частей)

---

## Функциональность

1. **Шаг 1**: загрузка нескольких изображений (с валидацией размера, превью).
2. **Шаг 2**: многоссекционная форма (React Hook Form + Zod) с датой рождения (react-datepicker + своя логика разбора/валидации ввода), радио- и текстовыми вопросами. Данные формы хранятся в Redux (formStateSlice) по каждому полю при onBlur/onChange, валидность тоже.
3. **Отправка на сервер**: сначала файлы через отдельный санк uploadImages, затем опросник через submitSurvey. Поддерживается режим мокового ответа (локальный endpoint `/api/submit-survey` или демонстрационный режим по флагу).
4. **Шаг 3**: показ отчёта.
    - Если моковый markdown → сразу рендерим (ReactMarkdown).
    - Если «боевой» режим → после отправки анкеты сохраняем `task_id`, далее периодически (каждые 10 сек) опрашиваем `/report/{task_id}` (Redux Thunk `fetchReportStatus`).
    - Если отчёт готов → показываем «Скачать отчет PDF» и «Просмотреть отчет».
    - Если долго не готов (таймаут, напр. 60 сек) → переключаемся в демонстрационный моковый отчёт.
5. **UI**:
    - `LoadingBlock` для загрузки файлов.
    - `FormInput` (input/textarea с автоподгонкой),
    - `FormRadioGroup`,
    - `DateInput` (Controller + react-datepicker с кастомным header + своя валидация dd.MM.yyyy + Zod-диапазон),
    - `StepNavigator` с кнопками Next/Prev и логикой шагов,
    - `Modal` для ошибок/уведомлений.
6. **Глобальное состояние**: Redux Toolkit + слайсы:
    - `imagesSlice`: загрузка изображений, `urls`, `taskId`, `isDemo`, мок при сбое.
    - `formStateSlice`: `formData` и `isValid`, аккумулирует данные из React Hook Form.
    - `surveySlice`: `submitSurvey`, хранит либо `mockMarkdown` (string), либо `serverResponse: { message, task_id }`.
    - `reportSlice`: опрос статуса отчёта (`fetchReportStatus`), хранит `status`, `pdfUrl`, `taskId`.
    - `progressSlice`: текущий шаг, навигация.
7. **Контексты**:
    - `ImagesContext`: доступ к загруженным файлам между компонентами.
    - `ReportContainerRefContext`: ref на DOM-элемент с отрендеренным markdown, чтобы html2pdf мог генерировать PDF.
8. **Моки и демо**:
    - Флаг `NEXT_PUBLIC_USE_MOCK_API` или `isDemo` при ошибке загрузки изображений → отправка анкеты на локальный `/api/submit-survey`, получаем markdown.
    - Боевой режим: отправляем реальные запросы, получаем `{ message, task_id }`, показываем сообщение, сохраняем `task_id`, опрашиваем статус отчёта.
    - Таймаут ожидания отчёта → переключение на демонстрационный запрос к локальному `/api/submit-survey` для получения mockMarkdown2.
9. **PDF из markdown**: html2pdf.js + контекст ref → StepNavigator вызывает html2pdf из контейнера с markdown.

---

## Технологии

- Next.js 15 (App Router)
- React 19+
- Redux Toolkit
- React Hook Form + Zod
- react-datepicker + date-fns + собственная логика разбора/валидации
- html2pdf.js (для генерации PDF из markdown-отчёта)
- CSS Modules + SCSS
- Netlify (деплой)
- TypeScript
- ESLint/Prettier

---

## Требования

- Node.js LTS (16+ или 18+)
- npm или Yarn
- Доступ к Netlify для деплоя
- Переменные окружения, настроенные в Netlify Dashboard (или `.env.local` локально)

---

## Установка и запуск локально

```bash
# Клонировать репозиторий
git clone <URL репозитория>
cd <папка проекта>

# Установить зависимости
npm install
# или
yarn install

# Создать файл .env.local (игнорируется .gitignore) со следующими переменными:
# NEXT_PUBLIC_API_URL=...
# NEXT_PUBLIC_API_SURVEY_URL=...
# NEXT_PUBLIC_API_REPORT_URL=...
# NEXT_PUBLIC_USE_MOCK_API=true/false
# NEXT_PUBLIC_USE_MOCK_ON_FAILURE=true/false

# Запустить dev-сервер
npm run dev
# Доступно: http://localhost:3000

Локально можно реализовать моковый endpoint /api/submit-survey для разработки офлайн.

React Hook Form + Zod схема ожидает birthDate: Date, остальные поля строки.

Redux Toolkit хранит состояние формы, файл- и отчетные данные.
```

---

## Переменные окружения

В Netlify (Site settings → Build & deploy → Environment variables) добавить:

- `NEXT_PUBLIC_API_URL` — URL загрузки изображений (https://.../upload).

- `NEXT_PUBLIC_API_SURVEY_URL` — URL отправки анкеты (https://.../submit-survey).

- `NEXT_PUBLIC_API_REPORT_URL` — URL проверки статуса отчёта (https://.../report).

- `NEXT_PUBLIC_USE_MOCK_API` — true/false (принудительный мок анкеты).

- `NEXT_PUBLIC_USE_MOCK_ON_FAILURE` — true, чтобы при сбое сервера при загрузке автоматически перейти в моковый режим.

---

## Описание ключевых частей

- **Redux slices**:

    - `imagesSlice`: загрузка изображений, хранит `urls, taskId, isDemo`, обрабатывает мок при сбое.

    - `formStateSlice`: `formData` и `isValid`, аккумулирует данные формы из React Hook Form.

    - `surveySlice`: отправка анкеты (`submitSurvey`), хранит в ответе либо `mockMarkdown` (string), либо `serverResponse: {message, task_id}`.

    - `reportSlice`: периодический опрос статуса отчёта (`fetchReportStatus`), хранит `status, pdfUrl, taskId`.

    - `progressSlice`: текущий шаг (1,2,3), навигация между шагами.

- **Компоненты**:

    - `MultiSectionForm`: обёртка над React Hook Form, Fieldsets, Controller для даты, FormInput/FormRadioGroup.

    - `FormInput`: инпут/текстовое поле, автоподгонка textarea, registerOptions для onBlur.

    - `FormRadioGroup`: группа радио-кнопок, register(name, {onChange:...}).

    - `DateInput` / прямой useController+react-datepicker: логика разбора формата dd.MM.yyyy, валидация формата, существования, диапазона, Zod-валидатор.

    - `StepNavigator`: кнопки Next/Prev, логика шага 1: загрузка изображений; шаг 2: отправка анкеты; шаг 3: показ ссылок на отчет или моковый markdown → PDF (html2pdf.js). Контекст ReportContainerRefContext передаёт ref контейнера с markdown в StepNavigator для html2pdf.

    - `Modal`: простой оверлей + сообщение + кнопка закрыть. Показывается при ошибках или уведомлениях (например, таймаут ожидания отчёта).

    - `LoadingBlock`: UI для загрузки файла, сброса, валидации размера, сброса isDemo при монтировании.

- **Контексты**:

    - `ImagesContext`: хранит ref к списку загруженных файлов для StepNavigator.

    - `ReportContainerRefContext`: хранит ref на DOM-элемент, содержащий отрендеренный markdown, чтобы html2pdf мог конвертировать его в PDF.

- **API маршруты Next.js** (локальный мок):

    - `/api/submit-survey`: возвращает markdown-строку (Content-Type: text/markdown).

    - `/api/report-status` для локального мок-опроса статуса.

- **React Hook Form + Zod**:

    - Схема `FormSchema` с `birthDate: z.date()`, остальные поля `z.string().min(1)`.

    - По умолчанию React Hook Form хранит состояние формы внутри, диспатчим в Redux при onBlur / onChange.

    - Валидация даты: собственная логика разбора строки + `onChangeRaw`, `onKeyDown` для Enter, `onBlur` для окончательной проверки + trigger Zod.

- **html2pdf.js**:

    - Динамический импорт в клиентских функциях `downloadReport` / `openReportInPdf`.

    - Ожидает DOM-node через переданный ref из Step3 → Context → StepNavigator.

- **Сценарии мок/демо**:

    - Если загрузка изображений терпит ошибку и флаг `NEXT_PUBLIC_USE_MOCK_ON_FAILURE=true`, ставится `isDemo=true`, генерируется mock taskId.

    - При отправке анкеты: если `process.env.NEXT_PUBLIC_USE_MOCK_API==='true'` или `isDemo===true`, отправляется локальный `/api/submit-survey`, ждём markdown, сохраняем в `surveySlice.mockMarkdown`. Шаг 3 сразу рендерит mockMarkdown (ReactMarkdown + возможность скачать PDF).

    - Если «боевой» режим: отправляем на реальный API, получаем `{message, task_id}`, показываем сообщение в модалке, сохраняем task_id; на шаге 3 пулим статус отчёта, ждём ответа.

    - Если отчёт не готов в разумное время (например, 60 сек), переключаемся в демо-режим: запускаем локальный запрос `/api/submit-survey` для получения mockMarkdown2, показываем его.
