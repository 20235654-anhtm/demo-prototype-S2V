# 06 — Bài Học Kiến Trúc Từ ElevenLabs Audiobooks Cho Prototype Story2Video

> **Mục tiêu:** Rút trích các quy chuẩn công nghiệp của ElevenLabs Audiobooks (nền tảng hàng đầu thế giới về xử lý truyện dài và sách nói) để áp dụng vào hệ thống Story2Video (Book to Video).

---

## 1. Bảng Đối Chiếu Thực Thể: ElevenLabs Audiobooks vs Story2Video

| Khái niệm nghiệp vụ | ElevenLabs Audiobooks / Studio | Story2Video Prototype (Của chúng ta) | Độ khớp kiến trúc |
|---|---|---|---|
| **Dự án tổng** | `Project` (`/v1/projects/{id}`) | `projects` (`/v1/projects/{pid}`) | **100% Khớp:** Quản lý tiêu đề, ngôn ngữ, cấu hình chung. |
| **Chương truyện** | `Chapter` (`.../chapters/{chapterId}`) | `chapters` (`.../chapters/{cid}`) | **100% Khớp:** Quản lý mục lục và văn bản nguyên văn của chương. |
| **Phân đoạn đọc** | `Block` / `Node` (Đoạn/câu) | `Shot` (Khung hình & đoạn text nguồn) | **Tương đồng:** Đơn vị nhỏ nhất để gán giọng, nghe thử và sinh lại lẻ. |
| **Diễn viên & Nhân vật** | `Cast List` (`.../used-voices`) | `Story Assets` (Nhân vật - `kind = CHARACTER`) | **Khớp:** Gán giọng người dẫn chuyện (Narrator) và giọng riêng cho nhân vật. |
| **Trạng thái audio bị cũ** | `is-export-stale` / `Stale Block` | `narrations.status = OUTDATED` (BR-06) | **100% Khớp:** Khi sửa text hoặc đổi giọng, audio cũ bị đánh dấu cần sinh lại. |
| **Lịch sử lần đọc (Takes)** | `Block Snapshots` (Take 1, Take 2) | `narrations.version_no` (D-04) | **Khớp:** Mỗi lần bấm đọc lại tạo một bản ghi mới, không ghi đè, cho phép khôi phục. |
| **Từ điển phát âm** | `Pronunciation Dictionary` (`.../pronunciation-dictionaries`) | `pronunciation_entries` (ALIAS / SYM rules) | **100% Khớp:** Sửa cách đọc tên riêng mà không làm thay đổi văn bản truyện gốc. |
| **Kiểm tra trước khi xuất** | `Audiobook QC` | `ReadinessChecker` (UC-06.16a, BR-23) | **Khớp:** Chỉ cho phép xuất khi 100% các đoạn đã hoàn tất và không bị lỗi. |

---

## 2. 5 Tính Năng "Đắt Giá Nhất" Của ElevenLabs Cần Học Hỏi Cho Story2Video

### 2.1 Bố cục Manuscript Block với Mini Toolbar tại chỗ
* ElevenLabs không hiển thị văn bản như một file Word dài ngoằng khó quản lý, mà tự động ngắt thành các **Khối văn bản (Blocks)**.
* Mỗi block đi kèm ngay 1 thanh công cụ nhỏ:
  `[Badge Giọng đọc 👤] [▶ Nút nghe thử] [🔄 Nút đọc lại] [⏸ Thêm khoảng nghỉ]`
👉 **Áp dụng vào Story2Video:**
Tại cột giữa của màn hình Studio biên tập, mỗi **Shot Card** của chúng ta chính là một Block tương tự, nhưng được bổ sung thêm:
`[Ảnh minh họa Shot 16:9]` + `[Đoạn văn bản nguồn]` + `[▶ Nghe thử audio]` + `[🔄 Sinh lại ảnh / giọng]`.

### 2.2 Quản lý Nhân vật bị ảnh hưởng (Affected Nodes Tracking)
* **Vấn đề thực tế:** Khi người dùng đổi diễn viên lồng tiếng cho nhân vật "Lan", làm sao biết những đoạn nào trong truyện bị ảnh hưởng?
* **Cách ElevenLabs giải quyết:** API `.../voices/{id}/edit/affected-nodes` tự động quét toàn bộ sách và chỉ ra có bao nhiêu đoạn cần cập nhật. Giao diện hiện nút: **`[Chỉ đọc lại các đoạn bị ảnh hưởng]`**.
👉 **Áp dụng vào Story2Video:**
Khi người dùng sửa mô tả nhân vật hoặc vẽ lại ảnh nhân vật ở cột trái (PT-04), hệ thống tự động đánh dấu các shot có mặt nhân vật đó bằng biểu tượng cảnh báo ⚠️ và cung cấp nút: **`[Sinh lại các shot có thay đổi]`** (Regenerate All Changes).

### 2.3 Quản lý phiên bản không ghi đè (Snapshots / Takes)
* Trong thu âm nghệ thuật, lần sinh lại thứ 2 chưa chắc đã hay hơn lần 1.
* ElevenLabs lưu lại từng lần sinh dưới dạng `Take 1`, `Take 2`. Nếu người dùng nghe Take 2 không thích, họ có thể bấm **`Restore Take 1`** ngay lập tức mà không tốn phí sinh lại.
👉 **Áp dụng vào Story2Video:**
Tận dụng quy tắc bất biến **D-04 (Phiên bản hóa đầu ra AI)** đã có sẵn trong bảng `illustrations` và `narrations` của chúng ta để làm menu chọn lại các ảnh và audio đã sinh trước đó.

### 2.4 Trải nghiệm Thanh Audio Player toàn cục (Global Player Bar)
* ElevenLabs đặt một thanh Player cố định ở đáy màn hình (Bottom Bar):
  Có nút `[Play All]`, thanh trượt tổng thời lượng (Total duration), nút tốc độ đọc (1.0x, 1.2x).
  Khi bấm Play, màn hình tự động cuộn (Auto-scroll) theo đoạn văn bản đang được đọc và tô sáng chữ (Highlight).
👉 **Áp dụng vào Story2Video:**
Thanh bottom player này giúp người dùng kiểm tra nhịp điệu tổng thể của toàn bộ truyện trước khi bấm nút tạo video chính thức.

### 2.5 Cơ chế Tách Lời Thoại Bằng Thao Tác Bôi Đen (Highlight to Assign Voice)
* Người dùng chỉ cần bôi đen một câu nói trong đoạn văn và nhấp vào nhân vật bên cột Cast -> hệ thống tự động tách câu thoại đó thành block riêng mang giọng nhân vật mà không làm hỏng cấu trúc câu văn bản gốc.
👉 **Áp dụng vào Story2Video:**
Cho phép người dùng bôi đen câu thoại trong đoạn trích sách để gán trực tiếp cho nhân vật phụ, giúp phân vai lồng tiếng đa giọng cực kỳ trực quan.
