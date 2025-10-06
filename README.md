This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started
figma https://www.figma.com/design/i8oNBNCxECTtOV5QpEebAb/iLucky-LaosApp-Final?t=zrodURtr084OSw6D-0
First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

# 🎡 LuckyRoom – Realtime Multiplayer Wheel of Names

**LuckyRoom** là ứng dụng vòng quay may mắn (Wheel of Names) mở rộng với khả năng **chơi realtime nhiều người**, **tùy chỉnh tỉ lệ trúng thưởng**, và **đồng bộ kết quả giữa tất cả người chơi trong phòng**.  
Ứng dụng được thiết kế theo mô hình **microservice realtime**, sử dụng **NestJS + Socket.IO + Redis** ở backend và **Next.js + Canvas/SVG animation** ở frontend.

---

## 🚀 Mục tiêu dự án
Tạo một nền tảng cho phép người dùng:
- 🎯 Tạo phòng (room) riêng để quay vòng cùng bạn bè hoặc đồng nghiệp.  
- 🧑‍🤝‍🧑 Mời người khác tham gia qua link hoặc mã phòng.  
- ⚡ Xem kết quả quay realtime, đồng bộ giữa tất cả người trong nhóm.  
- ⚙️ Cấu hình bánh xe: thêm/xóa ô, đổi màu, chọn biểu tượng, đặt **tỉ lệ xác suất** cho từng giá trị.  
- 🏆 Lưu lịch sử quay, thống kê kết quả và chia sẻ công khai.  

---

## 🧩 Kiến trúc tổng thể

Frontend (Next.js) ←→ Socket.IO Gateway (NestJS) ←→ Redis Pub/Sub
↓
PostgreSQL Database

**Frontend:**
- Next.js (App Router)
- Zustand / React Query / Socket.IO client
- Canvas hoặc SVG-based animation cho vòng quay
- Responsive (desktop, tablet, mobile)

**Backend:**
- NestJS (WebSocket Gateway)
- TypeORM (PostgreSQL)
- Redis Adapter cho Socket.IO
- Weighted random engine (cấu hình xác suất trúng)
- Seed đồng bộ để tất cả client quay cùng góc

---

## ⚙️ Tính năng chính

### 👥 Quản lý người dùng & nhóm
- Tạo phòng (room) với mã riêng hoặc link chia sẻ.  
- Join bằng nickname hoặc Google login (tùy chọn).  
- Phân quyền: Host, Player, Spectator.  
- Danh sách người chơi realtime (ai đang online / offline).  

### 🎡 Vòng quay realtime
- Khi Host bấm “Spin”, tất cả client đều thấy vòng quay quay **giống nhau**.  
- Kết quả được xác định bằng **seed random + weighted probability**.  
- Mỗi ô có thể đặt **trọng số** để thay đổi tỉ lệ thắng.  
- Animation mượt, hiệu ứng âm thanh & pháo hoa.  

### 📜 Lịch sử & thống kê
- Lưu tất cả kết quả quay, người quay, thời gian.  
- Thống kê tỷ lệ thắng của từng giá trị.  
- Cho phép export kết quả sang CSV hoặc chia sẻ link công khai.  

### 💬 Tương tác trong phòng
- Chat realtime, emoji reaction.  
- Hiển thị sự kiện: người vào phòng, bắt đầu quay, kết quả.  

---

## 🗂 Cấu trúc dữ liệu (schema chính)

### `users`
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | User ID |
| name | varchar | Nickname |
| avatar_url | varchar | Optional |
| created_at | timestamptz | |

### `rooms`
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Room ID |
| name | varchar | Room name |
| owner_id | UUID | Host |
| status | enum('ACTIVE','ENDED') | |
| created_at | timestamptz | |

### `wheel_items`
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | |
| room_id | UUID | |
| label | varchar | Text on wheel |
| color | varchar | Segment color |
| weight | float | Win probability weight |
| icon_url | varchar | Optional |

### `spins`
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | |
| room_id | UUID | |
| user_id | UUID | Who pressed spin |
| seed | bigint | Shared random seed |
| result_item_id | UUID | Winning segment |
| created_at | timestamptz | |

### `chat_messages`
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | |
| room_id | UUID | |
| user_id | UUID | |
| message | text | |
| created_at | timestamptz | |

---

## 🔄 Luồng hoạt động realtime

1️⃣ **Host tạo phòng** → backend lưu room & emit event `room:created`.  
2️⃣ **Người khác join** → thêm vào Redis list, emit `room:joined`.  
3️⃣ **Host cập nhật bánh xe** → emit `wheel:updated` đến mọi người.  
4️⃣ **Host nhấn “Spin”**:
   - Backend sinh seed & tính kết quả theo weighted random.
   - Lưu vào DB.
   - Emit `spin:start` đến tất cả client với `{ seed, result }`.
   - Mọi client quay cùng animation, cùng kết quả.  
5️⃣ **Sau khi kết thúc**, client emit `spin:done` → server lưu log.  

---

## 🧠 Weighted Random Logic

Thuật toán đơn giản:

```ts
function weightedRandom(items) {
  const total = items.reduce((s, i) => s + i.weight, 0);
  let r = Math.random() * total;
  for (const item of items) {
    r -= item.weight;
    if (r <= 0) return item;
  }
}
Khi host quay:

Server chọn 1 seed = randomInt(1, 1e9)

Từ seed, server → result.

Gửi { seed, result } cho mọi client.

Client dùng cùng seed để đồng bộ góc quay → kết quả giống nhau 100%.

🧰 Công nghệ sử dụng
Thành phần	Công nghệ
Frontend	Next.js, Tailwind, Zustand, Socket.IO client
Backend	NestJS, TypeORM, Socket.IO Gateway, Redis
Database	PostgreSQL
Cache / PubSub	Redis
Containerization	Docker Compose
Deployment	AWS EC2 / Render / Railway
🧩 Lộ trình phát triển
Phiên bản	Mô tả
v1.0	Tạo & join phòng, quay realtime, weighted probability
v1.1	Chat realtime, lịch sử kết quả
v1.2	Nhiều chế độ quay (Elimination, Auto-Spin)
v1.3	Auth (Google/Discord), avatar, public rooms
v1.4	Admin dashboard + thống kê
v1.5	API/iframe embed, theme tùy chỉnh, đa ngôn ngữ
``
