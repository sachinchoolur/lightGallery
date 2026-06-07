# AzGallery

A professional architectural gallery platform for showcasing projects with community feedback.

## Features

- **Public Gallery** - Browse published architectural projects
- **Admin Dashboard** - Create, manage, and publish projects
- **Image Gallery** - Upload and organize project images
- **Comments** - Community feedback and engagement
- **Responsive Design** - Works on all devices
- **Dark Mode** - Built-in dark mode support
- **Security** - Supabase Row Level Security

## Tech Stack

- Next.js 16 (React 19, TypeScript)
- Supabase (PostgreSQL + Auth)
- Tailwind CSS 4
- react-hot-toast

## Quick Start

### Prerequisites
- Node.js 18+
- Supabase project configured
- Environment variables set

### Installation

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`

### Environment Variables

Add to `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

## Usage

### Public Users
- Visit homepage to browse projects
- Click projects to see details, images, and comments
- Leave feedback without signing in

### Project Creators
1. Sign up at `/auth/signup`
2. Create projects from admin dashboard
3. Add images and metadata
4. Publish to make public
5. Manage comments and visibility

## Pages

- `/` - Public gallery homepage
- `/project/[id]` - Project detail view
- `/auth/login` - Admin login
- `/auth/signup` - Create admin account
- `/admin` - Project management dashboard
- `/admin/project/[id]` - Edit project details

## Database

5 main tables with Row Level Security:
- `projects` - Project metadata
- `images` - Project images
- `comments` - Community feedback
- `annotations` - Point-based markups
- `access_tokens` - Special project access

## Deployment

Deploy to Vercel:
```bash
vercel deploy
```

## See Also

- `BUILD_SUMMARY.md` - Detailed technical documentation
- Supabase Documentation - https://supabase.com/docs
- Next.js Documentation - https://nextjs.org/docs

## License

MIT
