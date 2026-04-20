# TUNOT

A course grade viewer for TU Darmstadt Informatik B.Sc. students. Browse courses by study area (Pflicht, Wahlpflicht, Wahl), view grade distributions, and explore course details.

## Tech Stack

- [Next.js 15](https://nextjs.org/) (App Router)
- [React 19](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Recharts](https://recharts.org/) — grade distribution charts
- [Lucide React](https://lucide.dev/) — icons
- TypeScript

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
app/                  # Next.js App Router pages
  pflichtbereich/     # Pflichtbereich courses
  wahlbereich/        # Wahlbereich courses
  wahlpflichtbereich/ # Wahlpflichtbereich courses
  course/             # Individual course detail pages
components/           # Shared UI components
lib/                  # Data and utility functions
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
