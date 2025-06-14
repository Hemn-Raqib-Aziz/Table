# User Management Fullstack Application

This is a fullstack user management application built with **React**, **Redux**, and **Tailwind CSS** on the frontend, and **Node.js**, **Express**, **PostgreSQL**, and **express-validator** on the backend. The app allows you to **create**, **read**, **update**, and **delete (CRUD)** user records with robust validation, error handling, modals, and undo toasts.

---

## Table of Contents

- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Installation & Setup](#installation--setup)  
- [Environment Variables](#environment-variables)  
- [Running the Application](#running-the-application)  
- [API Endpoints](#api-endpoints)  
- [Validation](#validation)  
- [Error Handling](#error-handling)  
- [Advanced UI Features](#advanced-ui-features)
- [Notes](#notes)  

---

## Features

- Display a list of users fetched from PostgreSQL
- Add new users with validation rules on required fields
- Update existing users with validation only on changed fields
- Delete users by ID with confirmation
- Show undo toast notifications for both update and delete actions
- Open and close modals for inserting, updating, deleting, and note-taking
- Sort users by `id`, `name`, `email`, `age`, `created_at`, or `updated_at`
- Group users by `country`, `role`, or `is_active`
- Backend validation with `express-validator`
- API protected against invalid IDs and malformed requests
- Frontend powered by React and Redux, styled using Tailwind CSS
- Backend uses connection pooling to PostgreSQL with environment config

---

## Tech Stack

| Layer     | Technology                                         |
|-----------|----------------------------------------------------|
| Frontend  | React, Redux, Tailwind CSS, Axios, React-Select    |
| Backend   | Node.js, Express, PostgreSQL, express-validator, pg|
| Tools     | Vite, Nodemon, dotenv, CORS                        |

---

## Installation & Setup

### Prerequisites

- Node.js (v18+ recommended)
- PostgreSQL database instance running locally or remotely
- npm or yarn package manager

### Backend Setup

1. Clone the repo and navigate to the `/server` folder.
2. Run:

npm install
Create a .env file in /server with your PostgreSQL credentials:

HOST=localhost
USER=your_db_user
PASSWORD=your_db_password
DATABASE=your_db_name
PORT=5432
Start the server:

npm run dev
Frontend Setup
Navigate to the /client folder.

npm install
npm run dev
Open http://localhost:5173 in your browser.

Environment Variables
The backend uses environment variables for the PostgreSQL connection. Make sure your .env includes:

HOST=localhost
USER=your_db_user
PASSWORD=your_db_password
DATABASE=your_db_name
PORT=5432
Running the Application
Backend runs on http://localhost:3000

Frontend runs on http://localhost:5173

The frontend interacts with the backend via REST API calls to /users

API Endpoints
Method	Endpoint	Description	Body / Query Params
GET	/users	Fetch all users	Optional query: sortBy, sortDirection, groupBy
POST	/users	Create a new user	{ name, email, age, country, role, is_active? }
PUT	/users/:id	Update existing user by ID	Any subset of fields to update
DELETE	/users/:id	Delete user by ID	URL param: id

New: Supports GET /users?sortBy=name&sortDirection=asc&groupBy=country

Validation
Validation is performed on both Insert and Update requests using express-validator.

Insert Validation Rules:
name: Required, string, 2–100 characters

email: Required, valid email format, unique

age: Required, integer between 1 and 120

country: Required, string, 2–100 characters

role: Required, one of: user, moderator, admin

is_active: Optional boolean

Update Validation Rules:
Same as insert, but all fields optional and only validated if present.

Error Handling
The API returns detailed error messages for:

400 Bad Request — Validation errors

409 Conflict — Unique constraint violations or foreign key issues

404 Not Found — User not found

500 Internal Server Error — Unhandled backend failures

Advanced UI Features
UI Redux Slice (uiSlice)

Stores modal state: insert, update, delete, note

Manages toast notifications for undoing delete/update

Global state reset with resetUIState()

Undo Toast Notifications

Show "Undo" button after delete or update

Timeout logic using setTimeout and clearTimeout to revert changes

Supports canceling the operation before the timeout completes

Modals System

InsertModal, UpdateModal, DeleteModal, NoteModal components

Each modal uses framer-motion and @headlessui/react for animations and transitions

Sort & Group

Group users by country, role, or is_active

Sort users by id, name, age, email, created_at, updated_at

All handled on backend using dynamic SQL query construction

Notes
The backend uses connection pooling with the pg library

CORS configured for development to accept requests only from http://localhost:5173

Tailwind CSS used for rapid UI design

Redux manages all UI and data states cleanly

You can easily extend the app to include:

Pagination

Filtering/search by name or email

User authentication & roles
