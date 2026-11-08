# Bóc Tách Chuyên Sâu: Modal Khởi Tạo & Import Sách (ElevenLabs Audiobooks)

> **Căn cứ kỹ thuật:** Dịch ngược từ module `014yfrfgsdgy_.js`, `3ty95_1jw7qw0.js`, `0fisp7d21hgkm.js`, `0t06ug7kohtwu.js` của ElevenLabs Audiobooks.
> **Vị trí kích hoạt:** Được mở khi người dùng click vào nút `[+ Create new book]` tại Dashboard (`https://elevenlabs.io/app/audiobooks`) hoặc nút `[📁 Import Document]` trong Studio Editor.

---

## 1. Cấu Trúc Giao Diện Của Modal (Modal Architecture & Layout)

Modal được thiết kế dưới dạng **Wizard đa phương thức (Multi-source Onboarding Wizard)** với 4 tab nguồn nhập và khối cấu hình dự án trực quan:

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│  TẠO MỚI SÁCH NÓI & DỰ ÁN DÀI TẬP (Create New Audiobook Project)                                [X]   │
├────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│  1. CHỌN NGUỒN BẢN THẢO (Source Selector Tabs):                                                       │
│  [ (•) Tải file tài liệu (Document) ] [ ( ) Trang trắng (Blank) ] [ ( ) Từ link web (URL) ] [ ( ) Mẫu ]│
│                                                                                                        │
│  ┌ - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ┐  │
│  |   📁 KÉO & THẢ FILE SÁCH VÀO ĐÂY, HOẶC [ CHỌN TỪ MÁY TÍNH ]                                     |  │
│  |   Hỗ trợ: .pdf, .epub, .txt, .html, .docx                                                       |  │
│  |   Giới hạn kỹ thuật: Dung lượng tối đa 25MB • Tối đa 500,000 từ / tác phẩm                      |  │
│  └ - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ┘  │
│  File đã chọn: [ 📄 tieng-thu-luu-trong-lu.epub ] (1.8 MB)                     [ Thao tác: Thay file ]│
│                                                                                                        │
│  2. THIẾT LẬP DỰ ÁN (Project Configuration):                                                           │
│  * Tiêu đề sách: [ "Tiếng Thu - Lưu Trọng Lư"                                                       ]  │
│  * Giọng đọc người dẫn chuyện (Default Narrator): [ 👤 Adam (Deep, Narrative, American)          ▼ ]  │
│  * Mô hình chuyển đổi TTS: [ Eleven Multilingual v2 (Khuyên dùng cho truyện Việt)                ▼ ]  │
│  * Chuẩn chất lượng âm thanh: [ (•) High (192kbps MP3 / FLAC) ]    [ ( ) Standard (128kbps MP3) ]     │
│                                                                                                        │
│  3. CẤU HÌNH AI PHÂN TÍCH TỰ ĐỘNG (AI Script Parsing & Character Extraction):                          │
│  [x] Tự động trích xuất cấu trúc chương & mục lục (Auto-detect Chapter titles & TOC)                  │
│  [x] Quét và nhận diện nhân vật thoại tự động (AI Character Voice Assignment)                         │
│                                                                                                        │
│  BẢNG XEM TRƯỚC PHÂN VAI (Character Casting Preview):                                                  │
│  • Người dẫn chuyện (Narrator)    ──>  [ 👤 Adam (Trầm, truyền cảm)      ▼ ]                          │
│  • Nhân vật: Lan (Nữ, trẻ)        ──>  [ 👤 Rachel (Nữ tính, nhẹ nhàng)   ▼ ]                          │
│  • Nhân vật: Minh (Nam, trẻ)      ──>  [ 👤 Antoni (Nam trẻ, dứt khoát)   ▼ ]                          │
├────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│  [ Hủy bỏ ]                                                  [ Trợ giúp ]   [ ✨ Khởi Tạo Sách Nói -> ]│
└────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Bóc Tách Chi Tiết Từng Nút Bấm, Sự Kiện & Validate

### 2.1 Tab 1: Tải File Tài Liệu (Document Upload)
- **Vùng thả file (Dropzone)**:
  - **Sự kiện `onDragOver` / `onDrop`**:
    - Validate MIME types: `application/pdf`, `application/epub+zip`, `text/plain`, `text/html`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`.
    - Validate kích thước file: `file.size <= 25 * 1024 * 1024` (25MB). Nếu vượt quá, hiển thị Toast cảnh báo: *"File exceeds maximum limit of 25MB"*.
  - **Sự kiện `onChange` của `<input type="file" />`**:
    - Đọc file vào `FormData`, kích hoạt trạng thái loading `m({ type: "processing" })`.
  - **Endpoint xử lý phân tích file**:
    ```http
    POST /v1/studio/parse-script
    Content-Type: multipart/form-data

    FormData:
    - file: [Binary Data của tieng-thu.epub]
    ```
  - **Phản hồi từ Backend**:
    - Trả về danh sách các chương được cắt tự động (`chapters[]`), tổng số từ (`word_count`), và danh sách nhân vật trích xuất (`detected_characters[]`).

### 2.2 Tab 2: Soạn Thảo Trang Trắng (Blank Project)
- **Input Tiêu đề**: Text input yêu cầu từ 1 đến 100 ký tự. Mặc định là `"Untitled Project"`.
- **Hành vi**: Bỏ qua bước parse tài liệu, tạo một dự án rỗng với duy nhất 1 chapter trắng để tác giả tự viết sách hoặc dán từng đoạn vào.

### 2.3 Tab 3: Nhập Từ Link Web (Import URL)
- **Input URL**:
  - Placeholder: `"https://elevenlabs.io/blog/..."`.
  - Validate định dạng: Regex URL hợp lệ (`http://` hoặc `https://`). Nếu rỗng, báo lỗi: `"Please add a url."`.
- **Nút `[Import]`**:
  - Gửi URL lên crawler của ElevenLabs:
    ```http
    POST /v1/studio/parse-script
    Content-Type: application/json
    Payload: { "url": "https://example.com/chuong-1-tieng-thu" }
    ```
  - Backend cào bài viết, loại bỏ quảng cáo/header/footer, chỉ giữ lại thân bài văn bản để đổ vào sách nói.

### 2.4 Tab 4: Mẫu Kịch Bản Có Sẵn (Use Template)
- Hỗ trợ các mẫu demo tiêu chuẩn:
  - `narrate-a-story`: Kể truyện thiếu nhi / phiêu lưu.
  - `direct-a-dramatic-movie-scene`: Kịch bản phim điện ảnh kịch tính.
  - `record-an-advertisement`: Mẫu kịch bản đọc quảng cáo thương mại.
  - `speak-in-different-languages`: Mẫu kịch bản đa ngữ kiểm tra phát âm.

### 2.5 Khối Thiết Lập Giọng Đọc & Mô Hình TTS
- **Dropdown Giọng Narrator (`default_paragraph_voice_id`)**:
  - Mở danh sách các giọng trong Voice Library của ElevenLabs (Adam, Rachel, Antoni, Josh...).
  - Có nút nghe thử mẫu giọng (Play preview sample 5s).
- **Dropdown Model ID (`default_model_id`)**:
  - `eleven_multilingual_v2`: Tối ưu cho tiếng Việt và 28 ngôn ngữ toàn cầu, giữ nguyên cảm xúc câu từ.
  - `eleven_turbo_v2_5`: Tốc độ sinh siêu nhanh, độ trễ thấp, tiết kiệm credit.
- **Quality Preset Toggle**:
  - `high`: Xuất MP3 192kbps / 44.1kHz (Chuẩn sách nói Audible / Spotify).
  - `standard`: Xuất MP3 128kbps / 44.1kHz.

---

## 3. Luồng Gửi Dữ Liệu & Các Endpoint Backend

### 3.1 Bước 1: Parse Tài Liệu Bóc Tách Chương & Nhân Vật
```http
POST /v1/studio/parse-script
Authorization: Bearer <TOKEN>
Content-Type: multipart/form-data

Body:
FormData {
  file: [Blob: tieng-thu.epub]
}
```
**Response (200 OK):**
```json
{
  "title": "Tiếng Thu - Lưu Trọng Lư",
  "total_words": 14250,
  "chapters": [
    {
      "name": "Chương 1: Mùa thu sang",
      "order": 1,
      "word_count": 4200
    },
    {
      "name": "Chương 2: Đêm trăng thổ thức",
      "order": 2,
      "word_count": 5100
    },
    {
      "name": "Chương 3: Tiếng lá rơi",
      "order": 3,
      "word_count": 4950
    }
  ],
  "detected_characters": [
    { "name": "Người dẫn chuyện", "gender": "male", "lines_count": 85 },
    { "name": "Lan", "gender": "female", "lines_count": 24 },
    { "name": "Minh", "gender": "male", "lines_count": 18 }
  ]
}
```

### 3.2 Bước 2: Tạo Bản Ghi Dự Án (`POST /v1/studio/projects`)
Client bấm **`[✨ Khởi Tạo Sách Nói]`**, gọi API tạo Project tổng:
```http
POST /v1/studio/projects
Authorization: Bearer <TOKEN>
Content-Type: application/json

Payload:
{
  "name": "Tiếng Thu - Lưu Trọng Lư",
  "default_title_voice_id": "21m00Tcm4TlvDq8ikWAM",
  "default_paragraph_voice_id": "21m00Tcm4TlvDq8ikWAM",
  "default_model_id": "eleven_multilingual_v2",
  "quality_preset": "high",
  "from_document": true
}
```
**Response (200 OK):**
```json
{
  "project_id": "ByPb7RWtQp4ku35EJpjW",
  "name": "Tiếng Thu - Lưu Trọng Lư",
  "can_be_downloaded": false,
  "create_date_unix": 1730908800
}
```

### 3.3 Bước 3: Đổ Từng Chương Vào Dự Án (`file-manager-import`)
Client tự động lặp qua danh sách các chương đã parse để import nội dung:
```http
POST /v1/studio/projects/ByPb7RWtQp4ku35EJpjW/chapters/gpeCRbIgRvdBil5KbtXc/file-manager-import
Authorization: Bearer <TOKEN>
Content-Type: multipart/form-data

FormData:
- file: [File chunk của Chương 1]
- import_content_str: "{\"type\":\"document\"}"
```
Backend tự động băm nhỏ chương sách thành các **Blocks (đoạn/câu)** và lưu vào cơ sở dữ liệu.

### 3.4 Bước 4: Lưu Danh Sách Phân Vai Nhân Vật (`Cast List`)
```http
POST /v1/projects/ByPb7RWtQp4ku35EJpjW/used-voices
Authorization: Bearer <TOKEN>
Content-Type: application/json

Payload:
{
  "voices": [
    { "character_name": "Người dẫn chuyện", "voice_id": "21m00Tcm4TlvDq8ikWAM" },
    { "character_name": "Lan", "voice_id": "2EiwWnXFnvU5JabPnv8n" },
    { "character_name": "Minh", "voice_id": "ErXwobaYiN019PkySvjV" }
  ]
}
```

### 3.5 Bước 5: Bắn Telemetry & Chuyển Hướng Người Dùng
- Telemetry event:
  ```javascript
  captureEvent("project_created", {
    projectId: "ByPb7RWtQp4ku35EJpjW",
    type: "audiobook",
    sourceType: "document",
    creationFlowType: "modal",
    creationSource: "audiobooks-dashboard",
    wordCount: 14250,
    chaptersCount: 3
  });
  ```
- Chuyển hướng: `router.push('/app/audiobooks/ByPb7RWtQp4ku35EJpjW?chapterId=gpeCRbIgRvdBil5KbtXc')`.

---

## 4. Các Trường Hợp Lỗi (Edge Cases) & Cơ Chế Khắc Phục

1. **File sách không có mục lục chuẩn (Mobi/EPUB scan thiếu thẻ heading)**:
   - AI Parser sẽ tự động fallback sang chia chương theo dung lượng từ (mỗi 3,000 từ tự tạo thành "Phần 1", "Phần 2").
2. **File quá lớn (> 25MB hoặc > 500,000 từ)**:
   - Giao diện từ chối ngay tại Dropzone và gợi ý người dùng tách file thành Tập 1, Tập 2.
3. **Mất kết nối mạng giữa chừng khi import**:
   - Nhờ cơ chế `upsertChapter`, các chương đã tải lên thành công được lưu lại, người dùng có thể bấm nút `[📁 Import Document]` tại sidebar cột trái trong Studio để tải bù các chương còn thiếu.
