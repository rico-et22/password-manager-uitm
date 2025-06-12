# Password Manager UITM

A password manager with 2FA client built using modern web technologies.

## Getting started

1. Clone the repository

git clone https://github.com/rico-et22/password-manager-uitm.git
cd password-manager-uitm

2. Install dependencies

pnpm install

3. Create an environment file

copy .env.example .env.local - Windows (CMD)
cp .env.example .env.local - Linux/macOS

4. Configure environment variables
```
# Example database for testing
POSTGRES_URL=postgres://neondb_owner:npg_vqwQNC69iftc@ep-plain-bar-a2pirj0c-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require
POSTGRES_PRISMA_URL=postgres://neondb_owner:npg_vqwQNC69iftc@ep-plain-bar-a2pirj0c-pooler.eu-central-1.aws.neon.tech/neondb?connect_timeout=15&sslmode=require
POSTGRES_URL_NON_POOLING=postgres://neondb_owner:npg_vqwQNC69iftc@ep-plain-bar-a2pirj0c.eu-central-1.aws.neon.tech/neondb?sslmode=require

# Generate one here: https://generate-secret.vercel.app/32 (only required for localhost)
AUTH_SECRET=
```

5. Run the application

pnpm build
pnpm start

6. Open in your browser:

http://localhost:3000
