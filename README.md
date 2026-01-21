# 🍜 Food Reels App

<div align="center">

![Food Reels Banner](https://img.shields.io/badge/Food-Reels-FF6B6B?style=for-the-badge&logo=youtube&logoColor=white)
![Version](https://img.shields.io/badge/version-1.0.0-blue?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)

**Discover delicious homemade food from talented home chefs in your area**

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Tech Stack](#-tech-stack) • [Contributing](#-contributing)

</div>

---

## 📖 About

Food Reels App is a social media platform that connects home chefs with food enthusiasts through short-form video content. Think TikTok meets UberEats, but for discovering authentic homemade cuisine from passionate cooks in your neighborhood.

### 🎯 Why Food Reels?

- **For Home Chefs**: Showcase your culinary creations, build a following, and turn your kitchen into a brand
- **For Food Lovers**: Discover authentic homemade meals, connect with local chefs, and explore diverse cuisines
- **For Communities**: Support local talent and strengthen neighborhood connections through food

---

## ✨ Features

### 👨‍🍳 For Content Creators (Home Chefs)

- **📹 Upload Food Reels**: Share short, engaging videos of your cooking process or finished dishes
- **📍 Location Sharing**: Let food lovers know where to find you
- **🎨 Profile Customization**: Build your brand with a personalized chef profile
- **📊 Analytics Dashboard**: Track views, likes, and engagement on your content
- **💬 Direct Engagement**: Respond to comments and build your community

### 🍽️ For Viewers (Food Enthusiasts)

- **🔥 Infinite Feed**: Scroll through an endless stream of mouth-watering food content
- **❤️ Like & Save**: Show appreciation and bookmark your favorite recipes
- **💬 Comment**: Engage with creators and ask questions
- **🔗 Share**: Spread the love by sharing reels with friends
- **🔍 Discover**: Find chefs and cuisines based on location and preferences
- **👤 Follow System**: Stay updated with your favorite home chefs

### 🌟 Core Features

- **Real-time Updates**: Get instant notifications for new content from followed chefs
- **Search & Filter**: Find specific cuisines, dietary preferences, or locations
- **Responsive Design**: Seamless experience across mobile and desktop devices
- **Secure Authentication**: Protected user accounts with JWT authentication
- **Cloud Storage**: Reliable video hosting and streaming

---

## 🎥 Demo

> **Note**: Add screenshots or a demo video link here

```
coming soon
```

---

## 🚀 Installation

### Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (v5.0 or higher)
- Git

### Clone the Repository

```bash
git clone https://github.com/Aditya7pandey/food-reels-app.git
cd food-reels-app
```

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment variables file
cp .env.example .env

# Update .env with your configuration
# Add MongoDB URI, JWT secret, cloud storage keys, etc.

# Start the development server
npm run dev
```

### Frontend Setup

```bash
# Navigate to frontend directory (open new terminal)
cd frontend

# Install dependencies
npm install

# Create environment variables file
cp .env.example .env

# Update .env with API endpoints

# Start the development server
npm start
```

The application should now be running at:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`

---

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI library for building interactive interfaces
- **Redux Toolkit** - State management
- **React Router** - Navigation and routing
- **Axios** - HTTP client for API requests
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication and authorization
- **Multer** - File upload handling
- **Cloudinary/AWS S3** - Video and image storage

### Additional Tools
- **Socket.io** - Real-time communication
- **Bcrypt** - Password hashing
- **Cors** - Cross-origin resource sharing
- **Dotenv** - Environment variable management

---

## 📁 Project Structure

```
food-reels-app/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/
│   │   ├── utils/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

## 🔑 Environment Variables

### Backend (.env)

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d

# Cloud Storage (Cloudinary example)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Optional: Email Service
EMAIL_SERVICE=gmail
EMAIL_USERNAME=your_email
EMAIL_PASSWORD=your_password
```

### Frontend (.env)

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

---

## 📱 API Documentation

### Authentication Endpoints

```
POST   /api/auth/register          - Register new user
POST   /api/auth/login             - Login user
GET    /api/auth/me                - Get current user
PUT    /api/auth/update            - Update user profile
```

### Reels Endpoints

```
GET    /api/reels                  - Get all reels (with pagination)
GET    /api/reels/:id              - Get single reel
POST   /api/reels                  - Create new reel (chef only)
PUT    /api/reels/:id              - Update reel (owner only)
DELETE /api/reels/:id              - Delete reel (owner only)
POST   /api/reels/:id/like         - Like/unlike reel
POST   /api/reels/:id/comment      - Comment on reel
GET    /api/reels/chef/:chefId     - Get reels by chef
```

### User Endpoints

```
GET    /api/users/:id              - Get user profile
PUT    /api/users/follow/:id       - Follow/unfollow user
GET    /api/users/:id/followers    - Get user followers
GET    /api/users/:id/following    - Get following list
```

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

### Contribution Guidelines

- Write clear, descriptive commit messages
- Follow the existing code style and conventions
- Add tests for new features
- Update documentation as needed
- Be respectful and constructive in discussions

---

## 🐛 Bug Reports & Feature Requests

Found a bug or have a feature idea? Please open an issue on GitHub:

- **Bug Report**: Describe the issue, steps to reproduce, and expected behavior
- **Feature Request**: Explain the feature and why it would be valuable

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

**Aditya Pandey**
- GitHub: [@Aditya7pandey](https://github.com/Aditya7pandey)

---

## 🙏 Acknowledgments

- Thanks to all contributors who have helped shape this project
- Inspired by the power of home cooking and community connection
- Built with ❤️ for food lovers everywhere

---

## 📞 Support

Need help? Reach out through:

- **GitHub Issues**: For bug reports and feature requests
- **Email**: adityapandey18501@gmail.com

---

<div align="center">

**⭐ Star this repository if you find it helpful!**

Made with ❤️ and 🍕

</div>
