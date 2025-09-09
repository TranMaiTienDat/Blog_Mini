# Blog Platform - Deploy Guide

## 🚀 Deployment Status
- **Frontend**: GitHub Pages (Vite + React)
- **Backend**: Ready for Render/Railway deployment

## 📋 Deploy Steps

### 1. Deploy Backend to Render (Miễn phí)

1. Đăng ký tài khoản tại [render.com](https://render.com)
2. Connect GitHub repository: `https://github.com/TranMaiTienDat/Blog_Mini`
3. Tạo Web Service:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node
4. Thêm Environment Variables:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/blog_mini
   JWT_SECRET=your_super_secret_jwt_key_here
   EMAIL_USER=your_email@gmail.com (optional)
   EMAIL_PASS=your_app_password (optional)
   ```
5. Deploy và copy URL backend (ví dụ: `https://blog-mini-backend.onrender.com`)

### 2. Deploy Frontend to GitHub Pages

1. Vào GitHub repo: Settings → Pages
2. **Source**: chọn "GitHub Actions" (không phải "Deploy from a branch")
3. Thêm Repository Secret:
   - Vào Settings → Secrets and variables → Actions
   - **Name**: `VITE_API_URL`
   - **Secret**: `https://your-backend-url.onrender.com/api`
4. Workflow sẽ tự chạy, sau đó mở: `https://tranmaitiendat.github.io/Blog_Mini/`

### 3. Alternative: Deploy Backend to Railway

1. Đăng ký [railway.app](https://railway.app)
2. Connect GitHub repo: `TranMaiTienDat/Blog_Mini`
3. Deploy from `/backend` folder
4. Thêm environment variables tương tự như Render
5. Copy URL và cập nhật `VITE_API_URL` secret

## 🔗 Live URLs (sau khi deploy)
- **Frontend**: https://tranmaitiendat.github.io/Blog_Mini/
- **Backend**: https://your-backend-domain/api/health
- **Admin**: https://tranmaitiendat.github.io/Blog_Mini/admin
  - Email: admin@test.com
  - Password: password123

## 🛠️ Features
- User authentication & authorization
- Post management with rich text editor
- Comment system with nested replies
- Voting system for posts and comments
- Media upload (images/videos)
- Admin dashboard with analytics
- Tags support
- Responsive design

## 🏗️ Tech Stack
- **Frontend**: React, Redux Toolkit, React Router, Vite
- **Backend**: Node.js, Express, MongoDB, JWT
- **Deployment**: GitHub Pages + Render/Railway
