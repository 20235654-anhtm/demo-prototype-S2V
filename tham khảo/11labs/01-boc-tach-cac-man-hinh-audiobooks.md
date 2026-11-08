# Bóc Tách Toàn Diện Cấu Trúc Các Màn Hình & API ElevenLabs Audiobooks (`https://elevenlabs.io/app/audiobooks`)

> **Phương pháp phân tích:** Reverse Engineering từ OpenAPI Schema và bundle Next.js của ElevenLabs (`014yfrfgsdgy_.js`, `3ty95_1jw7qw0.js`, `07esc26uql0nu.js`, `2_1cjn9gibx8n.js`).
> **Đối tượng khảo sát:** Toàn bộ vòng đời ứng dụng Sách nói (Audiobooks / Studio Long-form Projects) của ElevenLabs.

---

## 1. Kiến Trúc 4 Màn Hình Cốt Lõi (Core Screens Overview)

Quy trình sản xuất sách nói của ElevenLabs được phân bổ qua 4 màn hình liên kết chặt chẽ:

```
[Màn hình 1: Dashboard /app/audiobooks]
       │
       ▼ (Bấm "+ Create new book")
[Màn hình 2: Creation & Import Wizard Modal]
       │
       ▼ (Tải file sách -> AI bóc tách chương -> Tạo Project)
[Màn hình 3: Audiobooks Studio Editor (/app/audiobooks/{id})]
  ├── Cột trái: Quản lý Chapter / Mục lục
  ├── Cột giữa: Trình biên soạn phân đoạn (Block & Voice Node)
  └── Cột phải: Diễn viên lồng tiếng (Cast) & Từ điển phát âm (Dictionary)
       │
       ▼ (Bấm "Export")
[Màn hình 4: Export & Distribution Modal]
  ├── Xuất file âm thanh (MP3 / M4B / FLAC)
  └── Sinh video trực quan (Audio Waveform / Video Preview)
```

---

## 2. Bóc Tách Chi Tiết Từng Màn Hình

### 2.1 Màn Hình 1: Audiobooks Projects Dashboard (`/app/audiobooks`)

Màn hình quản lý danh sách toàn bộ các tác phẩm sách nói, truyện dài của tác giả/studio:

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [Logo 11Labs]  Audiobooks / Projects                     [🔍 Tìm kiếm sách...]   [+ Create new book]   │
├────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Bộ lọc: [ Tất cả (All) ]  [ Đang xử lý (In Progress) ]  [ Đã hoàn tất (Completed) ]   Sắp xếp: [Mới nhất ▼]│
├────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ DANH SÁCH SÁCH NÓI (Grid / Table View):                                                               │
│                                                                                                        │
│ ┌────────────────────────┐  ┌────────────────────────┐  ┌────────────────────────┐                    │
│ │ [Cover: Tiếng Thu]     │  │ [Cover: Rừng Xà Nu]    │  │ [Cover: Sherlock]      │                    │
│ │ Tiêu đề: Tiếng Thu     │  │ Tiêu đề: Rừng Xà Nu    │  │ Tiêu đề: Sherlock S2   │                    │
│ │ 3 Chương • 12,450 từ   │  │ 5 Chương • 24,100 từ   │  │ 12 Chương • 85,000 từ  │                    │
│ │ Thời lượng: 01h 15m    │  │ Thời lượng: Chưa xong  │  │ Thời lượng: 05h 42m    │                    │
│ │ Trạng thái: [✓ Ready]  │  │ Trạng thái: [⚡ 45%]   │  │ Trạng thái: [✓ Ready]  │                    │
│ │ Cập nhật: 2 giờ trước  │  │ Cập nhật: Hôm qua      │  │ Cập nhật: 3 ngày trước │                    │
│ │ [▶ Nghe nhanh] [...]   │  │ [Tiếp tục sửa] [...]   │  │ [Tải sách] [...]       │                    │
│ └────────────────────────┘  └────────────────────────┘  └────────────────────────┘                    │
└────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

#### Danh mục nút bấm & Sự kiện trên Dashboard:
| Nút bấm / Phần tử | Kiểu sự kiện | Mô tả hành vi & Validate | API Endpoint & Payload ngầm |
| :--- | :--- | :--- | :--- |
| **`[+ Create new book]`** | `onClick` | Mở Màn hình 2 (Creation & Import Modal). | Client-side: `setOpenCreateModal(true)`. |
| **Search Input (`🔍`)** | `onChange` (debounce 300ms) | Lọc danh sách theo tiêu đề sách. Tối thiểu 1 ký tự. | `GET /v1/projects/search?search={query}&page_size=25`. Trả về mảng `projects[]`. |
| **Filter Tabs** | `onClick` | Lọc theo trạng thái `all`, `in_progress`, `completed`. | `GET /v1/projects/search?status={filter}`. |
| **Project Card Click** | `onClick` | Mở trực tiếp Studio biên tập sách. | Điều hướng: `router.push('/app/audiobooks/' + project.project_id)`. |
| **Menu 3 chấm `[...]`** | `onClick` | Mở menu thao tác: Đổi tên, Nhân bản, Xóa, Đổi ảnh bìa. | - Rename: `PATCH /v1/projects/{id}` (`{ name }`)<br/>- Duplicate: `POST /v1/studio/projects/{id}/duplicate`<br/>- Delete: `DELETE /v1/studio/projects/{id}`<br/>- Cover: `POST /v1/projects/{id}/update-cover-image`. |

---

### 2.2 Màn Hình 2: Modal Khởi Tạo & Import Sách (New Audiobook Wizard)

> 📖 **Tài liệu chuyên sâu chi tiết:** Xem toàn bộ bóc tách form fields, validate và API tại [01b-chi-tiet-modal-khoi-tao-va-import-sach.md](file:///E:/Tài%20liệu/Daigaku/2026.1/GR2/Book%20to%20Video/demo-fe-prototype-S2V/demo-prototype-S2V/tham%20khảo/11labs/01b-chi-tiet-modal-khoi-tao-va-import-sach.md).
> 📊 **Các sơ đồ User Flow độc lập:**
> - [02a-user-flow-modal-import-document.puml](file:///E:/Tài%20liệu/Daigaku/2026.1/GR2/Book%20to%20Video/demo-fe-prototype-S2V/demo-prototype-S2V/tham%20khảo/11labs/02a-user-flow-modal-import-document.puml) (Luồng nạp file EPUB / PDF)
> - [02b-user-flow-modal-import-url-va-template.puml](file:///E:/Tài%20liệu/Daigaku/2026.1/GR2/Book%20to%20Video/demo-fe-prototype-S2V/demo-prototype-S2V/tham%20khảo/11labs/02b-user-flow-modal-import-url-va-template.puml) (Luồng URL & Template mẫu)
> - [02c-user-flow-modal-ai-casting.puml](file:///E:/Tài%20liệu/Daigaku/2026.1/GR2/Book%20to%20Video/demo-fe-prototype-S2V/demo-prototype-S2V/tham%20khảo/11labs/02c-user-flow-modal-ai-casting.puml) (Luồng AI phân tích & ghép giọng nhân vật)


Hộp thoại xuất hiện khi bấm **Create new book**, hỗ trợ nạp tài liệu tự động hoặc tạo bản thảo rỗng:

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│  TẠO MỚI SÁCH NÓI (Create New Audiobook)                                                        [X]   │
├────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│  Chọn phương thức nhập nội dung (Select source):                                                       │
│  [ (•) Tải file tài liệu (EPUB, PDF, TXT, DOCX) ]   [ ( ) Soạn thảo trang trắng ]   [ ( ) Từ URL Web ] │
│                                                                                                        │
│  ┌ - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ┐  │
│  |   📁 Kéo và thả file sách vào đây, hoặc [ Chọn file từ máy tính ]                               |  │
│  |   Hỗ trợ: .epub, .pdf, .txt, .docx (Dung lượng tối đa: 25MB, tối đa 500,000 từ)                |  │
│  └ - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ┘  │
│                                                                                                        │
│  THIẾT LẬP DỰ ÁN (Project Configuration):                                                              │
│  * Tiêu đề sách: [ "Tiếng Thu - Lưu Trọng Lư"                                                       ]  │
│  * Giọng đọc người dẫn chuyện (Default Narrator): [ Adam - Deep, Narrative Voice v ]                  │
│  * Chất lượng âm thanh (Quality Preset): [ (•) High (192kbps MP3) ]   [ ( ) Standard (128kbps) ]      │
│  * Mô hình chuyển đổi (Model): [ Eleven Multilingual v2 (Khuyên dùng cho truyện Việt) v ]             │
│                                                                                                        │
│  TÙY CHỌN NÂNG CAO (AI Processing Options):                                                            │
│  [x] Tự động trích xuất cấu trúc chương (Auto-detect Chapter titles & TOC)                             │
│  [x] Tự động nhận diện nhân vật & đề xuất phân vai (AI Cast Detection & Auto-assign voices)           │
├────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│  [ Hủy bỏ ]                                                                 [ ✨ Tạo Sách Nói -> ]    │
└────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

#### Danh mục nút bấm, Sự kiện & Pipeline xử lý ngầm:
1. **Dropzone tải file (`onDrop` / `onChange`)**:
   - Kiểm tra đuôi file (`.epub`, `.pdf`, `.docx`, `.txt`), dung lượng <= 25MB.
   - Gửi file lên API phân tích cấu trúc:
     ```http
     POST /v1/studio/parse-script
     Content-Type: multipart/form-data
     Payload: FormData { file: book.epub }
     ```
   - **Backend Response**:
     ```json
     {
       "title": "Tiếng Thu",
       "chapters": [
         { "name": "Chương 1: Mùa thu sang", "content": "..." },
         { "name": "Chương 2: Đêm trăng", "content": "..." }
       ],
       "detected_characters": [
         { "name": "Người dẫn chuyện", "gender": "male" },
         { "name": "Lan", "gender": "female" },
         { "name": "Minh", "gender": "male" }
       ]
     }
     ```
2. **Nút `[✨ Tạo Sách Nói]` (`onSubmit`)**:
   - Gửi yêu cầu khởi tạo dự án:
     ```http
     POST /v1/studio/projects
     Content-Type: application/json
     Payload:
     {
       "name": "Tiếng Thu - Lưu Trọng Lư",
       "default_title_voice_id": "21m00Tcm4TlvDq8ikWAM",
       "default_paragraph_voice_id": "21m00Tcm4TlvDq8ikWAM",
       "quality_preset": "high",
       "default_model_id": "eleven_multilingual_v2"
     }
     ```
   - Sau khi nhận `project_id`, hệ thống tự động import mảng chương qua `POST /v1/studio/projects/{projectId}/chapters`.
   - Chuyển hướng người dùng vào Studio: `router.push('/app/audiobooks/' + project_id)`.

---

### 2.3 Màn Hình 3: Audiobooks Studio Editor (`/app/audiobooks/{id}`)

Không gian làm việc chính với mô hình 3 cột chuyên dụng cho sách và truyện dài:

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [← Back]  Dự án: "Tiếng Thu" | [Quality: High ▼]                     [⚡ Convert Chapter] [🎬 Export]   │
├─────────────────────┬─────────────────────────────────────────────────┬────────────────────────────────┤
│ CỘT TRÁI: CHAPTERS  │ CỘT GIỮA: MANUSCRIPT & AUDIO BLOCKS             │ CỘT PHẢI: CAST & SETTINGS      │
├─────────────────────┼─────────────────────────────────────────────────┼────────────────────────────────┤
│ 📖 Chapters (3)     │ [ Chapter 1: Khởi đầu mùa thu ]                │ 🎭 Cast (Diễn viên sách)       │
│                     │                                                 │ • Narrator: Adam (Mặc định)    │
│ • Chương 1 (03:45)  │ [Block #1 - Dẫn chuyện] ─────────────────────── │ • Nhân vật Lan: Rachel         │
│   [✓ Đã chuyển đổi] │ [👤 Adam ▼] [▶ 0:08] [🔄] [⏸ +500ms]          │ • Nhân vật Minh: Antoni        │
│ • Chương 2 (05:12)  │ "Em không nghe mùa thu, dưới trăng mờ thổ     │                                │
│   [⚠️ Cần cập nhật] │ thức..."                                        │ [+ Assign Voice to Selection]  │
│ • Chương 3 (Chưa)   │ ─────────────────────────────────────────────── │ ────────────────────────────── │
│   [◌ Chưa chuyển]   │ [Block #2 - Lời thoại Lan] ─────────────────── │ 📖 Pronunciation Dictionary    │
│                     │ [👤 Rachel ▼] [▶ 0:05] [🔄] [⏸ +300ms]        │ • "AI" -> "Ây Ai"             │
│ [+ Add Chapter]     │ "— Anh có nghe thấy tiếng lá rơi không?"        │ • "Kowalski" -> "Ko-vahl-ski"  │
│ [📁 Import ePub]    │ ─────────────────────────────────────────────── │ [+ Add Pronunciation Rule]     │
├─────────────────────┴─────────────────────────────────────────────────┴────────────────────────────────┤
│ 🎵 GLOBAL AUDIO PLAYER BAR:                                                                            │
│ [⏮] [▶ Play All] [⏭]  [ 01:24 / 08:57 ] ───●────────────────────────────  [Speed: 1.0x] [Volume 🔊]    │
└────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

#### Chi tiết các khối xử lý và nút bấm:
1. **Khối Quản lý Chương (Cột trái)**:
   - **Select Chapter**: `GET /v1/studio/projects/{projectId}/chapters/{chapterId}/extended` -> Lấy danh sách blocks, nodes và trạng thái snapshot.
   - **Add Chapter (`+ Add Chapter`)**: `POST /v1/studio/projects/{projectId}/chapters` (`{ name }`).
   - **Reorder / Delete**: `DELETE /v1/studio/projects/{projectId}/chapters/{chapterId}`.
2. **Khối Soạn thảo Phân đoạn (Cột giữa - Manuscript Blocks)**:
   - **Textarea Block (`onChange`)**: Khi sửa text, UI đánh dấu trạng thái khối là **`Stale` (Audio bị cũ)**.
   - **Voice Badge Dropdown (`👤 Adam ▼`)**: Mở menu chọn giọng đọc cho block -> Gọi `PATCH /v1/projects/{projectId}/chapters/{chapterId}/blocks/{blockId}` với payload `{ voiceId }`. Trạng thái block chuyển sang `OUTDATED` cần sinh lại.
   - **Nút Play Block (`[▶]`)**: Gọi `GET /v1/projects/{projectId}/chapters/{chapterId}/blocks/{blockId}/nodes/{nodeId}/audio` để stream nghe thử đoạn đọc độc lập.
   - **Nút Regenerate Block (`[🔄]`)**: Sinh lại audio cho riêng block này, tự động lưu take cũ vào snapshot: `POST /v1/projects/{projectId}/chapters/{chapterId}/blocks/{blockId}/snapshots`.
   - **Nút Chèn khoảng dừng (`[⏸ +500ms]`)**: Chèn token dừng vào mảng tokens `{ type: "pause", duration: 0.5 }`.
3. **Khối Diễn viên & Từ điển (Cột phải)**:
   - **Assign Voice to Selection**: Bôi đen một câu thoại trong block -> Nhấn vào nhân vật ở cột phải -> Tách câu thoại thành 1 block độc lập mang giọng nhân vật đó (`POST .../duplicate-nodes`).
   - **Từ điển phát âm (`+ Add Pronunciation Rule`)**: `POST /v1/studio/projects/{projectId}/pronunciation-dictionaries` (`{ word, alias }`).
4. **Thanh Header Actions**:
   - **`[⚡ Convert Chapter]`**: Chuyển đổi toàn bộ text của chapter sang audio:
     ```http
     POST /v1/studio/projects/{projectId}/chapters/{chapterId}/convert
     ```
   - **`[⚡ Convert All Chapters]`**: Chuyển đổi toàn bộ tác phẩm:
     ```http
     POST /v1/studio/projects/{projectId}/convert
     ```
   - **Polling tiến độ**: Client liên tục gọi `GET /v1/projects/{projectId}/conversion-status` mỗi 1500ms để hiển thị progress bar (0% -> 100%).

---

### 2.4 Màn Hình 4: Modal Xuất Bản & Phân Phối (Export Audiobook Modal)

Hộp thoại xuất hiện khi bấm nút **`[🎬 Export]`** trên Header:

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│  XUẤT BẢN SÁCH NÓI (Export & Distribute Audiobook)                                              [X]   │
├────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│  1. ĐỊNH DẠNG ÂM THANH (Audio Format):                                                                 │
│     [ (•) MP3 (192 kbps, 44.1kHz - Phù hợp phát sóng, Spotify, Audible) ]                              │
│     [ ( ) M4B (Audiobook Format với Chapter Markers tích hợp) ]                                        │
│     [ ( ) FLAC (Lossless Studio Master Quality) ]                                                      │
│                                                                                                        │
│  2. CẤU TRÚC FILE XUẤT (File Output Structure):                                                        │
│     [ (•) Gộp toàn bộ thành 1 file duy nhất (Single Audio File kèm Mục lục Metadata) ]                 │
│     [ ( ) Tách riêng từng file theo từng Chương (Separate File Per Chapter: 01.mp3, 02.mp3, ...) ]     │
│                                                                                                        │
│  3. KÊNH PHÂN PHỐI & VIDEO PREVIEW:                                                                   │
│     [ ] Xuất bản trực tiếp lên Spotify for Podcasters / InAudio                                        │
│     [x] Tự động sinh Video Visualizer (Sóng âm + Ảnh bìa) để đăng tải YouTube / Shorts                │
│                                                                                                        │
│  Ước tính: 3 Chương • Tổng thời lượng: 01h 15m • Dung lượng: ~104 MB                                  │
├────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│  [ Hủy ]                                                    [ ⬇ Tải Xuống ]   [ 🎬 Tạo Lệnh Xuất ]     │
└────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

#### Danh mục nút bấm & API Endpoints:
| Nút bấm | Kiểu sự kiện | API Endpoint & Payload | Mô tả xử lý |
| :--- | :--- | :--- | :--- |
| **`[🎬 Tạo Lệnh Xuất]`** | `onClick` | `POST /v1/projects/{projectId}/exports`<br/>Payload: `{ format_type: "mp3_44100_192", single_file: true }` | Server đưa yêu cầu render vào hàng đợi Celery/Redis. Trả về `export_id`. |
| **Kiểm tra tiến độ xuất** | Polling | `GET /v1/projects/{projectId}/exports` | Trả về mảng các bản export, trạng thái `in_progress` hoặc `completed`. |
| **`[⬇ Tải Xuống]`** | `onClick` | `GET /v1/projects/{projectId}/exports/{exportId}/signed-url` | Lấy đường link AWS S3 Presigned URL để tải file audio hoàn chỉnh về máy. |
| **Sinh Video Visualizer** | `onClick` | `POST /v1/studio/projects/{projectId}/chapters/{chapterId}/exports/{exportId}/generate-video` | Tự động ghép audio với ảnh bìa tạo video MP4 để đăng YouTube. |

---

## 3. Tổng Hợp Các Điểm Đột Phá Kỹ Thuật Của ElevenLabs Audiobooks

1. **Kiến trúc Phân đoạn Block-level (Granular Block Architecture)**:
   - Sách không bị gửi nguyên cục văn bản lớn đi sinh TTS. Thay vào đó, sách được chia thành các Block nhỏ (tương đương 1 câu hoặc 1 đoạn ngắn 20-50 từ).
   - Mỗi Block có một `snapshot_id` và vòng đời riêng. Khi người dùng sửa 1 từ ở Chương 3, hệ thống **chỉ render lại duy nhất Block đó**, tiết kiệm 99% thời gian và chi phí tín chỉ so với việc đọc lại cả chương.
2. **Cơ chế Stale Status (Audio lỗi thời)**:
   - Mọi thay đổi về text hoặc đổi giọng diễn viên đều kích hoạt cờ `is_stale = true`. Khối đó sẽ hiện viền vàng cam nhắc nhở người dùng cần chuyển đổi lại.
3. **Từ điển phát âm cấp Dự án (Project-level Pronunciation Dictionary)**:
   - Quy tắc phiên âm (Alias / IPA) được lưu trữ vào dự án và áp dụng tự động cho toàn bộ các chương trong sách, giải quyết triệt để lỗi đọc sai tên nhân vật trong truyện dài.
4. **Khả năng đồng bộ xuất bản Đa định dạng**:
   - Vừa hỗ trợ xuất file âm thanh sách nói chuẩn (`.m4b`, `.mp3`), vừa hỗ trợ xuất video visualizer (`.mp4`) để đa dạng hóa kênh phân phối.
