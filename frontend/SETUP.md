# Zomato Frontend

A React-based frontend for the Zomato food delivery application.

## Features

- **User Authentication**: Register, login, and logout functionality for users
- **Partner Authentication**: Separate authentication system for food partners
- **User Dashboard**: Browse and view food items with video previews
- **Partner Dashboard**: Upload and manage food items with video content
- **Responsive Design**: Works on desktop and mobile devices
- **Form Validation**: Using Formik and Yup for robust form handling

## Tech Stack

- React 19
- React Router DOM for navigation
- Axios for API calls
- Formik & Yup for form validation
- Vite for build tooling

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Backend server running on `http://localhost:3000`

### Installation

```bash
# Install dependencies
npm install
```

### Running the Application

```bash
# Development mode with hot reload
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## Application Routes

### Public Routes
- `/` - Home page
- `/user/login` - User login
- `/user/register` - User registration
- `/partner/login` - Partner login
- `/partner/register` - Partner registration

### Protected Routes
- `/user/dashboard` - User dashboard (browse food items)
- `/partner/dashboard` - Partner dashboard (manage food items)

## API Endpoints Used

The frontend connects to these backend endpoints:

### User Authentication
- `POST /api/auth/user/register` - Register new user
- `POST /api/auth/user/login` - User login
- `GET /api/auth/user/logout` - User logout

### Partner Authentication
- `POST /api/auth/partner/register` - Register new partner
- `POST /api/auth/partner/login` - Partner login
- `GET /api/auth/partner/logout` - Partner logout

### Food Items
- `GET /api/food/` - Get all food items (User)
- `POST /api/food/` - Create food item with video (Partner)

## Environment Configuration

Make sure your backend is running on `http://localhost:3000`. If using a different URL, update the axios calls in the component files.

## Project Structure

```
frontend/
├── src/
│   ├── pages/
│   │   ├── Home.jsx - Landing page
│   │   ├── Home.css
│   │   ├── UserLogin.jsx - User login page
│   │   ├── UserRegister.jsx - User registration page
│   │   ├── PartnerLogin.jsx - Partner login page
│   │   ├── PartnerRegister.jsx - Partner registration page
│   │   ├── Auth.css - Shared authentication styles
│   │   ├── UserDashboard.jsx - User dashboard
│   │   ├── PartnerDashboard.jsx - Partner dashboard
│   │   └── Dashboard.css - Shared dashboard styles
│   ├── App.jsx - Main app component with routing
│   ├── App.css
│   ├── index.css
│   └── main.jsx - Application entry point
├── package.json
└── vite.config.js
```

## Notes

- Make sure cookies are enabled as authentication uses HTTP-only cookies
- Video uploads are handled via multipart/form-data
- The application uses localStorage to store user/partner information
