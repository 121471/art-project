# Art Project

A modern art platform built with Next.js, Prisma, and Tailwind CSS.

## Features

- User authentication with NextAuth.js
- Artwork management and discovery
- Collections and favorites
- Art preferences and notifications
- Email notifications for new similar artworks
- Responsive design

## Tech Stack

- Next.js 14
- TypeScript
- Prisma
- PostgreSQL
- Tailwind CSS
- NextAuth.js
- Resend (for email notifications)

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/art-project.git
cd art-project
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Then fill in the required environment variables in `.env`.

4. Set up the database:
```bash
npx prisma migrate dev
npx prisma db seed
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

- `DATABASE_URL`: PostgreSQL database URL
- `NEXTAUTH_URL`: NextAuth.js URL
- `NEXTAUTH_SECRET`: NextAuth.js secret
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret
- `RESEND_API_KEY`: Resend API key for email notifications
- `NEXT_PUBLIC_APP_URL`: Your application URL

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 