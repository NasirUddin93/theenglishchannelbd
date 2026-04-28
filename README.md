# The English Channel BD (Lumina Books & Courses)

A comprehensive e-commerce and learning management platform built with Laravel and Next.js. This platform enables users to purchase books, enroll in courses, track their learning progress, and interact with a community through reviews and Q&A.

## 🚀 Overview

The English Channel BD is a dual-purpose platform:
1.  **Bookstore**: A complete e-commerce experience for physical and digital books with features like wishlists, ratings, and structured categories.
2.  **LMS (Learning Management System)**: A robust course platform featuring video streaming, lesson structures, quizzes, and progress tracking.

---

## 🛠 Tech Stack

### Frontend
- **Framework**: [Next.js 15.3](https://nextjs.org/) (App Router)
- **Library**: [React 19](https://react.dev/)
- **Styling**: [TailwindCSS 4.x](https://tailwindcss.com/) with PostCSS
- **Animations**: [Motion](https://motion.dev/) (Framer Motion)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: React Context API
- **Data Fetching**: Native Fetch with SWR/Custom hooks
- **Type Safety**: [TypeScript](https://www.typescriptlang.org/)

### Backend
- **Framework**: [Laravel 12.0](https://laravel.com/)
- **Authentication**: [Laravel Sanctum](https://laravel.com/docs/sanctum) (SPA Authentication)
- **Database**: SQLite (Default) / MySQL / PostgreSQL
- **Media**: Custom Video Streaming & File Uploads
- **Tools**: Laravel Tinker, Pint, Pail

---

## ✨ Key Features

### 📖 Bookstore
- **Product Catalog**: Filterable by categories, search functionality, and detailed book pages.
- **Reviews & Ratings**: User-generated reviews with approval workflow.
- **Q&A System**: Users can ask questions about books, and staff can provide answers.
- **Wishlist & Cart**: Persistent shopping experience for authenticated users.
- **Order Management**: Tracking numbers, order history, and status updates (Pending, Shipped, Delivered, etc.).

### 🎓 Learning Management (LMS)
- **Course Structure**: Organized by Levels, Categories, Sections, and Lessons.
- **Video Streaming**: Secure streaming for course content.
- **Quizzes**: Interactive quizzes with scoring and persistence.
- **Progress Tracking**: Database-backed progress tracking for lessons and quizzes.
- **Resources**: Downloadable course materials.

### 🛡 Admin & Staff Dashboard
- **Product Management**: Create, update, and delete books and courses.
- **Category Management**: Hierarchical categorization for both store and LMS.
- **Order Fulfillment**: Manage customer orders, update statuses, and generate tracking numbers.
- **Content Moderation**: Approve/reject reviews and answer user questions.
- **Site Settings**: Manage global settings like payment charges, social links, and contact info.
- **Gallery Management**: Upload and manage site-wide gallery photos.

---

## ⚙️ Installation & Setup

### Prerequisites
- PHP >= 8.2
- Composer
- Node.js >= 18.x
- NPM / PNPM / Yarn

### 1. Clone the Repository
```bash
git clone https://github.com/your-repo/theenglishchannelbd.git
cd theenglishchannelbd
```

### 2. Backend Setup (Laravel)
```bash
cd backend
composer install

# Copy environment variables
cp .env.example .env

# Generate application key
php artisan key:generate

# Configure Database (Default is SQLite)
# If using SQLite, create the file:
touch database/database.sqlite

# Run Migrations & Seeders
php artisan migrate --seed

# Start the Laravel server
php artisan serve --port=8000
```

### 3. Frontend Setup (Next.js)
```bash
cd ../frontend
npm install

# Copy environment variables
cp .env.example .env

# Start the development server
npm run dev
```

---

## 📡 API Endpoints (Core)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | User authentication | No |
| `GET` | `/api/books` | Fetch all books | No |
| `GET` | `/api/courses` | Fetch all courses | No |
| `GET` | `/api/auth/me` | Get current user profile | Yes |
| `POST` | `/api/orders` | Place a new order | Yes |
| `POST` | `/api/wishlist/toggle` | Toggle book in wishlist | Yes |
| `GET` | `/api/staff/dashboard` | Admin statistics | Yes (Staff) |

---

## 📂 Project Structure

```text
theenglishchannelbd/
├── backend/                # Laravel Application
│   ├── app/                # Core Logic (Models, Controllers, Middleware)
│   ├── database/           # Migrations, Seeders, SQLite DB
│   ├── routes/             # API & Web Routes
│   └── public/             # Public Assets & Uploads
├── frontend/               # Next.js Application
│   ├── src/
│   │   ├── app/            # Pages & Layouts (App Router)
│   │   ├── components/     # Reusable UI Components
│   │   ├── context/        # Global State Providers
│   │   └── lib/            # Utility functions & API Clients
│   └── public/             # Static Assets
└── database/               # SQL Dumps (lumina_books_db.sql)
```

---

## 📄 License

This project is open-sourced software licensed under the [MIT license](LICENSE).
