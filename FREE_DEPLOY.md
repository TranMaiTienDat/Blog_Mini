# 🚀 Deploy Backend Miễn Phí - GitHub Compatible

## ⚠️ Lưu ý quan trọng
GitHub Pages chỉ host static files, không chạy được Node.js backend. Để có backend đầy đủ chức năng, bạn cần deploy ở nơi khác.

## 🆓 Các tùy chọn miễn phí 100%:

### 1. Render (Khuyên dùng nhất)
- **Ưu điểm**: Dễ setup, auto-deploy từ GitHub, 750h/tháng miễn phí
- **Setup**: 
  1. Vào [render.com](https://render.com)
  2. Connect GitHub repo: `TranMaiTienDat/Blog_Mini`  
  3. Root directory: `backend`
  4. Build: `npm install`, Start: `npm start`

### 2. Railway
- **Ưu điểm**: $5 credit miễn phí/tháng, deploy nhanh
- **Setup**: [railway.app](https://railway.app) → Connect GitHub

### 3. Cyclic (Đóng cửa - không dùng được)

### 4. Vercel (Serverless)
- **Ưu điểm**: Unlimited bandwidth, fast
- **Hạn chế**: Cần chuyển đổi sang serverless functions

### 5. Netfiy Functions
- **Ưu điểm**: Tích hợp tốt với frontend
- **Hạn chế**: Cần refactor code

## 🔧 Setup nhanh với Render (2 phút):

1. **Tạo tài khoản Render**:
   ```
   https://render.com/register
   ```

2. **Connect GitHub**:
   - New → Web Service
   - Connect repository: Blog_Mini
   - Root Directory: backend

3. **Environment Variables**:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/blog_mini
   JWT_SECRET=your_super_secret_key_here_make_it_long_and_random
   ```

4. **Deploy & Copy URL**:
   - Sau khi deploy xong, copy URL (dạng: `https://blog-mini-abc123.onrender.com`)
   - Thêm vào GitHub Secret: `VITE_API_URL = https://blog-mini-abc123.onrender.com/api`

## 🎯 Kết quả:
- Frontend: https://tranmaitiendat.github.io/Blog_Mini/
- Backend: https://your-app.onrender.com/api
- Toàn bộ miễn phí!

## 📱 Alternative: Mock Backend (tạm thời)
Nếu chỉ muốn demo frontend, có thể dùng static JSON files trên GitHub Pages.
