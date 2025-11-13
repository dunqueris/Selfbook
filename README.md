# Shelfbook - Profile Platform MVP

A modern, full-featured personal profile platform built with **Next.js**, **TypeScript**, **Tailwind CSS**, and **Supabase**. Create beautiful profiles with customizable sections and share them with a unique URL!

## 🎯 Features

✅ **User Authentication** - Email/password signup and login with Supabase Auth
✅ **Profile Management** - Create profiles with username, display name, bio, and avatar
✅ **Multiple Section Types** - Text lists, links, and galleries
✅ **Public Profile Pages** - Share your profile at `yoursite.com/@username`
✅ **Dashboard** - Easy-to-use editing interface
✅ **Responsive Design** - Mobile, tablet, and desktop friendly
✅ **Modern UI** - Beautiful gradient backgrounds and smooth animations

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Icons**: Lucide React
- **Deployment**: Vercel (recommended)

## 📋 Prerequisites

- Node.js 18+ and npm
- A free Supabase account (https://supabase.com)
- Git (optional, for deployment)

## 🚀 Quick Start

### Step 1: Clone and Install

```bash
# Create and navigate to project directory
cd d:\VSCode Projects\Shelfbook-Platform

# Install dependencies
npm install
```

### Step 2: Supabase Setup

1. Go to https://supabase.com and create a free account
2. Create a new project (wait 2-3 minutes for it to initialize)
3. Go to **SQL Editor** and create a new query
4. Copy and paste the SQL below:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  banner_url TEXT,
  theme TEXT DEFAULT 'default',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sections table
CREATE TABLE sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  content JSONB NOT NULL,
  position INTEGER NOT NULL,
  visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_sections_profile ON sections(profile_id);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for sections
CREATE POLICY "Public sections are viewable by everyone"
  ON sections FOR SELECT
  USING (visible = true);

CREATE POLICY "Users can manage own sections"
  ON sections FOR ALL
  USING (auth.uid() = (SELECT user_id FROM profiles WHERE id = profile_id))
  WITH CHECK (auth.uid() = (SELECT user_id FROM profiles WHERE id = profile_id));
```

5. Execute the SQL
6. Go to **Settings → API** and copy your:
   - Project URL
   - Anon Public Key

### Step 3: Environment Variables

Create a `.env.local` file in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### Step 4: Run Locally

```bash
npm run dev
```

Open http://localhost:3000 in your browser!

## 📝 Project Structure

```
Shelfbook-Platform/
├── app/
│   ├── layout.tsx              # Root layout with Navbar
│   ├── page.tsx                # Home page
│   ├── login/page.tsx          # Login page
│   ├── signup/page.tsx         # Sign up page
│   ├── dashboard/page.tsx      # User dashboard
│   ├── [username]/page.tsx     # Public profile page
│   └── api/
│       ├── profile/route.ts    # Profile API endpoints
│       └── sections/route.ts   # Sections API endpoints
├── components/
│   ├── Navbar.tsx              # Navigation component
│   ├── ProfileCard.tsx         # Public profile display
│   └── sections/
│       ├── TextListSection.tsx
│       ├── LinksSection.tsx
│       └── GallerySection.tsx
├── lib/
│   ├── types.ts                # TypeScript types
│   └── supabase.ts             # Supabase client
├── styles/
│   └── globals.css             # Global Tailwind styles
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── next.config.js
```

## 🎨 Programming Language Breakdown

Here's how your documentation was organized by language:

### **TypeScript/React** (Frontend Components & Pages)
- `app/page.tsx` - Home page
- `app/login/page.tsx` - Login form
- `app/signup/page.tsx` - Signup form
- `app/dashboard/page.tsx` - Profile editing dashboard
- `app/[username]/page.tsx` - Public profile view
- `components/Navbar.tsx` - Navigation
- `components/ProfileCard.tsx` - Profile display
- `components/sections/*.tsx` - Section renderers

### **TypeScript** (Backend & API)
- `app/api/profile/route.ts` - Profile management API
- `app/api/sections/route.ts` - Section management API
- `lib/types.ts` - Type definitions
- `lib/supabase.ts` - Supabase client setup

### **SQL** (Database)
- Supabase database schema setup
- Row-level security policies
- Table indexes

### **JavaScript/JSON** (Configuration)
- `package.json` - Dependencies
- `tsconfig.json` - TypeScript config
- `tailwind.config.js` - Styling config
- `next.config.js` - Next.js config

### **CSS** (Styling)
- `styles/globals.css` - Global Tailwind directives

## 🔑 Key Features Explained

### Authentication
- Supabase handles user registration and login
- Passwords are encrypted and secure
- Sessions managed automatically

### Profile Creation
- Usernames are unique and validated
- Display names, bios, and avatars stored
- Public URL: `yoursite.com/@username`

### Sections
Three types of content sections:
1. **Text Lists** - Bullet points and lists
2. **Links** - Clickable links with titles
3. **Galleries** - Image collections with captions

### Dashboard
- Edit profile information
- Add/delete sections
- View public profile
- Logout

## 🌐 Deployment

### Deploy to Vercel (Recommended)

```bash
# 1. Push to GitHub
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin YOUR_GITHUB_URL
git push -u origin main

# 2. Go to https://vercel.com
# 3. Click "New Project" and import your repo
# 4. Add environment variables:
#    - NEXT_PUBLIC_SUPABASE_URL
#    - NEXT_PUBLIC_SUPABASE_ANON_KEY
# 5. Deploy!
```

Your site will be live at `https://your-project-name.vercel.app`

## 🚨 Troubleshooting

### "Invalid API credentials"
- Check `.env.local` has correct Supabase URL and key
- Verify keys are from **Settings → API**

### "Username already taken"
- The validation is working correctly
- Try a different username

### Build errors about modules
- Run `npm install` again
- Delete `node_modules` and `.next` folders
- Run `npm install` and `npm run dev`

### Sections not showing
- Check Row Level Security policies in Supabase
- Verify sections have `visible: true`

### Pages not loading
- Clear Next.js cache: `rm -rf .next`
- Restart dev server: `npm run dev`

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 📦 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## 🎯 Next Steps

After getting the MVP running, consider adding:

- [ ] Image uploads for avatars and galleries
- [ ] Section reordering (drag and drop)
- [ ] Theme customization
- [ ] Social features (follows, likes)
- [ ] Analytics dashboard
- [ ] Premium features
- [ ] Custom domain support

## 📄 License

MIT - Feel free to use this project for personal or commercial purposes!

## 🤝 Support

Having issues? Check:
1. The troubleshooting section above
2. Supabase docs for database issues
3. Next.js docs for framework issues
4. Browser console for error messages

---

**Happy building! 🚀**

You've got all the code you need. Just follow the setup steps and you'll have a fully functional profile platform!
