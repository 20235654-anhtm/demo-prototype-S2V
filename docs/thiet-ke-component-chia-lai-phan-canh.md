# Thiết Kế Component: Chia Lại Phân Cảnh (Re-split Shots)

Tài liệu đặc tả các component phục vụ 3 Use Case:
1. **Chia lại 1 hoặc nhiều phân cảnh đã chọn** *(Scoped Re-split)*
2. **Chia lại toàn bộ phân cảnh** *(Re-split All)*
3. **Duyệt kết quả chia lại** *(Diff Preview & Confirm)*

---

## 1. UC 1: Chia lại 1 hoặc nhiều phân cảnh

Bao gồm bộ đôi: **`ScriptSelectionToolbar`** (Thanh chọn nhiều) và **`ResplitPopover`** (Khung nhập yêu cầu).

### 1.1. Component `ScriptSelectionToolbar` (Sticky Header)
* **Vị trí:** Ghim cố định trên đỉnh Cột Kịch Bản bên trái (Sticky Top khi cuộn chuột).
* **Kích hoạt:** Xuất hiện ngay khi người dùng tick chọn $\ge 1$ phân cảnh bất kỳ.
* **Bố cục & Trạng thái nút:**

```
+-----------------------------------------------------------------------------------+
|  [☑ Đã chọn N cảnh]    |    [✦ Chia lại]    [🔗 Gộp]                 [✕ Bỏ chọn]  |
+-----------------------------------------------------------------------------------+
```

| Nút bấm | Chọn 1 cảnh | Chọn nhiều cảnh LIỀN KỀ | Chọn nhiều cảnh KHÔNG LIỀN KỀ |
|---|:---:|:---:|:---:|
| **[ ✦ Chia lại ]** | Sáng (Mở Popover) | Sáng (Mở Popover) | Sáng (Mở Popover) |
| **[ 🔗 Gộp ]** | Ẩn / Mờ | **Sáng** (Gộp thẳng thành 1 cảnh) | **Làm mờ (Disabled)** *(Hover hiện tooltip: "Chỉ gộp được các cảnh liền kề")* |
| **[ ✕ Bỏ chọn ]** | Bỏ tick, đóng thanh bar | Bỏ tick toàn bộ | Bỏ tick toàn bộ |

---

### 1.2. Component `ResplitPopover` (Khung nhập yêu cầu & gợi ý)
* **Kích hoạt:** Mở ra khi bấm `[ ✦ Chia lại ]` trên Sticky Header (hoặc icon ✦ trên mỗi thẻ cảnh).
* **Cấu trúc 4 phần:**
  1. **Header:** Tiêu đề ngắn gọn (ví dụ: `✦ Chia lại Cảnh 2–4` hoặc `✦ Chia lại Cảnh 2, 5, 8`) + nút đóng `✕`.
  2. **Context Tabs (2 Tab điều hướng ngữ cảnh):**
     * **Tab `[ 🔀 Chia lại cả đoạn ]`:** Gom nội dung các cảnh lại để chia mốc ranh giới mới. *(Chỉ mở khi chọn các cảnh LIỀN KỀ; tự động khóa khi không liền kề)*.
     * **Tab `[ ✂ Chia nhỏ từng cảnh ]`:** Áp dụng cùng 1 quy tắc cắt nhỏ độc lập cho từng cảnh. *(Khả dụng cho mọi trường hợp)*.
  3. **Input Box:** Ô nhập yêu cầu tự do + Nút gửi `[ ↑ ]`.
  4. **Prompt Chips:** Các thẻ gợi ý nhanh bên dưới. **Click vào chip sẽ tự động điền văn bản mẫu vào ô Input** để người dùng gửi ngay hoặc gõ thêm tùy ý.

---

### 1.3. Chi tiết hiển thị Popover theo từng trường hợp cụ thể:

#### TRƯỜNG HỢP A: Khi chọn nhiều cảnh LIỀN KỀ (Ví dụ: Cảnh 2, 3, 4)
Người dùng có đầy đủ cả 2 Tab để lựa chọn:

```
+-------------------------------------------------------------------------------+
| ✦ Chia lại phân cảnh (Cảnh 2 – 4)                                           ✕ |
+-------------------------------------------------------------------------------+
|   [ (●) Chia lại cả đoạn ]           [ (○) Chia nhỏ từng cảnh ]               |
|                                                                               |
|  +-------------------------------------------------------------------------+  |
|  | Nhập yêu cầu phân chia lại cho cả đoạn này...                           |  |
|  |                                                                      [↑]|  |
|  +-------------------------------------------------------------------------+  |
|                                                                               |
|  Gợi ý nhanh (Bấm để tự điền):                                                |
|  [ ✂ Gom lại rồi chia đôi ]      [ ⚡ Chia lại theo nhịp nhanh (~4s/shot) ]   |
|  [ 🎯 Tách câu chốt làm điểm nhấn ]                                           |
+-------------------------------------------------------------------------------+
```

* **Văn bản tự điền tương ứng khi click chip:**
  * Chip `[ ✂ Gom lại rồi chia đôi ]`: `"Gom toàn bộ nội dung của các cảnh này lại và chia đều thành 2 phân cảnh cân đối."`
  * Chip `[ ⚡ Chia lại theo nhịp nhanh (~4s/shot) ]`: `"Chia lại toàn bộ đoạn này thành các phân cảnh ngắn (mỗi cảnh khoảng 3-5 giây) để tạo nhịp video dồn dập."`
  * Chip `[ 🎯 Tách câu chốt làm điểm nhấn ]`: `"Gộp phần đầu lại, tách riêng câu cuối cùng ra thành 1 phân cảnh độc lập."`

---

#### TRƯỜNG HỢP B: Khi chọn nhiều cảnh KHÔNG LIỀN KỀ (Ví dụ: Cảnh 2, 5, 8)
Hệ thống tự động khóa Tab 1 (vì không liền kề nên không thể gom đoạn) và chọn thẳng vào Tab 2:

```
+-------------------------------------------------------------------------------+
| ✦ Chia lại phân cảnh (Cảnh 2, 5, 8)                                         ✕ |
+-------------------------------------------------------------------------------+
|   [ 🔒 Chia lại cả đoạn (Cần liền kề) ]     [ (●) Chia nhỏ từng cảnh ]        |
|                                                                               |
|  +-------------------------------------------------------------------------+  |
|  | Nhập quy tắc chia nhỏ cho từng cảnh đã chọn...                          |  |
|  |                                                                      [↑]|  |
|  +-------------------------------------------------------------------------+  |
|                                                                               |
|  Gợi ý quy tắc chia nhỏ (Áp dụng độc lập cho mỗi cảnh):                       |
|  [ ✂ Mỗi câu là 1 cảnh ]       [ ✂ Chia đôi từng cảnh ]                       |
|  [ ⚡ Giới hạn nhịp nhanh (~5s) ]                                             |
+-------------------------------------------------------------------------------+
```

* **Văn bản tự điền tương ứng khi click chip:**
  * Chip `[ ✂ Mỗi câu là 1 cảnh ]`: `"Duyệt qua từng cảnh đã chọn, tách mỗi câu trọn vẹn thành một phân cảnh riêng biệt."`
  * Chip `[ ✂ Chia đôi từng cảnh ]`: `"Tìm điểm ngắt ý phù hợp nhất ở giữa để chia đôi từng cảnh đã chọn."`
  * Chip `[ ⚡ Giới hạn nhịp nhanh (~5s) ]`: `"Chia nhỏ từng cảnh sao cho độ dài mỗi cảnh dao động quanh mức 4-6 giây."`

---

#### TRƯỜNG HỢP C: Khi chỉ chọn ĐÚNG 1 CẢNH (Ví dụ: Cảnh 3)
Popover tự động ẩn thanh Tab (vì chỉ có 1 cảnh thì không có khái niệm gộp đoạn), giao diện tinh giản tối đa:

```
+-------------------------------------------------------------------------------+
| ✦ Chia lại Cảnh 3                                                           ✕ |
+-------------------------------------------------------------------------------+
|  +-------------------------------------------------------------------------+  |
|  | Nhập yêu cầu chia nhỏ cảnh này...                                       |  |
|  |                                                                      [↑]|  |
|  +-------------------------------------------------------------------------+  |
|                                                                               |
|  Gợi ý nhanh (Bấm để tự điền):                                                |
|  [ ✂ Mỗi câu là 1 cảnh ]       [ ✂ Chia đôi cảnh này ]                        |
|  [ 🎯 Tách câu cuối ra riêng ]                                                |
+-------------------------------------------------------------------------------+
```

* **Văn bản tự điền tương ứng khi click chip:**
  * Chip `[ ✂ Mỗi câu là 1 cảnh ]`: `"Chia nhỏ cảnh này ra, mỗi câu trọn vẹn thành một phân cảnh riêng biệt."`
  * Chip `[ ✂ Chia đôi cảnh này ]`: `"Tìm điểm ngắt ý phù hợp nhất ở giữa để chia đôi phân cảnh này."`
  * Chip `[ 🎯 Tách câu cuối ra riêng ]`: `"Giữ nguyên đoạn đầu, tách riêng câu cuối cùng ra thành phân cảnh mới độc lập."`

---

## 2. UC 2: Chia lại toàn bộ phân cảnh (`ResplitAllModal`)

* **Vị trí:** Nút `[ ✦ Re-split all shots ]` trên thanh công cụ chung của Cột Kịch Bản.
* **Giao diện Modal:**

```
+-------------------------------------------------------------------------------+
|  Re-split all shots                                                         ✕ |
+-------------------------------------------------------------------------------+
|  Chọn cơ chế chia lại toàn bộ kịch bản:                                       |
|                                                                               |
|  (●) 1. Tự động theo ngữ nghĩa (Auto scenes) — [Khuyên dùng]                  |
|      AI tự đọc hiểu nội dung, tự nhận biết khi đổi bối cảnh hoặc lời thoại    |
|      để gom nhóm mượt mà và tự nhiên nhất.                                    |
|                                                                               |
|  (○) 2. Theo thời lượng mong muốn                                             |
|      Mỗi phân cảnh dài khoảng: [  12  ] giây                                  |
|      Gợi ý chuẩn (Bấm để tự điền số giây vào ô):                              |
|      [ ⚡ Nhanh (Shorts / Reels): ~6s ]                                       |
|      [ 📖 Vừa (Kể chuyện YouTube): ~12s ]                                     |
|      [ 🎬 Chậm (Điện ảnh / Tóm tắt sách): ~20s ]                              |
|                                                                               |
|  (○) 3. Theo số lượng phân cảnh mục tiêu                                      |
|      Chia toàn bộ chương thành đúng: [  15  ] phân cảnh                       |
|      (Phù hợp khi bạn có ngân sách cố định cho số lượng hình ảnh)             |
|                                                                               |
|  ---------------------------------------------------------------------------  |
|  ⚠ Cảnh báo: Thao tác này sẽ chia lại toàn bộ kịch bản và làm mới các hình    |
|     ảnh chưa khóa.                                                            |
|                                                                               |
|                                        [ Hủy ]   [ Áp dụng chia lại toàn bộ ]  |
+-------------------------------------------------------------------------------+
```

* **Cơ chế xử lý:**
  * Bấm vào các chip `~6s`, `~12s`, `~20s` sẽ tự động điền số vào ô input (người dùng vẫn gõ số khác được).
  * Backend sử dụng công thức: $\text{target ký tự} = \text{target\_seconds} \times 14 \text{ ký tự/s}$ (tiếng Việt) để điều khiển LLM chia shot.

---

## 3. UC 3: Duyệt kết quả chia lại (`DiffPreview` dạng Inline)

Hiển thị trực tiếp ngay bên trong danh sách kịch bản (Script Feed), thay thế ngay tại vị trí các cảnh cũ tương tự giao diện code diff của Cursor / GitHub Copilot:

```
+-------------------------------------------------------------------------------+
|  CỘT KỊCH BẢN (SCRIPT FEED)                                                  |
+-------------------------------------------------------------------------------+
|                                                                               |
|  [ Card Cảnh 1 bình thường... ]                                               |
|                                                                               |
|  ┌── KHU VỰC DIFF PREVIEW ─────────────────────────────────────────────────┐  |
|  │  Thanh duyệt ghim trên đầu:       [ ✔ Áp dụng ]      [ ✕ Hủy ]          │  |
|  │                                                                         │  |
|  │  [Bản cũ - Bị làm mờ 40%]                                               │  |
|  │  [Ảnh cũ]  Cảnh 2: Taylor Swift công bố bìa đĩa. Bức ảnh gây tranh...   │  |
|  │                                                                         │  |
|  │  [Đề xuất mới - Viền xanh nét đứt]                                      │  |
|  │  ┌ - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ┐  │  |
|  │  │ [Ảnh chờ sinh]  Cảnh 2A: Taylor Swift công bố bìa đĩa.            │  │  |
|  │  └ - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ┘  │  |
|  │  ┌ - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ┐  │  |
|  │  │ [Ảnh chờ sinh]  Cảnh 2B: Bức ảnh gây tranh cãi vì chỉnh sửa...    │  │  |
|  │  └ - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ┘  │  |
|  └─────────────────────────────────────────────────────────────────────────┘  |
|                                                                               |
|  [ Card Cảnh 3 bình thường... ]                                               |
|                                                                               |
+-------------------------------------------------------------------------------+
```

* **Trạng thái hiển thị:**
  * **Cảnh cũ (bị thay thế):** Bị làm mờ nhẹ (40%), tạm khóa không cho click chỉnh sửa, gắn nhãn `[Bản cũ]`.
  * **Cảnh mới đề xuất:** Hiển thị viền nét đứt màu xanh lá, ảnh thumbnail ở dạng chờ sinh `[Ảnh chờ sinh]` (ảnh sẽ được sinh sau khi áp dụng).

* **Thanh duyệt (Review Bar):** Ghim ngay trên đầu khối Diff với 2 nút hành động:
  * **`[ ✔ Áp dụng ]`:** Cập nhật các phân cảnh mới vào kịch bản chính thức, đẩy trạng thái cũ vào bộ nhớ hoàn tác (hỗ trợ `Ctrl + Z` để quay lại được), đóng chế độ xem trước.
  * **`[ ✕ Hủy ]`:** Hủy bỏ đề xuất, xóa các cảnh mới dự kiến và khôi phục lại 100% trạng thái ban đầu của các cảnh cũ.

* **Hành vi tương tác:**
  * Màn hình tự động cuộn đến giữa cụm Diff khi AI vừa trả về kết quả để người dùng thấy ngay.
  * Tạm thời khóa việc chỉnh sửa text hoặc xóa các cảnh nằm ngoài khu vực Diff để tránh xung đột dữ liệu trong lúc người dùng đang duyệt.
