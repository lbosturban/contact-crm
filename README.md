# Contact CRM

A complete mini-CRM for managing a local base of contacts, built with Angular 22 and TypeScript.
It runs entirely in the browser: no backend, no database — all data is persisted in `localStorage`.

## Project Description

Contact CRM lets any user:

- manage contacts (create, edit, delete) with strict form validation;
- organize contacts into color-coded categories (students, companies, clients, partners…);
- mark contacts as favorites to find them faster;
- search, filter and sort the directory (name, company, category, favorites only, A–Z / Z–A, newest / oldest);
- view global statistics on a dashboard (total contacts, favorites, categories, latest additions, per-category split);
- import and export the full data set (contacts + categories) as a JSON file.

Deleting a category is blocked while contacts still belong to it, with a clear error message.
A category or contact deletion always goes through an accessible confirmation dialog.

## Technologies

- [Angular 22](https://angular.dev/) — standalone components, signals, zoneless change detection, lazy-loaded routes
- [TypeScript](https://www.typescriptlang.org/) in strict mode (no `any`)
- Angular Router (guards, resolvers), Reactive Forms
- [Vitest](https://vitest.dev/) for unit tests (default runner of the Angular CLI test builder)
- [ESLint](https://eslint.org/) with [angular-eslint](https://github.com/angular-eslint/angular-eslint) and [Prettier](https://prettier.io/)
- Plain CSS with custom properties (no UI library of any kind)

## Installation

Prerequisites: Node.js 20+ (or later) and npm.

```bash
npm install
```

## Run the Project

```bash
npm start   # or: npm run dev
```

The application is served at [http://localhost:4200/](http://localhost:4200/).

Other useful commands:

```bash
npm run build   # production build into dist/
npm test        # unit tests (Vitest)
npm run lint    # ESLint (TS + templates)
npm run format  # Prettier
```

## Architecture & Design Choices

```
src/app/
├── core/                       # framework-independent building blocks
│   ├── models/                 # Contact, Category, filters and sort types
│   ├── services/
│   │   ├── storage.service.ts  # JSON persistence on top of localStorage
│   │   ├── contact.service.ts  # contact state (signal) + CRUD + seeding
│   │   ├── category.service.ts # category state + usage counts + guarded delete
│   │   ├── data-transfer.service.ts  # JSON import/export
│   │   ├── theme.service.ts    # light/dark theme (persisted, OS-aware)
│   │   └── i18n.service.ts     # minimal FR/EN dictionary
│   ├── validators/             # strict email, phone and hex color validators
│   ├── pipes/                  # fullName, initials, highlight, jobLine, t
│   ├── directives/             # autofocus, debounceInput
│   ├── guards/                 # canDeactivate (unsaved form protection)
│   ├── resolvers/              # contact & category preloaders
│   └── utils/                  # UUID-like id generation, timestamps
├── features/                   # one folder per feature, lazy-loaded
│   ├── dashboard/
│   ├── contacts/               # list (+filters/pagination), form, detail
│   ├── categories/             # list, form (create/edit), detail
│   └── favorites/
└── shared/                     # contact card, confirm dialog, pager
```

Key decisions:

- **Signal-based state** — each repository (contacts, categories) holds its state in a read-only
  signal exposed by a `providedIn: 'root'` service. Views are pure functions of that state, which
  keeps the zoneless change detection cheap and predictable.
- **Swappable persistence** — feature code only talks to domain services; `StorageService` is the
  single place that touches `localStorage` (namespaced keys, JSON serialization, error handling).
  Replacing it with an HTTP backend would not touch a single component.
- **Reactive Forms only** — both forms (contact, category) are strictly typed with
  `NonNullableFormBuilder`, custom validators for email/phone/hex color and an async duplicate-name
  check for categories.
- **Router-driven UX** — all seven required routes exist as lazy-loaded standalone components;
  resolvers preload the edited entity and redirect on unknown ids; a `CanDeactivate` guard warns
  about unsaved changes; resolved data and route params are bound to component inputs.
- **No UI library** — the design system is a small set of CSS custom properties with a light and a
  dark theme (`data-theme` attribute), responsive layouts and keyboard/ARIA support (skip link,
  labelled controls, `aria-pressed` favorites, focus-visible outlines).
- **i18n** — a tiny FR/EN dictionary served through the `t` pipe, switchable from the header and
  persisted per user; English is the fallback.

## Author

Built as a training project for the Code2Work Angular team.
