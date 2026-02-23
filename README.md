# Wiki App

A configurable, self-hosted wiki application with a MediaWiki-inspired interface. Build your own personal encyclopedia for worldbuilding, knowledge management, or any topic.

**Features:** Rich text editor with wiki links, revision history, dark mode, sub-categories, article templates, search, interactive map, PDF/Markdown export, disambiguation pages.

## Deploy to Vercel (Recommended)

The fastest way to get your own wiki running.

### 1. Set up the database

Create a free PostgreSQL database on [Neon](https://neon.tech):
1. Sign up and create a new project
2. Copy the connection string (looks like `postgresql://user:pass@host/dbname?sslmode=require`)

### 2. Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmohammed-alsalhi%2Fwiki-app&env=DATABASE_URL,ADMIN_SECRET&envDescription=DATABASE_URL%3A%20PostgreSQL%20connection%20string.%20ADMIN_SECRET%3A%20Password%20for%20admin%20access.&project-name=my-wiki)

Or manually:
1. Fork this repository
2. Import it in [Vercel](https://vercel.com/new)
3. Add environment variables (see below)
4. Deploy

### 3. Configure environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `ADMIN_SECRET` | Yes | Password to access admin features |
| `NEXT_PUBLIC_WIKI_NAME` | No | Wiki name shown in header and metadata (default: `My Wiki`) |
| `NEXT_PUBLIC_WIKI_TAGLINE` | No | Short tagline in the top bar (default: `A personal wiki`) |
| `NEXT_PUBLIC_WIKI_DESCRIPTION` | No | Meta description for SEO |
| `NEXT_PUBLIC_WIKI_WELCOME_TEXT` | No | Welcome message on the home page |
| `NEXT_PUBLIC_WIKI_FOOTER_TEXT` | No | Footer text after the wiki name |
| `NEXT_PUBLIC_MAP_ENABLED` | No | Set to `true` to enable the interactive map page |
| `NEXT_PUBLIC_MAP_LABEL` | No | Label for the map in navigation (default: `Map`) |
| `NEXT_PUBLIC_MAP_IMAGE` | No | Path or URL to the map background image |
| `BLOB_READ_WRITE_TOKEN` | No | Vercel Blob token for image uploads |

### 4. Seed categories (optional)

After deploying, you can seed default categories by running the seed script, or just create categories manually through the admin interface.

## Run Locally

### Prerequisites
- Node.js 18+
- PostgreSQL database (local or remote)

### Setup

```bash
# Clone the repository
git clone https://github.com/mohammed-alsalhi/wiki-app.git
cd wiki-app

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your DATABASE_URL and ADMIN_SECRET
```

### Start the database

**Option A: Use a remote database (Neon, Supabase, etc.)**

Set `DATABASE_URL` in `.env` to your connection string.

**Option B: Use a local PostgreSQL**

```bash
# If using Docker:
docker run --name wiki-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=wiki -p 5432:5432 -d postgres

# Set in .env:
# DATABASE_URL="postgresql://postgres:postgres@localhost:5432/wiki"
```

### Run

```bash
# Push the schema to your database
npx prisma db push

# (Optional) Seed default categories
node prisma/seed.mjs

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). If `ADMIN_SECRET` is empty in `.env`, you'll have admin access automatically.

## Deploy to a Custom Domain

### Option 1: Vercel (easiest)

After deploying to Vercel, go to your project settings > Domains and add your custom domain. Vercel handles SSL automatically.

### Option 2: Self-host with Node.js

```bash
# Build the production bundle
npm run build

# Start the production server
npm start
```

The app runs on port 3000 by default. Put it behind a reverse proxy (Nginx, Caddy) for SSL and custom domain:

**Nginx example:**
```nginx
server {
    listen 443 ssl;
    server_name wiki.yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Caddy example (auto SSL):**
```
wiki.yourdomain.com {
    reverse_proxy localhost:3000
}
```

### Option 3: Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npx next build
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t wiki-app .
docker run -p 3000:3000 --env-file .env wiki-app
```

## License

MIT
