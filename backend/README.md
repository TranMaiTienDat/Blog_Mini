# Blog Platform Backend

## Deploy to Render

1. Connect GitHub repo to Render
2. Set these environment variables:
   - PORT: (auto-set by Render)
   - MONGODB_URI: your_mongodb_connection_string
   - JWT_SECRET: your_jwt_secret_key
   - EMAIL_USER: your_email@gmail.com (optional)
   - EMAIL_PASS: your_app_password (optional)

## Deploy to Railway

1. Connect GitHub repo to Railway
2. Set the same environment variables as above

## Local Development

```bash
npm install
npm run dev
```

## Health Check

Visit `/api/health` to verify the server is running.
