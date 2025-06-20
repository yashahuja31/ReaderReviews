Here is a detailed `README.md` file for your Book Review Hub project, covering its functionality, architecture, setup, and usage.

---

# 📚 BookReview Hub

A full-stack web application designed for book lovers to discover, review, and share their thoughts on various books. Users can browse a collection of books, read and write reviews, track books they've read, and manage their profiles. The application also includes administrative functionalities for managing the book catalog.

---

## ✨ Features

* **User Authentication & Authorization:**
    * Secure User Registration and Login.
    * Role-based access control (Admin vs. Regular User).
    * Session management using JSON Web Tokens (JWT).
    * User logout functionality.
* **Book Management:**
    * Browse a paginated list of all available books.
    * View detailed information for each book (title, author, genre, description, cover image, average rating).
    * Admins can add new books to the catalog.
* **Review System:**
    * Submit star ratings and text comments for books.
    * View all reviews for a specific book.
    * Users can only submit one review per book.
    * Average rating of books is automatically updated based on reviews.
* **User Profile:**
    * View personal profile information (name, email).
    * See a list of books they have marked as read.
    * View all their submitted reviews.
    * Update username and password.
* **Admin Panel (Limited):**
    * Admins have access to an "Add New Book" page.
    * (Extendable for book editing/deletion).

---

## 🛠️ Technologies Used

This project is built as a MERN (MongoDB, Express, React, Node.js) stack application.

### Frontend (Client)

* **React:** A JavaScript library for building user interfaces.
* **React Router DOM:** For declarative routing within the React application.
* **Axios:** Promise-based HTTP client for making API requests to the backend.
* **CSS:** For styling components and pages.

### Backend (Server)

* **Node.js:** JavaScript runtime environment.
* **Express.js:** Fast, unopinionated, minimalist web framework for Node.js.
* **MongoDB:** NoSQL database for storing application data.
* **Mongoose:** ODM (Object Data Modeling) library for MongoDB and Node.js.
* **JSON Web Tokens (JWT):** For secure authentication and authorization.
* **Bcryptjs:** For hashing passwords securely.
* **Dotenv:** To load environment variables from a `.env` file.
* **CORS:** Middleware to enable Cross-Origin Resource Sharing.

---

## 📂 Project Structure

The project is organized into `client` (frontend) and `server` (backend) directories, although in your current setup, they appear to be co-located at the root and `server` sub-directory.

```
.
├── src/                      # Frontend React Application
│   ├── components/           # Reusable UI components
│   │   ├── NavigationButtons.jsx  # Navigation links for logged-in users
│   │   └── LogoutButton.jsx       # Button to log out
│   ├── contexts/             # React Context API for global state management
│   │   └── authContext.jsx        # Manages user authentication state
│   ├── pages/                # Individual application pages
│   │   ├── AddBook.jsx            # Form for admin to add new books
│   │   ├── BookDetails.jsx        # Displays single book details and reviews
│   │   ├── BookList.jsx           # Displays a paginated list of books
│   │   ├── Home.jsx               # Landing page with navigation options
│   │   ├── Login.jsx              # User login form
│   │   ├── ProfilePage.jsx        # User profile, read books, reviews, settings
│   │   └── Register.jsx           # User registration form
│   ├── services/             # Frontend API service calls
│   │   ├── authService.js         # API calls related to authentication
│   │   ├── bookService.js         # API calls related to books
│   │   ├── reviewService.js       # API calls related to reviews
│   │   └── userService.js         # API calls related to user profiles
│   ├── App.jsx               # Main React application component
│   └── main.jsx              # Entry point for the React app (ReactDOM render)
|
├── server/                   # Backend Node.js/Express Application
│   ├── controllers/          # Business logic for API endpoints
│   │   ├── authController.js      # Handles user registration and login
│   │   ├── bookController.js      # Handles book-related operations
│   │   ├── reviewController.js    # Handles review-related operations
│   │   └── userController.js      # Handles user profile and read book operations
│   ├── middleware/           # Express middleware functions
│   │   ├── adminMiddleware.js     # Checks if the user is an admin
│   │   └── authMiddleware.js      # Protects routes requiring authentication (JWT verification)
│   ├── models/               # Mongoose schemas for MongoDB collections
│   │   ├── book.js                # Book schema
│   │   ├── review.js              # Review schema
│   │   └── user.js                # User schema
│   ├── routes/               # API routes definitions
│   │   ├── authRoutes.js          # Routes for authentication (login, register)
│   │   ├── bookRoutes.js          # Routes for books
│   │   ├── reviewRoutes.js        # Routes for reviews
│   │   └── userRoutes.js          # Routes for user profiles and read books
│   ├── utils/                # Utility functions
│   │   └── generateToken.js       # Helper for generating JWTs
│   └── server.js             # Main server entry point (Express app setup, DB connection)
|
├── .env.example              # Example environment variables file
├── package.json              # Project dependencies and scripts
└── README.md                 # This file
```

---

## 🚀 Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

* **Node.js & npm/Yarn:** Ensure you have Node.js (v14 or higher recommended) and npm (or Yarn) installed.
    * [Download Node.js](https://nodejs.org/en/download/)
* **MongoDB:** You need a running MongoDB instance. You can either:
    * Install MongoDB locally: [MongoDB Community Edition](https://www.mongodb.com/try/download/community)
    * Use a cloud-hosted solution like MongoDB Atlas: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

### 1. Backend Setup

1.  **Navigate to the server directory:**
    ```bash
    cd server
    ```
2.  **Install backend dependencies:**
    ```bash
    npm install
    # or yarn install
    ```
3.  **Create a `.env` file:** In the `server` directory, create a file named `.env` and add the following environment variables. Replace the placeholder values with your actual details:
    ```env
    MONGO_URI=YOUR_MONGODB_CONNECTION_STRING # e.g., mongodb://localhost:27017/bookreviewhub or your Atlas URI
    JWT_SECRET=A_VERY_STRONG_SECRET_KEY_FOR_JWT # Use a long, random string
    PORT=5000 # Or any preferred port
    ```
    * **`MONGO_URI`**: Your MongoDB connection string. For local MongoDB, it might be `mongodb://localhost:27017/bookreviewhub`. For MongoDB Atlas, get your connection string from the Atlas dashboard.
    * **`JWT_SECRET`**: A secret key used to sign and verify JWTs. Generate a long, random string.
    * **`PORT`**: The port on which your backend server will run.
4.  **Start the backend server:**
    ```bash
    npm start
    # or node server.js
    ```
    The server should start, and you'll see a message like `Server started on port http://localhost:5000` (or your chosen port) and `MongoDB connected`.

### 2. Frontend Setup

1.  **Navigate back to the project root directory:**
    ```bash
    cd ..
    ```
2.  **Install frontend dependencies:**
    ```bash
    npm install
    # or yarn install
    ```
3.  **Create a `.env` file:** In the **root** directory of your project (same level as `src` and `server`), create a file named `.env` (or `.env.local` for Vite) and add the following environment variable:
    ```env
    VITE_API_URL=http://localhost:5000/api # Make sure this matches your backend PORT
    ```
    * **`VITE_API_URL`**: This points to your backend API. Ensure the port matches the `PORT` you set in the `server/.env` file.
4.  **Start the frontend development server:**
    ```bash
    npm run dev
    # or yarn dev
    ```
    This will start the React development server, usually on `http://localhost:5173` (or a similar port). Your browser should automatically open the application.

---

## 👩‍💻 Usage

1.  **Register:** If you're a new user, navigate to the `/register` page to create an account.
2.  **Login:** Existing users can log in via the `/login` page.
3.  **Browse Books:** After logging in (or even as a guest), you can view all books on the `/books` page.
4.  **View Details & Review:** Click on any book to see its details and read existing reviews. If logged in, you can add your own review.
5.  **User Profile:** Access your profile via `/profilepage` to see your read books, reviews, and update your details.
6.  **Admin Functions:** If you register as an admin (e.g., manually set `isAdmin: true` in your MongoDB user document), you will see an option to "Add New Book" on the Home page and can access the `/addbook` route.

---

## 📝 License

(Add your license information here, e.g., MIT, Apache, etc.)

---
