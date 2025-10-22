# 🎡 LuckyRoom Frontend

Next.js frontend cho ứng dụng LuckyRoom - Realtime Multiplayer Wheel of Names.

## 🚀 Cài đặt

```bash
pnpm install
```

## ⚙️ Cấu hình

Tạo file `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:20251
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:20251/graphql
NEXT_PUBLIC_WS_URL=ws://localhost:20251
```

## 🏃 Chạy Development

```bash
pnpm dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem ứng dụng.

## 🏗️ Cấu trúc dự án

```
app/                    # Next.js App Router
  ├── page.tsx         # Trang chủ - Create/Join room
  ├── room/[id]/       # Trang phòng với wheel
  └── layout.tsx       # Layout chính

components/            # React components
  ├── Wheel.tsx        # Component vòng quay
  ├── ChatBox.tsx      # Chat realtime
  ├── ParticipantsList.tsx  # Danh sách người chơi
  └── AuthModal.tsx    # Modal đăng nhập/đăng ký

lib/                   # Utilities
  ├── graphql/         # GraphQL client & queries
  ├── socket/          # Socket.IO client
  └── utils.ts         # Helper functions

hooks/                 # Custom React hooks
  ├── useRoomSocket.ts
  ├── useWheelSocket.ts
  └── useChatSocket.ts

stores/                # Zustand state management
  ├── auth.store.ts
  ├── room.store.ts
  ├── wheel.store.ts
  └── chat.store.ts

types/                 # TypeScript types
  └── index.ts
```

## 🎯 Tính năng đã implement

### ✅ Authentication

- Đăng ký/đăng nhập với nickname
- Lưu access token
- Auto-reconnect Socket.IO

### ✅ Room Management

- Tạo phòng mới
- Join phòng bằng room code
- Realtime danh sách người chơi
- Phân quyền Host/Player/Spectator

### ✅ Wheel

- Canvas-based wheel rendering
- Smooth animation với Framer Motion
- Weighted random selection
- Synchronized spinning across all clients
- Customizable segments (colors, text, weights)

### ✅ Chat

- Realtime messaging
- Emoji reactions
- Auto-scroll to latest message

### ✅ Real-time Events

- Socket.IO integration cho tất cả namespaces:
  - `/room` - Room events
  - `/wheel` - Spin events
  - `/chat` - Chat events

## 🔌 API Integration

### GraphQL Queries

- `register` - Đăng ký user
- `createRoom` - Tạo phòng mới
- `joinRoom` - Join phòng
- `createWheel` - Tạo wheel
- `updateWheel` - Cập nhật wheel
- `spinHistory` - Lịch sử quay
- `statistics` - Thống kê

### Socket.IO Events

#### Room Events

```typescript
socket.emit("joinRoom", { roomId, userId, nickname });
socket.on("participantJoined", callback);
socket.on("participantLeft", callback);
```

#### Wheel Events

```typescript
socket.emit("spin", { roomId, wheelId, seed, spinnerNickname });
socket.on("spinStarted", callback);
socket.on("spinResult", callback);
socket.on("spinEnded", callback);
```

#### Chat Events

```typescript
socket.emit("sendMessage", { roomId, content, nickname });
socket.emit("sendEmoji", { roomId, emoji, nickname });
socket.on("newMessage", callback);
```

## 🎨 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI**: Tailwind CSS
- **Animation**: Framer Motion
- **State Management**: Zustand
- **GraphQL Client**: Apollo Client
- **WebSocket**: Socket.IO Client
- **Icons**: React Icons
- **Notifications**: React Hot Toast
- **Date**: date-fns

## 📦 Build

```bash
pnpm build
pnpm start
```

## 🚧 TODO / Improvements

- [ ] Thêm tính năng edit wheel segments
- [ ] Statistics dashboard
- [ ] Spin history UI
- [ ] Room settings (password, public/private)
- [ ] Responsive mobile optimization
- [ ] Dark mode
- [ ] Multiple wheel templates
- [ ] Export/import wheel configs
- [ ] Sound effects & confetti animations
- [ ] User profiles & avatars

## 📝 Notes

- Đảm bảo Backend đang chạy ở `http://localhost:20251`
- Socket.IO cần cùng origin hoặc cấu hình CORS đúng
- Access token được lưu trong localStorage
- Tất cả lỗi TypeScript về type GraphQL response có thể ignore (do không có codegen)
