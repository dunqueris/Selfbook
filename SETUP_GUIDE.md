# 📋 COMPLETE SHELFBOOK PLATFORM SETUP GUIDE

## 🎯 What You're Building

A full-stack profile platform where users can:
- Sign up with email/password
- Create a personal profile with username
- Add different types of content sections (text lists, links, galleries)
- Share their profile at a unique URL (e.g., shelfbook.app/@john)
- Edit and manage their profile from a dashboard

---

## 🗂️ PROJECT STRUCTURE & FILE ORGANIZATION

Your 5 text documents have been organized into a professional Next.js project structure:

### **By Programming Language:**

#### **TypeScript/React (Frontend)**
```
Frontend Components (User Interface):
├── app/page.tsx                        ← Home page
├── app/login/page.tsx                  ← Login form
├── app/signup/page.tsx                 ← Sign up form
├── app/dashboard/page.tsx              ← User dashboard
├── app/[username]/page.tsx             ← Public profile page
├── components/Navbar.tsx               ← Navigation bar
├── components/ProfileCard.tsx          ← Profile display
└── components/sections/
    ├── TextListSection.tsx             ← Text list renderer
    ├── LinksSection.tsx                ← Links renderer
    └── GallerySection.tsx              ← Gallery renderer
```

#### **TypeScript (Backend/API)**
```
Backend API Routes:
├── app/api/profile/route.ts            ← Profile API (GET, PATCH)
└── app/api/sections/route.ts           ← Sections API (GET, POST, PATCH, DELETE)

Core Libraries:
├── lib/types.ts                        ← Type definitions
└── lib/supabase.ts                     ← Supabase client initialization
```

#### **SQL (Database)**
```
Database Setup:
├── Supabase SQL Schema
├── Tables: profiles, sections
├── Row Level Security policies
└── Indexes for performance
```

#### **JavaScript/JSON (Configuration)**
```
Project Configuration:
├── package.json                        ← Dependencies and scripts
├── tsconfig.json                       ← TypeScript settings
├── tailwind.config.js                  ← Styling configuration
├── next.config.js                      ← Next.js settings
├── postcss.config.js                   ← CSS processing
└── .env.local.example                  ← Environment template
```

#### **CSS (Styling)**
```
Styling:
└── styles/globals.css                  ← Global Tailwind CSS
```

---

## 🚀 STEP-BY-STEP SETUP INSTRUCTIONS

### **STEP 1: Install Dependencies**

Navigate to your project directory and run:

```bash
cd d:\VSCode Projects\Selfbook-Platform
npm install
```

This installs:
- `next` - React framework
- `react` & `react-dom` - UI library
- `@supabase/supabase-js` - Database client
- `@supabase/auth-helpers-nextjs` - Authentication
- `lucide-react` - Icons
- `tailwindcss` - CSS framework

**Wait time: 2-5 minutes**

---

### **STEP 2: Set Up Supabase (Database)**

#### **2A: Create Supabase Account**
1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up with GitHub or email
4. Create a new project
   - Name: "shelfbook-platform" (or your choice)
   - Region: Choose closest to you
   - Password: Create a secure password
5. **Wait 2-3 minutes** for database to initialize

#### **2B: Create Database Schema**
1. In Supabase dashboard, click **"SQL Editor"**
2. Click **"New Query"**
3. Copy and paste the complete SQL below:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- PROFILES TABLE
-- ========================================
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

-- ========================================
-- SECTIONS TABLE
-- ========================================
CREATE TABLE sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT NOT NULL,  -- 'text_list', 'links', 'gallery'
  content JSONB NOT NULL,
  position INTEGER NOT NULL,
  visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- INDEXES (For Performance)
-- ========================================
CREATE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_sections_profile ON sections(profile_id);

-- ========================================
-- ROW LEVEL SECURITY
-- ========================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;

-- ========================================
-- POLICIES - PROFILES
-- ========================================
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ========================================
-- POLICIES - SECTIONS
-- ========================================
CREATE POLICY "Public sections are viewable by everyone"
  ON sections FOR SELECT
  USING (visible = true);

CREATE POLICY "Users can manage own sections"
  ON sections FOR ALL
  USING (
    auth.uid() = (SELECT user_id FROM profiles WHERE id = profile_id)
  )
  WITH CHECK (
    auth.uid() = (SELECT user_id FROM profiles WHERE id = profile_id)
  );
```

4. Click **"Run"** button
5. You should see ✅ "Success" messages

#### **2C: Get Supabase Credentials**
1. Click **"Settings"** (bottom left)
2. Click **"API"** in the left menu
3. Copy these values:
   - **Project URL** (starts with https://)
   - **Anon Public Key** (long string)

---

### **STEP 3: Create Environment Variables**

1. In your project root (`d:\VSCode Projects\Shelfbook-Platform`), create `.env.local` file
2. Add:

```bash
NEXT_PUBLIC_SUPABASE_URL=paste_your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=paste_your_anon_key_here
```

**Example** (replace with your actual keys):
```bash
NEXT_PUBLIC_SUPABASE_URL=https://abcdefgh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

### **STEP 4: Run the Development Server**

```bash
npm run dev
```

You should see:
```
> shelfbook-platform@0.1.0 dev
> next dev

  ▲ Next.js 14.0.0
  - Local:        http://localhost:3000
```

Open http://localhost:3000 in your browser! 🎉

---

## 🧪 TESTING YOUR SETUP

### **Test Flow:**

1. **Home Page** (http://localhost:3000)
   - See welcome screen with Sign Up button

2. **Sign Up** (http://localhost:3000/signup)
   - Enter username: `testuser`
   - Enter email: `test@example.com`
   - Enter password: `password123`
   - Click "Sign Up"
   - ✅ Should redirect to dashboard

3. **Dashboard** (http://localhost:3000/dashboard)
   - See profile info
   - Click "Edit Profile"
   - Update display name
   - Click "Save Changes"
   - ✅ Should update

4. **Add Section**
   - Click "Add Section" dropdown
   - Select "📝 Text List"
   - ✅ Should appear in sections list

5. **View Public Profile**
   - Click "View Profile" button
   - Should show: http://localhost:3000/testuser
   - ✅ See your profile with section

6. **Test Links**
   - Click username to go to public profile
   - Should show your section

If all tests pass ✅ - **Congratulations! Your platform is working!**

---

## 📊 UNDERSTANDING THE DATA FLOW

### **User Signs Up:**
```
1. User fills signup form
   ↓
2. Frontend sends email/password to Supabase Auth
   ↓
3. Supabase creates user account
   ↓
4. Create profile record in database
   ↓
5. Redirect to dashboard
```

### **User Adds a Section:**
```
1. User clicks "Add Section" in dashboard
   ↓
2. Frontend sends POST request to /api/sections
   ↓
3. API validates user ownership
   ↓
4. Create section in database
   ↓
5. Refresh dashboard to show new section
```

### **Public Profile View:**
```
1. User visits /username
   ↓
2. Next.js server-side renders page
   ↓
3. Query database for profile data
   ↓
4. Query sections for that profile
   ↓
5. Render HTML with profile info
```

---

## 🔑 KEY FILES EXPLAINED

### **app/layout.tsx**
- Root layout for entire app
- Includes Navbar on every page
- Sets up global metadata

### **app/page.tsx**
- Home/landing page
- Shows Sign Up and Log In buttons

### **app/login/page.tsx & app/signup/page.tsx**
- Authentication forms
- Handles email/password validation
- Creates profile on signup

### **app/dashboard/page.tsx**
- User's private dashboard
- Can edit profile info
- Can add/delete sections
- Shows "View Profile" link

### **app/[username]/page.tsx**
- Public profile page
- Server-side rendered
- Anyone can visit
- Shows profile + sections

### **app/api/profile/route.ts**
```
GET  - Get current user's profile
PATCH - Update profile info
```

### **app/api/sections/route.ts**
```
GET    - Get sections for a profile
POST   - Create new section
PATCH  - Update section
DELETE - Delete section
```

### **lib/types.ts**
- TypeScript interfaces
- Profile type
- Section type
- Content types

### **components/ProfileCard.tsx**
- Displays public profile
- Shows banner, avatar, bio
- Renders active section
- Tab navigation

### **components/sections/*.tsx**
- TextListSection - Renders bullet points
- LinksSection - Renders clickable links
- GallerySection - Renders image grid

---

## 🚨 COMMON ISSUES & SOLUTIONS

| Issue | Cause | Solution |
|-------|-------|----------|
| "Cannot find module 'next'" | Dependencies not installed | Run `npm install` |
| "Invalid API credentials" | Wrong Supabase keys | Check `.env.local` matches Settings → API |
| "Username already taken" | Username validation working | Choose different username |
| "Profile not found" | User not authenticated | Sign in first |
| Blank dashboard | RLS policies blocking | Check Supabase policies are correct |
| Sections not showing | visible flag is false | Set visible: true in database |
| Build fails | Cache corrupted | Delete `.next` folder, run `npm run dev` again |

---

## 🌐 DEPLOY TO PRODUCTION

### **Option 1: Deploy to Vercel (Recommended)**

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/shelfbook.git
   git push -u origin main
   ```

2. **Go to https://vercel.com**

3. **Click "New Project" and import your GitHub repo**

4. **Add Environment Variables:**
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY

5. **Click "Deploy"** - Done! 🎉

Your site is now live at `https://your-project.vercel.app`

### **Option 2: Other Hosting**
- Netlify, Railway, Fly.io all work
- Must set same environment variables

---

## 💡 PRO TIPS

1. **Test locally first** - Use `npm run dev` to test before deploying
2. **Check Supabase dashboard** - If something breaks, check your data in Supabase
3. **Use browser dev tools** - F12 to see console errors
4. **Start simple** - Get basic features working before adding complex ones
5. **Commit often** - `git commit` after each feature works

---

## 📚 USEFUL COMMANDS

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server (after build)
npm start

# Run linter
npm run lint

# Clear Next.js cache
rm -rf .next

# Fresh install
rm -rf node_modules
npm install
```

---

## ✅ CHECKLIST - YOU'RE DONE WHEN:

- [ ] npm install completes successfully
- [ ] Supabase project created
- [ ] Database schema created (SQL executed)
- [ ] Environment variables in .env.local
- [ ] `npm run dev` runs without errors
- [ ] Can visit http://localhost:3000
- [ ] Can sign up successfully
- [ ] Can add sections to profile
- [ ] Can view public profile
- [ ] All tests pass ✅

---

## 🎉 YOU DID IT!

You now have a fully functional profile platform. Next steps:

1. **Add more features:**
   - Image uploads
   - Profile themes
   - Social features

2. **Customize:**
   - Change colors in tailwind.config.js
   - Edit copy/text
   - Add more section types

3. **Deploy:**
   - Push to GitHub
   - Deploy to Vercel
   - Add custom domain

4. **Market it:**
   - Share with friends
   - Get real users
   - Collect feedback

---

**Good luck! You've built something awesome! 🚀**
 