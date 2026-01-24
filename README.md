# The Lit Site

A modern personal website and blog built with Next.js, featuring a portfolio section, blog with MDX support, and Spotify integration.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS 4
- **Content:** MDX with syntax highlighting (Prism)
- **Animations:** Framer Motion
- **UI Components:** Headless UI
- **Language:** TypeScript

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Configuration

### Environment Variables

Create a `.env.local` file for API integrations:

```env
# Spotify API (optional)
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
SPOTIFY_REFRESH_TOKEN=your_refresh_token
```

### Content

- **Blog Posts:** Add MDX files to `src/app/blog/[slug]/`
- **Images:** Place blog images in `public/images/blog/`

## Build

```bash
npm run build
npm start
```
