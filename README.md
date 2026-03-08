<div align="center">

# 🍳 Kitchen Coach

### *Master the Art of Cooking — One Class at a Time*

![Kitchen Coach Banner](public/banner.jpg)

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Lovable Cloud](https://img.shields.io/badge/Lovable_Cloud-Backend-FF6B6B?style=for-the-badge)](https://lovable.dev/)

---

**Kitchen Coach** is a modern cooking class booking platform where aspiring chefs can discover courses, enroll in batches, and track their culinary journey.

[🌐 Live Demo](https://id-preview--b4b04923-8c07-4b6a-b729-75a9e2e99b37.lovable.app) · [🐛 Report Bug](https://github.com/) · [✨ Request Feature](https://github.com/)

</div>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🎓 **Course Catalog** | Browse a rich collection of cooking courses with categories, pricing & details |
| 📅 **Batch Booking** | Enroll in scheduled batches with real-time seat availability |
| 👤 **User Auth** | Secure signup, login & profile management |
| 🛡️ **Admin Dashboard** | Manage courses, batches & bookings with role-based access |
| 📱 **Responsive Design** | Beautiful experience on desktop, tablet & mobile |
| 🔒 **Row-Level Security** | Data protection with fine-grained access policies |

---

## 🛠️ Tech Stack

<div align="center">

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 · JSX · Tailwind CSS · shadcn/ui |
| **Build Tool** | Vite 5 |
| **Routing** | React Router v6 |
| **State** | TanStack React Query |
| **Backend** | Lovable Cloud (Supabase) |
| **Auth** | Email/Password with role-based access |

</div>

---

## 📁 Project Structure

```
kitchen-coach/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   │   └── ui/          # shadcn/ui components
│   ├── contexts/        # Auth context provider
│   ├── hooks/           # Custom React hooks
│   ├── integrations/    # Supabase client & types
│   ├── lib/             # Utility functions
│   └── pages/           # Route pages
│       ├── Index.jsx        # Landing page
│       ├── Courses.jsx      # Course catalog
│       ├── CourseDetail.jsx  # Course details & booking
│       ├── MyBookings.jsx   # User bookings
│       ├── AdminDashboard.jsx # Admin panel
│       ├── Login.jsx        # Sign in
│       └── Register.jsx     # Sign up
├── supabase/            # Database config & migrations
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [npm](https://www.npmjs.com/) or [bun](https://bun.sh/)

### Installation

```bash
# 1. Clone the repository
git clone <YOUR_GIT_URL>

# 2. Navigate to project
cd kitchen-coach

# 3. Install dependencies
npm install

# 4. Set up environment variables
# Create a .env file with:
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key

# 5. Start development server
npm run dev
```

The app will be running at **http://localhost:5173** 🎉

---

## 📊 Database Schema

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│ courses  │────▶│ batches  │◀────│ bookings │
│          │     │          │     │          │
│ id       │     │ id       │     │ id       │
│ title    │     │ course_id│     │ batch_id │
│ price    │     │ schedule │     │ user_id  │
│ category │     │ capacity │     │ status   │
│ duration │     │ instructor│    │ payment  │
└──────────┘     └──────────┘     └──────────┘
                                       │
┌──────────┐     ┌──────────┐          │
│ profiles │     │user_roles│          │
│          │     │          │          │
│ user_id  │     │ user_id  │◀─────────┘
│ full_name│     │ role     │
│ email    │     └──────────┘
└──────────┘
```

---

## 👥 User Roles

| Role | Permissions |
|------|------------|
| **User** | Browse courses, book batches, view own bookings |
| **Admin** | Full CRUD on courses & batches, manage all bookings, view dashboard stats |

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

**Built with ❤️ using [Lovable](https://lovable.dev)**

</div>
