# Chi Tiết API Endpoints, Payloads Dữ Liệu & Giao Thức Backend

Tài liệu này tổng hợp toàn bộ các điểm cuối API (REST Endpoints) mà Vbee AIVoice Demo gọi tới máy chủ Backend (FastAPI) và dịch vụ Vbee Cloud.

---

## 1. BẢNG TỔNG HỢP CÁC API ENDPOINTS

| Endpoint | Method | Chức năng | Tham số / Payload chính | Phản hồi chính (Response) |
|---|---|---|---|---|
| `/api/upload` | `POST` | Tải video/âm thanh gốc lên máy chủ | `FormData`: `file: File` | `{ "url": "/api/uploads/videos/xxx.mp4" }` |
| `/api/transcribe` | `POST` | Tách lời thoại tự động từ video (STT) | Query: `url`, `language=vi` | `{ "segments": [ { "text": "...", "startSeconds": 0, "endSeconds": 2.5 } ] }` |
| `/api/vbee-voices` | `GET` | Lấy danh sách giọng đọc Vbee chính thức | Không có | `{ "result": { "voices": [ { "code": "...", "name": "...", "locale": "northern", ... } ] } }` |
| `/api/vbee-voices/community` | `GET` | Lấy danh sách giọng đọc cộng đồng Vbee | Query: `limit=20`, `cursor`, `search` | `{ "result": { "voices": [...], "next_cursor": "...", "has_next_page": true } }` |
| `/api/tts` | `GET` / `POST` | Sinh âm thanh lồng tiếng từ văn bản | Query/JSON: `text`, `voice`, `speed` | `{ "url": "/api/uploads/audios/{hash}.mp3", "cached": true }` |
| `/api/tts/callback` | `POST` | Webhook nhận kết quả từ Vbee Cloud | Body: `{ "request_id": "...", "status": "SUCCESS", "audio_link": "..." }` | `{ "status": "ok" }` |
| `/api/projects` | `GET` | Lấy danh sách tất cả dự án đã lưu | Không có | `[ { "id": "...", "name": "...", "type": "video", "updatedAt": 1700000000 } ]` |
| `/api/projects` | `POST` | Tạo một dự án mới | Body JSON: `{ "name": "...", "type": "video", "data": {...} }` | `{ "id": "uuid-v4", "name": "...", "data": {...} }` |
| `/api/projects/{id}` | `GET` | Tải dữ liệu chi tiết một dự án | Path: `id` | `{ "id": "...", "name": "...", "data": { "blocks": [...], "mediaBlocks": [...] } }` |
| `/api/projects/{id}` | `PUT` | Lưu cập nhật dự án (AutoSave) | Path: `id`, Body: `{ "data": {...} }` | `{ "status": "success", "updatedAt": 1700000000 }` |
| `/api/projects/{id}` | `DELETE` | Xóa một dự án | Path: `id` | `{ "status": "deleted" }` |
| `/api/loudness` | `POST` | Đo độ lớn chuẩn hóa âm thanh (LUFS) | Body JSON: `{ "url": "/api/uploads/..." }` | `{ "integrated": -16.5, "true_peak": -1.2, "lra": 7.1 }` |
| `/api/export` | `POST` | Khởi tạo tác vụ render video | Body JSON: `ExportPayload` chi tiết | `{ "job_id": "export-uuid", "status": "queued" }` |
| `/api/export/{job_id}` | `GET` | Kiểm tra tiến độ tác vụ render | Path: `job_id` | `{ "status": "processing", "progress": 45, "eta": 15, "url": null }` |

---

## 2. CHI TIẾT CÁC PAYLOAD TRỌNG YẾU

### 2.1. API Lồng tiếng Vbee TTS (`/api/tts`)

#### Luồng xử lý kỹ thuật (Race Pattern):
1. **Kiểm tra Cache:** Tính `content_hash(text, voice_code, speed)`. Nếu file `.mp3` tương ứng đã tồn tại trong thư mục máy chủ, trả về URL ngay lập tức mà không gọi ra bên ngoài.
2. **Gửi lệnh tới Vbee Cloud:** Gửi `POST https://dev.vbee.vn/api/v1/tts` kèm header `Authorization: Bearer VBEE_APP_TOKEN`.
   ```json
   {
     "app_id": "VBEE_APP_ID",
     "text": "Chào mừng bạn đến với Vbee AIVoice Studio",
     "voice_code": "hn_male_manhdung_full_24k-st",
     "speed": 1.0,
     "callback_url": "https://server.domain/api/tts/callback"
   }
   ```
3. **Mô hình đua đồng thời (Race: Webhook vs Polling):**
   * Server mở một `asyncio.Event` chờ webhook callback trả về.
   * Đồng thời kích hoạt vòng lặp `_poll` truy vấn `GET https://dev.vbee.vn/api/v1/tts/{request_id}` định kỳ mỗi `1.0s` (timeout tối đa 120s).
   * Cơ chế nào nhận được kết quả trước sẽ giải phóng kết quả, tải file từ link S3 của Vbee về lưu vào bộ nhớ đệm cục bộ và phản hồi cho client:
     ```json
     {
       "url": "/api/uploads/audios/c8f2a1b94d8e.mp3",
       "duration": 3.45,
       "voice": "hn_male_manhdung_full_24k-st"
     }
     ```

---

### 2.2. API Tách lời thoại tự động (`/api/transcribe`)

* **Yêu cầu (Request):**
  `POST /api/transcribe?url=%2Fapi%2Fuploads%2Fvideos%2Fvideo_01.mp4&language=vi`
* **Xử lý phía Server:**
  1. Dùng `ffmpeg` trích xuất luồng âm thanh wav 16kHz mono từ video gốc.
  2. Nạp âm thanh vào mô hình `sherpa-onnx` nhận diện giọng nói tiếng Việt.
  3. Tính toán timestamp (thời điểm bắt đầu & kết thúc) của từng phân đoạn câu.
* **Phản hồi (Response):**
  ```json
  {
    "segments": [
      {
        "text": "Chào mừng bạn đã quay trở lại với chuỗi video hướng dẫn.",
        "startSeconds": 0.5,
        "endSeconds": 3.8,
        "words": [
          { "text": "Chào", "start": 0.5, "end": 0.8 },
          { "text": "mừng", "start": 0.8, "end": 1.1 },
          { "text": "bạn", "start": 1.1, "end": 1.3 }
        ]
      },
      {
        "text": "Hôm nay chúng ta sẽ tìm hiểu về cách biên tập video tự động.",
        "startSeconds": 4.1,
        "endSeconds": 7.6
      }
    ]
  }
  ```

---

### 2.3. API Xuất Video Hoàn Chỉnh (`/api/export`)

Khi người dùng nhấn Xuất Video, client tổng hợp toàn bộ cây dữ liệu dự án thành một `ExportPayload` toàn vẹn gửi lên máy chủ:

#### Request Payload (`POST /api/export`):
```json
{
  "totalDuration": 15.6,
  "width": 1920,
  "height": 1080,
  "fps": 30,
  "bgColor": "#000000",
  "mediaBlocks": [
    {
      "id": 1000,
      "startTime": 0,
      "duration": 15.6,
      "trimStart": 0,
      "naturalDuration": 20.0,
      "type": "video",
      "src": "/api/uploads/videos/input.mp4",
      "label": "Video gốc"
    }
  ],
  "voiceBlocks": [
    {
      "id": 1,
      "startTime": 0.5,
      "duration": 3.3,
      "audioUrl": "/api/uploads/audios/c8f2a1b94d8e.mp3",
      "label": "Khối 1"
    },
    {
      "id": 2,
      "startTime": 4.0,
      "duration": 3.5,
      "audioUrl": "/api/uploads/audios/a1b2c3d4e5f6.mp3",
      "label": "Khối 2"
    }
  ],
  "musicBlocks": [
    {
      "id": 2000,
      "startTime": 0,
      "duration": 15.6,
      "trimStart": 5.0,
      "url": "https://aicc-dev-public.s3.ap-southeast-1.amazonaws.com/media/music/Midnight_Daydream_Elderflower.mp3",
      "volume": 0.25,
      "label": "Nhạc nền chill"
    }
  ],
  "captions": [
    {
      "text": "Chào mừng bạn đã quay trở lại với chuỗi video hướng dẫn.",
      "start": 0.5,
      "end": 3.8
    }
  ],
  "captionStyle": {
    "fontFamily": "Inter",
    "fontSize": 48,
    "color": "#FFFFFF",
    "highlightColor": "#FFD700",
    "strokeColor": "#000000",
    "strokeWidth": 4,
    "positionY": "bottom",
    "marginY": 60,
    "align": "center"
  }
}
```

#### Tiến trình kiểm tra trạng thái (`GET /api/export/{job_id}`):
```json
{
  "job_id": "7f8b9c2a-3e4d-5a6b-7c8d-9e0f1a2b3c4d",
  "status": "processing",
  "progress": 72,
  "stage": "encoding_video",
  "eta_seconds": 8,
  "output_url": null
}
```
Khi hoàn tất (`status: "done"`):
```json
{
  "job_id": "7f8b9c2a-3e4d-5a6b-7c8d-9e0f1a2b3c4d",
  "status": "done",
  "progress": 100,
  "output_url": "/api/exports/vbee_export_1730800000.mp4",
  "file_size_bytes": 14589230
}
```
