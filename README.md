# Kappa Kappa Psi Learning Platform

A modern web application for learning about Kappa Kappa Psi (KKΨ) National Honorary Band Fraternity through interactive flashcards, quizzes, and comprehensive information pages.

## Features

- **Interactive Flashcards** - Study 7 topic areas with spaced repetition algorithm
- **Customizable Quizzes** - Test your knowledge with timed quizzes
- **Chapter Directory** - Searchable database of 343+ chapters
- **Information Pages** - Detailed content about founders, history, awards, and more
- **Progress Tracking** - Track your learning journey with statistics and streaks
- **Guest Access** - Explore all content without creating an account

## Tech Stack

- **Framework**: Next.js 15.2.3 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Database**: PostgreSQL + Prisma 5
- **Authentication**: NextAuth v5 (Discord OAuth)
- **API**: tRPC 11
- **State Management**: TanStack Query

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Discord OAuth application (for authentication)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd boh
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
BOH_DATABASE_URL="postgresql://postgres:password@localhost:5432/boh"
AUTH_SECRET="your-secret-key-here"
AUTH_DISCORD_ID="your-discord-client-id"
AUTH_DISCORD_SECRET="your-discord-client-secret"
```

4. Set up the database:
```bash
npx prisma generate
npx prisma migrate dev
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts

```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix linting issues
npm run typecheck    # Run TypeScript type checking
npm run format:check # Check code formatting
npm run format:write # Format code with Prettier
```

## Database Management

```bash
npx prisma generate      # Generate Prisma client
npx prisma migrate dev   # Run database migrations
npx prisma studio        # Open Prisma Studio GUI
npx prisma db push       # Push schema changes to database
```

## Project Structure

```
src/
├── app/                 # Next.js app router pages
│   ├── dashboard/       # User dashboard
│   ├── flashcards/      # Flashcard study interface
│   ├── quizzes/         # Quiz interface
│   └── info/            # Information pages
├── components/          # React components
│   ├── layout/          # Navigation, footer
│   ├── flashcards/      # Flashcard components
│   ├── quizzes/         # Quiz components
│   └── ui/              # shadcn/ui components
├── server/              # Backend code
│   ├── api/routers/     # tRPC API routes
│   ├── auth/            # NextAuth configuration
│   └── db.ts            # Prisma client
├── lib/                 # Utility functions
│   ├── content/         # Content loaders
│   ├── spaced-repetition.ts
│   └── quiz-generator.ts
└── types/               # TypeScript type definitions

reference/               # Content data (JSON & Markdown)
├── chapters_trivia.json
├── founding_fathers_trivia.json
├── awards_and_jewelry_trivia.json
└── ...
```

## Content Management

Content is stored as JSON and Markdown files in the `reference/` directory for easy editing:

- **Trivia Questions**: `*_trivia.json` files
- **Founding Fathers**: `founding_fathers/*.md`
- **Awards**: `awards_and_jewelry/*.md`
- **Chapters**: `chapters.json`

Simply edit these files and restart the dev server to see changes.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `BOH_DATABASE_URL` | PostgreSQL connection string | Yes |
| `AUTH_SECRET` | NextAuth secret key | Yes |
| `AUTH_DISCORD_ID` | Discord OAuth client ID | Yes |
| `AUTH_DISCORD_SECRET` | Discord OAuth client secret | Yes |

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Follow existing code style and patterns
4. Use TypeScript strictly (no `any` types)
5. Test with and without authentication
6. Ensure mobile responsiveness
7. Commit your changes (`git commit -m 'Add amazing feature'`)
8. Push to the branch (`git push origin feature/amazing-feature`)
9. Open a Pull Request

## Brand Colors

- **Navy**: `#09268a` (primary)
- **Gold**: `#ffc61e` (accent)

## License

[Add your license here]

## Acknowledgments

Built with dedication for the brotherhood of Kappa Kappa Psi.

For more information about Kappa Kappa Psi, visit [kkpsi.org](https://kkpsi.org)
