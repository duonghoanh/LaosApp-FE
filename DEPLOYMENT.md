# 🚀 Hướng dẫn Deploy & Run

## Yêu cầu

- Node.js 18+
- pnpm 8+
- MongoDB (cho Backend)
- Redis (optional, cho scaled deployment)

## 1️⃣ Setup Backend

```bash
cd LaosApp-BE

# Install dependencies
pnpm install

# Copy và config environment
cp .env.example .env
# Edit .env với MongoDB URI của bạn

# Start MongoDB (nếu local)
# mongod --dbpath /path/to/data

# Run development
pnpm start:dev

# Backend sẽ chạy tại:
# - GraphQL: http://localhost:20251/graphql
# - WebSocket: ws://localhost:20251
```

## 2️⃣ Setup Frontend

```bash
cd LaosApp-FE

# Install dependencies
pnpm install

# Copy và config environment
cp .env.example .env.local
# Đảm bảo URL trỏ đúng Backend

# Run development
pnpm dev

# Frontend sẽ chạy tại: http://localhost:3000
```

## 🎯 Test Flow

### Bước 1: Tạo User

1. Vào http://localhost:3000
2. Click "Create Room"
3. Nhập nickname (ví dụ: "Player1")
4. Click "Join Now"

### Bước 2: Tạo Room

1. Nhập tên room (ví dụ: "My Lucky Room")
2. Click "Create Room"
3. Bạn sẽ được redirect đến room page

### Bước 3: Join Room (Multi-user test)

1. Mở tab mới hoặc incognito
2. Vào http://localhost:3000
3. Click "Join Room"
4. Nhập room code (hiển thị ở tab đầu)
5. Click "Join Room"

### Bước 4: Spin Wheel

1. Host click nút "SPIN THE WHEEL"
2. Tất cả người trong room thấy cùng animation
3. Kết quả xuất hiện đồng thời

### Bước 5: Chat

1. Gửi message trong chat box
2. Tất cả người thấy message realtime
3. React với emoji

## 🐛 Troubleshooting

### Backend không start

```bash
# Check MongoDB
mongosh
# Hoặc
mongo

# Check port 20251
lsof -i :20251
```

### Frontend không connect

```bash
# Check .env.local có đúng URL không
cat .env.local

# Check network trong DevTools Console
# Phải thấy WebSocket connection: ws://localhost:20251
```

### Socket.IO không hoạt động

```bash
# Check CORS trong backend
# File: src/main.ts
# Phải có:
app.enableCors({
  origin: 'http://localhost:3000',
  credentials: true,
});

# Check Socket.IO adapter trong backend
# File: các gateway files
# Phải emit events đúng namespace
```

## 📦 Production Build

### Backend

```bash
cd LaosApp-BE
pnpm build
pnpm start:prod
```

### Frontend

```bash
cd LaosApp-FE
pnpm build
pnpm start
```

## 🌐 Deploy lên Production

### Backend (Render/Railway/AWS)

1. Set environment variables
2. Configure MongoDB Atlas connection
3. Configure Redis (nếu scale)
4. Deploy

### Frontend (Vercel/Netlify)

1. Connect GitHub repo
2. Set environment variables
3. Deploy
4. Update CORS trong Backend

## 🔒 Security Notes

- **Production**: Đổi JWT_SECRET
- **Database**: Dùng MongoDB Atlas với IP whitelist
- **CORS**: Chỉ allow domain thật
- **Rate limiting**: Add rate limiter cho API
- **WebSocket auth**: Validate token trước khi join room

## 📊 Monitoring

- Backend logs: `LaosApp-BE/logs/`
- Frontend: Check Vercel Analytics
- Database: MongoDB Atlas Metrics
- WebSocket: Socket.IO Admin UI (optional)

## 🎨 Customization

### Thay đổi màu sắc wheel

Edit `app/room/[id]/page.tsx`:

```typescript
const DEFAULT_SEGMENTS = [
  { text: "Prize 1", color: "#YOUR_COLOR", weight: 1, order: 0 },
  // ...
];
```

### Thêm segments

Modify số lượng trong DEFAULT_SEGMENTS array

### Thay đổi animation

Edit `components/Wheel.tsx`:

```typescript
transition: {
  duration: 4, // Thời gian quay (giây)
  ease: [0.25, 0.1, 0.25, 1], // Easing function
}
```

## 💡 Tips

- Use Chrome DevTools Network tab để debug WebSocket
- Check Redux DevTools cho Zustand stores
- Use GraphQL Playground để test queries
- Enable verbose logging trong development
