# Blog Mini Platform

A modern blog platform built with React.js and Node.js, featuring complete blogging functionality.

## ✨ Features

### 🔐 Authentication & Authorization
- User registration/login
- Admin and User roles
- JWT Authentication
- Editable user profiles

### 📝 Post Management
- Create/Edit/Delete posts
- Rich text editor
- Admin can manage all posts
- Users can only manage their own posts

### 💬 Comment System
- Comments on each post
- Nested comment replies
- Admin can delete any comment

### 👍 Voting System
- Upvote/Downvote for posts
- Upvote/Downvote for comments
- Aggregate score display
- User vote status tracking

## 🛠️ Tech Stack

### Frontend
- **React.js 18** - UI Library
- **Redux Toolkit** - State Management
- **React Router** - Navigation
- **Axios** - HTTP Client
- **Vite** - Build Tool

### Backend
- **Node.js** - Runtime
- **Express.js** - Web Framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password Hashing

## 🚀 Installation & Setup

### Prerequisites
- Node.js >= 16
- MongoDB Atlas account or local MongoDB

### Backend Setup
```bash
cd backend
npm install
npm start
```

### Frontend Setup
```bash
cd blog-mini
npm install
npm run dev
```

## 📁 Project Structure

```
Blog Platform/
├── backend/                 # Node.js + Express API
│   ├── models/             # MongoDB Models
│   ├── routes/             # API Routes
│   ├── middleware/         # Custom Middleware
│   └── server.js           # Entry Point
├── blog-mini/              # React Frontend
│   ├── src/
│   │   ├── components/     # React Components
│   │   ├── pages/          # Page Components
│   │   ├── features/       # Redux Slices
│   │   ├── services/       # API Services
│   │   └── styles.css      # Global Styles
│   └── package.json
└── README.md
```

## 🔧 Configuration

### Environment Variables (Backend)
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

### Environment Variables (Frontend)
```env
VITE_API_URL=http://localhost:5000/api
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get user info
- `PUT /api/auth/profile` - Update profile

### Posts
- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get post details
- `POST /api/posts` - Create post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post

### Comments
- `GET /api/comments/post/:postId` - Get post comments
- `POST /api/comments` - Create comment
- `PUT /api/comments/:id` - Update comment
- `DELETE /api/comments/:id` - Delete comment

### Votes
- `POST /api/votes` - Vote on post/comment
- `GET /api/votes/:targetType/:targetId` - Get vote info

## 👨‍💻 Author

**Tran Mai Tien Dat**
- GitHub: [@TranMaiTienDat](https://github.com/TranMaiTienDat)

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Contact

If you have any questions, please feel free to create an issue in this repository.
