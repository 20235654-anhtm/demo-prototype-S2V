# Tổng Quan Kiến Trúc Vbee AIVoice Demo (AI Content Studio)

## 1. Giới thiệu hệ thống
Trang web `https://vbee-aivoice-demo.vercel.app` (dự án gốc **AI Content Studio** - `@figma/my-make-file` / `@vbee-holding`) là một nền tảng biên tập video trực tuyến tích hợp trí tuệ nhân tạo (AI Video & Voiceover Studio), chuyên sâu về lồng tiếng video tự động, bóc tách phụ đề tiếng Việt (Speech-to-Text) và đồng bộ âm thanh đa luồng.

Ứng dụng được thiết kế theo phong cách giao diện hiện đại kết hợp giữa **CapCut / Descript** (biên tập văn bản sinh ra video) và **Premiere / DaVinci** (thanh timeline đa track trực quan).

---

## 2. Ngăn xếp công nghệ (Technology Stack)

### 2.1. Frontend Web Client
* **Framework:** React 18, TypeScript, Vite.
* **Định tuyến (Routing):** `react-router` (v6/v7) với 2 màn hình chính:
  * `/`: `ProjectListPage` (Dashboard danh sách dự án, tạo dự án mới).
  * `/project/:id` (hoặc `/projects/:id`): `ProjectDetailPage` (All-in-one Studio Editor).
* **Giao diện & Styling:** Tailwind CSS, Lucide React icons, Material-UI Rounded icons (`@mui/icons-material`), `react-resizable-panels` (chia tỷ lệ các cột linh hoạt).
* **Quản lý danh sách lớn:** `VirtualizedBlockList` (render ảo hóa danh sách hàng trăm đoạn thoại mà không làm chậm DOM).
* **Xử lý âm thanh trình duyệt:** Web Audio API (`AudioContext`, `GainNode` đa luồng để chuẩn hóa âm lượng LUFS, tách riêng luồng TTS, luồng video và luồng nhạc nền BGM).
* **Render phụ đề trực tiếp:** Canvas 2D engine tích hợp từ package độc quyền `@vbee-holding/video-renderer`, đồng bộ frame-by-frame qua `requestAnimationFrame`.
* **Analytics & Phân tách thử nghiệm:** PostHog Analytics (`posthog-js/react`) kiểm thử A/B testing tính năng Export (`EXPERIMENTS.EXPORT_CTA`).

### 2.2. Backend Services (FastAPI Server)
* **Ngôn ngữ & Framework:** Python 3.12+, FastAPI, Uvicorn.
* **Xử lý đa phương tiện:** `ffmpeg` và `ffprobe` (trích xuất metadata, đo âm lượng chuẩn EBU R128 qua filter `loudnorm`, ghép nối video).
* **Mô hình Speech-to-Text (STT) ngoại tuyến:** `sherpa-onnx` (mô hình nhận diện giọng nói tiếng Việt chạy trực tiếp trên server, không phụ thuộc API bên thứ 3).
* **Hệ thống tổng hợp giọng nói (Text-to-Speech - TTS):**
  * **Vbee TTS API (Primary):** Tích hợp trực tiếp cổng API `https://dev.vbee.vn/api/v1/tts` với cơ chế bất đồng bộ song song: *Race pattern* giữa Webhook Callback (`/api/tts/callback`) và Polling fallback (`GET /api/v1/tts/{id}`).
  * **Edge-TTS (Fallback):** Dự phòng qua Microsoft Edge Neural TTS (`vi-VN-NamMinhNeural`, `vi-VN-HoaiMyNeural`).
  * **Bộ nhớ đệm (Caching):** Tính toán mã băm nội dung `content_hash(text, voice, speed)` để cache file âm thanh `.mp3` tại `data/uploads/audios/`, tránh gọi API lặp lại.

### 2.3. Desktop Companion Agent (Vbee Studio Plugin)
* **Công nghệ:** Headless Electron App.
* **Giao thức kết nối:** Deep link URL Scheme `vbeestudio://` và giao tiếp qua Loopback HTTP nội bộ trên máy người dùng (`http://127.0.0.1`).
* **Mục đích:** Giải phóng giới hạn tài nguyên của server cloud (tránh timeout khi xuất video dài 4K/1080p 60fps), cho phép render offline ngay trên GPU máy người dùng.

---

## 3. Kiến trúc luồng dữ liệu (Architecture Overview)

```
+-------------------------------------------------------------------------+
|                        FRONTEND CLIENT (React 18)                       |
|                                                                         |
|  [ProjectListPage]                     [ProjectDetailPage Studio]      |
|  - Danh sách dự án                     - Cột trái: Voiceover Blocks     |
|  - Upload Video Modal                  - Cột giữa: Live Canvas Player   |
|  - Tạo dự án                           - Cột dưới: Multi-track Timeline |
+-------------------------------------------------------------------------+
       |                                          |
       | REST API (/api/projects, /api/upload)   | REST API & SSE
       v                                          v
+-------------------------------------------------------------------------+
|                        BACKEND SERVER (FastAPI)                         |
|                                                                         |
|  /api/upload       --> Lưu video gốc vào data/uploads/videos/           |
|  /api/transcribe   --> Tách thoại tự động bằng sherpa-onnx              |
|  /api/tts          --> Gọi Vbee API (Race Callback + Poll) & Cache S3   |
|  /api/export       --> Điều phối Render CLI qua ffmpeg trên server      |
|  /api/loudness     --> Đo âm lượng EBU R128 chuẩn hóa GainNode          |
+-------------------------------------------------------------------------+
       |                                          |
       v                                          v
+-----------------------------+       +-----------------------------------+
|       VBEE CLOUD TTS        |       |   ELECTRON COMPANION AGENT        |
|  https://dev.vbee.vn/api/v1 |       |   (Local render qua vbeestudio://)|
+-----------------------------+       +-----------------------------------+
```
