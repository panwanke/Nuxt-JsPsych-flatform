# Nuxt 3 Minimal Starter

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

1. Build database. An example using docker-postgres is below:
```
docker run --name postgres-db -e POSTGRES_PASSWORD={user_password} -e POSTGRES_USER=postgres -e POSTGRES_DB={db_name} -p 5432:5432 -d postgres
```
- Note: `{user_password}` and `{db_name}` should be replaced with your own values

2. Setup environment variables for database in `.env`:
```
# .env
POSTGRES_PRISMA_URL=postgresql://postgres:{user_password}@localhost:5432/{db_name}
POSTGRES_URL_NON_POOLING=postgresql://postgres:{user_password}@localhost:5432/{db_name}
```
then initialize database by: `npx prisma migrate dev`

Make sure to install the dependencies:

```bash
pnpm install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
pnpm run dev
```

## Production

Build the application for production:

```bash
pnpm run build
```

Locally preview production build:

```bash
pnpm run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
