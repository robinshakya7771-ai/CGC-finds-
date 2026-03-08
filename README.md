# CGC Finds

**CGC Finds** is a full-stack Lost & Found web application built for the CGC campus community. Users can report lost or found items, browse listings, get smart match suggestions, and chat in real time to coordinate returns.

---

## Tech Stack

| Layer         | Technology                          |
| ------------- | ----------------------------------- |
| Framework     | [Next.js 16](https://nextjs.org) (App Router) |
| Language      | TypeScript                          |
| Styling       | Tailwind CSS 3                      |
| Database      | SQLite (via Prisma ORM)             |
| Auth          | NextAuth.js (Credentials provider)  |
| Icons         | Lucide React                        |

---

## Features

- **User Authentication** – Sign up / log in with email & password (hashed with bcrypt).
- **Report Items** – Post lost or found items with title, category, description, location, date, and optional image.
- **Search & Filter** – Browse all listings and filter by category, type, or keyword.
- **Smart Matching** – Automatically suggests potential matches between lost and found items.
- **Real-Time Chat** – In-app messaging between users to coordinate item returns.
- **Dashboard** – Personal dashboard showing your reported items and active chats.

---

## Prerequisites

Make sure the following are installed on your machine:

- **Node.js** – v18 or later → [Download](https://nodejs.org)
- **npm** – comes bundled with Node.js (v9+ recommended)
- **Git** – [Download](https://git-scm.com)

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/robinshakya7771-ai/CGC-finds-.git
cd CGC-finds-
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the project root (or copy the example below):

```env
# Database — SQLite file stored locally
DATABASE_URL="file:./dev.db"

# NextAuth secret — replace with your own random string in production
NEXTAUTH_SECRET="your-secret-key-here"
```

> **Tip:** You can generate a strong secret by running `openssl rand -base64 32` in your terminal.

### 4. Set Up the Database

Generate the Prisma client and create the SQLite database:

```bash
npx prisma generate
npx prisma db push
```

This will create a `dev.db` file inside the `prisma/` folder with all the required tables.

### 5. Run the Development Server

```bash
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser to see the app.

---

## Available Scripts

| Command           | Description                              |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Start the development server             |
| `npm run build`   | Create a production build                |
| `npm run start`   | Start the production server              |
| `npm run lint`    | Run ESLint to check for code issues      |
| `npx prisma studio` | Open Prisma Studio to view/edit DB data |

---

## Project Structure

```
CGC-finds-/
├── prisma/
│   └── schema.prisma      # Database schema (User, Item, Chat, Message)
├── public/                 # Static assets
├── src/
│   ├── app/                # Next.js App Router pages & API routes
│   │   └── api/auth/       # NextAuth authentication endpoints
│   ├── components/         # Reusable React components
│   ├── lib/                # Utility functions & Prisma client
│   └── types/              # TypeScript type definitions
├── .env                    # Environment variables (not committed)
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies & scripts
```

---

## Troubleshooting

| Problem                        | Solution                                                                 |
| ------------------------------ | ------------------------------------------------------------------------ |
| `prisma: command not found`    | Run `npm install` first — Prisma is a dev dependency.                    |
| Database errors after cloning  | Run `npx prisma generate && npx prisma db push` to recreate the DB.     |
| Port 3000 already in use       | Stop the other process or use `npm run dev -- -p 3001`.                  |
| Auth not working               | Make sure `NEXTAUTH_SECRET` is set in your `.env` file.                  |

---

## Contributing

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature`.
3. Commit your changes: `git commit -m "Add your feature"`.
4. Push to the branch: `git push origin feature/your-feature`.
5. Open a Pull Request.

---

## License

This project is for educational / campus use. Feel free to use and modify it.
