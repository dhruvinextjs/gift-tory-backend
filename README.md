# 🎁 Gifttory — Full Backend (Node + Express + EJS + Mongoose)

Complete backend for a gift e-commerce platform (inspired by gift-tory-main.vercel.app), featuring:

- **User REST API** — auth, products, categories, occasions, cart, orders, reviews, wishlist, blog, contact, bulk-order & newsletter
- **Admin REST API** — full CRUD for every module, JWT protected
- **Admin Panel (EJS)** — a complete, professional, server-rendered dashboard to manage the entire store
- **Image uploads** via Multer, organized per module (`/uploads/products`, `/uploads/categories`, etc.)
- Clean, scalable **MVC folder structure** with `user`/`admin` split at both the controller and route level

---

## 📁 Folder Structure

```
gifttory-backend/
├── server.js                  # App entry point
├── package.json
├── .env.example                # Copy to .env and fill in your values
│
├── config/
│   └── db.js                  # MongoDB connection
│
├── models/                    # Mongoose schemas
│   ├── user.model.js
│   ├── admin.model.js
│   ├── product.model.js
│   ├── category.model.js
│   ├── occasion.model.js
│   ├── cart.model.js
│   ├── order.model.js
│   ├── review.model.js
│   ├── testimonial.model.js
│   ├── blog.model.js
│   ├── banner.model.js
│   ├── contact.model.js
│   ├── bulkOrder.model.js
│   ├── newsletter.model.js
│   └── coupon.model.js
│
├── controllers/
│   ├── user/                  # Controllers for the public/user-facing API
│   │   ├── auth.controller.js
│   │   ├── product.controller.js
│   │   ├── category.controller.js
│   │   ├── occasion.controller.js
│   │   ├── cart.controller.js
│   │   ├── order.controller.js
│   │   ├── review.controller.js
│   │   ├── testimonial.controller.js
│   │   ├── blog.controller.js
│   │   ├── contact.controller.js
│   │   ├── bulkOrder.controller.js
│   │   ├── newsletter.controller.js
│   │   └── home.controller.js
│   │
│   └── admin/                 # Controllers for Admin Panel (EJS) + Admin API
│       ├── auth.controller.js
│       ├── dashboard.controller.js
│       ├── product.controller.js
│       ├── category.controller.js
│       ├── occasion.controller.js
│       ├── order.controller.js
│       ├── user.controller.js
│       ├── review.controller.js
│       ├── testimonial.controller.js
│       ├── blog.controller.js
│       ├── banner.controller.js
│       ├── contact.controller.js
│       ├── bulkOrder.controller.js
│       └── coupon.controller.js
│
├── routes/
│   ├── user/                  # Mounted at /api/user
│   │   ├── auth.routes.js
│   │   ├── product.routes.js
│   │   ├── category.routes.js
│   │   ├── occasion.routes.js
│   │   ├── cart.routes.js
│   │   ├── order.routes.js
│   │   ├── review.routes.js
│   │   ├── testimonial.routes.js
│   │   ├── blog.routes.js
│   │   ├── contact.routes.js
│   │   ├── bulkOrder.routes.js
│   │   ├── newsletter.routes.js
│   │   ├── home.routes.js
│   │   └── index.js
│   │
│   └── admin/
│       ├── viewRoutes.js      # Admin Panel (EJS) — mounted at /admin
│       ├── auth.routes.js     # Admin REST API      — mounted at /api/admin
│       ├── dashboard.routes.js
│       ├── product.routes.js
│       ├── category.routes.js
│       ├── occasion.routes.js
│       ├── order.routes.js
│       ├── user.routes.js
│       ├── review.routes.js
│       ├── testimonial.routes.js
│       ├── blog.routes.js
│       ├── banner.routes.js
│       ├── contact.routes.js
│       ├── bulkOrder.routes.js
│       ├── coupon.routes.js
│       └── index.js
│
├── middlewares/
│   ├── auth.middleware.js         # protectUser / optionalUser (JWT)
│   ├── adminAuth.middleware.js    # requireAdminSession + protectAdmin (JWT)
│   ├── multer.middleware.js       # per-module image upload factory
│   └── error.middleware.js        # global error + 404 handler
│
├── utils/
│   ├── catchAsync.js
│   ├── ApiError.js
│   ├── ApiResponse.js
│   ├── apiFeatures.js         # search / filter / sort / paginate
│   └── generateToken.js
│
├── views/admin/               # EJS templates for the Admin Panel
│   ├── layout/ (main.ejs, sidebar.ejs)
│   ├── login.ejs
│   ├── dashboard.ejs
│   ├── products/ (list, add, edit)
│   ├── categories/ (list, add, edit)
│   ├── occasions/ (list, add, edit)
│   ├── orders/ (list, detail)
│   ├── users/ (list)
│   ├── reviews/ (list)
│   ├── testimonials/ (list, add, edit)
│   ├── blogs/ (list, add, edit)
│   ├── banners/ (list, add)
│   ├── enquiries/ (contact, bulkOrder)
│   └── coupons/ (list, add)
│
├── public/admin/              # Static assets for the Admin Panel
│   ├── css/style.css          # Custom design system (rose + gold gift theme)
│   └── js/script.js
│
├── uploads/                   # Uploaded images (served at /uploads/*)
│   ├── products/  categories/  occasions/  banners/  blogs/  testimonials/
│
└── seed/
    └── seed.js                # Creates default admin + sample categories/occasions/testimonials
```

---

## 🚀 Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment variables
```bash
cp .env.example .env
```
Edit `.env` and set your own values, especially:
- `MONGO_URI` — your MongoDB connection string
- `JWT_SECRET` / `SESSION_SECRET` — long random strings
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — credentials for the default admin account

### 3. Seed the database (creates default admin + sample data)
```bash
npm run seed
```
This creates an admin account using `ADMIN_EMAIL` / `ADMIN_PASSWORD` from `.env`
(defaults to `admin@gifttory.com` / `Admin@123`).

### 4. Start the server
```bash
npm run dev     # with nodemon (auto-restart)
# or
npm start
```

The server starts on `http://localhost:5000` by default.

- **Admin Panel:** http://localhost:5000/admin/login
- **User API base:** http://localhost:5000/api/user
- **Admin API base:** http://localhost:5000/api/admin
- **Health check:** http://localhost:5000/api/health

---

## 🔑 Authentication

| Area | Mechanism | Notes |
|---|---|---|
| User API | JWT — `Bearer` header or `token` cookie | Set on register/login |
| Admin Panel (EJS) | Session (`express-session`) | Login at `/admin/login` |
| Admin REST API | JWT — `Bearer` header or `adminToken` cookie | Login via `POST /api/admin/auth/login` |

---

## 📚 Key User API Endpoints (`/api/user`)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Login |
| GET | `/auth/me` | Get profile (protected) |
| GET | `/home` | Aggregated homepage data (banners, categories, best sellers...) |
| GET | `/products` | List products — supports `search`, `category`, `occasion`, `minPrice`, `maxPrice`, `sort`, `page`, `limit`, `isTrending`, `isFeatured`, etc. |
| GET | `/products/:slug` | Product detail |
| POST | `/products/:id/wishlist` | Toggle wishlist (protected) |
| GET / POST / PUT / DELETE | `/cart` | Cart management (protected) |
| POST | `/orders` | Checkout / place order (protected) |
| GET | `/orders` | My orders (protected) |
| GET / POST | `/reviews/:productId` | Product reviews |
| GET | `/testimonials` | Homepage testimonials |
| GET | `/blog` | Blog listing |
| POST | `/contact` | Contact us form |
| POST | `/bulk-order` | Bulk / corporate order enquiry |
| POST | `/newsletter` | Newsletter subscribe |

## 📚 Key Admin API Endpoints (`/api/admin`)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/login` | Admin login (returns JWT) |
| GET | `/dashboard/stats` | Dashboard statistics |
| CRUD | `/products` | Manage products (multipart image upload) |
| CRUD | `/categories`, `/occasions` | Manage catalog taxonomy |
| GET / PUT | `/orders` | View & update order status |
| GET / PUT / DELETE | `/users` | Manage customers (block/unblock) |
| GET / PUT / DELETE | `/reviews` | Moderate reviews |
| CRUD | `/testimonials`, `/blogs`, `/banners` | Manage site content |
| GET / PUT / DELETE | `/contact`, `/bulk-order` | Manage enquiries |
| CRUD | `/coupons` | Manage discount coupons |

All list endpoints support pagination via `?page=&limit=`.

---

## 🖥️ Admin Panel

A complete, professional dashboard (no separate frontend framework needed — pure EJS + vanilla JS):

- **Dashboard** — revenue, order/user/product counts, recent orders, low-stock alerts
- **Products** — add/edit/delete with multi-image upload, flags (trending, featured, best seller, personalized, corporate, same-day delivery)
- **Categories & Occasions** — image-based taxonomy management
- **Orders** — status pipeline (placed → confirmed → processing → shipped → out for delivery → delivered / cancelled)
- **Customers** — search, block/unblock
- **Reviews** — approve/hide/delete
- **Testimonials, Blog, Banners** — full content management
- **Enquiries** — Contact Us & Bulk/Corporate order leads with status tracking
- **Coupons** — percentage/flat discount codes with usage limits & expiry

Design: a warm, gift-shop inspired palette (rose `#d94f6e` + gold `#e0a63c` ribbon accent) — distinct from a generic blue/purple admin template.

---

## 🗃️ Image Uploads

Handled via a reusable Multer factory (`middlewares/multer.middleware.js`) — each module gets its own folder:

```
uploads/products/       (up to 6 images per product)
uploads/categories/
uploads/occasions/
uploads/banners/
uploads/blogs/
uploads/testimonials/
```

Files are served statically at `/uploads/<folder>/<filename>` and are automatically deleted from disk when their parent record is deleted or its image is replaced.

---

## 🛠️ Tech Stack

- **Runtime:** Node.js + Express 4
- **Database:** MongoDB + Mongoose 8
- **Views:** EJS + express-ejs-layouts (Admin Panel)
- **Auth:** JWT (`jsonwebtoken`) for APIs, `express-session` for the Admin Panel
- **Uploads:** Multer
- **Security/UX:** bcryptjs (password hashing), connect-flash (panel alerts), method-override

---

## 📝 Notes

- All list/search endpoints use the shared `ApiFeatures` utility (search, filter, sort, pagination).
- All controllers use `catchAsync` — no repetitive try/catch blocks; errors flow to the centralized error handler.
- Responses follow a consistent shape: `{ success, statusCode, message, data }` via `ApiResponse` / `ApiError`.
- Update `sample images` referenced by the seed script (`placeholder-category.png` etc.) with real images through the Admin Panel after first login.
