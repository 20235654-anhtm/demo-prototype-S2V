# Bóc Tách Màn Hình & Luồng Xử Lý: Script To Video (`https://app.fliki.ai/?workflow=script&format=video`)

> **Phương pháp phân tích**: Kỹ thuật đảo ngược bundle Next.js/Turbopack kết hợp trích xuất trực tiếp từ các module cốt lõi của Fliki (`0ld2553166s61.js`, `0r2s_aik21wl0.js`, `217zfx2zudp6w.js`, `1lxx0tqt17r75.js`, `3saei-c0mitvd.js`).

---

## 1. Tổng Quan Cấu Trúc Màn Hình (Screen Hierarchy & Layout)

Khi người dùng truy cập URL `https://app.fliki.ai/?workflow=script&format=video`, hệ thống Fliki nhận diện 2 tham số query:
- `workflow=script`: Kích hoạt workflow chuyển thể kịch bản có sẵn sang video (`Script to video`).
- `format=video`: Đặt chế độ định dạng đầu ra là video (thay vì `audio`/podcast).

Giao diện hiển thị dưới dạng **Creation Modal / Full-view Workflow Drawer** ghim trên nền Dashboard (`/`), gồm 4 khối chính:

```
+----------------------------------------------------------------------------------------------------+
|  [X] Đóng                                  SCRIPT TO VIDEO (30 Credits)                            |
+----------------------------------------------------------------------------------------------------+
|  1. THÔNG TIN CƠ BẢN (Basic Setup)                                                                  |
|     * Tên file / Dự án: [ Input: "Untitled video"                                               ] |
|     * Ngôn ngữ & Giọng đọc mặc định: [ Tiếng Việt (vi-VN) - Hoài My (Ultra-realistic) v ]          |
|     * Tỉ lệ khung hình (Aspect Ratio): [ (o) 16:9 Landscape ]  [ ( ) 9:16 Portrait ]  [ ( ) 1:1 ] |
+----------------------------------------------------------------------------------------------------+
|  2. NỘI DUNG KỊCH BẢN (Script Input Section)                                                       |
|     +--------------------------------------------------------------------------------------------+ |
|     | Textarea (Hỗ trợ auto-expand, paste, drag & drop file .txt/.pdf):                          | |
|     | "Nhập hoặc dán nội dung kịch bản văn bản vào đây..."                                       | |
|     |                                                                                            | |
|     |                                                                                            | |
|     +--------------------------------------------------------------------------------------------+ |
|     | [Đính kèm file .txt/.pdf] (Tối đa 5MB)                 Bộ đếm: 145 / 15,000 ký tự (Free 1.5k) |
|     | Tiện ích AI: [ ✨ Enhance Script ]   [ 🌐 Web Research ]                                    |
+----------------------------------------------------------------------------------------------------+
|  3. CẤU HÌNH PHÂN CẢNH & NGUỒN MEDIA (Breakdown & Media Settings)                                  |
|     * Quy tắc phân cảnh (Scene Breakdown Rule):                                                    |
|       [ (•) Auto (AI based) ]     [ ( ) Line breaks (Xuống dòng) ]     [ ( ) Sentences (Theo câu) ]|
|     * Nguồn tài nguyên hình ảnh/video (Media Source):                                              |
|       [ (•) Cinematic AI Media ]  [ ( ) Stock Library (Video/Ảnh) ]    [ ( ) Blank / Màu nền ]     |
|     * Tùy chọn nâng cao (Collapsible Accordion):                                                  |
|       [v] Thêm phụ đề tự động (Auto Subtitles)                                                     |
|       [v] Thêm nhạc nền tự động (Auto Background Music - Minimax Music 3)                          |
|       [ ] Tạo avatar AI dẫn chuyện (AI Talking Avatar)                                             |
+----------------------------------------------------------------------------------------------------+
|  4. KHỐI ĐIỀU KHIỂN & SUBMIT (Action Footer)                                                        |
|     [ Hủy bỏ ]                                              [ ✨ Tạo video (Generate Video) -> ]   |
+----------------------------------------------------------------------------------------------------+
```

---

## 2. Bóc Tách Chi Tiết Từng Nút Bấm, Sự Kiện & Validate

### 2.1. Khối nhập kịch bản (Script Input)
- **Textarea Kịch bản (`textarea`)**:
  - **Sự kiện `onChange`**: Cập nhật state nội dung text, kích hoạt bộ đếm từ/ký tự.
  - **Giới hạn ký tự (Trích xuất từ code Fliki `limit.script`)**:
    - Tài khoản Free: Tối đa **1,500 ký tự** (hoặc ~250 từ).
    - Tài khoản Paid (Standard/Premium): Tối đa **15,000 ký tự**.
  - **Sự kiện `onDrop` / `onPaste`**: Cho phép kéo thả file văn bản (`.txt`, `.pdf`). Validate định dạng MIME `['application/pdf', 'text/plain']`, dung lượng tối đa 5MB.
- **Nút "Enhance script" (Biểu tượng Sparkles ✨)**:
  - **Sự kiện `onClick`**: Gọi query tRPC `G.k.workflow.generatePrompt.query({ userInput, mediaType: 'script' })`.
  - **Hành vi**: AI làm mượt câu chữ, bổ sung các chỉ dẫn âm thanh/hình ảnh trước khi phân tách cảnh.
- **Nút "Web Research" (Biểu tượng Quả địa cầu 🌐)**:
  - **Sự kiện `onClick`**: Bật/tắt cờ `enableSearch`. Hệ thống hiển thị tooltip cảnh báo trừ thêm credit (`enableSearchCreditCharged / 60`).

### 2.2. Khối chọn quy tắc phân cảnh (Scene Breakdown Rule)
Fliki hỗ trợ 3 tùy chọn cắt phân đoạn kịch bản (mã nội bộ: `sceneBreakdown`):
1. **`auto` (Auto - AI based)**:
   - Sử dụng mô hình LLM để phân tích ngữ nghĩa, chia cảnh thông minh dựa trên diễn biến nội dung và nhịp thở của câu nói.
   - **Mô hình phụ trách (Trích xuất từ module 0ld2553166s61)**:
     - Gói trả phí (Paid): Chạy qua **Gemini Flash 3.8 Breakdown** (với transport fallback tự động sang Gemini Flash 2.5 để không bao giờ bị đứt gãy luồng xử lý).
     - Gói miễn phí (Free): Chạy qua **GPT-5.6 Luna** (context 1.05M tokens, tối ưu hóa structured output).
2. **`lineBreak` (Line breaks - Theo dấu xuống dòng)**:
   - Mỗi lần người dùng nhấn `Enter` (ngắt dòng) sẽ tạo ra một phân cảnh độc lập.
3. **`sentence` (Sentences - Theo từng câu đơn)**:
   - Tách theo dấu câu kết thúc (`.`, `!`, `?`, `...`).

### 2.3. Khối chọn tỉ lệ khung hình (Aspect Ratio)
- **Các tùy chọn**:
  - `16:9` (Landscape - YouTube, TV): Kích thước sinh hình ảnh gốc `2048 x 1152` px.
  - `9:16` (Portrait - TikTok, Reels, Shorts): Kích thước `1152 x 2048` px.
  - `1:1` (Square - Instagram Feed): Kích thước `1600 x 1600` px.
- **Sự kiện `onClick`**: Cập nhật state `aspectRatio` trong store khởi tạo dự án.

### 2.4. Khối chọn tài nguyên hình ảnh (Media Source)
- **Tùy chọn `aiMedia`**: Sinh hình ảnh AI cho từng phân cảnh qua dịch vụ Runware:
  - Model hình ảnh: `runware-qwen-image-3`, `runware-gpt-image-2-5`, `runware-seedream-5-flash`.
  - Model video chuyển động: `runware-gen-video`, `runware-minimax-h3-max`, `runware-seedance-2-5`.
- **Tùy chọn `stock`**: Tự động trích xuất từ khóa tìm kiếm (Stock keywords) từ câu thoại và lấy video/ảnh bản quyền từ Unsplash, Storyblocks.

---

## 3. Luồng Gửi Dữ Liệu & Các Endpoint Backend (Data Flow & Endpoints)

Fliki sử dụng kiến trúc **tRPC (TypeScript Remote Procedure Call)** thuần nhất chạy trên WebSocket + HTTP POST `/api/trpc/...`. Không sử dụng các REST endpoint rời rạc.

### 3.1. Telemetry khi người dùng tương tác
Trước và trong khi submit, hệ thống phát sinh các sự kiện phân tích:
- `workflow_started`: Phát khi modal mở ra với query `?workflow=script&format=video`.
- `workflow_insight_tags_changed`: Phát khi người dùng đổi quy tắc chia cảnh hoặc tỉ lệ màn hình.
- `workflow_submitted`: Phát ngay khi nhấn nút **Generate Video**.

### 3.2. Payload Submit Khởi Tạo Workflow
Khi nhấn nút **Generate Video**, client thực hiện lệnh mutate tRPC:

```typescript
// Client invocation:
const result = await trpc.workflow.create.mutate({
  format: "video",
  workflowType: "script",
  title: formValues.title || "Untitled video",
  script: formValues.scriptContent,
  settings: {
    aspectRatio: formValues.aspectRatio, // "16:9" | "9:16" | "1:1"
    language: formValues.languageCode,   // "vi-VN", "en-US", ...
    voiceId: formValues.voiceId,         // ID của giọng đọc đã chọn
    sceneBreakdown: formValues.breakdownRule, // "auto" | "lineBreak" | "sentence"
    mediaSource: formValues.mediaSource,      // "aiMedia" | "stock" | "blank"
    enableSubtitles: formValues.enableSubtitles,
    enableMusic: formValues.enableMusic,
    musicStyle: "fal-minimax-music-3"
  }
});
```

### 3.3. Xử lý Backend & Thực thi luồng sinh kịch bản (`workflow.execute`)
1. **Khởi tạo bản ghi dự án (`driveId`, `playbackId`)**:
   - Backend cấp phát mã định danh `driveId` và trả về `{ success: true, data: { driveId, workflowId } }`.
2. **Kích hoạt luồng bóc tách phân cảnh ngầm (`trpc.workflow.execute.mutate`)**:
   - Client gọi ngay `d.k.workflow.execute.mutate({ workflowId })`.
   - Backend chạy pipeline:
     - `detailedScriptProcessing.segmentScript`: Tách đoạn văn thành mảng text scenes thô theo quy tắc đã chọn.
     - `detailedScriptProcessing.sceneBreakdown.ai`: Gọi Gemini Flash 3.8 / GPT-5.6 Luna để gắn metadata: prompt hình ảnh, nhịp ngắt nghỉ, thời lượng dự kiến.
     - `playback.sceneGenerate`: Lưu danh sách scenes vào Playback Engine.
3. **Đồng bộ trạng thái qua WebSocket (`common.updates.subscribe`)**:
   - Client lắng nghe socket realtime:
     ```javascript
     G.h.common.updates.subscribe({ token, userId }, {
       onData: (event) => {
         // Cập nhật thanh tiến độ % (0% -> 100%)
         // event.type === "workflowProgress"
       }
     });
     ```
4. **Điều hướng vào Studio (`/editor/{driveId}`)**:
   - Khi hoàn thành (hoặc khi tiến độ đạt 100%), router chuyển hướng:
     ```javascript
     router.replace(`/editor/${driveId}`);
     ```
   - Studio 3 cột sẽ tải toàn bộ danh sách cảnh và các layer hình ảnh/giọng đọc tương ứng.

---

## 4. Tham Số Kỹ Thuật Đáng Chú Ý (Trích Xuất Từ Fliki Source)

| Tham số | Giá trị trong Code Fliki | Ý nghĩa thực tế |
| :--- | :--- | :--- |
| `speech.wordsPerSecond` | **2.5 từ / giây** | Tốc độ đọc trung bình dùng để ước tính thời lượng cảnh |
| `speech.lineBreathSec` | **1.0 giây** | Khoảng đệm thở giữa các dòng thoại |
| `scene.minSec` | **5 - 6 giây** | Thời lượng tối thiểu một phân cảnh video ngắn |
| `scene.maxSec` | **15 giây** | Thời lượng tối đa khuyến nghị cho 1 cảnh trước khi đổi góc máy |
| `scene.avgMinSec` | **9 giây** | Thời lượng trung bình lý tưởng của 1 cảnh |
| `scene.wordlessMaxSec` | **10 giây** | Giới hạn tối đa của một cảnh không có lời thoại (chỉ có nhạc/tiếng động) |
| `music.volume` | **16% - 22%** | Mức âm lượng nhạc nền tự động so với 100% của giọng đọc |
| `segmentation.skipWordCount`| **200 từ** | Ngưỡng script ngắn sẽ bỏ qua bước nén tóm tắt |

---

## 5. Đề Xuất Áp Dụng Cho Dự Án Book To Video (Story2Video)

1. **Giao diện Modal Khởi Tạo**:
   - Giữ nguyên cấu trúc tinh gọn của Fliki: Người dùng chỉ cần dán đoạn trích sách -> Chọn tỉ lệ video (`16:9` hoặc `9:16`) -> Chọn quy tắc chia cảnh (`Tự động theo ngữ nghĩa` / `Theo câu` / `Theo thời lượng mục tiêu`).
2. **Áp dụng bộ thông số chuẩn cho thuật toán chia cảnh**:
   - Tốc độ đọc tiếng Việt: ~2.5 từ/giây (hoặc 14 ký tự/giây).
   - Đặt ngưỡng chặn an toàn cho cảnh: Tối thiểu 4 giây (tránh giật hình quá nhanh), tối đa 15-20 giây (tránh nhàm chán).
3. **Cơ chế Điều hướng mượt mà**:
   - Khi bấm **"Tạo video"**, tạo ngay bản ghi project và mở thanh tiến độ dạng thanh bar nhỏ hoặc skeleton, sau đó đưa người dùng thẳng vào giao diện biên tập kịch bản phân cảnh mà không làm treo ứng dụng.
