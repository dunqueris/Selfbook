# 🗣️ PROGRAMMING LANGUAGES & FILE BREAKDOWN

## 📊 Overview

Your 5 text documents have been converted into a professional Next.js project using **6 different programming languages/formats**:

| Language | Files | Purpose | Examples |
|----------|-------|---------|----------|
| **TypeScript/React** | 11 | Frontend UI Components | Buttons, Forms, Pages |
| **TypeScript** | 3 | Backend Logic | API routes, Configuration |
| **SQL** | 1 | Database Schema | Tables, Indexes, Policies |
| **JavaScript/JSON** | 6 | Project Configuration | Dependencies, Settings |
| **CSS** | 1 | Styling | Global styles, Tailwind |
| **Markdown** | 3 | Documentation | Guides, README |

**Total: 25 files organized by language and purpose**

---

## 🎨 DETAILED FILE BREAKDOWN

### 1️⃣ **TypeScript/React (Frontend UI Components)**

These are interactive React components that users see and interact with.

#### **Pages** (User-facing screens)
```
app/page.tsx                      
├── Location: Home page
├── Language: TypeScript + JSX (React)
├── Purpose: Landing page with sign up/login buttons
└── Key Features: Welcome message, feature cards, CTAs

app/login/page.tsx                
├── Location: /login
├── Language: TypeScript + JSX
├── Purpose: Email/password login form
├── Key Features: Form validation, error handling, redirects

app/signup/page.tsx               
├── Location: /signup
├── Language: TypeScript + JSX
├── Purpose: User registration form
├── Key Features: Username validation, profile creation

app/dashboard/page.tsx            
├── Location: /dashboard (protected)
├── Language: TypeScript + JSX
├── Purpose: User control panel for profile management
├── Key Features: Edit profile, add sections, view sections

app/[username]/page.tsx           
├── Location: /@username (dynamic)
├── Language: TypeScript + JSX
├── Purpose: Public profile display page
├── Key Features: Server-side rendering, profile data fetch

app/layout.tsx                    
├── Location: Root layout (all pages)
├── Language: TypeScript + JSX
├── Purpose: Global page wrapper
├── Key Features: Navbar, global metadata
```

#### **Components** (Reusable UI pieces)
```
components/Navbar.tsx             
├── Type: Navigation component
├── Language: TypeScript + JSX
├── Purpose: Top navigation bar
├── Shows: Logo, auth buttons or dashboard link

components/ProfileCard.tsx        
├── Type: Profile display component
├── Language: TypeScript + JSX
├── Purpose: Shows profile with banner, avatar, sections
├── Shows: User info, section navigation, active content

components/sections/TextListSection.tsx
├── Type: Section renderer
├── Language: TypeScript + JSX
├── Purpose: Displays bullet point lists
├── Shows: List items formatted nicely

components/sections/LinksSection.tsx
├── Type: Section renderer
├── Language: TypeScript + JSX
├── Purpose: Displays clickable links
├── Shows: Link cards with external link icon

components/sections/GallerySection.tsx
├── Type: Section renderer
├── Language: TypeScript + JSX
├── Purpose: Displays image gallery
├── Shows: Image grid with captions
```

---

### 2️⃣ **TypeScript (Backend & Utilities)**

These files handle business logic, data management, and configuration.

#### **API Routes** (Server endpoints)
```
app/api/profile/route.ts          
├── Language: TypeScript
├── Endpoints: GET, PATCH
├── Purpose: Profile management API
├── GET  - Fetch current user's profile
├── PATCH - Update profile info (name, bio, avatar)
└── Authentication: Requires user to be logged in

app/api/sections/route.ts         
├── Language: TypeScript
├── Endpoints: GET, POST, PATCH, DELETE
├── Purpose: Section management API
├── GET    - Get sections for a profile
├── POST   - Create new section
├── PATCH  - Update section content
├── DELETE - Delete a section
└── Authentication: Verified by ownership
```

#### **Core Libraries** (App configuration)
```
lib/types.ts                      
├── Language: TypeScript
├── Purpose: Type definitions for entire app
├── Defines:
│   ├── Profile interface
│   ├── Section interface
│   ├── Content types (text, links, gallery)
│   └── Props interfaces for components
└── Benefit: Full type safety, autocomplete

lib/supabase.ts                   
├── Language: TypeScript
├── Purpose: Supabase client initialization
├── Exports:
│   ├── supabase client instance
│   └── getSupabaseClient() function
└── Used by: All API calls to database
```

---

### 3️⃣ **SQL (Database)**

These are database schema definitions executed in Supabase.

#### **Database Schema**
```
Profiles Table:
├── id (UUID) - Primary key
├── user_id (UUID) - Reference to auth.users
├── username (TEXT UNIQUE) - Unique username
├── display_name (TEXT) - Display name
├── bio (TEXT) - User bio
├── avatar_url (TEXT) - Profile picture URL
├── banner_url (TEXT) - Banner image URL
├── theme (TEXT) - Profile theme
├── created_at - Timestamp
└── updated_at - Timestamp

Sections Table:
├── id (UUID) - Primary key
├── profile_id (UUID) - Reference to profiles
├── title (TEXT) - Section title
├── type (TEXT) - 'text_list', 'links', 'gallery'
├── content (JSONB) - Dynamic content
├── position (INTEGER) - Display order
├── visible (BOOLEAN) - Show/hide flag
├── created_at - Timestamp
└── updated_at - Timestamp

Indexes:
├── idx_profiles_username - Fast username lookup
├── idx_profiles_user_id - Fast user lookup
└── idx_sections_profile - Fast sections lookup

Row Level Security Policies:
├── Public profiles viewable by everyone
├── Users can only update own profiles
├── Sections managed by profile owner
└── Only visible sections shown to public
```

---

### 4️⃣ **JavaScript/JSON (Configuration)**

These files tell Node.js, Next.js, and npm how to run the project.

#### **Dependencies & Scripts**
```
package.json                      
├── Language: JSON
├── Purpose: Project manifest
├── Contains:
│   ├── name, version, description
│   ├── Dependencies (next, react, supabase, etc.)
│   ├── Dev dependencies (typescript, tailwindcss)
│   └── Scripts (dev, build, start, lint)
└── Commands: npm install, npm run dev, npm run build
```

#### **TypeScript Configuration**
```
tsconfig.json                     
├── Language: JSON
├── Purpose: TypeScript compiler settings
├── Configures:
│   ├── Target JavaScript version (ES5)
│   ├── Module system (ESNext)
│   ├── JSX handling (preserve)
│   ├── Strict type checking (true)
│   ├── Path aliases (@/* = root)
│   └── Lib includes (DOM, ES modules)
└── Benefit: Type safety across project
```

#### **Styling Configuration**
```
tailwind.config.js                
├── Language: JavaScript
├── Purpose: Tailwind CSS configuration
├── Configures:
│   ├── Content paths (which files to scan)
│   ├── Theme extensions
│   └── Plugins
└── Result: CSS classes available in components

postcss.config.js                 
├── Language: JavaScript
├── Purpose: CSS processing pipeline
├── Plugins:
│   ├── tailwindcss - Generates Tailwind classes
│   └── autoprefixer - Adds browser prefixes
└── Used by: Build process
```

#### **Framework Configuration**
```
next.config.js                    
├── Language: JavaScript
├── Purpose: Next.js configuration
├── Configures:
│   └── Image handling (remote patterns)
└── Allows: Images from any URL

.env.local.example                
├── Language: Text/Bash
├── Purpose: Environment variables template
├── Contains:
│   ├── NEXT_PUBLIC_SUPABASE_URL
│   └── NEXT_PUBLIC_SUPABASE_ANON_KEY
└── Usage: Copy to .env.local and fill in
```

---

### 5️⃣ **CSS (Styling)**

```
styles/globals.css                
├── Language: CSS (with Tailwind directives)
├── Purpose: Global styles for entire app
├── Includes:
│   ├── @tailwind base - Reset styles
│   ├── @tailwind components - Component classes
│   ├── @tailwind utilities - Utility classes
│   └── Custom global styles (font smoothing, etc.)
└── Applied to: Every page in the app
```

---

### 6️⃣ **Markdown (Documentation)**

```
README.md                         
├── Language: Markdown
├── Purpose: Project overview and guide
├── Contains:
│   ├── Features overview
│   ├── Tech stack explanation
│   ├── Quick start guide
│   ├── Project structure
│   ├── Deployment instructions
│   ├── Troubleshooting
│   └── Learning resources
└── Read this: First thing when starting

SETUP_GUIDE.md                    
├── Language: Markdown
├── Purpose: Detailed step-by-step setup
├── Contains:
│   ├── Prerequisites checklist
│   ├── Installation steps
│   ├── Supabase configuration
│   ├── Environment setup
│   ├── Testing procedures
│   ├── Troubleshooting table
│   └── Deployment options
└── Read this: Before running npm install

QUICK_REFERENCE.md               
├── Language: Markdown
├── Purpose: Quick lookup guide
├── Contains:
│   ├── 30-second overview
│   ├── File organization
│   ├── Quick commands
│   ├── Common problems & fixes
│   └── FAQ
└── Read this: When you need quick answers
```

---

## 🔄 HOW FILES WORK TOGETHER

### **When User Signs Up:**
```
1. User submits form (React)
   ↓
2. Form validation in TypeScript
   ↓
3. Send to API Route (app/api/*)
   ↓
4. API validates with Supabase Auth (SQL policies)
   ↓
5. Create profile in database (SQL tables)
   ↓
6. Update UI state (TypeScript/React)
   ↓
7. Redirect to dashboard
```

### **When User Views Public Profile:**
```
1. User visits /username
   ↓
2. Next.js server-side renders [username]/page.tsx
   ↓
3. Query Supabase using lib/types.ts types
   ↓
4. Fetch profile via SQL (READ policy)
   ↓
5. Fetch sections via SQL (READ policy)
   ↓
6. Render ProfileCard.tsx component
   ↓
7. Render active section with appropriate component
   ↓
8. Apply styles from globals.css
   ↓
9. Send HTML to browser
```

---

## 💻 LANGUAGE SYNTAX EXAMPLES

### **TypeScript/React Example:**
```tsx
// app/page.tsx
export default function Home() {
  return (
    <div className="container mx-auto">
      <h1>Welcome to Shelfbook</h1>
      <button className="bg-purple-600">Sign Up</button>
    </div>
  )
}
```

### **TypeScript Example:**
```typescript
// lib/types.ts
export interface Profile {
  id: string
  username: string
  display_name: string | null
}
```

### **SQL Example:**
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT UNIQUE NOT NULL
);
```

### **JSON Example:**
```json
{
  "name": "shelfbook-platform",
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0"
  }
}
```

### **CSS Example:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### **Markdown Example:**
```markdown
# Shelfbook - Profile Platform MVP
A platform for creating beautiful profiles...
```

---

## 📊 LANGUAGE BREAKDOWN BY PURPOSE

```
PURPOSE                  LANGUAGE           FILES
────────────────────────────────────────────────────
User Interface          TypeScript/JSX      11
Server Logic            TypeScript          2
Configuration           JavaScript/JSON     6
Data Storage            SQL                 1
Styling                 CSS                 1
Documentation           Markdown            3
────────────────────────────────────────────────────
TOTAL                                      24
```

---

## 🎯 WHICH FILES DO WHAT?

### **To Add a New Feature:**
1. **Create UI:** TypeScript/JSX in `components/` or `app/`
2. **Create API:** TypeScript in `app/api/`
3. **Update DB:** SQL in Supabase
4. **Add Types:** TypeScript in `lib/types.ts`
5. **Style it:** Tailwind CSS classes in JSX
6. **Document:** Update README.md

### **To Fix a Bug:**
1. Check error in browser console (F12)
2. Find problematic file by error message
3. Edit the TypeScript/JSX file
4. Check API routes if data issue
5. Verify database if data missing
6. Update types if type mismatch

### **To Deploy:**
1. Push all files to GitHub
2. Environment vars (.env.local values) → Vercel settings
3. Vercel builds and deploys
4. Live! 🎉

---

## ✅ SUMMARY

Your Shelfbook platform uses:

- **TypeScript/React** for beautiful, interactive UIs
- **TypeScript** for safe, maintainable backend code
- **SQL** for reliable, scalable database
- **JavaScript/JSON** for standard configurations
- **CSS** for professional styling
- **Markdown** for clear documentation

This is the **same language combination** used by:
- Netflix (TypeScript + React)
- GitHub (TypeScript + React)
- Stripe (TypeScript + React)
- Vercel (Next.js + TypeScript)

**You're building with professional tools!** 🚀

---

**Next: Read SETUP_GUIDE.md to get started** 📚
