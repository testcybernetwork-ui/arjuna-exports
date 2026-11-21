# Arjuna Exports - Code Overview

## Project Summary

**Arjuna Exports** is a premium, immersive storytelling website for a coconut-based growing media manufacturer and exporter. Built with modern web technologies, it showcases the journey from coconut plantations in South India to agricultural applications worldwide.

**Tech Stack:**
- **Frontend Framework:** React 19 + TypeScript
- **Routing:** TanStack Router (v1.170)
- **Server Framework:** TanStack React Start (SSR + Server Functions)
- **Build Tool:** Vite
- **Database:** PostgreSQL (via Neon) or SQLite (better-sqlite3)
- **Styling:** TailwindCSS v4 + Custom CSS
- **UI Components:** Radix UI (accessible component primitives)
- **Rich Text Editor:** TipTap (for blog/article content)
- **Forms:** React Hook Form + Zod validation
- **Data Fetching:** TanStack React Query
- **Email:** Resend
- **Package Manager:** Bun (with npm fallback)

---

## Architecture Overview

### Directory Structure

```
ArjunaExports-main/
├── src/
│   ├── routes/                 # Page routes (file-based routing)
│   ├── components/             # React components
│   │   ├── site/              # Layout components (Header, Footer)
│   │   └── ui/                # Radix UI wrapper components
│   ├── server/                # Server functions & API endpoints
│   ├── lib/                   # Utilities & helpers
│   ├── hooks/                 # Custom React hooks
│   ├── assets/                # Images, fonts, static files
│   ├── styles.css             # Global styles
│   ├── router.tsx             # Router configuration
│   ├── start.ts               # Server middleware setup
│   ├── server.ts              # Server entry point
│   └── env.d.ts               # TypeScript environment types
├── scripts/                    # Build & setup scripts
├── tests/                      # Test files
├── data/                       # Static data files
├── public/                     # Static assets
├── package.json               # Dependencies
├── tsconfig.json              # TypeScript config
├── vite.config.ts             # Vite build config
├── tailwind.config.ts         # TailwindCSS config
└── README.md / BLOG_ADMIN_GUIDE.md
```

---

## Core Concepts

### 1. Routing System (File-Based)

**Location:** [`src/routes/`](/src/routes)

Routes use **TanStack Router's file-based routing** pattern. The router is automatically generated into [`routeTree.gen.ts`](/src/routeTree.gen.ts).

**Key Routes:**

| Route | File | Purpose |
|-------|------|---------|
| `/` | `index.tsx` | Homepage |
| `/products` | `products.tsx` | Product listing |
| `/products/:slug` | `products.$slug.tsx` | Product details |
| `/process` | `process.tsx` | Manufacturing process |
| `/our-story` | `our-story.tsx` | Company story |
| `/gallery` | `gallery.tsx` | Image gallery |
| `/contact` | `contact.tsx` | Contact form |
| `/resources` | `resources.tsx` | Blog/articles index |
| `/resources/:slug` | `resources_.$slug.tsx` or `resources.articles.$slug.tsx` | Individual articles |
| `/applications` | `applications.tsx` | Use cases/applications |
| `/sustainability` | `sustainability.tsx` | Sustainability info |
| `/admin` | `admin.tsx` | Admin dashboard (protected) |
| `/admin/login` | `admin.login.tsx` | Admin authentication |
| `/admin/articles` | `admin.articles.tsx` | Article management |
| `/admin/posts/:id/edit` | `admin.posts.$id.edit.tsx` | Post editing |

### 2. Root Layout Component

**Location:** [`src/routes/__root.tsx`](/src/routes/__root.tsx)

Wraps all pages with:
- **Header** with navigation (desktop & mobile)
- **Footer** with company info
- **QueryClientProvider** for React Query
- **Error handling** (custom 404 & error pages)
- **Global styling** and meta tags

Handles:
- SSR HTML structure (`<html>`, `<head>`, `<body>`)
- Vite preload error recovery
- Chunk loading failures with auto-reload

### 3. Component Architecture

**Location:** [`src/components/`](/src/components)

**Key Components:**

#### Site Components (Layout)
- **Header** — Navigation bar with logo, menu, and mobile drawer
- **Footer** — Company info, links, contact details

#### UI Components
- Radix UI wrapper components (Dialog, Dropdown, Popover, etc.)
- Custom styled versions using TailwindCSS
- Located in `components/ui/` (shadcn-style structure)

#### Feature Components
- Product cards
- Gallery components
- Form components
- Rich text editor wrapper (TipTap integration)

### 4. Server Functions & API

**Location:** [`src/server/`](/src/server) and [`src/routes/api/`](/src/routes/api)

**TanStack React Start Server Functions** allow RPC-style server calls from client:

```typescript
// In server code
export const getArticles = server$(async () => {
  // Runs on server, database access, etc.
  return db.articles.findAll();
});

// In client component
import { getArticles } from '~/server/articles';
const articles = await getArticles();
```

**Key Server Operations:**
- Article/post CRUD operations
- Admin authentication & session management
- Contact form submissions
- Database queries

**API Routes** (traditional REST endpoints):
- Located in `routes/api/`
- Handle external integrations
- Sitemap generation (`sitemap.xml.ts`)

### 5. Database Layer

**Supported Databases:**
1. **PostgreSQL** (Neon) — Production
   - Connection via `@neondatabase/serverless`
   - Configured in `.env` with `DATABASE_URL`

2. **SQLite** (better-sqlite3) — Development/Local
   - File-based database
   - Used for development with scripts

**Database Utilities:**
- Located in `src/lib/`
- Schema management
- Query helpers
- Connection pooling

**Admin & Blog Features:**
- User authentication (bcrypt password hashing)
- Blog article/post management
- Admin session JWT tokens

### 6. Forms & Validation

**Technology:** React Hook Form + Zod

**Key Forms:**
- Contact form (`/contact`)
- Admin login form
- Article/post creation & editing
- Settings/password change

**Pattern:**
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  message: z.string().min(10),
});

export function ContactForm() {
  const form = useForm({ resolver: zodResolver(schema) });
  // Form logic...
}
```

### 7. Rich Text Editing

**Technology:** TipTap (collaborative editor)

**Used For:**
- Blog article content editing (admin panel)
- Rich formatting: bold, italic, underline, links, images
- Text alignment and color
- Highlighting

**Location:** Admin article editor (`admin.articles.$id.edit.tsx`)

### 8. Styling System

**TailwindCSS v4** with custom utilities:

**Color Palette (Brand Colors):**
```css
--primary-teal: #006465        /* Arjuna brand color */
--deep-teal: #003F40
--dark-forest: #123C3B
--soft-teal: #DCEEEE
--pale-aqua: #EEF7F5
--coconut-brown: #8B6245
--natural-earth: #B78A63
--sand: #D8C3A5
```

**Key CSS Features:**
- Responsive design (mobile-first)
- CSS Grid & Flexbox layouts
- Custom animations (`framer-motion`)
- Tailwind plugins for carousel (`embla-carousel`)
- Text styles (custom fonts: Archivo, Cormorant Garamond, Dela Gothic, DM Sans, Poppins)

### 9. Data Visualization & Charts

**Technology:** Recharts

**Use Cases:**
- Product statistics
- Growth metrics
- Performance charts
- Dashboard visualizations (admin panel)

### 10. Authentication & Security

**Admin Authentication:**
- Bcrypt password hashing
- JWT tokens for sessions
- Protected routes with auth middleware
- CSRF protection via `createCsrfMiddleware`

**Security Features:**
- Server function validation
- Zod schema validation
- HTML sanitization (`sanitize-html` package)
- HTTPS recommended for production

---

## Development Workflow

### Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server (Vite) with HMR |
| `npm run build` | Build for production |
| `npm run build:dev` | Build with dev mode (source maps) |
| `npm start` | Run production server |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
| `npm run test` | Run test suite |
| `npm run format` | Format code with Prettier |
| `npm run blog:migrate` | Migrate legacy blog content |
| `npm run blog:import-articles` | Import articles from external source |
| `npm run admin:hash` | Hash admin password |
| `npm run admin:setup` | Initial admin setup |
| `npm run admin:db` | Admin database CLI |
| `npm run db:migrate` | Run database migrations |

### Environment Variables

Create a `.env` file (see `.env.example`):

```env
# Database
DATABASE_URL=postgresql://user:pass@neon.tech/db  # Production (PostgreSQL)
# or for local: DATABASE_URL=file:./local.db      # Development (SQLite)

# Admin credentials
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD_HASH=<bcrypt-hash>

# JWT secret
JWT_SECRET=your-secret-key

# Email (Resend)
RESEND_API_KEY=your-api-key

# Optional: Deployment platform
VERCEL_URL=https://arjuna-exports.com
```

### Local Setup

```bash
# Install dependencies
npm install
# or with Bun: bun install

# Setup database
npm run db:migrate

# Setup admin user
npm run admin:setup

# Start dev server
npm run dev

# Visit http://localhost:5173
```

---

## Key Features

### 1. Public Website
- **Immersive storytelling** design focused on visual content
- **Responsive design** (mobile, tablet, desktop)
- **Rich imagery** of products, process, and applications
- **Contact form** for inquiries
- **Blog/Resources** section for articles

### 2. Admin Panel
- **Article/post management** (create, read, update, delete)
- **Rich text editing** with TipTap
- **Preview functionality**
- **Article preview** before publishing
- **Change password** for admin users
- **Dashboard** with stats and recent items

### 3. SEO
- **Meta tags** (title, description, OG tags)
- **Sitemap** generation (`sitemap.xml`)
- **Semantic HTML**
- **Robot-friendly** routing

### 4. Performance
- **Code splitting** via dynamic imports
- **Lazy loading** for images
- **TanStack Query** for caching
- **Vite optimizations** for fast builds
- **Server-side rendering** (SSR) for fast initial load

---

## State Management

### Client-Side State

**React Query (TanStack Query):**
- Manages server state (API calls)
- Automatic caching and synchronization
- Used for: articles, products, admin data

**React Hooks:**
- Local UI state (modals, forms, etc.)
- Custom hooks in `src/hooks/`

**Form State:**
- React Hook Form + Zod validation
- Independent of data fetching

---

## Error Handling

**Global Error Boundary:**
- Catches all errors in route components
- Displays user-friendly error page
- Logs to console for debugging

**Chunk Loading Errors:**
- Detects dynamic import failures
- Auto-reloads page once per 10 seconds
- Prevents infinite reload loops

**Server Error Handling:**
- Middleware catches errors in `start.ts`
- Renders error page with status 500
- h3 error normalization in `server.ts`

---

## Testing

**Test Files:** `tests/` directory

**Current Tests:**
- Dashboard functionality
- Blog admin features

**Run Tests:**
```bash
npm run test
```

---

## Deployment

### Vercel
- Configured in `vercel.json`
- Automatic deployments from Git
- Environment variables in Vercel dashboard

### Self-Hosted
1. Build: `npm run build`
2. Output: `.output/` directory (Nitro server)
3. Run: `node .output/server/index.mjs`
4. Set `DATABASE_URL` environment variable

### Database Deployment
- **Neon** for PostgreSQL (serverless)
- Create database, set `DATABASE_URL` in env

---

## Key Dependencies Overview

| Package | Version | Purpose |
|---------|---------|---------|
| `@tanstack/react-start` | 1.168 | SSR framework |
| `@tanstack/react-router` | 1.170 | Routing |
| `@tanstack/react-query` | 5.101 | Server state |
| `react` | 19.2 | UI library |
| `tailwindcss` | 4.2 | Styling |
| `@radix-ui/*` | Various | UI components |
| `zod` | 3.24 | Validation |
| `react-hook-form` | 7.71 | Forms |
| `@tiptap/*` | 3.32 | Rich editor |
| `recharts` | 2.15 | Charts |
| `framer-motion` | 14.0 | Animations |
| `better-sqlite3` | 13.0 | Local DB |
| `pg` | 8.23 | PostgreSQL client |
| `bcryptjs` | 3.0 | Password hashing |
| `jsonwebtoken` | 9.0 | JWT auth |
| `resend` | 6.34 | Email service |

---

## Best Practices in This Codebase

1. **Type Safety:** Full TypeScript usage
2. **Server Functions:** RPC-style data access (no REST boilerplate)
3. **Validation:** Zod schemas for forms and APIs
4. **Component Reusability:** UI components in `src/components/ui/`
5. **Error Handling:** Global error boundaries + middleware
6. **Performance:** Code splitting, lazy loading, caching
7. **Security:** CSRF protection, password hashing, input sanitization
8. **SEO:** Meta tags, sitemap, semantic HTML
9. **Responsive Design:** TailwindCSS breakpoints
10. **Admin UX:** Rich editor, preview functionality, session management

---

## Common Tasks

### Add a New Page
1. Create file in `src/routes/` (e.g., `about.tsx`)
2. Use `createFileRoute()` to define route
3. Router will auto-generate in `routeTree.gen.ts`

### Add an API Endpoint
1. Create file in `src/routes/api/` (e.g., `api/subscribe.ts`)
2. Export server function or HTTP handler
3. Access via fetch on client

### Create a New Article/Post
1. Use admin panel at `/admin`
2. Navigate to "Articles" or "Posts"
3. Click "New"
4. Use TipTap editor for content
5. Preview before publishing

### Modify Branding
1. Update colors in `tailwind.config.ts`
2. Update logo in `Header` component
3. Update fonts in `__root.tsx` link tags
4. Update metadata in `__root.tsx` head config

---

## Resources

- **TanStack Documentation:** https://tanstack.com/
- **React Documentation:** https://react.dev/
- **TailwindCSS:** https://tailwindcss.com/
- **Radix UI:** https://www.radix-ui.com/
- **Vite:** https://vitejs.dev/

---

**Last Updated:** 2024
**Project:** Arjuna Exports - Premium B2B Website
