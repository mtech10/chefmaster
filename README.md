# 👨‍🍳 ChefMaster

ChefMaster is a full-stack, responsive web application that allows culinary enthusiasts to discover, create, share, and manage their favorite recipes. Built with React, Node.js, Express, and PostgreSQL, it features a modern UI, secure JWT authentication, and seamless cloud image hosting via Cloudinary.

## ✨ Features

- **User Authentication:** Secure signup and login using `bcryptjs` for password hashing and `jsonwebtoken` (JWT) for session management.
- **Recipe Management:** Complete CRUD (Create, Read, Update, Delete) functionality for recipes.
- **Cloud Image Uploads:** Direct, secure image uploading and storage via Cloudinary and Multer.
- **Interactive Dashboard:** Users can manage their published recipes and edit them seamlessly.
- **Favorites System:** Users can easily bookmark ("heart") and curate a personalized list of their favorite recipes.
- **Responsive Design:** Fully optimized for both desktop and mobile viewing with interactive sidebars and scalable CSS grid layouts.

## 🛠️ Tech Stack

**Frontend:**

- React (Vite)
- React Router DOM (Navigation)
- Custom Vanilla CSS (Fully responsive)

**Backend:**

- Node.js & Express.js
- PostgreSQL (Supabase)
- `pg` (node-postgres)

**Middlewares & Tools:**

- **Cloudinary / Multer:** Image uploading & cloud storage
- **JWT:** Authentication
- **Bcrypt.js:** Password encryption
- **CORS:** Cross-origin resource sharing management

---

## 🚀 Getting Started (Local Development)

Follow these instructions to set up the project on your local machine.

### 1. Clone the repository

    git clone https://github.com/mtech10/chefmaster.git
    cd chefmaster

### 2. Install Dependencies

Because both the frontend and backend share the root directory, simply run this to install all required packages:

    npm install

### 3. Environment Variables

Create a `.env` file in the root directory and add the following keys. **Never commit this file to GitHub.**

    # Server
    PORT=3000
    SECRET_KEY=your_jwt_secret_key

    # Database (Supabase/PostgreSQL)
    DATABASE_URL=postgres://username:password@host:port/database

    # Cloudinary (Image Hosting)
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret

### 4. Database Setup

Ensure your PostgreSQL database is running and your tables (`users`, `recipes`, `favorites`) are created via your Supabase dashboard or SQL scripts.

### 5. Start the Application

To run the project locally, you will need to start both the backend server and the frontend React app.

**Start the Backend Server:**

    node index.js

**Start the Frontend (in a new terminal):**

    npm run dev

The frontend will be available at `http://localhost:5173` and the backend at `http://localhost:3000`.

---

## 🔗 API Endpoints

### Authentication

- `POST /register` - Register a new user
- `POST /login` - Authenticate user & receive JWT token

### Recipes

- `GET /api/recipes` - Fetch all recipes
- `GET /api/recipes/:id` - Fetch a single recipe by ID
- `POST /api/recipes` - Create a new recipe (Requires Auth & Image Upload)
- `PUT /api/recipes/:id` - Edit a recipe (Requires Auth)
- `DELETE /api/recipes/:id` - Delete a recipe (Requires Auth)

### User Data

- `GET /api/my-recipes` - Fetch recipes authored by the logged-in user
- `GET /api/favorites` - Fetch user's favorite recipes
- `POST /api/favorites/toggle` - Add/Remove a recipe from favorites

---

## 🌐 Deployment

- **Frontend:** Hosted on Render.
- **Backend:** Hosted on Render.
- **Database:** Hosted on Supabase.

## 🛡️ Security Measures Implemented

- API Keys and Secrets hidden via `.env` and excluded via `.gitignore`.
- Password hashing before database insertion.
- Protected routes requiring valid Bearer Tokens.

---

## 📝 License

This project is open-source and available under the MIT License.
