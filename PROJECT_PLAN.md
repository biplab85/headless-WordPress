# Sklentr.com — Headless WordPress + Next.js Rebuild

> **Project:** Sklentr Inc. Website Rebuild
> **Version:** 1.0
> **Date:** March 2026
> **Architecture:** WordPress (Headless CMS) + Next.js (Frontend) + MySQL (Database)
> **Live Reference:** https://www.sklentr.com/

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [System Architecture](#2-system-architecture)
3. [Tech Stack](#3-tech-stack)
4. [Complete Site Map & Page Inventory](#4-complete-site-map--page-inventory)
5. [Folder Structure (Next.js)](#5-folder-structure-nextjs)
6. [WordPress Setup Guide](#6-wordpress-setup-guide)
7. [Custom Post Types & ACF Fields](#7-custom-post-types--acf-fields)
8. [Required WordPress Plugins](#8-required-wordpress-plugins)
9. [API Endpoints](#9-api-endpoints)
10. [Next.js Data Fetching Strategy](#10-nextjs-data-fetching-strategy)
11. [Dynamic Routing System](#11-dynamic-routing-system)
12. [Component Architecture](#12-component-architecture)
13. [Page-by-Page Build Specification](#13-page-by-page-build-specification)
14. [Media & Image Handling](#14-media--image-handling)
15. [SEO Strategy](#15-seo-strategy)
16. [Dark/Light Mode](#16-darklight-mode)
17. [Deployment Strategy](#17-deployment-strategy)
18. [Development Task Plan](#18-development-task-plan)
19. [Future Scalability](#19-future-scalability)

---

## 1. Project Overview

**Sklentr Inc.** is a Toronto-based MVP development studio. The current website at `sklentr.com` is being rebuilt using a headless WordPress + Next.js architecture. The rebuild will replicate **every page, section, and feature** from the current live site while gaining the benefits of a decoupled CMS.

### Architecture Summary

- **WordPress** — Headless CMS. Content editors manage all pages, blog posts, portfolio case studies, services, pricing, testimonials, FAQs, and team members through the WordPress admin dashboard. No frontend theme is served.
- **Next.js** — Public-facing frontend. Fetches all data from WordPress via REST API / GraphQL. Renders a fast, SEO-optimized, responsive website with dark/light mode support.
- **MySQL** — Powers the WordPress database.

### Content Workflow

```
Sklentr Team → WordPress Admin → Content saved to MySQL
                                        ↓
Site Visitor ← Next.js (Vercel) ← REST API / GraphQL ← WordPress
```

### Business Context

| Detail | Value |
|---|---|
| **Company** | Sklentr Inc. |
| **Founded** | 2023 |
| **Founder** | Rishad Wahid |
| **HQ** | Toronto, Ontario, Canada |
| **Dev Center** | Dhaka, Bangladesh |
| **Email** | info@sklentr.com |
| **Phone** | +1 647-997-0557 |
| **Social** | LinkedIn, Facebook, Instagram, X/Twitter |

---

## 2. System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                     WORDPRESS (Headless CMS)                        │
│                                                                     │
│  Content Types:                    Database:                        │
│  ├── Pages (Home, About, etc.)     MySQL                           │
│  ├── Blog Posts                                                     │
│  ├── Portfolio (CPT)               Media:                          │
│  ├── Services (CPT)                wp-content/uploads/             │
│  ├── Team Members (CPT)                                            │
│  ├── Testimonials (CPT)            Plugins:                        │
│  ├── FAQs (CPT)                    ACF Pro, Yoast SEO,            │
│  ├── Pricing Plans (CPT)           WPGraphQL, REST API Menus      │
│  └── Menus & Settings                                              │
│                                                                     │
│  API Layer:                                                         │
│  ├── REST: /wp-json/wp/v2/...                                      │
│  ├── GraphQL: /graphql                                             │
│  ├── ACF: /wp-json/acf/v3/...                                     │
│  └── Menus: /wp-json/wp-api-menus/v2/...                          │
└──────────────────────────┬──────────────────────────────────────────┘
                           │ HTTPS / JSON
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      NEXT.JS FRONTEND                               │
│                                                                     │
│  Routes:                          Components:                       │
│  /                (Home)          Header, Footer, Navigation       │
│  /services        (Services)      Hero, ProblemSection             │
│  /startup-visa    (Startup Visa)  ServiceCard, PricingCard         │
│  /portfolio       (Portfolio)     PortfolioCard, CaseStudy         │
│  /pricing         (Pricing)       TestimonialSlider, TeamCard      │
│  /about           (About)         FAQAccordion, BlogCard           │
│  /blog            (Blog)          CTASection, StatsBar             │
│  /blog/[slug]     (Blog Post)     ContactForm, SearchBar           │
│                                                                     │
│  Rendering: SSG + ISR (revalidate on content change)               │
│  Styling: Tailwind CSS + Dark/Light mode                           │
│  Deployment: Vercel (Edge Network)                                  │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        END USER                                     │
│  Fast, SEO-optimized, responsive pages via Vercel CDN              │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 3. Tech Stack

### Backend (WordPress)

| Technology | Version | Purpose |
|---|---|---|
| WordPress | 6.x | Headless CMS |
| PHP | 8.2+ | WordPress runtime |
| MySQL | 8.0+ | Database |
| ACF Pro | Latest | Custom fields for all content types |
| WPGraphQL | Latest | GraphQL API layer |
| WPGraphQL for ACF | Latest | Expose ACF fields in GraphQL |
| ACF to REST API | Latest | Expose ACF fields in REST API |
| Yoast SEO | Latest | SEO metadata management |
| WP REST API Menus | Latest | Menu API endpoints |

### Frontend (Next.js)

| Technology | Version | Purpose |
|---|---|---|
| Next.js | 15 | React framework with App Router |
| React | 19 | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4 | Utility-first styling |
| next-themes | Latest | Dark/Light mode |
| next/image | Built-in | Image optimization |
| Framer Motion | Latest | Animations & transitions |
| Lucide React | Latest | Icon library |
| html-react-parser | Latest | Parse WordPress HTML content |

### DevOps

| Tool | Purpose |
|---|---|
| Git + GitHub | Version control |
| Vercel | Next.js hosting & CI/CD |
| WampServer | Local WordPress development |
| Postman | API testing |
| ESLint + Prettier | Code quality |

---

## 4. Complete Site Map & Page Inventory

Every page that exists on the current `sklentr.com`:

```
/                     → Homepage
/services             → Services (6 service categories)
/startup-visa         → Startup Visa MVP page
/portfolio            → Portfolio (6 case studies)
/pricing              → Pricing (3 tiers + FAQ)
/about                → About (story, values, team, offices)
/blog                 → Blog listing
/blog/[slug]          → Individual blog posts (6+ articles)
/privacy-policy       → Privacy Policy
/terms-of-service     → Terms of Service
```

### Navigation Menu

**Primary Navigation:**

| Label | Link | Type |
|---|---|---|
| Services | /services | Internal |
| Startup Visa | /startup-visa | Internal |
| Portfolio | /portfolio | Internal |
| Pricing | /pricing | Internal |
| About | /about | Internal |
| Blog | /blog | Internal |
| Book a Call | Calendly URL | External CTA |

**Footer Navigation:**

| Column | Links |
|---|---|
| Company | About, Portfolio, Blog, Contact, Pricing |
| Services | MVP Development, Website Design, SEO & Marketing, Paid Ads, Video Production |
| Legal | Privacy Policy, Terms of Service |

---

## 5. Folder Structure (Next.js)

```
frontend/
├── public/
│   ├── fonts/                          # Inter font files (variable weight)
│   ├── images/
│   │   ├── logo.svg                    # Sklentr logo
│   │   ├── logo-dark.svg              # Logo for dark mode
│   │   ├── og-default.jpg             # Default Open Graph image
│   │   └── icons/                      # Service icons, misc
│   └── favicon.ico
│
├── src/
│   ├── app/
│   │   ├── layout.tsx                  # Root layout (HTML, providers, Header, Footer)
│   │   ├── page.tsx                    # Homepage
│   │   ├── not-found.tsx               # Custom 404
│   │   ├── loading.tsx                 # Global loading skeleton
│   │   ├── error.tsx                   # Error boundary
│   │   ├── sitemap.ts                  # Auto-generated sitemap
│   │   ├── robots.ts                   # Robots.txt
│   │   │
│   │   ├── services/
│   │   │   └── page.tsx                # Services page
│   │   │
│   │   ├── startup-visa/
│   │   │   └── page.tsx                # Startup Visa page
│   │   │
│   │   ├── portfolio/
│   │   │   └── page.tsx                # Portfolio listing
│   │   │
│   │   ├── pricing/
│   │   │   └── page.tsx                # Pricing page
│   │   │
│   │   ├── about/
│   │   │   └── page.tsx                # About page
│   │   │
│   │   ├── blog/
│   │   │   ├── page.tsx                # Blog listing
│   │   │   └── [slug]/
│   │   │       └── page.tsx            # Single blog post
│   │   │
│   │   ├── privacy-policy/
│   │   │   └── page.tsx                # Privacy Policy
│   │   │
│   │   ├── terms-of-service/
│   │   │   └── page.tsx                # Terms of Service
│   │   │
│   │   └── api/
│   │       └── revalidate/
│   │           └── route.ts            # ISR on-demand revalidation
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx              # Sticky header with nav
│   │   │   ├── Footer.tsx              # Full footer with columns
│   │   │   ├── Navigation.tsx          # Desktop nav menu
│   │   │   ├── MobileMenu.tsx          # Mobile hamburger menu
│   │   │   └── BookCallButton.tsx      # Calendly CTA button
│   │   │
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   ├── Accordion.tsx           # For FAQs
│   │   │   ├── ThemeToggle.tsx
│   │   │   └── SectionHeading.tsx      # Reusable section title + subtitle
│   │   │
│   │   ├── sections/
│   │   │   ├── Hero.tsx                # Homepage hero
│   │   │   ├── ProblemSection.tsx      # "Your idea deserves better..."
│   │   │   ├── WhyChooseSection.tsx    # "We ship while others plan"
│   │   │   ├── StatsBar.tsx            # Metrics row (14 days, 98%, 50+)
│   │   │   ├── PricingSection.tsx      # 3 pricing cards
│   │   │   ├── ServicesGrid.tsx        # 6 service cards
│   │   │   ├── PortfolioGrid.tsx       # Portfolio cards
│   │   │   ├── TestimonialSlider.tsx   # Client testimonials
│   │   │   ├── StartupVisaCTA.tsx      # Startup Visa callout
│   │   │   ├── BlogPreview.tsx         # Latest 3 blog posts
│   │   │   ├── FinalCTA.tsx            # "Ready to launch?" section
│   │   │   └── ProcessTimeline.tsx     # 4-week process steps
│   │   │
│   │   ├── portfolio/
│   │   │   ├── PortfolioCard.tsx       # Project card (image, title, industry)
│   │   │   └── CaseStudyDetail.tsx     # Full case study layout
│   │   │
│   │   ├── blog/
│   │   │   ├── BlogCard.tsx            # Blog post card
│   │   │   ├── BlogContent.tsx         # Single post content renderer
│   │   │   └── BlogMeta.tsx            # Author, date, read time
│   │   │
│   │   ├── about/
│   │   │   ├── TeamCard.tsx            # Team member card
│   │   │   ├── ValueCard.tsx           # Core value card
│   │   │   └── OfficeCard.tsx          # Office location card
│   │   │
│   │   ├── pricing/
│   │   │   ├── PricingCard.tsx         # Tier card with features
│   │   │   ├── PricingComparison.tsx   # Feature comparison table
│   │   │   └── GuaranteeCard.tsx       # On-time, code ownership, etc.
│   │   │
│   │   └── seo/
│   │       └── JsonLd.tsx              # Structured data (Organization, Article)
│   │
│   ├── lib/
│   │   ├── wordpress.ts               # WordPress API client
│   │   ├── constants.ts               # Site config, API URLs, social links
│   │   └── utils.ts                   # Helper functions (date format, slug, sanitize)
│   │
│   ├── services/
│   │   ├── posts.ts                   # Blog posts fetching
│   │   ├── pages.ts                   # WordPress pages fetching
│   │   ├── portfolio.ts               # Portfolio CPT fetching
│   │   ├── services.ts                # Services CPT fetching
│   │   ├── testimonials.ts            # Testimonials CPT fetching
│   │   ├── team.ts                    # Team Members CPT fetching
│   │   ├── pricing.ts                 # Pricing Plans CPT fetching
│   │   ├── faqs.ts                    # FAQs CPT fetching
│   │   ├── menus.ts                   # Navigation menus
│   │   └── search.ts                  # Search functionality
│   │
│   ├── hooks/
│   │   ├── useMenu.ts
│   │   ├── useTheme.ts
│   │   └── usePagination.ts
│   │
│   ├── types/
│   │   ├── wordpress.ts               # Base WP types
│   │   ├── post.ts                    # Blog post type
│   │   ├── portfolio.ts               # Portfolio project type
│   │   ├── service.ts                 # Service type
│   │   ├── testimonial.ts             # Testimonial type
│   │   ├── team.ts                    # Team member type
│   │   ├── pricing.ts                 # Pricing tier type
│   │   ├── faq.ts                     # FAQ type
│   │   └── menu.ts                    # Menu type
│   │
│   └── styles/
│       └── globals.css                # Tailwind directives, custom properties
│
├── .env.local
├── .env.example
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## 6. WordPress Setup Guide

### Step 1: Install WordPress

1. Ensure WampServer is running (Apache + MySQL + PHP 8.2+).
2. Open phpMyAdmin → Create database: `sklentr_headless`.
3. Download WordPress from [wordpress.org](https://wordpress.org/download/).
4. Extract to `E:\wampserver\www\sklentr\headless-WordPress\wordpress\`.
5. Navigate to `http://localhost/sklentr/headless-WordPress/wordpress/` → Run installer.
6. Database settings:
   - Database: `sklentr_headless`
   - Username: `root`
   - Password: *(empty for WampServer)*
   - Host: `localhost`
7. Site Title: `Sklentr Inc.`

### Step 2: Configure for Headless

Add to **`wp-config.php`**:

```php
// Site URLs
define('WP_HOME', 'http://localhost/sklentr/headless-WordPress/wordpress');
define('WP_SITEURL', 'http://localhost/sklentr/headless-WordPress/wordpress');

// Headless frontend URL (Next.js)
define('HEADLESS_FRONTEND_URL', 'http://localhost:3000');
```

### Step 3: Enable CORS

Add to the active theme's **`functions.php`**:

```php
<?php
// CORS for headless frontend
add_action('rest_api_init', function () {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function ($value) {
        $origin = get_http_origin();
        $allowed = [
            'http://localhost:3000',
            'https://www.sklentr.com',
        ];

        if ($origin && in_array($origin, $allowed, true)) {
            header('Access-Control-Allow-Origin: ' . esc_url_raw($origin));
        }

        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
        header('Access-Control-Allow-Credentials: true');

        return $value;
    });
});
```

### Step 4: Set Permalinks

Go to **Settings → Permalinks** → Select **"Post name"** (`/%postname%/`) → Save.

### Step 5: Install All Plugins

See [Section 8](#8-required-wordpress-plugins) for the complete plugin list. Install and activate all required plugins.

### Step 6: Register Custom Post Types

See [Section 7](#7-custom-post-types--acf-fields) for all CPTs and ACF field definitions.

### Step 7: Create Navigation Menus

1. **Appearance → Menus**
2. Create **"Primary Menu"**:
   - Services → `/services`
   - Startup Visa → `/startup-visa`
   - Portfolio → `/portfolio`
   - Pricing → `/pricing`
   - About → `/about`
   - Blog → `/blog`
3. Create **"Footer Company"**:
   - About, Portfolio, Blog, Contact, Pricing
4. Create **"Footer Services"**:
   - MVP Development, Website Design, SEO & Marketing, Paid Ads, Video Production
5. Create **"Footer Legal"**:
   - Privacy Policy, Terms of Service

### Step 8: Seed Content

Create all content that currently exists on the live site:

**Pages:**
- Home, About, Services, Pricing, Portfolio, Startup Visa, Blog, Privacy Policy, Terms of Service

**Blog Posts (6):**
1. "How to Validate Your Startup Idea Before Building" — Strategy — Rishad Wahid — Jan 20, 2026
2. "The 2-Week MVP: What's Actually Possible" — Development — Sklentr Team — Jan 15, 2026
3. "Startup Visa Canada: Technical Requirements Explained" — Startup Visa — Sklentr Team — Jan 10, 2026
4. "Why Your MVP Doesn't Need to Be Perfect" — Mindset — Rishad Wahid — Jan 5, 2026
5. "SEO for Startups: A No-BS Guide" — Marketing — Sklentr Team — Dec 28, 2025
6. "How We Built an MVP in 10 Days" — Case Study — Rishad Wahid — Dec 20, 2025

**Portfolio Projects (6):**
1. Horizon Trials — Healthcare/AI
2. AI Farming — AgriTech/AI
3. Get Takaful — FinTech/Blockchain
4. KindredCare — Healthcare/Elderly Care
5. Agile Sourcing — Fashion/Sustainability
6. GAinData — SaaS/Data Analytics

**Services (6):**
1. Web & Mobile Applications (MVP Development)
2. Website Design (WordPress & Custom)
3. SEO & Marketing
4. Paid Advertising
5. Video Production
6. Business Consultation

**Testimonials (3):**
1. Tanzila Rawnack, CEO KindredCare
2. Sudhir Biswas, CEO Roboreg
3. Monzur Khan, CEO AI Farming

**Team Members (4):**
1. Rishad Wahid — Founder & CEO
2. Development Team — Engineering
3. Design Team — UI/UX Design
4. Marketing Team — Growth & SEO

**Pricing Plans (3):**
1. Starter MVP — $5,000 CAD
2. Growth MVP — $15,000 CAD (Popular)
3. Full-Service — $30,000+ CAD

**FAQs (Pricing page — 8 questions):**
1. How do I know which package is right for me?
2. What's included in the price?
3. Do you offer payment plans?
4. What if I need features not listed?
5. How fast can you really deliver?
6. What happens after launch?
7. Do I own the code?
8. What tech stack do you use?

**FAQs (Startup Visa page — 7 questions):**
1. How long does it take to build my MVP?
2. What if I don't have technical specifications?
3. Do I own the source code?
4. What tech stack do you use?
5. What happens after launch?
6. Can you help with my pitch deck?
7. What if the SUV program stays paused?

---

## 7. Custom Post Types & ACF Fields

### CPT 1: Portfolio Projects

**Post Type:** `portfolio`
**REST Base:** `portfolio`
**Supports:** title, editor, thumbnail, excerpt, custom-fields

**ACF Field Group: "Portfolio Details"**

| Field Name | Field Type | API Key | Notes |
|---|---|---|---|
| Industry | Text | `industry` | e.g., "Healthcare / AI" |
| Client Challenge | Textarea | `client_challenge` | Problem description |
| Our Solution | Textarea | `our_solution` | Solution description |
| Results Summary | Textarea | `results_summary` | Outcomes achieved |
| Development Time | Text | `dev_time` | e.g., "2 months" |
| Tech Stack | Repeater | `tech_stack` | Sub-field: `technology` (text) |
| Project URL | URL | `project_url` | Live project link (optional) |
| Featured on Homepage | True/False | `featured_home` | Show on homepage? |

```php
function register_portfolio_cpt() {
    register_post_type('portfolio', [
        'labels' => [
            'name'          => 'Portfolio',
            'singular_name' => 'Project',
            'add_new'       => 'Add New Project',
            'add_new_item'  => 'Add New Project',
            'edit_item'     => 'Edit Project',
            'all_items'     => 'All Projects',
        ],
        'public'       => true,
        'has_archive'  => true,
        'rewrite'      => ['slug' => 'portfolio'],
        'show_in_rest' => true,
        'rest_base'    => 'portfolio',
        'supports'     => ['title', 'editor', 'thumbnail', 'excerpt', 'custom-fields'],
        'menu_icon'    => 'dashicons-portfolio',
    ]);
}
add_action('init', 'register_portfolio_cpt');
```

---

### CPT 2: Services

**Post Type:** `service`
**REST Base:** `services`
**Supports:** title, editor, thumbnail, excerpt, custom-fields

**ACF Field Group: "Service Details"**

| Field Name | Field Type | API Key | Notes |
|---|---|---|---|
| Icon | Image | `service_icon` | Service icon/illustration |
| Timeline | Text | `timeline` | e.g., "2-8 weeks" |
| Starting Price | Text | `starting_price` | e.g., "$5,000 CAD" |
| Sub-Services | Repeater | `sub_services` | Sub-field: `name` (text) |
| Display Order | Number | `display_order` | Sort order on page |

```php
function register_service_cpt() {
    register_post_type('service', [
        'labels' => [
            'name'          => 'Services',
            'singular_name' => 'Service',
            'add_new'       => 'Add New Service',
            'all_items'     => 'All Services',
        ],
        'public'       => true,
        'has_archive'  => true,
        'rewrite'      => ['slug' => 'services'],
        'show_in_rest' => true,
        'rest_base'    => 'services',
        'supports'     => ['title', 'editor', 'thumbnail', 'excerpt', 'custom-fields'],
        'menu_icon'    => 'dashicons-clipboard',
    ]);
}
add_action('init', 'register_service_cpt');
```

---

### CPT 3: Testimonials

**Post Type:** `testimonial`
**REST Base:** `testimonials`
**Supports:** title, custom-fields

**ACF Field Group: "Testimonial Details"**

| Field Name | Field Type | API Key | Notes |
|---|---|---|---|
| Quote | Textarea | `quote` | The testimonial text |
| Client Name | Text | `client_name` | e.g., "Tanzila Rawnack" |
| Client Role | Text | `client_role` | e.g., "CEO" |
| Company Name | Text | `company_name` | e.g., "KindredCare" |
| Client Photo | Image | `client_photo` | Headshot |
| Display Order | Number | `display_order` | Sort order |

```php
function register_testimonial_cpt() {
    register_post_type('testimonial', [
        'labels' => [
            'name'          => 'Testimonials',
            'singular_name' => 'Testimonial',
            'add_new'       => 'Add New Testimonial',
            'all_items'     => 'All Testimonials',
        ],
        'public'       => true,
        'has_archive'  => false,
        'show_in_rest' => true,
        'rest_base'    => 'testimonials',
        'supports'     => ['title', 'custom-fields'],
        'menu_icon'    => 'dashicons-format-quote',
    ]);
}
add_action('init', 'register_testimonial_cpt');
```

---

### CPT 4: Team Members

**Post Type:** `team_member`
**REST Base:** `team-members`
**Supports:** title, editor, thumbnail, custom-fields

**ACF Field Group: "Team Member Details"**

| Field Name | Field Type | API Key | Notes |
|---|---|---|---|
| Position/Role | Text | `position` | e.g., "Founder & CEO" |
| Department | Text | `department` | e.g., "Engineering" |
| Location | Text | `location` | e.g., "Toronto, Canada" |
| Bio | Textarea | `bio` | Short bio text |
| LinkedIn URL | URL | `linkedin_url` | Optional |
| Display Order | Number | `display_order` | Sort order |

```php
function register_team_cpt() {
    register_post_type('team_member', [
        'labels' => [
            'name'          => 'Team Members',
            'singular_name' => 'Team Member',
            'add_new'       => 'Add New Member',
            'all_items'     => 'All Team Members',
        ],
        'public'       => true,
        'has_archive'  => false,
        'show_in_rest' => true,
        'rest_base'    => 'team-members',
        'supports'     => ['title', 'editor', 'thumbnail', 'custom-fields'],
        'menu_icon'    => 'dashicons-groups',
    ]);
}
add_action('init', 'register_team_cpt');
```

---

### CPT 5: Pricing Plans

**Post Type:** `pricing_plan`
**REST Base:** `pricing-plans`
**Supports:** title, custom-fields

**ACF Field Group: "Pricing Plan Details"**

| Field Name | Field Type | API Key | Notes |
|---|---|---|---|
| Price | Text | `price` | e.g., "$5,000 CAD" |
| Price Range | Text | `price_range` | e.g., "$5,000–$10,000" |
| Timeline | Text | `timeline` | e.g., "2 weeks" |
| Is Popular | True/False | `is_popular` | Highlight badge |
| Core Features Count | Text | `features_count` | e.g., "1-3 features" |
| Design Type | Text | `design_type` | e.g., "Template-based" |
| Pages/Screens | Text | `pages_screens` | e.g., "Up to 5" |
| Revisions | Text | `revisions` | e.g., "2 rounds" |
| Support Duration | Text | `support_duration` | e.g., "2 weeks" |
| Inclusions | Repeater | `inclusions` | Sub-field: `item` (text) |
| Exclusions | Repeater | `exclusions` | Sub-field: `item` (text) |
| CTA Text | Text | `cta_text` | e.g., "Get Started" |
| CTA Link | URL | `cta_link` | Calendly or contact |
| Display Order | Number | `display_order` | Sort order |

```php
function register_pricing_cpt() {
    register_post_type('pricing_plan', [
        'labels' => [
            'name'          => 'Pricing Plans',
            'singular_name' => 'Pricing Plan',
            'add_new'       => 'Add New Plan',
            'all_items'     => 'All Plans',
        ],
        'public'       => true,
        'has_archive'  => false,
        'show_in_rest' => true,
        'rest_base'    => 'pricing-plans',
        'supports'     => ['title', 'custom-fields'],
        'menu_icon'    => 'dashicons-money-alt',
    ]);
}
add_action('init', 'register_pricing_cpt');
```

---

### CPT 6: FAQs

**Post Type:** `faq`
**REST Base:** `faqs`
**Supports:** title, custom-fields

**ACF Field Group: "FAQ Details"**

| Field Name | Field Type | API Key | Notes |
|---|---|---|---|
| Question | Text | `question` | (Also use as title) |
| Answer | Wysiwyg | `answer` | Rich text answer |
| Page Context | Select | `page_context` | Options: "pricing", "startup-visa", "general" |
| Display Order | Number | `display_order` | Sort order |

```php
function register_faq_cpt() {
    register_post_type('faq', [
        'labels' => [
            'name'          => 'FAQs',
            'singular_name' => 'FAQ',
            'add_new'       => 'Add New FAQ',
            'all_items'     => 'All FAQs',
        ],
        'public'       => true,
        'has_archive'  => false,
        'show_in_rest' => true,
        'rest_base'    => 'faqs',
        'supports'     => ['title', 'custom-fields'],
        'menu_icon'    => 'dashicons-editor-help',
    ]);
}
add_action('init', 'register_faq_cpt');
```

---

### Blog Post Categories

Create these categories in WordPress for blog posts:

| Category | Slug |
|---|---|
| Strategy | `strategy` |
| Development | `development` |
| Startup Visa | `startup-visa` |
| Mindset | `mindset` |
| Marketing | `marketing` |
| Case Study | `case-study` |

---

### Include All CPTs

Create `wordpress/wp-content/themes/your-theme/inc/custom-post-types.php` with all CPT registrations above, then include in `functions.php`:

```php
require_once get_template_directory() . '/inc/custom-post-types.php';
```

---

## 8. Required WordPress Plugins

### Essential (Must Install)

| Plugin | Purpose |
|---|---|
| **ACF Pro** | Custom fields for Portfolio, Services, Testimonials, Team, Pricing, FAQs |
| **ACF to REST API** | Exposes all ACF fields in REST API responses |
| **WP REST API Menus** | Exposes navigation menus (Primary, Footer) via API |
| **Yoast SEO** | SEO metadata for all pages and posts (title, description, OG tags) |
| **Application Passwords** | Built into WP 5.6+. For authenticated API requests if needed |

### GraphQL Layer (Recommended)

| Plugin | Purpose |
|---|---|
| **WPGraphQL** | GraphQL endpoint at `/graphql` — query exactly what you need |
| **WPGraphQL for ACF** | ACF fields in GraphQL queries |
| **WPGraphQL Yoast SEO** | Yoast SEO data in GraphQL responses |

### Security & Performance

| Plugin | Purpose |
|---|---|
| **Wordfence Security** | Firewall, malware scan, login protection |
| **WP Super Cache** | Server-side caching of API responses |
| **Disable WP Frontend** | Redirect all WP frontend URLs to Next.js |

### Utility

| Plugin | Purpose |
|---|---|
| **WebP Express** | Auto-convert uploads to WebP |
| **Regenerate Thumbnails** | Rebuild image sizes |
| **WP Mail SMTP** | Reliable email delivery (contact form notifications) |

---

## 9. API Endpoints

**Base URL:** `http://localhost/sklentr/headless-WordPress/wordpress/wp-json`

### Blog Posts

```
GET /wp/v2/posts                          # All posts
GET /wp/v2/posts?slug={slug}&_embed       # Single post by slug
GET /wp/v2/posts?categories={id}&_embed   # Posts by category
GET /wp/v2/posts?per_page=10&page=1       # Paginated
GET /wp/v2/posts?search={keyword}         # Search
GET /wp/v2/posts?_fields=slug             # Slugs only (for generateStaticParams)
```

### Pages

```
GET /wp/v2/pages?slug=about&_embed        # Single page by slug
GET /wp/v2/pages?slug=privacy-policy      # Legal pages
```

### Portfolio (CPT)

```
GET /wp/v2/portfolio?_embed               # All projects
GET /wp/v2/portfolio?slug={slug}&_embed   # Single project
```

### Services (CPT)

```
GET /wp/v2/services?_embed&orderby=menu_order&order=asc    # All services ordered
GET /wp/v2/services?slug={slug}&_embed                      # Single service
```

### Testimonials (CPT)

```
GET /wp/v2/testimonials                   # All testimonials
```

### Team Members (CPT)

```
GET /wp/v2/team-members?_embed            # All team members
```

### Pricing Plans (CPT)

```
GET /wp/v2/pricing-plans                  # All pricing tiers
```

### FAQs (CPT)

```
GET /wp/v2/faqs                           # All FAQs
GET /wp/v2/faqs?filter[meta_key]=page_context&filter[meta_value]=pricing    # By page
```

### Categories & Tags

```
GET /wp/v2/categories                     # Blog categories
GET /wp/v2/tags                           # Blog tags
```

### Menus

```
GET /wp-api-menus/v2/menu-locations/primary       # Primary nav
GET /wp-api-menus/v2/menu-locations/footer-company # Footer company links
GET /wp-api-menus/v2/menu-locations/footer-services # Footer services links
GET /wp-api-menus/v2/menu-locations/footer-legal    # Footer legal links
```

### Media

```
GET /wp/v2/media/{id}                     # Single media item
```

### API Response Example — Portfolio Project

```json
{
  "id": 42,
  "title": { "rendered": "Horizon Trials" },
  "slug": "horizon-trials",
  "excerpt": { "rendered": "AI platform matching cancer patients with clinical trials..." },
  "featured_media": 55,
  "_embedded": {
    "wp:featuredmedia": [{
      "source_url": "http://localhost/.../horizon-trials.jpg",
      "alt_text": "Horizon Trials Platform",
      "media_details": { "width": 1200, "height": 630 }
    }]
  },
  "acf": {
    "industry": "Healthcare / AI",
    "client_challenge": "Patients struggle finding relevant clinical trials...",
    "our_solution": "Built AI matching engine using Google Gemini...",
    "results_summary": "2-month development, 1-year ongoing partnership...",
    "dev_time": "2 months",
    "tech_stack": [
      { "technology": "Laravel" },
      { "technology": "Next.js" },
      { "technology": "Google Gemini" },
      { "technology": "PostgreSQL" }
    ],
    "project_url": "",
    "featured_home": true
  },
  "yoast_head_json": {
    "title": "Horizon Trials - AI Clinical Trial Matching | Sklentr Portfolio",
    "description": "..."
  }
}
```

### GraphQL Queries

**Fetch Portfolio Projects:**

```graphql
query GetPortfolio {
  portfolio(first: 20) {
    nodes {
      title
      slug
      excerpt
      featuredImage {
        node {
          sourceUrl
          altText
          mediaDetails { width height }
        }
      }
      portfolioDetails {
        industry
        clientChallenge
        ourSolution
        resultsSummary
        devTime
        techStack { technology }
        projectUrl
        featuredHome
      }
    }
  }
}
```

**Fetch Services:**

```graphql
query GetServices {
  services(first: 10, where: { orderby: { field: MENU_ORDER, order: ASC } }) {
    nodes {
      title
      slug
      excerpt
      featuredImage {
        node { sourceUrl altText }
      }
      serviceDetails {
        serviceIcon { sourceUrl }
        timeline
        startingPrice
        subServices { name }
        displayOrder
      }
    }
  }
}
```

**Fetch Testimonials:**

```graphql
query GetTestimonials {
  testimonials(first: 10) {
    nodes {
      testimonialDetails {
        quote
        clientName
        clientRole
        companyName
        clientPhoto { sourceUrl }
      }
    }
  }
}
```

---

## 10. Next.js Data Fetching Strategy

### WordPress API Client

**`src/lib/wordpress.ts`**

```typescript
const API_URL = process.env.WORDPRESS_API_URL!;

interface FetchOptions {
  revalidate?: number | false;
  tags?: string[];
}

export async function fetchAPI<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { revalidate = 60, tags } = options;

  const res = await fetch(`${API_URL}${endpoint}`, {
    next: { revalidate, tags },
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    throw new Error(`WordPress API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}
```

### Service Layer Examples

**`src/services/portfolio.ts`**

```typescript
import { fetchAPI } from '@/lib/wordpress';
import type { WPPortfolio } from '@/types/portfolio';

export async function getPortfolioProjects(): Promise<WPPortfolio[]> {
  return fetchAPI<WPPortfolio[]>(
    '/wp/v2/portfolio?_embed&per_page=20',
    { revalidate: 3600, tags: ['portfolio'] }
  );
}

export async function getPortfolioBySlug(slug: string): Promise<WPPortfolio | null> {
  const projects = await fetchAPI<WPPortfolio[]>(
    `/wp/v2/portfolio?slug=${encodeURIComponent(slug)}&_embed`,
    { revalidate: 3600, tags: ['portfolio', `portfolio-${slug}`] }
  );
  return projects[0] ?? null;
}
```

**`src/services/posts.ts`**

```typescript
import { fetchAPI } from '@/lib/wordpress';
import type { WPPost } from '@/types/post';

export async function getPosts(page = 1, perPage = 10): Promise<WPPost[]> {
  return fetchAPI<WPPost[]>(
    `/wp/v2/posts?_embed&per_page=${perPage}&page=${page}`,
    { revalidate: 60, tags: ['posts'] }
  );
}

export async function getPostBySlug(slug: string): Promise<WPPost | null> {
  const posts = await fetchAPI<WPPost[]>(
    `/wp/v2/posts?slug=${encodeURIComponent(slug)}&_embed`,
    { revalidate: 60, tags: ['posts', `post-${slug}`] }
  );
  return posts[0] ?? null;
}

export async function getPostSlugs(): Promise<string[]> {
  const posts = await fetchAPI<{ slug: string }[]>(
    '/wp/v2/posts?per_page=100&_fields=slug',
    { revalidate: 3600 }
  );
  return posts.map((p) => p.slug);
}
```

**`src/services/testimonials.ts`**

```typescript
import { fetchAPI } from '@/lib/wordpress';
import type { WPTestimonial } from '@/types/testimonial';

export async function getTestimonials(): Promise<WPTestimonial[]> {
  return fetchAPI<WPTestimonial[]>(
    '/wp/v2/testimonials?per_page=20',
    { revalidate: 3600, tags: ['testimonials'] }
  );
}
```

**`src/services/faqs.ts`**

```typescript
import { fetchAPI } from '@/lib/wordpress';
import type { WPFAQ } from '@/types/faq';

export async function getFAQsByContext(context: string): Promise<WPFAQ[]> {
  return fetchAPI<WPFAQ[]>(
    `/wp/v2/faqs?per_page=50`,
    { revalidate: 3600, tags: ['faqs'] }
  );
  // Filter by page_context on the client if REST meta filtering is not configured
}
```

### Caching Strategy

| Content Type | Revalidation | Reason |
|---|---|---|
| Blog posts (list) | 60 seconds | New posts added regularly |
| Blog post (single) | 60 seconds | Content may be updated |
| Portfolio projects | 3600 seconds | Rarely changes |
| Services | 3600 seconds | Rarely changes |
| Pricing plans | 3600 seconds | Changes occasionally |
| Testimonials | 3600 seconds | Rarely changes |
| Team members | 3600 seconds | Rarely changes |
| FAQs | 3600 seconds | Rarely changes |
| Navigation menus | 3600 seconds | Rarely changes |
| Search results | 0 (no cache) | Must be real-time |

### On-Demand ISR Revalidation

**`src/app/api/revalidate/route.ts`**

```typescript
import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-revalidate-secret');
  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
  }

  const { tag } = await request.json();
  if (tag) {
    revalidateTag(tag);
    return NextResponse.json({ revalidated: true, tag });
  }

  return NextResponse.json({ error: 'Missing tag' }, { status: 400 });
}
```

**WordPress side — `functions.php`:**

```php
add_action('save_post', function ($post_id, $post) {
    if (wp_is_post_revision($post_id) || wp_is_post_autosave($post_id)) return;

    $frontend_url = HEADLESS_FRONTEND_URL;
    $tag_map = [
        'post'         => 'posts',
        'portfolio'    => 'portfolio',
        'service'      => 'services',
        'testimonial'  => 'testimonials',
        'team_member'  => 'team',
        'pricing_plan' => 'pricing',
        'faq'          => 'faqs',
    ];

    $tag = $tag_map[$post->post_type] ?? 'pages';

    wp_remote_post($frontend_url . '/api/revalidate', [
        'headers' => [
            'Content-Type'        => 'application/json',
            'x-revalidate-secret' => 'YOUR_REVALIDATION_SECRET',
        ],
        'body'    => wp_json_encode(['tag' => $tag]),
        'timeout' => 5,
    ]);
}, 10, 2);
```

---

## 11. Dynamic Routing System

### Complete Route Map

```
src/app/
├── page.tsx                        →  /                      Homepage
│
├── services/
│   └── page.tsx                    →  /services              Services listing
│
├── startup-visa/
│   └── page.tsx                    →  /startup-visa          Startup Visa page
│
├── portfolio/
│   └── page.tsx                    →  /portfolio             Portfolio grid
│
├── pricing/
│   └── page.tsx                    →  /pricing               Pricing tiers + FAQ
│
├── about/
│   └── page.tsx                    →  /about                 About + team
│
├── blog/
│   ├── page.tsx                    →  /blog                  Blog listing
│   └── [slug]/
│       └── page.tsx                →  /blog/[slug]           Single blog post
│
├── privacy-policy/
│   └── page.tsx                    →  /privacy-policy        Privacy Policy
│
├── terms-of-service/
│   └── page.tsx                    →  /terms-of-service      Terms of Service
│
├── not-found.tsx                   →  404 page
└── api/
    └── revalidate/
        └── route.ts                →  ISR webhook
```

### Blog Dynamic Route

**`src/app/blog/[slug]/page.tsx`**

```typescript
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPostBySlug, getPostSlugs } from '@/services/posts';
import BlogContent from '@/components/blog/BlogContent';
import ArticleJsonLd from '@/components/seo/JsonLd';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: 'Post Not Found' };

  const yoast = post.yoast_head_json;
  return {
    title: yoast?.title || post.title.rendered,
    description: yoast?.description,
    openGraph: {
      title: yoast?.og_title || post.title.rendered,
      description: yoast?.og_description,
      images: yoast?.og_image?.map((img) => ({
        url: img.url, width: img.width, height: img.height,
      })),
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.modified,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <>
      <ArticleJsonLd post={post} siteUrl={process.env.NEXT_PUBLIC_SITE_URL!} />
      <BlogContent post={post} />
    </>
  );
}
```

### Static Pages (Pricing, Services, etc.)

Pages like `/services`, `/pricing`, `/about`, `/startup-visa` are **static routes** (not dynamic `[slug]`). They fetch their data from CPTs and ACF fields:

```typescript
// src/app/pricing/page.tsx
import { getPricingPlans } from '@/services/pricing';
import { getFAQsByContext } from '@/services/faqs';
import { getTestimonials } from '@/services/testimonials';
import PricingCard from '@/components/pricing/PricingCard';
import GuaranteeCard from '@/components/pricing/GuaranteeCard';
import FAQAccordion from '@/components/ui/Accordion';
import FinalCTA from '@/components/sections/FinalCTA';

export const metadata = {
  title: 'Pricing - Transparent MVP Development Costs',
  description: 'Simple pricing. No surprises. Starter MVP from $5,000 CAD.',
};

export default async function PricingPage() {
  const [plans, faqs] = await Promise.all([
    getPricingPlans(),
    getFAQsByContext('pricing'),
  ]);

  return (
    <>
      {/* Hero: "Simple Pricing. No Surprises." */}
      {/* Pricing Cards Grid */}
      {/* Guarantees: On-Time, Code Ownership, Flexible Payments, Free Consultation */}
      {/* FAQ Accordion */}
      {/* Final CTA */}
    </>
  );
}
```

---

## 12. Component Architecture

### Layout Components

| Component | Description | Used On |
|---|---|---|
| `Header` | Sticky top nav with logo, menu items, "Book a Call" CTA, mobile hamburger, theme toggle | All pages |
| `Footer` | 4-column footer: about blurb, Company links, Services links, contact info + social icons | All pages |
| `Navigation` | Desktop nav rendering menu items from WordPress | Header |
| `MobileMenu` | Slide-out mobile menu with all nav items | Header |
| `BookCallButton` | Calendly link styled as primary CTA button | Header, multiple sections |

### Section Components (Homepage)

The homepage is composed of these sections in order:

| # | Component | Content |
|---|---|---|
| 1 | `Hero` | Headline: "Launch-ready MVPs in weeks, not months." + subheading + stats (2-week, 50+, #1 SEO, 100% Canadian) + 2 CTAs |
| 2 | `ProblemSection` | "Your idea deserves better than 'coming soon.'" + 3 pain points |
| 3 | `WhyChooseSection` | "We ship while others plan." + 4 value props (2-Week MVPs, One Team, Canadian Quality, Built to Scale) |
| 4 | `StatsBar` | Metric tiles: 14 days avg, 98% on-time, 50+ shipped, 98% success |
| 5 | `PricingSection` | 3 pricing cards (Starter, Growth, Full-Service) |
| 6 | `ServicesGrid` | 6 service cards with icons and sub-service bullets |
| 7 | `PortfolioGrid` | 6 portfolio cards (filtered to `featured_home: true`) |
| 8 | `TestimonialSlider` | Client quotes carousel |
| 9 | `StartupVisaCTA` | "Need an MVP for your Startup Visa?" + 3 value props + CTA |
| 10 | `BlogPreview` | "Insights for Founders" + 3 latest blog cards |
| 11 | `FinalCTA` | "Ready to launch?" + "Book My Free Consultation" + "See Pricing" |

### Reusable UI Components

| Component | Description |
|---|---|
| `Button` | Primary, secondary, outline variants. Supports `href` (link) and `onClick` |
| `Card` | Generic card with hover effects |
| `Badge` | Small label (e.g., "Popular", category badges) |
| `SectionHeading` | Consistent section title + subtitle styling |
| `Accordion` | FAQ expand/collapse with smooth animation |
| `Skeleton` | Loading placeholder for cards, text, images |
| `ThemeToggle` | Sun/Moon icon button for dark/light mode switch |

---

## 13. Page-by-Page Build Specification

### Page 1: Homepage (`/`)

**Data Sources:**
- Pricing Plans CPT (3 plans)
- Services CPT (6 services)
- Portfolio CPT (6 projects, `featured_home: true`)
- Testimonials CPT (all)
- Blog Posts (latest 3)

**Sections (top to bottom):**

1. **Hero Section**
   - Headline: "Launch-ready MVPs in weeks, not months."
   - Subheading: "We build MVPs that get you funded, validated, and to market — fast."
   - Tagline: "Canadian expertise. Competitive pricing. No excuses."
   - Stats row: `2-week MVPs` | `50+ Projects Built` | `#1 SEO Rankings` | `100% Canadian Management`
   - CTA: "Book My Free Consultation" (primary) + "See Pricing" (secondary)

2. **Problem Section**
   - Title: "Your idea deserves better than 'coming soon.'"
   - 3 pain points:
     - "They take months while your window closes"
     - "They charge a fortune before you've validated anything"
     - "They deliver what you didn't ask for and call it 'scope'"

3. **Why Choose Section**
   - Title: "We ship while others plan."
   - 4 cards:
     - **2-Week MVPs** — "Launch fast. Iterate faster. We've shipped products in as little as 14 days."
     - **One Team, Full Service** — "Dev, design, SEO, marketing, video — no juggling vendors."
     - **Canadian Quality, Smart Pricing** — "Toronto-managed, globally powered. Premium work without the premium markup."
     - **Built to Scale** — "Real architecture, not duct tape. Your MVP becomes your product."

4. **Stats Bar**
   - Average Delivery: 14 days
   - On-time Rate: 98%
   - Projects Shipped: 50+
   - Success Rate: 98%

5. **Pricing Section**
   - Title: "Transparent pricing. No surprises."
   - 3 cards from Pricing Plans CPT
   - Note: "Every project starts with a free 30-minute consultation."

6. **Services Section**
   - Title: "Everything you need to launch."
   - 6 cards from Services CPT, each with icon + sub-service bullets

7. **Portfolio Section**
   - Title: "Work That Speaks"
   - 6 project cards from Portfolio CPT

8. **Testimonials**
   - Carousel/slider of client quotes

9. **Startup Visa CTA**
   - Title: "Need an MVP for your Startup Visa? We've got you."
   - 3 value props: Working Product, Meet Deadlines, Budget Friendly

10. **Blog Preview**
    - Title: "Insights for Founders."
    - Subtitle: "Strategies, guides, and lessons from building MVPs for startups across Canada."
    - 3 latest blog post cards

11. **Final CTA**
    - Title: "Ready to launch?"
    - Text: "Book a free 30-minute consultation. Tell us your idea — we'll tell you how fast we can build it."
    - CTAs: "Book My Free Consultation" + "See Pricing"

---

### Page 2: Services (`/services`)

**Data Sources:**
- Services CPT (6 services with ACF fields)

**Sections:**

1. **Hero** — Page title + intro text
2. **Services Grid** — 6 service cards, each with:
   - Icon/illustration
   - Title (e.g., "Web & Mobile Applications")
   - Timeline (e.g., "2-8 weeks")
   - Starting price (e.g., "$5,000 CAD")
   - Sub-services list (e.g., Next.js apps, React Native, API development...)
   - "Get Started" CTA button
3. **Why Choose** — 6 differentiators (2-Week MVPs, One Team, Canadian Quality, Built to Scale, AI-Powered Workflow, No Flight Risk)
4. **Process** — Discovery → Design → Build → Launch
5. **Final CTA**

**Services Data:**

| Service | Timeline | Starting Price | Sub-Services |
|---|---|---|---|
| Web & Mobile Applications | 2-8 weeks | $5,000 CAD | Next.js/React web apps, React Native/Flutter mobile, API development, DB architecture, Auth & security, Admin dashboards |
| Website Design | 1-4 weeks | $2,500 CAD | Custom design, WordPress, Next.js static, E-commerce, Landing pages, Maintenance |
| SEO & Marketing | Ongoing | $1,500/month | Technical SEO, On-page optimization, Content strategy, Social media, Link building, Local SEO |
| Paid Advertising | Ongoing | $1,000/month + ad spend | Google Ads, Meta Ads, Campaign strategy, A/B testing, Conversion tracking, Reporting |
| Video Production | 1-2 weeks | $1,500 CAD | Promo videos, Product demos, Social content, Explainers, Testimonial videos, Motion graphics |
| Business Consultation | Flexible | $200/hour | Product strategy, Market research, Technical roadmapping, Growth planning, Pitch prep, MVP scoping |

---

### Page 3: Startup Visa (`/startup-visa`)

**Data Sources:**
- Portfolio CPT (4 featured SUV projects)
- Testimonials CPT (3 testimonials)
- FAQs CPT (filtered: `page_context = startup-visa`)

**Sections:**

1. **Hero**
   - Title: "Your Startup Visa Application Needs More Than an Idea"
   - Stats: 15+ SUV MVPs Built | 4-Week Delivery | 100% On-Time Delivery
   - CTAs: "Book My Free Consultation" + "See What We Build"

2. **The Hard Truth**
   - Title: "Ideas Don't Get Visas. Products Do."
   - Key points about SUV program pause, IRCC scrutiny, designated organizations

3. **Why It Matters**
   - Title: "Why a Working MVP Changes Everything"
   - Benefits: Proof of qualifying business, execution capability, market validation, founder commitment, differentiation

4. **Complete MVP Package**
   - Checklist: Working app, auth, admin dashboard, technical docs, pitch deck assets, source code ownership, production deployment, 1-month support

5. **Portfolio** — 4 featured SUV projects (Horizon Trials, AI Farming, KindredCare, Get Takaful)

6. **Visa Benefits** — "How Your MVP Strengthens Your Visa"

7. **Funding Benefits** — "VCs and Angels Don't Fund Ideas. They Fund Traction."

8. **Process Timeline**
   - Week 1: Discovery & Planning
   - Week 2: Design & Architecture
   - Week 3: Development Sprint
   - Week 4: Testing & Launch
   - Guarantee: "Delivery before your visa deadline"

9. **Pricing**
   - Growth MVP: $15,000 CAD / 4 weeks
   - Full inclusion list
   - "Agencies charge $50,000+. Freelancers take 6+ months."

10. **Testimonials** — 3 client quotes

11. **FAQ Accordion** — 7 questions

12. **Final CTA**
    - "Don't Let Your Visa Dream Die With Just an Idea"
    - "Limited spots available each month. We only take on 4 SUV projects at a time."
    - CTAs: "Book My Free Consultation" + "WhatsApp Us"

---

### Page 4: Portfolio (`/portfolio`)

**Data Sources:**
- Portfolio CPT (all 6 projects)

**Sections:**

1. **Hero** — Title + stats (50+ projects, 15+ SUV MVPs, 2-week fastest, 100% satisfaction)
2. **Portfolio Grid** — 6 project cards with:
   - Featured image
   - Title
   - Industry badge
   - Short excerpt
   - Tech stack tags
3. **CTA** — "Your Project Could Be Next"

**Portfolio Projects:**

| Project | Industry | Tech Stack | Dev Time |
|---|---|---|---|
| Horizon Trials | Healthcare/AI | Laravel, Next.js, Google Gemini, PostgreSQL | 2 months |
| AI Farming | AgriTech/AI | Laravel, Next.js, WordPress, Google Gemini | 3 months |
| Get Takaful | FinTech/Blockchain | Laravel, Next.js, Blockchain, WordPress | Ongoing |
| KindredCare | Healthcare/Elderly Care | Laravel, Next.js, ChatGPT, Google Gemini | 2.5 months |
| Agile Sourcing | Fashion/Sustainability | Laravel, Next.js, AI, Instagram API | 3 months |
| GAinData | SaaS/Data Analytics | Laravel, Next.js, ChatGPT, Gemini, Claude | 3 months |

---

### Page 5: Pricing (`/pricing`)

**Data Sources:**
- Pricing Plans CPT (3 tiers)
- FAQs CPT (filtered: `page_context = pricing`)

**Sections:**

1. **Hero** — "Simple Pricing. No Surprises." + free consultation mention
2. **Pricing Cards** — 3 tiers:

| Feature | Starter MVP | Growth MVP (Popular) | Full-Service |
|---|---|---|---|
| Price | $5,000 CAD | $15,000 CAD | $30,000+ CAD |
| Range | $5,000–$10,000 | $15,000–$25,000 | $30,000–$60,000+ |
| Timeline | 2 weeks | 4 weeks | 8+ weeks |
| Features | 1-3 | 5-7 | Full product |
| Design | Template-based | Custom UI | Custom UI/UX |
| Pages/Screens | Up to 5 | Up to 15 | Unlimited |
| Revisions | 2 rounds | 3 rounds | Unlimited |
| SEO | Basic setup | Full SEO | Full SEO + Marketing |
| Support | 2 weeks | 1 month | 3 months |
| Admin Dashboard | No | Yes | Yes |
| Video Production | No | No | Yes |
| Social Media | Setup | Setup | Management |

3. **Guarantees** — 4 cards:
   - On-Time Delivery: "If we're late, you get a discount"
   - 100% Code Ownership: No licensing restrictions
   - Flexible Payments: Milestone-based, no full upfront
   - Free Consultation: 30-minute no-obligation call

4. **FAQ Accordion** — 8 questions

5. **Final CTA**

---

### Page 6: About (`/about`)

**Data Sources:**
- Team Members CPT (4 entries)
- WordPress page content for About

**Sections:**

1. **Hero** — Company overview

2. **Stats** — 50+ projects | 15+ SUV MVPs | 2 offices | 100% satisfaction

3. **Our Story** — Founded 2023, experienced the pain as entrepreneurs, alternative to expensive agencies and unreliable freelancers

4. **Core Values** — 4 cards:
   - Speed Without Sacrifice: "Every line of code is built to last"
   - Founder-First Mentality: Building for startup needs, not maximizing fees
   - Radical Transparency: No hidden costs or surprises
   - Ownership & Accountability: Partners beyond launch

5. **Leadership / Team** — 4 cards from Team Members CPT:
   - Rishad Wahid — Founder & CEO — Toronto — 10+ years digital products
   - Development Team — Engineering — Dhaka — React, Next.js, Laravel, mobile
   - Design Team — UI/UX Design — Global — "Great UX is invisible"
   - Marketing Team — Growth & SEO — Toronto & Dhaka — Data-driven, competitive keywords

6. **Office Locations** — 2 cards:
   - Toronto, Canada (HQ) — Strategy, client relationships, project management
   - Dhaka, Bangladesh (Dev Center) — Engineering, design, implementation

7. **Final CTA**

---

### Page 7: Blog (`/blog`)

**Data Sources:**
- Blog Posts (all, paginated)
- Categories

**Sections:**

1. **Hero** — Title: "Insights for Founders" + subtitle
2. **Featured Post** — Latest post highlighted
3. **Blog Grid** — Cards with: featured image, category badge, title, excerpt, author, date, read time
4. **Pagination**

**Blog Posts:**

| Title | Category | Author | Date | Read Time |
|---|---|---|---|---|
| How to Validate Your Startup Idea Before Building | Strategy | Rishad Wahid | Jan 20, 2026 | 8 min |
| The 2-Week MVP: What's Actually Possible | Development | Sklentr Team | Jan 15, 2026 | 6 min |
| Startup Visa Canada: Technical Requirements Explained | Startup Visa | Sklentr Team | Jan 10, 2026 | 10 min |
| Why Your MVP Doesn't Need to Be Perfect | Mindset | Rishad Wahid | Jan 5, 2026 | 5 min |
| SEO for Startups: A No-BS Guide | Marketing | Sklentr Team | Dec 28, 2025 | 7 min |
| How We Built an MVP in 10 Days | Case Study | Rishad Wahid | Dec 20, 2025 | 9 min |

---

### Page 8: Blog Post (`/blog/[slug]`)

**Data Sources:**
- Single blog post by slug (with `_embed`)

**Sections:**

1. Category badge + Title + Meta (author, date, read time)
2. Featured image
3. Post content (HTML rendered from WordPress)
4. Author bio
5. Related posts (same category)
6. CTA

---

### Page 9 & 10: Legal Pages (`/privacy-policy`, `/terms-of-service`)

**Data Sources:**
- WordPress pages by slug

Simple content pages rendering WordPress page content with prose styling.

---

## 14. Media & Image Handling

### Next.js Image Configuration

**`next.config.ts`**

```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/sklentr/headless-WordPress/wordpress/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'admin.sklentr.com',
        pathname: '/wp-content/uploads/**',
      },
    ],
  },
};

export default nextConfig;
```

### Featured Image Component

```tsx
import Image from 'next/image';

interface Props {
  media: {
    source_url: string;
    alt_text: string;
    media_details: { width: number; height: number };
  };
  priority?: boolean;
  className?: string;
}

export default function WPImage({ media, priority = false, className }: Props) {
  return (
    <Image
      src={media.source_url}
      alt={media.alt_text || ''}
      width={media.media_details?.width || 1200}
      height={media.media_details?.height || 630}
      priority={priority}
      className={className}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
    />
  );
}
```

### Best Practices

| Practice | Details |
|---|---|
| Use `next/image` for all images | Auto WebP/AVIF, lazy loading, responsive |
| Set `priority` on hero/above-fold images | Prevents LCP delays |
| Always pass `width` + `height` | Prevents CLS (layout shift) |
| Use `alt_text` from WordPress | Accessibility + SEO |
| Configure `remotePatterns` | Required for external WordPress image URLs |
| Use `sizes` attribute | Serve correct image size per viewport |

---

## 15. SEO Strategy

### Global Metadata

**`src/app/layout.tsx`**

```typescript
export const metadata: Metadata = {
  metadataBase: new URL('https://www.sklentr.com'),
  title: {
    default: 'Sklentr Inc. - Launch-Ready MVPs in Weeks, Not Months',
    template: '%s | Sklentr',
  },
  description: 'Toronto-based MVP development studio. We build launch-ready products in weeks. Web apps, mobile apps, SEO, marketing, and more.',
  openGraph: {
    type: 'website',
    locale: 'en_CA',
    siteName: 'Sklentr Inc.',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: { index: true, follow: true },
};
```

### Per-Page Metadata

Every page uses `generateMetadata` pulling from Yoast SEO data. Example for blog posts shown in Section 11.

### Structured Data (JSON-LD)

**Organization Schema** (on all pages via layout):

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Sklentr Inc.",
  "url": "https://www.sklentr.com",
  "logo": "https://www.sklentr.com/images/logo.svg",
  "foundingDate": "2023",
  "founder": { "@type": "Person", "name": "Rishad Wahid" },
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Toronto",
    "addressRegion": "Ontario",
    "addressCountry": "CA"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+1-647-997-0557",
    "email": "info@sklentr.com"
  },
  "sameAs": [
    "https://linkedin.com/company/sklentr",
    "https://facebook.com/sklentr",
    "https://instagram.com/sklentr",
    "https://x.com/sklentr"
  ]
}
```

**Article Schema** on blog posts, **Service Schema** on services page, **FAQPage Schema** on pricing/startup-visa FAQ sections.

### Sitemap

**`src/app/sitemap.ts`**

```typescript
import type { MetadataRoute } from 'next';
import { getPostSlugs } from '@/services/posts';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const url = 'https://www.sklentr.com';
  const postSlugs = await getPostSlugs();

  return [
    { url, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${url}/services`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${url}/startup-visa`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${url}/portfolio`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${url}/pricing`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${url}/about`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${url}/blog`, changeFrequency: 'weekly', priority: 0.8 },
    ...postSlugs.map((slug) => ({
      url: `${url}/blog/${slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  ];
}
```

### Robots

```typescript
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/api/'] },
    sitemap: 'https://www.sklentr.com/sitemap.xml',
  };
}
```

---

## 16. Dark/Light Mode

### Setup

Install `next-themes`:

```bash
npm install next-themes
```

**`src/app/layout.tsx`** — Wrap app in ThemeProvider:

```tsx
import { ThemeProvider } from 'next-themes';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <Header />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
```

**`tailwind.config.ts`**:

```typescript
export default {
  darkMode: 'class',
  // ...
};
```

**ThemeToggle component:**

```tsx
'use client';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
```

Use Tailwind's `dark:` prefix throughout all components for dual-mode styling.

---

## 17. Deployment Strategy

### Architecture

```
admin.sklentr.com  →  VPS (WordPress + MySQL)
www.sklentr.com    →  Vercel (Next.js)
```

### WordPress (VPS)

1. Provision VPS (DigitalOcean / AWS / Hostinger VPS).
2. Install LEMP stack: Nginx, MySQL 8, PHP 8.2+.
3. SSL via Let's Encrypt (Certbot).
4. Deploy WordPress to `/var/www/wordpress`.
5. Configure Nginx: allow `/wp-json/`, `/graphql`, `/wp-admin/`, `/wp-content/uploads/`. Block all other frontend routes.
6. Set `WP_HOME` / `WP_SITEURL` to `https://admin.sklentr.com`.

### Next.js (Vercel)

1. Push `frontend/` to GitHub.
2. Connect repo to Vercel.
3. Set Root Directory: `frontend`.
4. Environment variables:

```
WORDPRESS_API_URL=https://admin.sklentr.com/wp-json
NEXT_PUBLIC_SITE_URL=https://www.sklentr.com
NEXT_PUBLIC_WORDPRESS_URL=https://admin.sklentr.com
REVALIDATION_SECRET=<random-64-char-string>
```

5. Deploy. Auto-builds on push to `main`.

### DNS

| Record | Type | Value |
|---|---|---|
| `www.sklentr.com` | CNAME | `cname.vercel-dns.com` |
| `admin.sklentr.com` | A | `<VPS IP>` |

### Environment Variables Reference

**`.env.local`** (local dev):

```env
WORDPRESS_API_URL=http://localhost/sklentr/headless-WordPress/wordpress/wp-json
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_WORDPRESS_URL=http://localhost/sklentr/headless-WordPress/wordpress
REVALIDATION_SECRET=local-dev-secret
```

---

## 18. Development Task Plan

### Phase 1 — Environment Setup (Days 1–2)

- [ ] Install WordPress in project directory
- [ ] Create MySQL database `sklentr_headless`
- [ ] Run WordPress installer, set site title "Sklentr Inc."
- [ ] Set permalinks to "Post name"
- [ ] Scaffold Next.js: `npx create-next-app@latest frontend --typescript --tailwind --app --src-dir`
- [ ] Install dependencies: `next-themes`, `framer-motion`, `lucide-react`, `html-react-parser`
- [ ] Configure `next.config.ts` with WordPress remote image patterns
- [ ] Create `.env.local` and `.env.example`
- [ ] Verify REST API: `http://localhost/.../wp-json/wp/v2/posts`
- [ ] Set up Git with `.gitignore`

### Phase 2 — WordPress Backend (Days 3–6)

- [ ] Install plugins: ACF Pro, ACF to REST API, WP REST API Menus, Yoast SEO, WPGraphQL, WPGraphQL for ACF
- [ ] Add CORS headers to `functions.php`
- [ ] Register all 6 CPTs (Portfolio, Services, Testimonials, Team, Pricing Plans, FAQs)
- [ ] Create all ACF field groups per Section 7
- [ ] Create blog categories: Strategy, Development, Startup Visa, Mindset, Marketing, Case Study
- [ ] Create navigation menus: Primary, Footer Company, Footer Services, Footer Legal
- [ ] Create all WordPress pages (Home, About, Services, Pricing, Portfolio, Startup Visa, Blog, Privacy Policy, Terms of Service)
- [ ] Enter all 6 blog posts with full content and featured images
- [ ] Enter all 6 portfolio projects with ACF data and images
- [ ] Enter all 6 services with ACF data
- [ ] Enter all 3 testimonials
- [ ] Enter all 4 team members
- [ ] Enter all 3 pricing plans with full ACF data
- [ ] Enter all 15 FAQs (8 pricing + 7 startup visa)
- [ ] Configure Yoast SEO for every piece of content
- [ ] Test all REST API endpoints with Postman
- [ ] Verify ACF fields in API responses
- [ ] Add `save_post` hook for ISR revalidation

### Phase 3 — Next.js Foundation (Days 7–9)

- [ ] Create folder structure per Section 5
- [ ] Define all TypeScript types (`types/*.ts`)
- [ ] Build WordPress API client (`lib/wordpress.ts`)
- [ ] Build constants file (`lib/constants.ts`) — site config, social links, contact info
- [ ] Build all service functions (`services/*.ts`)
- [ ] Test data fetching — render raw data on test pages
- [ ] Configure Tailwind theme (colors, fonts matching current site design)
- [ ] Set up `next-themes` with dark mode default
- [ ] Create root layout with ThemeProvider
- [ ] Create revalidation API route

### Phase 4 — Layout & UI Components (Days 10–12)

- [ ] Build `Header` — sticky, logo, nav, "Book a Call" CTA, mobile menu toggle, theme toggle
- [ ] Build `Navigation` — desktop menu from WordPress API
- [ ] Build `MobileMenu` — slide-out with Framer Motion animation
- [ ] Build `Footer` — 4-column layout with all links, social icons, contact info, copyright
- [ ] Build `Button` — primary, secondary, outline variants
- [ ] Build `Card` — generic card with hover effects
- [ ] Build `Badge` — category/industry label
- [ ] Build `SectionHeading` — reusable title + subtitle
- [ ] Build `Accordion` — FAQ expand/collapse
- [ ] Build `Skeleton` — loading states
- [ ] Build `ThemeToggle`
- [ ] Build `BookCallButton`

### Phase 5 — Section Components (Days 13–16)

- [ ] Build `Hero` — headline, subheading, stats, CTAs
- [ ] Build `ProblemSection` — pain points with icons
- [ ] Build `WhyChooseSection` — 4 value prop cards
- [ ] Build `StatsBar` — animated counter tiles
- [ ] Build `PricingSection` — 3 pricing cards
- [ ] Build `PricingCard` — tier card with features list, badge, CTA
- [ ] Build `ServicesGrid` — 6 service cards
- [ ] Build `PortfolioGrid` — project cards
- [ ] Build `PortfolioCard` — image, title, industry, tech tags
- [ ] Build `TestimonialSlider` — carousel with client quotes
- [ ] Build `StartupVisaCTA` — callout section
- [ ] Build `BlogPreview` — latest 3 posts
- [ ] Build `BlogCard` — image, category, title, excerpt, meta
- [ ] Build `FinalCTA` — "Ready to launch?" section
- [ ] Build `ProcessTimeline` — 4-week steps
- [ ] Build `TeamCard` — member photo, name, role, location
- [ ] Build `ValueCard` — core value with icon
- [ ] Build `OfficeCard` — location card
- [ ] Build `GuaranteeCard` — guarantee item
- [ ] Build `JsonLd` — Organization, Article, FAQPage schemas

### Phase 6 — Page Assembly (Days 17–22)

- [ ] Build Homepage (`/`) — compose all 11 sections
- [ ] Build Services page (`/services`)
- [ ] Build Startup Visa page (`/startup-visa`)
- [ ] Build Portfolio page (`/portfolio`)
- [ ] Build Pricing page (`/pricing`)
- [ ] Build About page (`/about`)
- [ ] Build Blog listing (`/blog`)
- [ ] Build Blog post (`/blog/[slug]`) — with `generateStaticParams` + `generateMetadata`
- [ ] Build Privacy Policy (`/privacy-policy`)
- [ ] Build Terms of Service (`/terms-of-service`)
- [ ] Build 404 page (`not-found.tsx`)
- [ ] Build loading states (`loading.tsx`)
- [ ] Build error boundary (`error.tsx`)

### Phase 7 — SEO & Performance (Days 23–24)

- [ ] Implement `generateMetadata` on every page with Yoast data
- [ ] Add JSON-LD structured data to all pages
- [ ] Create `sitemap.ts`
- [ ] Create `robots.ts`
- [ ] Add canonical URLs
- [ ] Verify OG and Twitter Card tags
- [ ] Lighthouse audit — target 90+ all categories
- [ ] Optimize images (priority loading, sizes, lazy load)
- [ ] Test Core Web Vitals (LCP, CLS, FID)

### Phase 8 — Responsive & Dark Mode (Days 25–26)

- [ ] Test every page at 320px, 375px, 768px, 1024px, 1280px, 1920px
- [ ] Test dark mode on every page
- [ ] Test mobile navigation
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Accessibility audit (keyboard navigation, screen readers, contrast)

### Phase 9 — Deployment (Days 27–28)

- [ ] Set up production WordPress (VPS or managed hosting)
- [ ] Configure Nginx with SSL
- [ ] Migrate database and uploads
- [ ] Update WP_HOME/WP_SITEURL for production
- [ ] Push Next.js to GitHub
- [ ] Connect to Vercel, set environment variables
- [ ] Deploy to Vercel
- [ ] Configure DNS (www → Vercel, admin → VPS)
- [ ] Test production site end-to-end
- [ ] Test ISR revalidation in production

### Phase 10 — Launch (Day 29–30)

- [ ] Final smoke test all pages
- [ ] Submit sitemap to Google Search Console
- [ ] Set up Google Analytics / Plausible
- [ ] Set up uptime monitoring (UptimeRobot)
- [ ] Document content editor workflow
- [ ] Update README

---

## 19. Future Scalability

| Feature | Strategy |
|---|---|
| **Multi-language** | WPML/Polylang + Next.js `[locale]` route groups + `next-intl` |
| **E-commerce** | WooCommerce + WooCommerce REST API/GraphQL |
| **User Authentication** | JWT Auth for WP REST API + Next.js middleware |
| **Newsletter** | Mailchimp/ConvertKit API integration |
| **Preview Mode** | Next.js Draft Mode for unpublished content preview |
| **Redis Cache** | Redis Object Cache plugin for WordPress API response caching |
| **CDN for Media** | Offload uploads to Cloudflare R2 / AWS S3 + CloudFront |
| **Contact Forms** | Next.js API route → WP REST API or direct email service (Resend, SendGrid) |
| **Search** | Algolia or Meilisearch for advanced search capabilities |
| **Analytics** | Vercel Analytics + Sentry for error tracking |

---

> **This document is the single source of truth for building the Sklentr.com headless WordPress + Next.js website. Every page, section, component, API endpoint, and task is documented. Follow sequentially from Phase 1 through Phase 10.**
