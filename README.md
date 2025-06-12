# Password Manager UI TM

A simple password manager built using modern web technologies.
This project allows for easy password management with secure authentication and efficient database interaction.

## Deploy Your Own

1. Clone the repository

git clone https://github.com/rico-et22/password-manager-uitm.git
cd password-manager-uitm

2. Install dependencies

npm install

3. Create an environment file

copy .env.example .env.local - Windows (CMD)
cp .env.example .env.local - Linux/macOS

4. Configure environment variables

# Create a Postgres database on Vercel: https://vercel.com/postgres
POSTGRES_URL=postgres://neondb_owner:npg_vqwQNC69iftc@ep-plain-bar-a2pirj0c-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require
POSTGRES_PRISMA_URL=postgres://neondb_owner:npg_vqwQNC69iftc@ep-plain-bar-a2pirj0c-pooler.eu-central-1.aws.neon.tech/neondb?connect_timeout=15&sslmode=require
POSTGRES_URL_NON_POOLING=postgres://neondb_owner:npg_vqwQNC69iftc@ep-plain-bar-a2pirj0c.eu-central-1.aws.neon.tech/neondb?sslmode=require

# Generate one here: https://generate-secret.vercel.app/32 (only required for localhost)
AUTH_SECRET=2f8487e6a4b4962e1eba2b5446c7065b

5. Run the application

npm run build
npm start

6. Open in your browser:

http://localhost:3000

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Neon Database](https://neon.tech/docs/introduction) – how Neon works and how to connect to the database
- [Drizzle ORM](https://orm.drizzle.team/docs) – the ORM used in this project
