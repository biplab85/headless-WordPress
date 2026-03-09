# Headless WordPress + Elementor + Next.js Architecture

> **Architecture:** WordPress (Elementor CMS) → REST API → Next.js (Frontend)
> **Version:** 1.0
> **Date:** March 2026

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [System Architecture](#2-system-architecture)
3. [WordPress Setup](#3-wordpress-setup)
4. [Example Page Creation](#4-example-page-creation)
5. [WordPress API Usage](#5-wordpress-api-usage)
6. [Next.js Integration](#6-nextjs-integration)
7. [Elementor Asset Loading](#7-elementor-asset-loading)
8. [Dynamic Page Routing](#8-dynamic-page-routing)
9. [Performance Optimization](#9-performance-optimization)
10. [Security](#10-security)
11. [SEO Integration](#11-seo-integration)
12. [Folder Structure](#12-folder-structure)
13. [Deployment](#13-deployment)
14. [Best Practices](#14-best-practices)

---

## 1. Project Overview

### Goal

Build a decoupled web application where:

- **WordPress + Elementor** serves as the content management system and visual page builder
- **Next.js** serves as the frontend rendering engine
- The **WordPress REST API** acts as the data bridge between the two systems

### Why This Architecture?

| Benefit | Description |
|---------|-------------|
| **Client-Friendly Editing** | Non-technical clients design pages visually with Elementor's drag-and-drop builder |
| **Performance** | Next.js delivers optimized, server-rendered pages with static generation |
| **Security** | WordPress admin is isolated from the public frontend, reducing attack surface |
| **Scalability** | Frontend and backend scale independently |
| **SEO** | Server-side rendering ensures full crawlability by search engines |
| **Hosting Flexibility** | WordPress on any hosting, Next.js on Vercel/edge platforms |

### How It Works

The client opens WordPress admin, designs pages using Elementor with full visual control — sections, columns, widgets, images, buttons, animations, and responsive settings. Elementor stores all content as rendered HTML in the WordPress database. Next.js fetches this rendered HTML via the REST API, injects it into the page along with the required Elementor CSS and JavaScript assets, and delivers a fast, optimized frontend to the end user.

---

## 2. System Architecture

### Data Flow

```
Client (Browser)
│
▼
WordPress Admin Panel
│  └── Elementor Page Builder (drag-and-drop design)
│
▼
WordPress Database (MySQL)
│  └── Stores page content as rendered HTML + Elementor metadata
│
▼
WordPress REST API
│  └── GET /wp-json/wp/v2/pages?slug={slug}
│  └── Returns: title, content.rendered, excerpt, featured_media, yoast_meta
│
▼
Next.js Server (App Router)
│  └── Fetches page data at build time (SSG) or request time (SSR/ISR)
│  └── Renders Elementor HTML inside React components
│  └── Injects Elementor CSS/JS assets
│
▼
End User (Browser)
│  └── Receives fast, fully rendered HTML page
│  └── Elementor styles and interactions work as designed
```

### Component Diagram

```
┌─────────────────────────────────────────────────┐
│                   CLIENT SIDE                    │
│                                                  │
│  ┌──────────────┐     ┌──────────────────────┐  │
│  │  WordPress    │     │     Next.js App       │  │
│  │  Admin Panel  │     │  (Public Frontend)    │  │
│  │              │     │                       │  │
│  │  Elementor   │     │  ┌─────────────────┐  │  │
│  │  Editor      │     │  │  Dynamic Route   │  │  │
│  │              │     │  │  /[...slug]      │  │  │
│  └──────┬───────┘     │  └────────┬────────┘  │  │
│         │             │           │            │  │
└─────────┼─────────────┼───────────┼────────────┘  │
          │             │           │               │
          ▼             │           ▼               │
┌─────────────────┐     │  ┌─────────────────────┐ │
│  WordPress DB   │     │  │  REST API Fetch      │ │
│  (MySQL)        │◄────┼──│  + Asset Injection   │ │
│                 │     │  └─────────────────────┘ │
└─────────────────┘     └──────────────────────────┘
```

### Key Endpoints

| Endpoint | Purpose |
|----------|---------|
| `/wp-json/wp/v2/pages` | Fetch all pages |
| `/wp-json/wp/v2/pages?slug={slug}` | Fetch single page by slug |
| `/wp-json/wp/v2/posts` | Fetch blog posts |
| `/wp-json/wp/v2/posts?slug={slug}` | Fetch single blog post |
| `/wp-json/wp/v2/media/{id}` | Fetch media/images |
| `/wp-json/yoast/v1/get_head?url={url}` | Fetch Yoast SEO metadata |

---

## 3. WordPress Setup

### 3.1 Installing WordPress

**Local Development (WampServer):**

1. Download WordPress from https://wordpress.org/download/
2. Extract into your WampServer web directory:
   ```
   E:\wampserver\www\your-project\wordpress\
   ```
3. Create a MySQL database via phpMyAdmin:
   - Database name: `your_project_db`
   - Collation: `utf8mb4_unicode_ci`
4. Navigate to `http://localhost/your-project/wordpress/` and complete the installation wizard
5. Set admin credentials during setup

**Production Server:**

1. Install WordPress on your VPS or managed hosting
2. Use a subdomain like `admin.yourdomain.com` or `cms.yourdomain.com`
3. Install SSL certificate for the admin domain
4. Configure `wp-config.php` with production database credentials

### 3.2 Installing Required Plugins

Install and activate the following plugins:

| Plugin | Purpose | Required |
|--------|---------|----------|
| **Elementor** | Visual page builder | Yes |
| **Elementor Pro** | Advanced widgets, theme builder, forms | Recommended |
| **Yoast SEO** | SEO metadata, Open Graph, sitemaps | Yes |
| **WP REST Cache** | Cache REST API responses | Recommended |
| **Application Passwords** | Secure API authentication | Yes (built into WP 5.6+) |
| **Custom Post Type UI** | Create custom post types | Optional |
| **ACF (Advanced Custom Fields)** | Add custom fields to pages | Optional |

**Install via WP Admin:**

```
WordPress Admin → Plugins → Add New → Search → Install → Activate
```

### 3.3 Configuring the REST API

#### Enable REST API Access

The WordPress REST API is enabled by default. Verify it works:

```
GET http://localhost/your-project/wordpress/wp-json/wp/v2/pages
```

You should receive a JSON array of pages.

#### Configure Permalinks

**Important:** Pretty permalinks must be enabled for clean REST API URLs.

```
WordPress Admin → Settings → Permalinks → Select "Post name" → Save
```

#### Allow CORS (Cross-Origin Requests)

Add to your theme's `functions.php` or create a custom plugin:

```php
<?php
/**
 * Plugin Name: Headless CORS
 * Description: Enable CORS for headless frontend
 */

add_action('rest_api_init', function () {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function ($value) {
        $origin = get_http_origin();
        $allowed_origins = [
            'http://localhost:3000',
            'https://www.yourdomain.com',
        ];

        if (in_array($origin, $allowed_origins)) {
            header('Access-Control-Allow-Origin: ' . esc_url_raw($origin));
        }

        header('Access-Control-Allow-Methods: GET, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
        header('Access-Control-Allow-Credentials: true');

        return $value;
    });
});
```

#### Expose Elementor Rendered Content

By default, the REST API returns `content.rendered` which contains the full Elementor HTML. Verify this by checking:

```
GET /wp-json/wp/v2/pages?slug=home
```

The response `content.rendered` field should contain the full Elementor HTML output including all section wrappers, column structures, and widget markup.

#### Expose Featured Image URL

Add to `functions.php`:

```php
add_action('rest_api_init', function () {
    register_rest_field('page', 'featured_image_url', [
        'get_callback' => function ($post) {
            $image_id = get_post_thumbnail_id($post['id']);
            if ($image_id) {
                return wp_get_attachment_image_url($image_id, 'full');
            }
            return null;
        },
        'schema' => ['type' => 'string'],
    ]);
});
```

### 3.4 Elementor Configuration

#### Enable REST API Content Delivery

Elementor renders content to `the_content` filter by default, which is included in the REST API response. No special configuration is needed.

#### CSS Print Method

Set Elementor to generate external CSS files for better caching:

```
WordPress Admin → Elementor → Settings → Advanced → CSS Print Method → External File
```

This generates CSS files at:

```
/wp-content/uploads/elementor/css/post-{id}.css
```

#### Disable Default Colors and Fonts

To avoid conflicts between Elementor's default styles and your production assets:

```
WordPress Admin → Elementor → Settings → General
  → Disable Default Colors: Yes
  → Disable Default Fonts: Yes
```

---

## 4. Example Page Creation

### Overview

Each page is created in WordPress using the Elementor editor. The client designs the page visually, and Elementor stores the rendered HTML. Next.js fetches this HTML via the REST API and displays it.

### 4.1 Home Page

**WordPress Setup:**

1. Navigate to `Pages → Add New`
2. Title: `Home`
3. Slug: `home` (set in permalink settings)
4. Click `Edit with Elementor`
5. Design the homepage with sections:
   - **Hero Section**: Full-width section with heading widget, text editor, button, and background image
   - **Services Overview**: Inner section with icon boxes in a 3-column layout
   - **About Snippet**: Two-column section with image and text
   - **Portfolio Carousel**: Image carousel or gallery widget
   - **Testimonials**: Testimonial carousel widget
   - **CTA Section**: Full-width section with heading and button
6. Publish the page

**Set as Front Page:**

```
WordPress Admin → Settings → Reading → Your homepage displays → A static page → Homepage: Home
```

**API Response:**

```json
{
  "id": 10,
  "slug": "home",
  "title": { "rendered": "Home" },
  "content": {
    "rendered": "<div data-elementor-type=\"wp-page\" data-elementor-id=\"10\">...full Elementor HTML...</div>"
  },
  "status": "publish"
}
```

### 4.2 About Page

**WordPress Setup:**

1. `Pages → Add New` → Title: `About` → Slug: `about`
2. Edit with Elementor
3. Design with:
   - **Company Story**: Text editor with heading
   - **Team Section**: Team member widgets in grid layout
   - **Mission/Vision**: Icon list or text columns
   - **Company Stats**: Counter widgets showing numbers
4. Publish

**Elementor Storage:**

Elementor stores two types of data:
- `content.rendered` — The final HTML output (used by Next.js)
- `_elementor_data` — JSON structure of the page builder data (used internally by Elementor editor)

### 4.3 Services Page

**WordPress Setup:**

1. `Pages → Add New` → Title: `Services` → Slug: `services`
2. Design with Elementor:
   - **Page Header**: Section with heading and breadcrumb
   - **Service Cards**: Icon box widgets in a responsive grid
   - **Process Section**: Steps with icon and description
   - **CTA**: Call-to-action banner with button
3. Publish

### 4.4 Portfolio Page

**WordPress Setup:**

1. `Pages → Add New` → Title: `Portfolio` → Slug: `portfolio`
2. Design with Elementor:
   - **Portfolio Grid**: Gallery widget or Posts widget showing portfolio items
   - **Filter Tabs**: Tabs widget with categorized projects
   - **Project Cards**: Image, title, category, and link for each project
3. Publish

### 4.5 Pricing Page

**WordPress Setup:**

1. `Pages → Add New` → Title: `Pricing` → Slug: `pricing`
2. Design with Elementor:
   - **Pricing Tables**: Price table widgets (3 tiers)
   - **Feature Comparison**: Table or toggle content
   - **FAQ Section**: Accordion widget
   - **CTA**: Contact button
3. Publish

### 4.6 Contact Page

**WordPress Setup:**

1. `Pages → Add New` → Title: `Contact` → Slug: `contact`
2. Design with Elementor:
   - **Contact Form**: Elementor Pro form widget (or embed a third-party form)
   - **Contact Info**: Icon list with address, phone, email
   - **Map**: Google Maps widget
   - **Business Hours**: Text or table widget
3. Publish

**Note on Forms:** Elementor forms submit to WordPress by default. In a headless setup, you have two options:
- Use a third-party form service (Formspree, Getform, etc.)
- Create a custom REST API endpoint in WordPress to handle form submissions

### 4.7 Blog Page

**WordPress Setup:**

Blog pages use **Posts** instead of Pages.

1. Create posts: `Posts → Add New`
2. Each post can be designed with Elementor or use the default Gutenberg editor
3. Create a blog listing page using Elementor Pro's **Posts Widget** or handle listing in Next.js

**API Endpoint for Posts:**

```
GET /wp-json/wp/v2/posts?per_page=10&page=1
GET /wp-json/wp/v2/posts?slug=my-blog-post
```

### 4.8 Startup Visa Page

**WordPress Setup:**

1. `Pages → Add New` → Title: `Startup Visa` → Slug: `startup-visa`
2. Design with Elementor:
   - **Hero Section**: Heading, description, and CTA button
   - **Program Overview**: Text columns explaining the visa program
   - **Eligibility Steps**: Icon list or step-flow widget
   - **Success Stories**: Testimonial widgets
   - **Application Process**: Accordion or toggle widget
   - **Contact CTA**: Button linking to contact page
3. Publish

### How Elementor Content Is Stored and Delivered

```
┌──────────────────────────────────────────┐
│              WordPress Database           │
│                                          │
│  wp_posts table:                         │
│  ├── post_content  → Raw HTML fallback   │
│  ├── post_title    → Page title          │
│  └── post_name     → URL slug           │
│                                          │
│  wp_postmeta table:                      │
│  ├── _elementor_data    → JSON builder   │
│  │   structure (sections, columns,       │
│  │   widgets, settings)                  │
│  ├── _elementor_css     → Inline CSS     │
│  └── _elementor_version → Version info   │
│                                          │
│  Elementor CSS Files:                    │
│  └── /wp-content/uploads/elementor/css/  │
│      └── post-{id}.css                   │
└──────────────────────────────────────────┘
          │
          ▼
┌──────────────────────────────────────────┐
│         REST API Response                 │
│                                          │
│  content.rendered:                       │
│    Complete HTML output with all          │
│    Elementor classes, data attributes,   │
│    inline styles, and widget markup      │
│                                          │
│  This is what Next.js receives and       │
│  renders on the frontend                 │
└──────────────────────────────────────────┘
```

---

## 5. WordPress API Usage

### 5.1 Fetching All Pages

```
GET /wp-json/wp/v2/pages?per_page=100&status=publish
```

**Response (array):**

```json
[
  {
    "id": 10,
    "slug": "home",
    "title": { "rendered": "Home" },
    "content": { "rendered": "<div data-elementor-type=\"wp-page\">...</div>" },
    "excerpt": { "rendered": "<p>Welcome to our site...</p>" },
    "featured_media": 45,
    "status": "publish",
    "template": "",
    "menu_order": 0
  },
  {
    "id": 12,
    "slug": "about",
    "title": { "rendered": "About" },
    "content": { "rendered": "<div data-elementor-type=\"wp-page\">...</div>" },
    ...
  }
]
```

### 5.2 Fetching a Single Page by Slug

```
GET /wp-json/wp/v2/pages?slug=about
```

**Response:**

```json
[
  {
    "id": 12,
    "slug": "about",
    "title": { "rendered": "About" },
    "content": {
      "rendered": "<div data-elementor-type=\"wp-page\" data-elementor-id=\"12\" class=\"elementor elementor-12\"><section class=\"elementor-section elementor-top-section\" data-element_type=\"section\"><div class=\"elementor-container\"><div class=\"elementor-column\"><div class=\"elementor-widget-wrap\"><div class=\"elementor-element elementor-widget elementor-widget-heading\"><div class=\"elementor-widget-container\"><h1 class=\"elementor-heading-title\">About Us</h1></div></div></div></div></div></section></div>"
    },
    "excerpt": { "rendered": "<p>Learn about our company...</p>" },
    "featured_media": 50,
    "status": "publish",
    "yoast_head_json": {
      "title": "About - Your Company",
      "description": "Learn about our company...",
      "og_title": "About - Your Company",
      "og_description": "Learn about our company...",
      "og_image": [{ "url": "https://admin.yourdomain.com/wp-content/uploads/about-og.jpg" }]
    }
  }
]
```

### 5.3 Fetching Blog Posts

**List all posts with pagination:**

```
GET /wp-json/wp/v2/posts?per_page=10&page=1&_embed
```

The `_embed` parameter includes featured image data and author info inline.

**Fetch single post:**

```
GET /wp-json/wp/v2/posts?slug=my-first-post&_embed
```

### 5.4 Fetching Categories

```
GET /wp-json/wp/v2/categories
```

### 5.5 Fetching Media

```
GET /wp-json/wp/v2/media/{id}
```

### 5.6 Useful Query Parameters

| Parameter | Description | Example |
|-----------|-------------|---------|
| `slug` | Filter by URL slug | `?slug=about` |
| `per_page` | Results per page (max 100) | `?per_page=20` |
| `page` | Pagination page number | `?page=2` |
| `_embed` | Include linked resources inline | `?_embed` |
| `_fields` | Limit response fields | `?_fields=id,slug,title,content` |
| `status` | Filter by status | `?status=publish` |
| `orderby` | Sort order | `?orderby=date` |
| `order` | Sort direction | `?order=desc` |
| `categories` | Filter posts by category ID | `?categories=5` |
| `search` | Search content | `?search=keyword` |

---

## 6. Next.js Integration

### 6.1 Environment Configuration

Create `.env.local` in your Next.js project root:

```env
WORDPRESS_API_URL=http://localhost/your-project/wordpress/wp-json
WORDPRESS_URL=http://localhost/your-project/wordpress
NEXT_PUBLIC_SITE_URL=http://localhost:3000
REVALIDATION_SECRET=your-secret-key-here
```

### 6.2 WordPress API Client

Create a reusable API client:

```typescript
// src/lib/wordpress.ts

const API_URL = process.env.WORDPRESS_API_URL!;
const WP_URL = process.env.WORDPRESS_URL!;

export interface WPPage {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  featured_media: number;
  featured_image_url?: string;
  yoast_head_json?: {
    title: string;
    description: string;
    og_title: string;
    og_description: string;
    og_image?: { url: string }[];
  };
}

export interface WPPost {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  date: string;
  featured_media: number;
  categories: number[];
  _embedded?: {
    "wp:featuredmedia"?: { source_url: string }[];
    author?: { name: string; avatar_urls: Record<string, string> }[];
  };
}

/**
 * Fetch a single page by slug
 */
export async function getPageBySlug(slug: string): Promise<WPPage | null> {
  const res = await fetch(
    `${API_URL}/wp/v2/pages?slug=${encodeURIComponent(slug)}&_fields=id,slug,title,content,excerpt,featured_media,featured_image_url,yoast_head_json`,
    { next: { revalidate: 3600 } }
  );

  if (!res.ok) return null;

  const pages: WPPage[] = await res.json();
  return pages[0] ?? null;
}

/**
 * Fetch all published pages (for static generation)
 */
export async function getAllPages(): Promise<WPPage[]> {
  const res = await fetch(
    `${API_URL}/wp/v2/pages?per_page=100&status=publish&_fields=id,slug,title`,
    { next: { revalidate: 3600 } }
  );

  if (!res.ok) return [];
  return res.json();
}

/**
 * Fetch blog posts with pagination
 */
export async function getPosts(page = 1, perPage = 10): Promise<{ posts: WPPost[]; totalPages: number }> {
  const res = await fetch(
    `${API_URL}/wp/v2/posts?per_page=${perPage}&page=${page}&_embed&status=publish`,
    { next: { revalidate: 600 } }
  );

  if (!res.ok) return { posts: [], totalPages: 0 };

  const posts: WPPost[] = await res.json();
  const totalPages = parseInt(res.headers.get("X-WP-TotalPages") || "1");

  return { posts, totalPages };
}

/**
 * Fetch a single post by slug
 */
export async function getPostBySlug(slug: string): Promise<WPPost | null> {
  const res = await fetch(
    `${API_URL}/wp/v2/posts?slug=${encodeURIComponent(slug)}&_embed`,
    { next: { revalidate: 3600 } }
  );

  if (!res.ok) return null;

  const posts: WPPost[] = await res.json();
  return posts[0] ?? null;
}

/**
 * Get Elementor CSS URL for a specific page
 */
export function getElementorPageCSS(pageId: number): string {
  return `${WP_URL}/wp-content/uploads/elementor/css/post-${pageId}.css`;
}

/**
 * Get global Elementor CSS URLs
 */
export function getElementorGlobalCSS(): string[] {
  return [
    `${WP_URL}/wp-content/plugins/elementor/assets/css/frontend.min.css`,
    `${WP_URL}/wp-content/uploads/elementor/css/global.css`,
    `${WP_URL}/wp-content/plugins/elementor/assets/lib/eicons/css/elementor-icons.min.css`,
  ];
}
```

### 6.3 Elementor Page Renderer Component

```typescript
// src/components/ElementorContent.tsx

"use client";

import { useEffect, useRef } from "react";

interface ElementorContentProps {
  html: string;
  pageId: number;
}

export default function ElementorContent({ html, pageId }: ElementorContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Execute any inline scripts from Elementor content
    const scripts = containerRef.current.querySelectorAll("script");
    scripts.forEach((oldScript) => {
      const newScript = document.createElement("script");
      Array.from(oldScript.attributes).forEach((attr) => {
        newScript.setAttribute(attr.name, attr.value);
      });
      newScript.textContent = oldScript.textContent;
      oldScript.parentNode?.replaceChild(newScript, oldScript);
    });
  }, [html]);

  return (
    <div
      ref={containerRef}
      className="elementor-content"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
```

### 6.4 Dynamic Page Route

```typescript
// src/app/[[...slug]]/page.tsx

import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPageBySlug, getAllPages, getElementorPageCSS, getElementorGlobalCSS } from "@/lib/wordpress";
import ElementorContent from "@/components/ElementorContent";

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

// Generate static paths for all WordPress pages
export async function generateStaticParams() {
  const pages = await getAllPages();

  return [
    { slug: [] }, // Home page (root)
    ...pages
      .filter((p) => p.slug !== "home")
      .map((page) => ({
        slug: [page.slug],
      })),
  ];
}

// Generate metadata from WordPress/Yoast
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const pageSlug = slug?.[0] || "home";
  const page = await getPageBySlug(pageSlug);

  if (!page) return { title: "Page Not Found" };

  const yoast = page.yoast_head_json;

  return {
    title: yoast?.title || page.title.rendered,
    description: yoast?.description || "",
    openGraph: {
      title: yoast?.og_title || page.title.rendered,
      description: yoast?.og_description || "",
      images: yoast?.og_image?.map((img) => img.url) || [],
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const pageSlug = slug?.[0] || "home";
  const page = await getPageBySlug(pageSlug);

  if (!page) notFound();

  const globalCSS = getElementorGlobalCSS();
  const pageCSS = getElementorPageCSS(page.id);

  return (
    <>
      {/* Load Elementor CSS */}
      {globalCSS.map((href) => (
        <link key={href} rel="stylesheet" href={href} />
      ))}
      <link rel="stylesheet" href={pageCSS} />

      {/* Render Elementor HTML */}
      <main>
        <ElementorContent html={page.content.rendered} pageId={page.id} />
      </main>
    </>
  );
}
```

### 6.5 Blog Listing Page

```typescript
// src/app/blog/page.tsx

import { Metadata } from "next";
import Link from "next/link";
import { getPosts } from "@/lib/wordpress";

export const metadata: Metadata = {
  title: "Blog",
  description: "Latest articles and insights",
};

export default async function BlogPage() {
  const { posts, totalPages } = await getPosts(1, 12);

  return (
    <main className="max-w-6xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-bold mb-12">Blog</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => {
          const featuredImage = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;

          return (
            <article key={post.id} className="border rounded-lg overflow-hidden">
              {featuredImage && (
                <img
                  src={featuredImage}
                  alt={post.title.rendered}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <time className="text-sm text-gray-500">
                  {new Date(post.date).toLocaleDateString()}
                </time>
                <h2 className="text-xl font-semibold mt-2">
                  <Link href={`/blog/${post.slug}`}>
                    {post.title.rendered}
                  </Link>
                </h2>
                <div
                  className="text-gray-600 mt-2 line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                />
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
}
```

### 6.6 Single Blog Post Page

```typescript
// src/app/blog/[slug]/page.tsx

import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPostBySlug, getElementorPageCSS, getElementorGlobalCSS } from "@/lib/wordpress";
import ElementorContent from "@/components/ElementorContent";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };

  return {
    title: post.title.rendered,
    description: post.excerpt.rendered.replace(/<[^>]*>/g, "").slice(0, 160),
  };
}

export default async function BlogPostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const globalCSS = getElementorGlobalCSS();
  const pageCSS = getElementorPageCSS(post.id);

  return (
    <>
      {globalCSS.map((href) => (
        <link key={href} rel="stylesheet" href={href} />
      ))}
      <link rel="stylesheet" href={pageCSS} />

      <article className="max-w-4xl mx-auto px-6 py-20">
        <header className="mb-12">
          <h1 className="text-4xl font-bold">{post.title.rendered}</h1>
          <time className="text-gray-500 mt-4 block">
            {new Date(post.date).toLocaleDateString()}
          </time>
        </header>

        <ElementorContent html={post.content.rendered} pageId={post.id} />
      </article>
    </>
  );
}
```

---

## 7. Elementor Asset Loading

### 7.1 Required CSS Files

Elementor generates several CSS files that must be loaded for the design to render correctly:

| File | Purpose | Location |
|------|---------|----------|
| `frontend.min.css` | Core Elementor layout and widget styles | `/wp-content/plugins/elementor/assets/css/frontend.min.css` |
| `frontend-lite.min.css` | Lightweight version (if available) | `/wp-content/plugins/elementor/assets/css/frontend-lite.min.css` |
| `global.css` | Global Elementor styles (colors, fonts, spacing) | `/wp-content/uploads/elementor/css/global.css` |
| `post-{id}.css` | Page-specific styles generated by Elementor | `/wp-content/uploads/elementor/css/post-{id}.css` |
| `elementor-icons.min.css` | Elementor icon font | `/wp-content/plugins/elementor/assets/lib/eicons/css/elementor-icons.min.css` |

**Elementor Pro (if installed):**

| File | Purpose |
|------|---------|
| `frontend.min.css` | Pro widget styles |

Located at: `/wp-content/plugins/elementor-pro/assets/css/frontend.min.css`

### 7.2 Loading CSS in Next.js Layout

```typescript
// src/app/layout.tsx

import type { Metadata } from "next";

const WP_URL = process.env.WORDPRESS_URL!;

export const metadata: Metadata = {
  title: { default: "Your Site", template: "%s | Your Site" },
  description: "Your site description",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Elementor Core CSS */}
        <link
          rel="stylesheet"
          href={`${WP_URL}/wp-content/plugins/elementor/assets/css/frontend.min.css`}
        />

        {/* Elementor Global Styles (colors, fonts, custom CSS) */}
        <link
          rel="stylesheet"
          href={`${WP_URL}/wp-content/uploads/elementor/css/global.css`}
        />

        {/* Elementor Icons */}
        <link
          rel="stylesheet"
          href={`${WP_URL}/wp-content/plugins/elementor/assets/lib/eicons/css/elementor-icons.min.css`}
        />

        {/* Elementor Pro CSS (if using Pro) */}
        <link
          rel="stylesheet"
          href={`${WP_URL}/wp-content/plugins/elementor-pro/assets/css/frontend.min.css`}
        />

        {/* Google Fonts used in Elementor */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
```

### 7.3 Loading Page-Specific CSS

Each Elementor page has its own CSS file. Load it dynamically per page:

```typescript
// In your page component
import { getElementorPageCSS } from "@/lib/wordpress";

// Inside the page component's return:
<link rel="stylesheet" href={getElementorPageCSS(page.id)} />
```

### 7.4 Required JavaScript Files

Some Elementor widgets require JavaScript for interactivity:

| Widget | JS Dependency |
|--------|--------------|
| Carousel/Slider | Swiper.js |
| Accordion | elementor-frontend.min.js |
| Tabs | elementor-frontend.min.js |
| Counter | elementor-frontend.min.js + waypoints |
| Progress Bar | elementor-frontend.min.js |
| Video | elementor-frontend.min.js |
| Lightbox | elementor-frontend.min.js |
| Animated Heading | elementor-frontend.min.js |

### 7.5 Loading Elementor JS in Next.js

```typescript
// src/components/ElementorScripts.tsx

"use client";

import Script from "next/script";

const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL!;

export default function ElementorScripts() {
  return (
    <>
      {/* jQuery (required by Elementor) */}
      <Script
        src="https://code.jquery.com/jquery-3.7.1.min.js"
        strategy="beforeInteractive"
      />

      {/* Swiper (for carousels) */}
      <Script
        src={`${WP_URL}/wp-content/plugins/elementor/assets/lib/swiper/v8/swiper.min.js`}
        strategy="lazyOnload"
      />

      {/* Waypoints (for scroll-triggered animations) */}
      <Script
        src={`${WP_URL}/wp-content/plugins/elementor/assets/lib/waypoints/waypoints.min.js`}
        strategy="lazyOnload"
      />

      {/* Elementor Frontend JS */}
      <Script
        src={`${WP_URL}/wp-content/plugins/elementor/assets/js/frontend.min.js`}
        strategy="lazyOnload"
        onLoad={() => {
          // Initialize Elementor frontend after script loads
          if (typeof window !== "undefined" && (window as any).elementorFrontend) {
            (window as any).elementorFrontend.init();
          }
        }}
      />

      {/* Elementor Pro Frontend JS (if using Pro) */}
      <Script
        src={`${WP_URL}/wp-content/plugins/elementor-pro/assets/js/frontend.min.js`}
        strategy="lazyOnload"
      />
    </>
  );
}
```

Add to your layout:

```typescript
// src/app/layout.tsx
import ElementorScripts from "@/components/ElementorScripts";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>{/* CSS links */}</head>
      <body>
        {children}
        <ElementorScripts />
      </body>
    </html>
  );
}
```

### 7.6 Handling Elementor Frontend Initialization

Elementor's frontend JavaScript needs to initialize after the DOM is ready. Create a hook:

```typescript
// src/hooks/useElementorInit.ts

"use client";

import { useEffect } from "react";

export function useElementorInit() {
  useEffect(() => {
    const initElementor = () => {
      const win = window as any;

      if (win.elementorFrontend && !win.elementorFrontendInitialized) {
        win.elementorFrontendConfig = {
          environmentMode: { edit: false, wpPreview: false },
          is_rtl: false,
          breakpoints: { xs: 0, sm: 480, md: 768, lg: 1025, xl: 1440, xxl: 1600 },
          version: "3.20.0",
          urls: { assets: `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-content/plugins/elementor/assets/` },
        };

        win.elementorFrontend.init();
        win.elementorFrontendInitialized = true;
      }
    };

    // Try immediately, then retry after a delay
    initElementor();
    const timer = setTimeout(initElementor, 2000);

    return () => clearTimeout(timer);
  }, []);
}
```

---

## 8. Dynamic Page Routing

### 8.1 Catch-All Route for WordPress Pages

The catch-all route `[[...slug]]` handles all WordPress pages including the homepage:

```
URL: /              → slug = []        → fetches "home"
URL: /about         → slug = ["about"] → fetches "about"
URL: /services      → slug = ["services"] → fetches "services"
URL: /portfolio     → slug = ["portfolio"] → fetches "portfolio"
URL: /pricing       → slug = ["pricing"] → fetches "pricing"
URL: /contact       → slug = ["contact"] → fetches "contact"
URL: /startup-visa  → slug = ["startup-visa"] → fetches "startup-visa"
```

### 8.2 Route Structure

```
src/app/
├── [[...slug]]/
│   └── page.tsx          ← Handles all WordPress pages
├── blog/
│   ├── page.tsx           ← Blog listing
│   └── [slug]/
│       └── page.tsx       ← Single blog post
├── layout.tsx             ← Root layout with Elementor CSS/JS
├── not-found.tsx          ← 404 page
└── globals.css
```

### 8.3 How Routing Maps to WordPress

| Next.js Route | WordPress Slug | Page Type |
|---------------|---------------|-----------|
| `/` | `home` | Static page (Front Page) |
| `/about` | `about` | Static page |
| `/services` | `services` | Static page |
| `/portfolio` | `portfolio` | Static page |
| `/pricing` | `pricing` | Static page |
| `/contact` | `contact` | Static page |
| `/startup-visa` | `startup-visa` | Static page |
| `/blog` | — | Custom listing (Next.js) |
| `/blog/my-post` | `my-post` | WordPress post |

### 8.4 Static Generation with generateStaticParams

```typescript
export async function generateStaticParams() {
  const pages = await getAllPages();

  return [
    { slug: [] }, // Homepage
    ...pages
      .filter((p) => p.slug !== "home")
      .map((page) => ({ slug: [page.slug] })),
  ];
}
```

This pre-builds all WordPress pages at build time. New pages are handled by ISR (see Performance section).

### 8.5 Adding New Pages

When the client creates a new page in WordPress:

1. Client creates page in WordPress Admin → Designs with Elementor → Publishes
2. On next revalidation (or manual trigger), Next.js fetches the new page
3. The catch-all route automatically handles the new slug
4. No code changes required

---

## 9. Performance Optimization

### 9.1 Incremental Static Regeneration (ISR)

ISR allows Next.js to serve static pages while revalidating them in the background.

```typescript
// In fetch calls, use the revalidate option:
const res = await fetch(url, {
  next: { revalidate: 3600 }, // Revalidate every hour
});
```

**Recommended revalidation intervals:**

| Content Type | Interval | Reason |
|-------------|----------|--------|
| Static pages (Home, About) | 3600s (1 hour) | Rarely changes |
| Blog listing | 600s (10 minutes) | New posts added periodically |
| Single blog post | 3600s (1 hour) | Rarely edited after publishing |
| Dynamic content | 60s (1 minute) | Frequently updated |

### 9.2 On-Demand Revalidation

Trigger revalidation from WordPress when content is updated:

```typescript
// src/app/api/revalidate/route.ts

import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const secret = request.headers.get("x-revalidation-secret");

  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  const { slug, type } = body;

  if (type === "post") {
    revalidatePath(`/blog/${slug}`);
    revalidatePath("/blog");
  } else {
    revalidatePath(slug === "home" ? "/" : `/${slug}`);
  }

  return NextResponse.json({ revalidated: true, slug });
}
```

**WordPress webhook (add to functions.php):**

```php
add_action('save_post', function ($post_id) {
    if (wp_is_post_revision($post_id) || wp_is_post_autosave($post_id)) return;

    $post = get_post($post_id);
    if ($post->post_status !== 'publish') return;

    $type = $post->post_type === 'post' ? 'post' : 'page';
    $slug = $post->post_name;

    wp_remote_post(HEADLESS_FRONTEND_URL . '/api/revalidate', [
        'headers' => [
            'Content-Type' => 'application/json',
            'x-revalidation-secret' => HEADLESS_REVALIDATION_SECRET,
        ],
        'body' => wp_json_encode([
            'slug' => $slug,
            'type' => $type,
        ]),
        'timeout' => 10,
    ]);
}, 10, 1);
```

### 9.3 Caching Strategy

```
┌──────────────────────────────────────────┐
│             Caching Layers                │
│                                          │
│  1. Next.js Build Cache (Static Pages)   │
│     └── Pre-built HTML at deploy time    │
│                                          │
│  2. ISR Cache (Runtime)                  │
│     └── Revalidated pages cached on      │
│         the edge / server                │
│                                          │
│  3. WordPress REST Cache Plugin          │
│     └── Caches API responses in WP       │
│                                          │
│  4. CDN Cache (Vercel Edge / Cloudflare) │
│     └── Caches static assets globally    │
│                                          │
│  5. Browser Cache                        │
│     └── CSS/JS/images cached locally     │
└──────────────────────────────────────────┘
```

### 9.4 Optimizing API Requests

**Limit response fields** to reduce payload size:

```typescript
// Only fetch what you need
const res = await fetch(
  `${API_URL}/wp/v2/pages?slug=${slug}&_fields=id,slug,title,content,yoast_head_json`
);
```

**Parallel fetching** for pages that need multiple API calls:

```typescript
const [page, posts, categories] = await Promise.all([
  getPageBySlug("home"),
  getPosts(1, 6),
  getCategories(),
]);
```

### 9.5 Image Optimization

Use Next.js Image component for WordPress media:

```typescript
import Image from "next/image";

// In next.config.js, allow WordPress domain:
// images: { remotePatterns: [{ hostname: "admin.yourdomain.com" }] }

<Image
  src={post.featured_image_url}
  alt={post.title.rendered}
  width={800}
  height={450}
  quality={80}
/>
```

Configure `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "admin.yourdomain.com",
      },
    ],
  },
};

module.exports = nextConfig;
```

---

## 10. Security

### 10.1 HTML Sanitization

Elementor content is rendered using `dangerouslySetInnerHTML`. Sanitize the HTML to prevent XSS attacks:

**Install DOMPurify:**

```bash
npm install dompurify
npm install -D @types/dompurify
```

**Create a sanitization utility:**

```typescript
// src/lib/sanitize.ts

import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";

// Server-side sanitization
const window = new JSDOM("").window;
const purify = DOMPurify(window as any);

export function sanitizeHTML(html: string): string {
  return purify.sanitize(html, {
    ALLOWED_TAGS: [
      // Structure
      "div", "section", "article", "header", "footer", "main", "nav", "aside",
      "span", "p", "br", "hr",
      // Headings
      "h1", "h2", "h3", "h4", "h5", "h6",
      // Text formatting
      "strong", "em", "b", "i", "u", "s", "sub", "sup", "mark", "small",
      // Lists
      "ul", "ol", "li",
      // Links and media
      "a", "img", "video", "source", "iframe",
      // Tables
      "table", "thead", "tbody", "tr", "th", "td",
      // Forms
      "form", "input", "textarea", "select", "option", "button", "label",
      // Elementor-specific
      "figure", "figcaption", "blockquote", "cite", "svg", "path", "use",
    ],
    ALLOWED_ATTR: [
      // Global
      "id", "class", "style", "role", "aria-label", "aria-hidden",
      "data-*", "tabindex", "title",
      // Links
      "href", "target", "rel",
      // Media
      "src", "alt", "width", "height", "loading", "srcset", "sizes",
      // Video
      "autoplay", "controls", "loop", "muted", "poster", "preload",
      // iFrame
      "frameborder", "allowfullscreen", "allow",
      // Forms
      "type", "name", "value", "placeholder", "required", "action", "method",
      // Elementor data attributes
      "data-id", "data-element_type", "data-settings", "data-widget_type",
    ],
    ADD_TAGS: ["style"],
    ADD_ATTR: ["target"],
  });
}
```

**Use in components:**

```typescript
import { sanitizeHTML } from "@/lib/sanitize";

<div dangerouslySetInnerHTML={{ __html: sanitizeHTML(page.content.rendered) }} />
```

### 10.2 API Security

**Restrict API access** — only expose what's needed:

```php
// functions.php — Disable user enumeration via REST API
add_filter('rest_endpoints', function ($endpoints) {
    if (isset($endpoints['/wp/v2/users'])) {
        unset($endpoints['/wp/v2/users']);
    }
    if (isset($endpoints['/wp/v2/users/(?P<id>[\d]+)'])) {
        unset($endpoints['/wp/v2/users/(?P<id>[\d]+)']);
    }
    return $endpoints;
});
```

**Hide WordPress admin from the public:**

```php
// Redirect frontend to Next.js (add to theme's functions.php)
add_action('template_redirect', function () {
    if (!is_admin() && !wp_doing_ajax() && !defined('REST_REQUEST')) {
        wp_redirect('https://www.yourdomain.com', 301);
        exit;
    }
});
```

### 10.3 Environment Variables

Never expose sensitive values to the client:

```env
# Server-only (no NEXT_PUBLIC_ prefix)
WORDPRESS_API_URL=https://admin.yourdomain.com/wp-json
REVALIDATION_SECRET=your-long-random-secret

# Client-safe (NEXT_PUBLIC_ prefix)
NEXT_PUBLIC_WORDPRESS_URL=https://admin.yourdomain.com
NEXT_PUBLIC_SITE_URL=https://www.yourdomain.com
```

### 10.4 Content Security Policy

Add security headers in `next.config.js`:

```javascript
const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};
```

---

## 11. SEO Integration

### 11.1 Yoast SEO Integration

Yoast SEO exposes metadata through the REST API via the `yoast_head_json` field.

**Ensure Yoast REST API is enabled:**

```
WordPress Admin → Yoast SEO → General → Features → REST API → Enabled
```

### 11.2 Generating Metadata in Next.js

```typescript
// src/app/[[...slug]]/page.tsx

import { Metadata } from "next";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const pageSlug = slug?.[0] || "home";
  const page = await getPageBySlug(pageSlug);

  if (!page) {
    return { title: "Page Not Found" };
  }

  const yoast = page.yoast_head_json;

  return {
    title: yoast?.title || page.title.rendered,
    description: yoast?.description || "",
    openGraph: {
      title: yoast?.og_title || page.title.rendered,
      description: yoast?.og_description || "",
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/${pageSlug === "home" ? "" : pageSlug}`,
      siteName: "Your Company",
      images: yoast?.og_image?.map((img) => ({
        url: img.url,
        width: 1200,
        height: 630,
      })) || [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: yoast?.og_title || page.title.rendered,
      description: yoast?.og_description || "",
      images: yoast?.og_image?.map((img) => img.url) || [],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/${pageSlug === "home" ? "" : pageSlug}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
```

### 11.3 Structured Data (JSON-LD)

```typescript
// src/components/JsonLd.tsx

interface JsonLdProps {
  data: Record<string, unknown>;
}

export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// Usage in a page:
<JsonLd
  data={{
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: page.title.rendered,
    description: yoast?.description,
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/${pageSlug}`,
    publisher: {
      "@type": "Organization",
      name: "Your Company",
      logo: { "@type": "ImageObject", url: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png` },
    },
  }}
/>
```

### 11.4 Sitemap Generation

```typescript
// src/app/sitemap.ts

import { MetadataRoute } from "next";
import { getAllPages } from "@/lib/wordpress";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = await getAllPages();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;

  const pageEntries = pages.map((page) => ({
    url: `${siteUrl}/${page.slug === "home" ? "" : page.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: page.slug === "home" ? 1.0 : 0.8,
  }));

  return [
    ...pageEntries,
    {
      url: `${siteUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    },
  ];
}
```

### 11.5 Robots.txt

```typescript
// src/app/robots.ts

import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL}/sitemap.xml`,
  };
}
```

---

## 12. Folder Structure

```
project-root/
├── wordpress/                    # WordPress installation
│   ├── wp-admin/
│   ├── wp-content/
│   │   ├── plugins/
│   │   │   ├── elementor/
│   │   │   ├── elementor-pro/
│   │   │   ├── wordpress-seo/          # Yoast
│   │   │   └── headless-cors/          # Custom CORS plugin
│   │   ├── themes/
│   │   │   └── headless-theme/         # Minimal theme
│   │   │       ├── functions.php       # API customizations, webhooks
│   │   │       ├── style.css           # Theme header only
│   │   │       └── index.php           # Redirect to Next.js
│   │   └── uploads/
│   │       └── elementor/
│   │           └── css/                # Generated Elementor CSS
│   │               ├── global.css
│   │               ├── post-10.css
│   │               ├── post-12.css
│   │               └── ...
│   ├── wp-config.php
│   └── ...
│
├── frontend/                     # Next.js application
│   ├── public/
│   │   ├── fonts/
│   │   ├── images/
│   │   └── favicon.ico
│   ├── src/
│   │   ├── app/
│   │   │   ├── [[...slug]]/
│   │   │   │   └── page.tsx           # Dynamic WordPress page route
│   │   │   ├── blog/
│   │   │   │   ├── page.tsx           # Blog listing
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx       # Single blog post
│   │   │   ├── api/
│   │   │   │   └── revalidate/
│   │   │   │       └── route.ts       # On-demand revalidation endpoint
│   │   │   ├── layout.tsx             # Root layout (Elementor CSS/JS)
│   │   │   ├── not-found.tsx          # 404 page
│   │   │   ├── globals.css            # Global styles
│   │   │   ├── sitemap.ts             # Dynamic sitemap
│   │   │   └── robots.ts              # Robots.txt
│   │   ├── components/
│   │   │   ├── ElementorContent.tsx   # Renders Elementor HTML safely
│   │   │   ├── ElementorScripts.tsx   # Loads Elementor JS
│   │   │   ├── Header.tsx             # Site header/navigation
│   │   │   ├── Footer.tsx             # Site footer
│   │   │   └── JsonLd.tsx             # Structured data component
│   │   ├── hooks/
│   │   │   └── useElementorInit.ts    # Elementor initialization hook
│   │   └── lib/
│   │       ├── wordpress.ts           # WordPress API client
│   │       └── sanitize.ts            # HTML sanitization utility
│   ├── .env.local                     # Environment variables
│   ├── next.config.js                 # Next.js configuration
│   ├── package.json
│   ├── tsconfig.json
│   └── tailwind.config.ts
│
├── .gitignore
└── README.md
```

---

## 13. Deployment

### 13.1 WordPress Deployment (VPS / Managed Hosting)

#### Option A: VPS (DigitalOcean, AWS EC2, Linode)

**Server requirements:**

- Ubuntu 22.04+ or similar Linux
- PHP 8.1+
- MySQL 8.0+ or MariaDB 10.6+
- Nginx or Apache
- SSL certificate (Let's Encrypt)

**Setup steps:**

1. **Provision server** and connect via SSH
2. **Install LEMP stack:**
   ```bash
   sudo apt update && sudo apt upgrade -y
   sudo apt install nginx mysql-server php8.2-fpm php8.2-mysql php8.2-xml php8.2-curl php8.2-mbstring php8.2-zip php8.2-gd php8.2-intl -y
   ```
3. **Create database:**
   ```sql
   CREATE DATABASE wordpress_db;
   CREATE USER 'wp_user'@'localhost' IDENTIFIED BY 'strong_password';
   GRANT ALL PRIVILEGES ON wordpress_db.* TO 'wp_user'@'localhost';
   FLUSH PRIVILEGES;
   ```
4. **Install WordPress** into `/var/www/admin.yourdomain.com/`
5. **Configure Nginx:**
   ```nginx
   server {
       listen 443 ssl http2;
       server_name admin.yourdomain.com;

       root /var/www/admin.yourdomain.com;
       index index.php;

       ssl_certificate /etc/letsencrypt/live/admin.yourdomain.com/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/admin.yourdomain.com/privkey.pem;

       # Allow REST API
       location /wp-json/ {
           try_files $uri $uri/ /index.php?$args;

           # CORS headers
           add_header Access-Control-Allow-Origin "https://www.yourdomain.com" always;
           add_header Access-Control-Allow-Methods "GET, OPTIONS" always;
           add_header Access-Control-Allow-Headers "Content-Type, Authorization" always;

           if ($request_method = OPTIONS) {
               return 204;
           }
       }

       # Allow Elementor CSS/JS assets
       location /wp-content/ {
           add_header Access-Control-Allow-Origin "*" always;
           expires 30d;
           add_header Cache-Control "public, immutable";
       }

       location ~ \.php$ {
           include fastcgi_params;
           fastcgi_pass unix:/run/php/php8.2-fpm.sock;
           fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
       }

       location ~ /\.ht {
           deny all;
       }
   }
   ```
6. **Install SSL:**
   ```bash
   sudo apt install certbot python3-certbot-nginx -y
   sudo certbot --nginx -d admin.yourdomain.com
   ```
7. **Update wp-config.php** for production:
   ```php
   define('WP_HOME', 'https://admin.yourdomain.com');
   define('WP_SITEURL', 'https://admin.yourdomain.com');
   define('HEADLESS_FRONTEND_URL', 'https://www.yourdomain.com');
   define('HEADLESS_REVALIDATION_SECRET', 'your-long-random-secret');
   define('WP_DEBUG', false);
   ```

#### Option B: Managed WordPress Hosting

Use services like:
- **Cloudways** — VPS management with WordPress optimization
- **Kinsta** — Managed WordPress with REST API support
- **SiteGround** — Shared hosting with good PHP performance

Ensure the host allows:
- REST API access (not blocked by firewall)
- Custom `functions.php` modifications
- External CSS/JS asset access (CORS)

### 13.2 Next.js Deployment (Vercel)

**Steps:**

1. **Push frontend code to GitHub**
2. **Connect to Vercel:**
   - Go to https://vercel.com
   - Import your GitHub repository
   - Set the root directory to `frontend/`
3. **Configure environment variables** in Vercel dashboard:
   ```
   WORDPRESS_API_URL=https://admin.yourdomain.com/wp-json
   WORDPRESS_URL=https://admin.yourdomain.com
   NEXT_PUBLIC_WORDPRESS_URL=https://admin.yourdomain.com
   NEXT_PUBLIC_SITE_URL=https://www.yourdomain.com
   REVALIDATION_SECRET=your-long-random-secret
   ```
4. **Set custom domain:**
   - Add `www.yourdomain.com` in Vercel project settings
   - Update DNS records at your domain registrar:
     ```
     CNAME  www  →  cname.vercel-dns.com
     A      @    →  76.76.21.21
     ```
5. **Deploy:**
   - Vercel automatically builds and deploys on push to `main`
   - ISR handles content updates without redeployment

### 13.3 DNS Configuration Summary

| Record | Name | Value | Purpose |
|--------|------|-------|---------|
| A | `admin` | `your-vps-ip` | WordPress admin |
| CNAME | `www` | `cname.vercel-dns.com` | Next.js frontend |
| A | `@` | `76.76.21.21` | Root domain → Vercel |

### 13.4 Deployment Checklist

- [ ] WordPress installed and accessible at `admin.yourdomain.com`
- [ ] SSL certificates active on both domains
- [ ] Elementor pages published and visible in REST API
- [ ] CORS configured to allow `www.yourdomain.com`
- [ ] Yoast SEO configured with metadata for all pages
- [ ] Next.js environment variables set in Vercel
- [ ] Revalidation webhook working (save a page in WP, verify Next.js updates)
- [ ] Elementor CSS/JS loading correctly on the frontend
- [ ] Images loading from WordPress media library
- [ ] 404 page working for non-existent routes
- [ ] Sitemap accessible at `/sitemap.xml`
- [ ] Performance tested (Lighthouse score > 90)

---

## 14. Best Practices

### 14.1 Content Management

- **Use Elementor templates** — Save commonly used sections as templates so the client can reuse them across pages
- **Create a style guide page** in Elementor with approved fonts, colors, and component styles
- **Lock global widgets** — Use Elementor's global widgets for headers, footers, and CTAs that appear on multiple pages
- **Limit Elementor widget usage** — Stick to well-supported widgets (heading, text, image, button, section, column, icon box, accordion, tabs, form, video, carousel) for reliable REST API rendering

### 14.2 Development Workflow

```
1. Client designs page in Elementor
2. Client clicks "Publish" or "Update"
3. WordPress webhook triggers revalidation
4. Next.js fetches updated content
5. Users see the new content within seconds
```

- **Local development**: Run WordPress on WampServer/MAMP, Next.js with `npm run dev`
- **Staging**: Deploy WordPress to a staging subdomain, Next.js to a Vercel preview branch
- **Production**: Deploy both to production domains after testing

### 14.3 Performance

- **Minimize Elementor widgets** — Each widget adds HTML/CSS. Use only what's needed
- **Optimize images in WordPress** — Use plugins like ShortPixel or Imagify to compress uploads
- **Use `_fields` parameter** in API requests to reduce response size
- **Enable WP REST Cache** plugin to cache API responses server-side
- **Use `next/image`** for all images rendered outside Elementor content
- **Preload critical Elementor CSS** using `<link rel="preload">`

### 14.4 Maintenance

- **Keep WordPress updated** — Core, Elementor, and plugins
- **Monitor REST API performance** — Use tools like Postman or curl to check response times
- **Backup WordPress database** regularly (use UpdraftPlus or similar)
- **Monitor Vercel build logs** for any ISR or build failures
- **Test after Elementor updates** — Major updates may change HTML output structure

### 14.5 Troubleshooting Common Issues

| Issue | Solution |
|-------|----------|
| Elementor styles not loading | Verify CORS headers allow Next.js domain to fetch CSS from WordPress |
| Page shows raw HTML | Ensure Elementor CSS files are linked in the layout |
| Interactive widgets not working | Load Elementor JS and initialize `elementorFrontend.init()` |
| REST API returns 404 | Enable pretty permalinks in WordPress |
| Content not updating | Check ISR revalidation interval or trigger on-demand revalidation |
| CORS errors in browser console | Add proper CORS headers in WordPress (Nginx or PHP) |
| Elementor editor breaks | Ensure `_elementor_data` is not modified outside Elementor |
| Forms not submitting | Use third-party form service or create custom WP REST endpoint |
| Images broken on frontend | Configure `next.config.js` `remotePatterns` for WordPress domain |
| Slow API response | Install WP REST Cache plugin, use `_fields` to limit response data |

### 14.6 Scaling the System

- **Multiple sites**: Use WordPress Multisite with separate Next.js frontends per site
- **High traffic**: Put a CDN (Cloudflare) in front of both WordPress and Next.js
- **Content team**: Create WordPress user roles (Editor, Author) with appropriate Elementor access levels
- **Internationalization**: Use WPML or Polylang for multilingual content, fetch translations via REST API
- **Custom functionality**: Build custom Elementor widgets that expose data via REST API for special frontend components

---

## Summary

This architecture provides a powerful, flexible system where:

1. **Clients** get the full visual editing power of Elementor
2. **Developers** get the performance and DX benefits of Next.js
3. **Users** get fast, SEO-optimized, server-rendered pages
4. **Content updates** flow automatically from WordPress to the frontend via the REST API and ISR

The key to success is ensuring Elementor's CSS and JavaScript assets load correctly in the Next.js frontend, proper CORS configuration between the two domains, and a reliable revalidation mechanism to keep content fresh.
