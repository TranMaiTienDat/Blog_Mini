# Blog Mini Platform

Một nền tảng blog mini được xây dựng với React.js và Node.js, hỗ trợ đầy đủ tính năng blog hiện đại.

## ✨ Tính năng

### 🔐 Xác thực & Phân quyền
- Đăng ký/Đăng nhập người dùng
- Phân quyền Admin và User
- JWT Authentication
- Profile người dùng có thể chỉnh sửa

### 📝 Quản lý Bài viết
- Tạo/Sửa/Xóa bài viết
- Rich text editor
- Admin có thể quản lý tất cả bài viết
- User chỉ quản lý bài viết của mình

### 💬 Hệ thống Bình luận
- Bình luận trên từng bài viết
- Phản hồi bình luận (nested comments)
- Admin có thể xóa mọi bình luận

### 👍 Voting System
- Upvote/Downvote cho bài viết
- Upvote/Downvote cho bình luận
- Hiển thị điểm tổng hợp
- Trạng thái vote của user

## 🛠️ Công nghệ sử dụng

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

## 🚀 Cài đặt và Chạy

### Yêu cầu
- Node.js >= 16
- MongoDB Atlas account hoặc MongoDB local

### Backend
```bash
cd backend
npm install
npm start
```

### Frontend
```bash
cd blog-mini
npm install
npm run dev
```

## 📁 Cấu trúc Project

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

## 🔧 Cấu hình

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
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/me` - Thông tin user
- `PUT /api/auth/profile` - Cập nhật profile

### Posts
- `GET /api/posts` - Lấy danh sách bài viết
- `GET /api/posts/:id` - Chi tiết bài viết
- `POST /api/posts` - Tạo bài viết
- `PUT /api/posts/:id` - Cập nhật bài viết
- `DELETE /api/posts/:id` - Xóa bài viết

### Comments
- `GET /api/comments/post/:postId` - Bình luận của bài viết
- `POST /api/comments` - Tạo bình luận
- `PUT /api/comments/:id` - Cập nhật bình luận
- `DELETE /api/comments/:id` - Xóa bình luận

### Votes
- `POST /api/votes` - Vote cho bài viết/bình luận
- `GET /api/votes/:targetType/:targetId` - Thông tin vote

## 👨‍💻 Tác giả

**Trần Mai Tiến Đạt**
- GitHub: [@TranMaiTienDat](https://github.com/TranMaiTienDat)

## 📄 License

MIT License - xem file [LICENSE](LICENSE) để biết thêm chi tiết.

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Hãy tạo issue hoặc pull request.

1. Fork project
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📞 Liên hệ

Nếu có câu hỏi, hãy tạo issue trong repository này.
