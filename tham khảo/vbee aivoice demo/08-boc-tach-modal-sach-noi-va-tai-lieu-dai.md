# Bóc Tách Chuyên Sâu: Modal Sách Nói & Tài Liệu Dài (Vbee AIVoice Studio)

> **Mục tiêu phân tích:** Bóc tách cấu trúc giao diện, sự kiện nút bấm, quy tắc xác thực và luồng dữ liệu của **Modal Sách nói & Tài liệu dài (3 bước: Tải lên ➔ Chọn giọng ➔ Kiểm tra)** trên nền tảng Vbee AIVoice Studio (`https://vbee-aivoice-demo.vercel.app/projects`).
> **Phương pháp:** Kết hợp trích xuất trực tiếp mã nguồn Frontend/Backend từ `demo-ai-content-studio-master` kết hợp quy chuẩn vận hành thực tế của Vbee Studio.

---

## 1. Cấu Trúc Tổng Thể Modal (3-Step Wizard Layout)

Modal được thiết kế theo dạng **Wizard phân bước (Stepped Wizard Modal)** giúp người dùng xử lý các văn bản dài (từ vài nghìn đến hàng trăm nghìn từ) một cách an toàn, tránh lỗi tràn bộ nhớ hoặc vượt hạn mức ký tự:

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│  TẠO DỰ ÁN: SÁCH NÓI & TÀI LIỆU DÀI (Long-form Document & Audiobook)                            [X]   │
├────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│  THANH TIẾN ĐỘ 3 BƯỚC (Wizard Stepper):                                                                │
│      (1) Tải lên văn bản  ───────►  (2) Chọn giọng đọc  ───────►  (3) Kiểm tra & Xác nhận              │
│       [✓ Bước hiện tại]                 [Chờ cấu hình]                 [Chờ xem trước]                 │
├────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│  NỘI DUNG THAY ĐỔI THEO TỪNG BƯỚC:                                                                     │
│                                                                                                        │
│  [ BƯỚC 1: TẢI LÊN ]          [ BƯỚC 2: CHỌN GIỌNG ĐỌC ]       [ BƯỚC 3: KIỂM TRA & XÁC NHẬN ]         │
│  • Dropzone kéo thả file      • Bộ lọc: Vùng miền, Giới tính   • Bảng thống kê: Số ký tự, số đoạn     │
│    (.txt, .docx, .pdf, .epub) • Nghe thử giọng mẫu trực quan   • Ước tính: Thời lượng, số credit trừ  │
│  • Tùy chọn quy tắc cắt đoạn  • Tinh chỉnh: Tốc độ, Cao độ,    • Rà soát từ khó / Từ viết tắt         │
│  • Khung dán trực tiếp text     Khoảng ngắt nghỉ giữa đoạn     • Danh sách phân đoạn xem trước        │
├────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│  CHÂN TRANG ĐIỀU HƯỚNG (Modal Footer):                                                                 │
│  [ Hủy bỏ ]                                                    [ ← Quay lại ]   [ Tiếp tục / Tạo -> ] │
└────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Bóc Tách Chi Tiết Từng Bước (Deep-dive 3 Steps)

### 2.1 Bước 1: Tải Lên Văn Bản (Upload & Parsing)

Giao diện hỗ trợ 2 hình thức nạp nội dung: **Tải file tài liệu** hoặc **Dán văn bản trực tiếp**.

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│  BƯỚC 1 / 3: TẢI LÊN BẢN THẢO SÁCH NÓI                                                                 │
├────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│  Phương thức: [ (•) Tải tệp lên (.txt, .docx, .pdf, .epub) ]     [ ( ) Nhập / Dán văn bản trực tiếp ]  │
│                                                                                                        │
│  ┌ - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ┐  │
│  |   ☁️ KÉO THẢ TỆP VÀO ĐÂY HOẶC [ NHẤN ĐỂ CHỌN FILE TỪ MÁY ]                                      |  │
│  |   Hỗ trợ định dạng: .txt, .docx, .pdf, .epub                                                    |  │
│  |   Quy định: Dung lượng tối đa 50MB • Giới hạn 200,000 ký tự / dự án                             |  │
│  └ - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ┘  │
│  File đã chọn: [ 📄 de-men-phieu-luu-ky.epub ] (2.4 MB)                  [ Trạng thái: Đã đọc xong ]   │
│                                                                                                        │
│  CẤU HÌNH PHÂN ĐOẠN TỰ ĐỘNG (Segmentation Rules):                                                      │
│  * Quy tắc ngắt khối văn bản (Split rule):                                                             │
│    [ (•) Ngắt theo dấu chấm câu & xuống dòng ]  [ ( ) Ngắt cố định theo độ dài (300 - 500 ký tự) ]    │
│  * Tự động lọc bỏ: [x] Tiêu đề trang / Số trang (Header & Footer)   [x] Chú thích chân trang (Footnote)│
├────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│  [ Hủy bỏ ]                                                                 [ Tiếp tục: Chọn giọng -> ]│
└────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

#### Nút bấm, Sự kiện & Xử lý API Bước 1:
| Nút bấm / Vùng | Sự kiện | Mô tả hành vi & Validate | API Endpoint & Payload |
| :--- | :--- | :--- | :--- |
| **Vùng thả file (Dropzone)** | `onDragOver`, `onDrop`, `onChange` | Validate MIME type (`.txt`, `.docx`, `.pdf`, `.epub`). Kiểm tra dung lượng `<= 50MB`. Hiển thị loader `Đang đọc tài liệu...`. | `POST /api/upload/document`<br/>Payload: `FormData { file, splitRule }`. |
| **Tùy chọn cắt đoạn** | `onChange` | Chọn phương án ngắt block (`sentence` / `paragraph` / `length_chunk`). | Lưu vào state `segmentationConfig`. |
| **Nút `[Tiếp tục: Chọn giọng]`** | `onClick` | Kiểm tra tài liệu đã được trích xuất thành công (`totalCharacters > 0`). Chuyển Stepper sang Bước 2. | Gửi văn bản đã bóc tách vào store tạo dự án. |

---

### 2.2 Bước 2: Chọn Giọng Đọc & Thiết Lập Âm Thanh (Select Voice & Audio Tuning)

Bước này người dùng lựa chọn diễn viên lồng tiếng AI của Vbee phù hợp với thể loại sách (văn học, truyện kiếm hiệp, tài liệu khoa học, tin tức).

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│  BƯỚC 2 / 3: CHỌN GIỌNG ĐỌC & ĐẶT THÔNG SỐ ÂM THANH                                                    │
├────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│  BỘ LỌC GIỌNG ĐỌC VBEE AI:                                                                             │
│  * Vùng miền: [ Tất cả ] [ Miền Bắc ] [ Miền Nam ] [ Miền Trung ]                                      │
│  * Giới tính: [ Tất cả ] [ Nữ ] [ Nam ]       * Thể loại: [ Sách nói / Đọc truyện ▼ ]                  │
│                                                                                                        │
│  DANH SÁCH GIỌNG ĐỌC NỔI BẬT:                                                                          │
│  ┌──────────────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │ (•) [Avatar] Mai Phương (Nữ - Miền Bắc) • Đọc truyện truyền cảm, ấm áp       [▶ Nghe thử] [Đã chọn]│  │
│  │ ( ) [Avatar] Mạnh Dũng (Nam - Miền Bắc) • Giọng đọc tiểu thuyết, kiếm hiệp    [▶ Nghe thử] [Dùng]   │  │
│  │ ( ) [Avatar] Thảo Trinh (Nữ - Miền Nam) • Ngọt ngào, nhẹ nhàng, truyền cảm   [▶ Nghe thử] [Dùng]   │  │
│  │ ( ) [Avatar] Minh Hoàng (Nam - Miền Trung) • Trầm ấm, sâu lắng               [▶ Nghe thử] [Dùng]   │  │
│  └──────────────────────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                                        │
│  TINH CHỈNH THÔNG SỐ ĐỌC MẶC ĐỊNH CHO TOÀN BỘ SÁCH:                                                    │
│  * Tốc độ đọc (Speed):  Chậm ◄──────────[ 1.0x ]──────────► Nhanh   (Dải: 0.5x - 2.0x)                 │
│  * Độ cao giọng (Pitch): Trầm ◄──────────[ 0.0  ]──────────► Bổng    (Dải: -10Hz - +10Hz)              │
│  * Khoảng nghỉ giữa các đoạn (Break pause): [ 500 ms ▼ ] (Mặc định: 500ms giữa 2 khối câu)            │
├────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│  [ ← Quay lại: Tải lên ]                                                    [ Tiếp tục: Kiểm tra -> ]  │
└────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

#### Nút bấm, Sự kiện & Xử lý API Bước 2:
| Nút bấm / Điều khiển | Sự kiện | Mô tả hành vi & Validate | API Endpoint & Payload |
| :--- | :--- | :--- | :--- |
| **Filter Vùng miền / Giới tính** | `onClick` | Lọc realtime danh sách giọng `EDGE_TTS_VOICES` hoặc Vbee Premium Voices. | Client-side filter. |
| **Nút Nghe thử `[▶]`** | `onClick` | Phát audio mẫu câu chào: *"Xin chào, tôi là giọng đọc AI của Vbee"*. Nút chuyển icon `[⏸ Pause]`. | `POST /api/tts/preview`<br/>Payload: `{ voiceId, speed, pitch }`. |
| **Slider Tốc độ / Cao độ** | `onChange` | Cập nhật giá trị số thực `speed` (0.5 đến 2.0), `pitch`. | Lưu local state cấu hình âm thanh. |
| **Nút `[Tiếp tục: Kiểm tra]`** | `onClick` | Bắt buộc phải có 1 giọng được chọn (`selectedVoice !== null`). Chuyển sang Bước 3. | Lưu `voiceConfig` vào wizard store. |

---

### 2.3 Bước 3: Kiểm Tra & Xác Nhận Dự Án (Review, Verify & Create)

Bước chốt chặn kỹ thuật quan trọng nhất để đảm bảo chất lượng sách nói trước khi render:

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│  BƯỚC 3 / 3: KIỂM TRA TÀI LIỆU & XÁC NHẬN KHỞI TẠO DỰ ÁN                                               │
├────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│  1. THỐNG KÊ TỔNG QUAN (Document Overview):                                                            │
│     * Tên tác phẩm: [ Input: "Dế Mèn Phiêu Lưu Ký - Tô Hoài"                                        ]  │
│     * Tổng số ký tự: 48,250 ký tự  •  Tổng số từ: 9,650 từ  •  Số khối phân đoạn: 120 khối           │
│     * Giọng đọc chính: Mai Phương (Nữ Bắc)  •  Tốc độ: 1.0x  •  Thời lượng ước tính: ~48 phút          │
│     * Số dư tài khoản: 250,000 ký tự  ──>  Dự kiến trừ: 48,250 ký tự (Đủ điều kiện ✓)                 │
│                                                                                                        │
│  2. RÀ SOÁT TỪ VỰNG ĐẶC BIỆT (Pronunciation & Special Words):                                         │
│     Phát hiện 3 từ viết tắt / từ mượn tiếng nước ngoài cần kiểm tra phát âm:                           │
│     • "D-com 3G"  ──>  Phiên âm AI đề xuất: [ "Đê com ba gờ"         ▼ ]                               │
│     • "UNESCO"    ──>  Phiên âm AI đề xuất: [ "U-nét-xcô"            ▼ ]                               │
│                                                                                                        │
│  3. XEM TRƯỚC BẢN THẢO PHÂN ĐOẠN (Manuscript Segments Preview):                                        │
│     ┌────────────────────────────────────────────────────────────────────────────────────────────┐     │
│     │ Khối 1 (00:00 - 00:24 • 320 ký tự)                                                         │     │
│     │ "Tôi sống độc lập từ thuở bé. Ấy là tục lệ lâu đời trong họ nhà giũ chúng tôi..."          │     │
│     │ ────────────────────────────────────────────────────────────────────────────────────────── │     │
│     │ Khối 2 (00:24 - 00:52 • 385 ký tự)                                                         │     │
│     │ "Mẹ tôi chỉ nuôi chúng tôi được ba hôm, đến hôm thứ tư thì cho ra ở riêng..."             │     │
│     └────────────────────────────────────────────────────────────────────────────────────────────┘     │
├────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│  [ ← Quay lại: Chọn giọng ]                                                 [ ✨ Khởi Tạo Dự Án -> ]   │
└────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

#### Nút bấm, Sự kiện & Xử lý API Bước 3:
| Nút bấm / Input | Sự kiện | Mô tả hành vi & Validate | API Endpoint & Payload |
| :--- | :--- | :--- | :--- |
| **Input Tiêu đề tác phẩm** | `onChange` | Cho phép người dùng chỉnh lại tên dự án trước khi lưu. Không được để trống. | Client validation. |
| **Sửa phiên âm từ khó** | `onChange` | Người dùng gõ phiên âm chuẩn cho các danh từ riêng/từ nước ngoài. | Lưu vào mảng `pronunciationDictionary[]`. |
| **Nút `[✨ Khởi Tạo Dự Án]`** | `onClick` (`onSubmit`) | Kiểm tra số dư ký tự tài khoản (`userBalance >= totalCharacters`). Bật loading `Đang khởi tạo...`. Gọi API tạo dự án và đổ blocks. | `POST /api/projects`<br/>Payload: Xem mục 3 bên dưới. |

---

## 3. Cấu Trúc Payload & Dữ Liệu Gửi Đi (API & Data Flow)

Khi người dùng nhấn nút **`[✨ Khởi Tạo Dự Án]`** ở Bước 3, hệ thống thực hiện lệnh gọi API:

### 3.1 Request Payload Tạo Dự Án (`POST /api/projects`)
```json
{
  "name": "Dế Mèn Phiêu Lưu Ký - Tô Hoài",
  "type": "audiobook",
  "data": {
    "fileName": "de-men-phieu-luu-ky.epub",
    "totalCharacters": 48250,
    "totalWords": 9650,
    "estimatedDurationSeconds": 2880,
    "voiceConfig": {
      "voiceId": "vi-VN-MaiPhuongNeural",
      "voiceName": "Mai Phương",
      "region": "Bắc",
      "gender": "Nữ",
      "speed": 1.0,
      "pitch": 0.0,
      "breakPauseMs": 500
    },
    "pronunciationRules": [
      { "word": "D-com 3G", "replacement": "Đê com ba gờ" },
      { "word": "UNESCO", "replacement": "U-nét-xcô" }
    ],
    "blocks": [
      {
        "id": 1,
        "title": "Khối 1",
        "content": "Tôi sống độc lập từ thuở bé. Ấy là tục lệ lâu đời trong họ nhà giũ chúng tôi...",
        "characterCount": 320,
        "voiceId": "vi-VN-MaiPhuongNeural",
        "speed": 1.0,
        "startTime": "00:00",
        "endTime": "00:24",
        "startSeconds": 0,
        "endSeconds": 24,
        "status": "ready_to_convert"
      },
      {
        "id": 2,
        "title": "Khối 2",
        "content": "Mẹ tôi chỉ nuôi chúng tôi được ba hôm, đến hôm thứ tư thì cho ra ở riêng...",
        "characterCount": 385,
        "voiceId": "vi-VN-MaiPhuongNeural",
        "speed": 1.0,
        "startTime": "00:24",
        "endTime": "00:52",
        "startSeconds": 24,
        "endSeconds": 52,
        "status": "ready_to_convert"
      }
    ]
  }
}
```

### 3.2 Response & Điều Hướng
- **Server phản hồi thành công (201 Created)**:
  ```json
  {
    "id": "proj_audiobook_98a7b6c5",
    "name": "Dế Mèn Phiêu Lưu Ký - Tô Hoài",
    "type": "audiobook",
    "createdAt": 1730910000
  }
  ```
- **Điều hướng Client**:
  ```javascript
  navigate(`/project/${project.id}`, {
    state: {
      type: "audiobook",
      blocks: project.data.blocks,
      voiceConfig: project.data.voiceConfig
    }
  });
  ```

---

## 4. Công Thức & Quy Chuẩn Kỹ Thuật Tính Toán

1. **Công thức ước tính thời lượng âm thanh đọc tiếng Việt**:
   $$\text{Thời lượng (giây)} = \frac{\text{Tổng số ký tự}}{16} \times \frac{1}{\text{Tốc độ đọc (speed)}}$$
   *(Quy chuẩn Vbee: Người Việt đọc trung bình 15 - 17 ký tự/giây ở tốc độ chuẩn 1.0x)*.
2. **Quy tắc phân đoạn an toàn (Safety Block Size)**:
   - Một khối câu tối ưu trong Vbee là từ **200 đến 500 ký tự** (tương đương 1 đến 3 câu hoàn chỉnh).
   - Không nên để khối vượt quá 1,000 ký tự để tránh lỗi sinh audio ngắt quãng và giúp việc nghe thử, sinh lại lẻ từng đoạn đạt tốc độ cao nhất.
