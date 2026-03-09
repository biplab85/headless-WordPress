# Sklentr — Headless WordPress + Next.js

A headless WordPress + Next.js website for **Sklentr Inc.**, a Toronto-based MVP development studio. WordPress serves as the headless CMS (content management only), while Next.js powers the frontend.

## Tech Stack

- **CMS:** WordPress (headless, REST API + WPGraphQL)
- **Frontend:** Next.js 16 (App Router) + React 19 + TypeScript
- **Styling:** Tailwind CSS 4
- **Animations:** GSAP + Lenis (smooth scrolling)
- **Database:** MySQL
- **Theme:** Dark/Light mode via `next-themes`

## Project Structure

```
headless-WordPress/
├── frontend/               # Next.js application
│   ├── src/
│   │   ├── app/            # App Router pages
│   │   ├── components/     # React components
│   │   │   ├── about/      # About page components
│   │   │   ├── blog/       # Blog components
│   │   │   ├── layout/     # Header, Footer
│   │   │   ├── portfolio/  # Portfolio components
│   │   │   ├── pricing/    # Pricing components
│   │   │   ├── sections/   # Homepage sections
│   │   │   ├── seo/        # JSON-LD & SEO
│   │   │   └── ui/         # Shared UI components
│   │   └── services/       # API service layer
│   └── public/             # Static assets
├── wordpress/              # WordPress installation (headless CMS)
└── PROJECT_PLAN.md         # Detailed project specification
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage (hero, services, portfolio, testimonials, pricing, FAQ, CTA) |
| `/services` | Services listing |
| `/portfolio` | Portfolio showcase |
| `/pricing` | Pricing plans |
| `/about` | About the company & team |
| `/blog` | Blog listing |
| `/blog/[slug]` | Individual blog posts |
| `/startup-visa` | Startup Visa program info |
| `/privacy-policy` | Privacy policy |
| `/terms-of-service` | Terms of service |

## Custom Post Types

- Portfolio, Services, Testimonials, Team Members, Pricing Plans, FAQs
- All managed via ACF (Advanced Custom Fields) and exposed through the REST API

## Getting Started

### Prerequisites

- Node.js 18+
- PHP 8+ with MySQL (WampServer, XAMPP, or similar)
- WordPress with required plugins installed

### WordPress Setup

1. Install WordPress in the `wordpress/` directory
2. Install required plugins: ACF Pro, WPGraphQL, Custom Post Type UI
3. Import content or configure custom post types as specified in `PROJECT_PLAN.md`

### Frontend Setup

```bash
cd frontend
npm install
```

Create `.env.local`:

```env
WORDPRESS_API_URL=http://localhost/sklentr/headless-WordPress/wordpress/wp-json
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_WORDPRESS_URL=http://localhost/sklentr/headless-WordPress/wordpress
REVALIDATION_SECRET=your-secret-here
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deployment

- **WordPress:** VPS at `admin.sklentr.com` (headless, API only)
- **Next.js:** Vercel at `www.sklentr.com`

## License

Private — Sklentr Inc.
