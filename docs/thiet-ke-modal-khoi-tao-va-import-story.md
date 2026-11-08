# Thiết Kế Chi Tiết: Modal Khởi Tạo & Import Story (Creation & Import Modal)

Tài liệu đặc tả toàn diện cấu trúc giao diện, luồng tương tác và kế hoạch triển khai Frontend trong thư mục `fe/` cho **Modal Khởi Tạo & Import Story (`Story`)**. Modal được kích hoạt khi:
1. Nhấp nút **`[ + Tạo dự án mới ]`** trên Toolbar trang chủ.
2. Nhấp vào bất kỳ thẻ hoặc dòng dự án nào có gắn tag **`● Creation draft`** để tiếp tục thiết lập bản thảo đang dang dở.

---

## PHẦN 1: BÓC TÁCH CẤU TRÚC GIAO DIỆN & HÀNH VI TƯƠNG TÁC

### 1. Bố cục Khung Modal chuẩn & Cột tiến trình (Stepper Sidebar)

Khung modal tuân thủ chính xác kiến trúc dialog nguyên bản (`CreateStoryModal.tsx`):
* **Header:** Tiêu đề `[📖] Story` bên trái và nút đóng `[ ✕ ]` bên phải.
* **Body:** Được chia làm 2 cột:
  * **Cột bước tiến trình bên trái (`w-55` / ~220px):** Chỉ hiển thị các nhãn bước **ngắn gọn, xúc tích**:
    1. `Tải lên`
    2. `Thiết lập`
    3. `Giọng đọc` *(nếu ở Bước 2 chọn Single cast)* HOẶC `Nhân vật` *(nếu ở Bước 2 chọn Multi cast)*.
    *(Không có các dòng mô tả rườm rà dưới tên bước).*
  * **Khung nội dung bên phải (`flex-1`):** Chứa giao diện nội dung của bước đang kích hoạt.
* **Footer chung:** Trải dài toàn bộ đáy modal (không bị vách ngăn chia cắt).
  * Toàn bộ cụm nút hành động được căn về **góc dưới bên phải (`justify-end gap-3`)**:
    * Nút **`[ ← Quay lại ]`**: Nằm bên trái của nút chính (chỉ xuất hiện từ Bước 2, ẩn khi đang ở Bước 1).
    * Nút **`[ Tiếp tục → ]`** (ở Bước 1 & 2) hoặc **`[ Tạo dự án ]`** (ở Bước 3, màu vàng nổi bật).
  *(Tự động lưu bản nháp `● Creation draft` khi người dùng bấm `[ ✕ ]` hoặc đóng modal).*

```
+----------------------------------------------------------------------------------------------------+
| [📖] Story                                                                                    [ ✕ ]|
+-------------------+--------------------------------------------------------------------------------+
| (CỘT BƯỚC DỌC)    | (NỘI DUNG TỪNG BƯỚC)                                                           |
|                   |                                                                                |
| (●) 1. Tải lên    | [ ... Nội dung tương ứng theo bước được chọn ... ]                             |
| (○) 2. Thiết lập  |                                                                                |
| (○) 3. Giọng đọc  |                                                                                |
|     / Nhân vật    |                                                                                |
|                   |                                                                                |
+-------------------+--------------------------------------------------------------------------------+
|                                                  [ ← Quay lại ]             [ Tiếp tục → / Tạo dự án ] |
+----------------------------------------------------------------------------------------------------+
```

---

### 2. Chi tiết Bước 1: Tải lên (`Tải lên`)

Giữ nguyên trải nghiệm tải file và xem trước nội dung văn bản kịch bản như hiện tại:

```
+----------------------------------------------------------------------------------------------------+
| [DOCX] Bà Nguyễn Thị Thược.docx                                                 [ 🔄 Đổi tệp ]      |
| 58 KB · 3.930 ký tự · khoảng 00:04:24                                                              |
| +------------------------------------------------------------------------------------------------+ |
| | Bà Nguyễn Thị Thược sinh năm 1940, tại một làng quê nhỏ thuộc tỉnh Hà Nam. Bà lớn lên trong...  | |
| | Tuổi thơ của bà gắn liền với những cánh đồng lúa bát ngát, với tiếng ru ầu ơ của mẹ...         | |
| | Năm 18 tuổi, bà tham gia đội thanh niên xung phong, cùng đồng đội mở đường, xây cầu...         | |
| |                                                                                                | |
| | [Cuộn để đọc tiếp toàn văn bản thảo...]                                                        | |
| +------------------------------------------------------------------------------------------------+ |
| Xem trước 3.000 ký tự đầu.                                                                        |
+----------------------------------------------------------------------------------------------------+
```

* **Trạng thái chưa chọn file:**
  * Khung Dropzone lớn: Icon tải tệp, dòng chữ *"Kéo thả tệp vào đây hoặc nhấn để chọn tệp từ máy tính"*. Hỗ trợ: `DOCX`, `EPUB`, `PDF`, `TXT`.
* **Trạng thái đã chọn file:**
  * **Thẻ tệp:** Badge định dạng (`DOCX`), Tên tệp, Dung lượng, Số ký tự, Thời lượng ước tính đọc và nút `[ 🔄 Đổi tệp ]`.
  * **Khung xem trước văn bản (Text Preview Box):** Hộp cuộn văn bản hiển thị 3.000 ký tự đầu để người dùng kiểm tra nhanh chất lượng nội dung trước khi cấu hình.

---

### 3. Chi tiết Bước 2: Thiết lập (`Thiết lập`)

Bước này tập trung toàn bộ cấu hình dự án: Phong cách đọc, Ảnh bìa sách, Ngôn ngữ tác phẩm, Phong cách mỹ thuật (có hình ảnh minh họa) và Tỷ lệ ảnh muốn sinh. Trong đó, khối **Ảnh bìa sách** và **Ngôn ngữ tác phẩm** được xếp theo **hàng dọc** để đảm bảo không gian rộng rãi, không bị co cụm:

```
+----------------------------------------------------------------------------------------------------+
| Phong cách đọc                                                                                     |
| +---------------------------------------------------+ +------------------------------------------+ |
| | (•) Single cast                                   | | ( ) Multi cast                           | |
| | Một giọng người kể chuyện cho toàn bộ cuốn sách   | | Các giọng đọc riêng biệt cho người kể    | |
| | Thích hợp cho sách tóm tắt, tiểu luận, phóng sự   | | chuyện và từng nhân vật trong tác phẩm   | |
| +---------------------------------------------------+ +------------------------------------------+ |
|                                                                                                    |
| Ảnh bìa sách                                                                                       |
| +-----------+                                                                                      |
| | [ ẢNH     |  [ Thay ảnh bìa ]                                                                    |
| |   BÌA     |  [ Xóa ảnh bìa ]                                                                     |
| |  PREVIEW] |                                                                                      |
| +-----------+                                                                                      |
|                                                                                                    |
| Ngôn ngữ tác phẩm                                                                                  |
| +------------------------------------------------------------------------------------------------+ |
| | 🇻🇳 Tiếng Việt                                                                               [v] | |
| +------------------------------------------------------------------------------------------------+ |
|                                                                                                    |
| Phong cách mỹ thuật                                                                                |
| +---------------+ +---------------+ +---------------+ +---------------+                            |
| | [🖼 ẢNH DEMO] | | [🖼 ẢNH DEMO] | | [🖼 ẢNH DEMO] | | [🖼 ẢNH DEMO] |                            |
| | Ghibli Anime  | | 3D Cinematic  | | Watercolor    | | Cyberpunk     |                            |
| +---------------+ +---------------+ +---------------+ +---------------+                            |
|                                                                                                    |
| Tỷ lệ ảnh muốn sinh                                                                                |
| [ 16:9 (Ngang chuẩn) ]      [ 9:16 (Dọc) ]      [ 1:1 (Vuông) ]      [ 4:3 (Cổ điển) ]             |
+----------------------------------------------------------------------------------------------------+
```

* **1. Phong cách đọc:**
  * Chuyển sang Bước 2 để người dùng không bị gián đoạn màn hình tải tệp ở Bước 1.
  * Khi chọn **`Single cast`**: Bước 3 trên cột bên trái sẽ có tên là **`Giọng đọc`**.
  * Khi chọn **`Multi cast`**: Bước 3 trên cột bên trái sẽ có tên là **`Nhân vật`**.
* **2. Ảnh bìa sách (Xếp dọc phía trên):**
  * Tự động nhận diện từ file EPUB/PDF hoặc người dùng upload ảnh ngoài.
  * Khi đã có ảnh: Hiển thị thumbnail + 2 nút thao tác **`[ Thay ảnh bìa ]`** và **`[ Xóa ảnh bìa ]`**.
* **3. Ngôn ngữ tác phẩm (Xếp dọc ngay dưới khối Ảnh bìa):**
  * Đặt theo hàng dọc để đảm bảo không gian hiển thị dropdown thoáng đãng, không bị chèn ép.
  * Dropdown chọn ngôn ngữ gốc của kịch bản, hiển thị cờ quốc gia `🇻🇳 Tiếng Việt`.
* **4. Phong cách mỹ thuật (CÓ ẢNH MINH HỌA):**
  * Mỗi lựa chọn là một card trực quan gồm **ảnh thumbnail mẫu minh họa phong cách** bên trên và tên phong cách bên dưới (Ví dụ: `Ghibli Anime`, `3D Cinematic`, `Watercolor Painting`, `Vintage Retro Comic`, `Photorealistic`).
* **5. Tỷ lệ ảnh muốn sinh:**
  * Lựa chọn tỷ lệ cho các ảnh AI sẽ sinh ra cho các phân cảnh/shot: `16:9` (khung ngang), `9:16` (khung dọc), `1:1` (khung vuông), `4:3` (truyện cổ điển).

---

### 4. Chi tiết Bước 3: Giọng đọc / Nhân vật

Tùy vào phong cách đọc đã chọn ở Bước 2, Bước 3 sẽ tự động kích hoạt một trong hai giao diện:

#### Nhánh 3A: Chọn Giọng đọc (`Giọng đọc` - Khi chọn Single cast)
Áp dụng theo giao diện tuyển chọn giọng:

```
+----------------------------------------------------------------------------------------------------+
| [ 🔍 Tìm kiếm giọng đọc...                         ]  [ 🇻🇳 Tiếng Việt [v] ]                       |
|                                                                                                    |
| Bộ lọc nhanh:  [ Tất cả Accent [v] ]  [ Thể loại [v] ]  [ Giới tính [v] ]  [ Độ tuổi [v] ]         |
|                                                                                                    |
| [ Khám phá ]  |  [ Giọng của tôi ]                                                                 |
|----------------------------------------------------------------------------------------------------|
| (●) Triệu Dương - Trầm ấm, truyền cảm                                                 [ ✓ ]  [ ▶ ] |
|     Giọng nam miền Nam, trầm ấm, truyền cảm, thích hợp đọc truyện & tin tức.                       |
|----------------------------------------------------------------------------------------------------|
| ( ) Cẩm Hồng - Miền Nam bản địa                                                              [ ▶ ] |
|     Giọng nữ miền Nam, nhẹ nhàng, tự nhiên, thích hợp tản văn và truyện ngắn.                      |
|----------------------------------------------------------------------------------------------------|
| ( ) Duy Khoa - Hà Nội chuẩn                                                                  [ ▶ ] |
|     Giọng nam Bắc chuẩn, rõ ràng, phong thái MC thời sự & phóng sự.                                |
+----------------------------------------------------------------------------------------------------+
```
* Bộ lọc Accent (Bắc, Trung, Nam), Giới tính (Nam, Nữ), Độ tuổi, Thể loại.
* 2 Tab: `Khám phá` (Giọng mẫu có sẵn) và `Giọng của tôi` (Giọng clone cá nhân).
* Thẻ giọng có avatar (có badge check), tên giọng, mô tả âm sắc, biểu tượng checkmark `[ ✓ ]` khi được chọn và nút Play **`[ ▶ ]`** (chỉ có icon `[ ▶ ]`, không để chữ "Nghe thử" để giao diện gọn gàng). *(Đã bỏ hoàn toàn nút ba chấm `...` bên cạnh nút play theo đúng thiết kế).*

---

#### Nhánh 3B: Quản lý Nhân vật & Giọng (`Nhân vật` - Khi chọn Multi cast)
Áp dụng theo tương tác bóc tách nhân vật:

##### Giai đoạn 1: Skeleton Loading khi vừa vào bước
* Dòng trạng thái thông báo: **`Đang nhận diện nhân vật...`**.
* Hiệu ứng Shimmer 3–4 hàng giả lập avatar và text đang được AI quét từ kịch bản.

##### Giai đoạn 2: Danh sách nhân vật
```
+----------------------------------------------------------------------------------------------------+
| +------------------------------------------------------------------------------------------------+ |
| | [👤] Người kể chuyện (Triệu Dương)                                            [ 🔊 ]  [ 🗑 ]   | |
| |      "Căn cứ kết quả giám định ADN và lời khai của các bên, tòa công nhận..."                  | |
| +------------------------------------------------------------------------------------------------+ |
| | [👤] Jack (Hoàng Nam)                                                         [ 🔊 ]  [ 🗑 ]   | |
| |      "Tôi chỉ muốn được tòa ghi nhận quyền làm cha, không muốn tách bé..."                     | |
| +------------------------------------------------------------------------------------------------+ |
| | [👤] Thiên An (Hà Chi)                                                        [ 🔊 ]  [ 🗑 ]   | |
| |      "Tôi cảm thấy ấm ức vì ba năm đầu sinh và chăm con vất vả..."                             | |
| +------------------------------------------------------------------------------------------------+ |
| | [👤] Nhân vật chưa đặt tên (Chưa chọn giọng)                                  [ 🔈(mờ) ] [ 🗑 ]| |
| |      "Tiếng người dân xôn xao bàn tán trước cổng phiên tòa..."                                 | |
| +------------------------------------------------------------------------------------------------+ |
|                                                                                                    |
| [ + Thêm nhân vật ]                                                                                |
+----------------------------------------------------------------------------------------------------+
```
* **Biểu tượng loa nghe thử `[ 🔊 ]`:**
  * Nhân vật đã gán giọng: Bấm loa phát câu thoại mẫu của nhân vật bằng giọng tương ứng.
  * Nhân vật chưa gán giọng (ví dụ `Nhân vật chưa đặt tên` mới phát hiện): **Biểu tượng loa bị mờ (`opacity-30 cursor-not-allowed`)**, không thể bấm nghe thử.
* Nút `[ 🗑 ]`: Xóa nhân vật khỏi danh sách (lời thoại sẽ tự động gán về cho Người kể chuyện / `Narrator`).
* Nút `[ + Thêm nhân vật ]`: Thêm nhân vật thủ công và mở màn hình chi tiết.

##### Giai đoạn 3: Màn hình chỉnh sửa chi tiết nhân vật & Gán giọng

Khi nhấp vào bất kỳ hàng nhân vật nào (ví dụ Người kể chuyện hoặc nhân vật mới phát hiện), khung nội dung bên phải sẽ trượt mở giao diện chỉnh sửa thông tin chi tiết và bảng gán giọng:

```
+----------------------------------------------------------------------------------------------------+
| [📖] Story                                                                                    [ ✕ ]|
+-------------------+--------------------------------------------------------------------------------+
| (CỘT BƯỚC DỌC)    | [ < Danh sách nhân vật ]                                                       |
|                   |                                                                                |
| (✓) 1. Tải lên    | Tên nhân vật                                                                   |
|                   | +----------------------------------------------------------------------------+ |
| (✓) 2. Thiết lập  | | Người kể chuyện                                                            | |
|                   | +----------------------------------------------------------------------------+ |
| (●) 3. Nhân vật   |                                                                                |
|                   | Mô tả vai diễn & tông giọng                                                    |
|                   | +----------------------------------------------------------------------------+ |
|                   | | Phóng viên tường thuật khách quan diễn biến phiên tòa pháp lý.           🪄 | |
|                   | +----------------------------------------------------------------------------+ |
|                   |                                                                                |
|                   | Dòng thoại mẫu                                                                 |
|                   | +----------------------------------------------------------------------------+ |
|                   | | Căn cứ kết quả giám định ADN và lời khai của các bên, tòa công nhận...     | |
|                   | +----------------------------------------------------------------------------+ |
|                   |                                                                                |
|                   | [ Khám phá ]     [ Giọng của tôi ]                                             |
|                   | ------------------------------------------------------------------------------ |
|                   | +----------------------------------------------------------------------------+ |
|                   | | [👤✓] Triệu Dương - Trầm ấm, truyền cảm                           [ ✓ ]  [ ▶ ]| |
|                   | |       Giọng nam miền Nam, tự nhiên, thích hợp dẫn truyện...                | |
|                   | +----------------------------------------------------------------------------+ |
|                   | | [👤 ] Cẩm Hồng - Miền Nam bản địa                                        [ ▶ ]| |
|                   | |       Giọng nữ miền Nam, nhẹ nhàng, truyền cảm...                          | |
|                   | +----------------------------------------------------------------------------+ |
|                   | | [👤 ] Duy Khoa - Hà Nội chuẩn                                            [ ▶ ]| |
|                   | |       Giọng nam truyền cảm chuẩn miền Bắc...                               | |
|                   | +----------------------------------------------------------------------------+ |
+-------------------+--------------------------------------------------------------------------------+
|                                                  [ ← Quay lại ]             [ Tiếp tục → / Tạo dự án ] |
+----------------------------------------------------------------------------------------------------+
```

* **Trường hợp nhân vật chưa có tên:**
```
+----------------------------------------------------------------------------------------------------+
| [ < Danh sách nhân vật ]                                                                           |
|                                                                                                    |
| Tên nhân vật                                                                                       |
| +------------------------------------------------------------------------------------------------+ |
| | Nhân vật chưa đặt tên                                                                          | |
| +------------------------------------------------------------------------------------------------+ |
|                                                                                                    |
| Mô tả vai diễn & tông giọng                                                                        |
| +------------------------------------------------------------------------------------------------+ |
| | Người qua đường hoặc nhân vật phụ xuất hiện thoáng qua trong bối cảnh                       🪄 | |
| +------------------------------------------------------------------------------------------------+ |
|                                                                                                    |
| Dòng thoại mẫu                                                                                     |
| +------------------------------------------------------------------------------------------------+ |
| | Nhập dòng thoại mẫu để nghe thử giọng đọc...                                                   | |
| +------------------------------------------------------------------------------------------------+ |
|                                                                                                    |
| [ Khám phá ]     [ Giọng của tôi ]                                                                 |
| -------------------------------------------------------------------------------------------------- |
| (Người dùng chọn 1 giọng trong danh sách bên dưới để gán cho nhân vật này)                         |
+----------------------------------------------------------------------------------------------------+
```

* **Phân tích các thành phần chi tiết:**
  1. **Nút quay lại danh sách (`[ < Danh sách nhân vật ]`):** Nằm ngay đầu khung bên phải, click vào sẽ quay lại bảng danh sách tổng các nhân vật (tự động cập nhật các thay đổi vừa chỉnh).
  2. **Trường Tên nhân vật:** Input text cho phép đổi tên nhân vật tùy ý.
  3. **Trường Mô tả vai diễn:** Textarea mô tả vai trò, cảm xúc, tông giọng của nhân vật. Góc dưới có icon cây đũa thần `🪄` để AI tự hoàn thiện mô tả.
  4. **Trường Dòng thoại mẫu:** Dòng thoại ngắn dùng làm mẫu phát audio khi test giọng đọc cho nhân vật này. Nếu là nhân vật mới hoặc chưa có thoại, hiển thị placeholder *"Nhập dòng thoại mẫu để nghe thử giọng đọc..."*.
  5. **Bộ chọn giọng đọc (Voice Picker):**
     * **Loại bỏ hoàn toàn tab `Recommended`** (chỉ giữ 2 tab `Khám phá` và `Giọng của tôi`).
     * Khi người dùng click chọn 1 giọng: Icon checkmark `[ ✓ ]` hiển thị, giọng đọc đó lập tức được gán cho nhân vật và nút loa `[ 🔊 ]` ngoài danh sách nhân vật sẽ sáng lên (không còn bị mờ nữa). Nút Play nghe thử **chỉ hiển thị icon `[ ▶ ]`** (không có chữ "Nghe thử").
  6. **Footer đồng bộ:** Cả nút `[ ← Quay lại ]` (quay về Bước 2 Thiết lập) và nút `[ Tạo dự án ]` đều được đặt cạnh nhau ở góc dưới bên phải (`justify-end gap-3`).

---

### 5. Hành động Chốt tạo & Điều hướng vào Studio Editor

* Ở Bước 3, nút bấm góc dưới bên phải hiển thị: **`[ Tạo dự án ]`** (Màu vàng thương hiệu, icon `✨`).
* Khi người dùng nhấp:
  1. Tổng hợp dữ liệu: File kịch bản, `narrationStyle`, `coverImage`, `language`, `artStyle`, `aspectRatio`, danh sách nhân vật và gán giọng.
  2. Tạo bản ghi dự án mới.
  3. Đóng modal và chuyển hướng mượt sang Studio Editor: `navigate('/editor/' + newProjectId)`.

---

## PHẦN 2: KẾ HOẠCH TRIỂN KHAI FRONTEND (`fe/`)

> [!IMPORTANT]
> **HƯỚNG DẪN DÀNH CHO AI ASSISTANT / DEVELOPER:**
> Phần này phân định ranh giới nghiêm ngặt giữa **Những gì ĐÃ CÓ / CẦN GIỮ NGUYÊN** và **Những gì CẦN SỬA ĐỔI / TẠO MỚI**. Bạn phải đọc kỹ phạm vi này trước khi can thiệp vào codebase để tránh làm thay đổi thừa, phá vỡ logic kịch bản hoặc hỏng layout Studio Editor hiện có.

---

### 1. Đánh Giá Hiện Trạng Codebase Thực Tế Tại `fe/`

Trước khi bắt tay vào code, cần nắm rõ tình trạng các file liên quan trong thư mục `fe/`:

* **1.1. Thư mục Modal `src/pages/HomePage/components/CreateStoryModal/`:**
  * `CreateStoryModal.tsx`: Hiện đang chứa code cũ với lỗi import `StepVoiceSelect` và `StepReview` (không tồn tại trong dự án, gây lỗi build `TS2307`). Đồng thời footer của modal đang dùng `<DialogFooter className="... flex justify-between ...">` khiến nút *Quay lại* bị dạt sang tận mép trái, lệch chuẩn so với thiết kế.
  * `StepUpload.tsx`: **ĐÃ CÓ SẴN** và hoạt động ổn định (cần giữ nguyên cơ chế Dropzone và Text Preview Box 3.000 ký tự).
  * `StepCharacters/`: Đang là **thư mục rỗng** (chưa có code).
  * Chưa có: `types.ts`, `StepSettings.tsx`, `StepVoice.tsx`, `VoicePickerList.tsx`, và các file con trong `StepCharacters/`.
* **1.2. Thư mục Component gốc Shadcn UI `src/components/ui/`:**
  * **Đã có sẵn 10 component:** `button.tsx`, `badge.tsx`, `card.tsx`, `dialog.tsx`, `dropdown-menu.tsx`, `input.tsx`, `scroll-area.tsx`, `slider.tsx`, `table.tsx`, `tooltip.tsx`.
  * **Còn thiếu 5 component cần thiết:** `radio-group.tsx`, `select.tsx`, `tabs.tsx`, `separator.tsx`, `textarea.tsx`.
* **1.3. Thư mục Trang chủ `src/pages/HomePage/`:**
  * `HomePage.tsx`, `ProjectCard.tsx`, `ProjectTable.tsx`, `ProjectToolbar.tsx` đã có khung hiển thị cơ bản, cần chuẩn hóa lại sự kiện click và liên kết ảnh bìa `project.thumbnail`.
* **1.4. Toàn bộ thư mục Studio Editor `src/pages/EditorPage/`:**
  * Đã được lập trình hoàn chỉnh đầy đủ (kịch bản, CanvasPreview, Timeline, Resplit). **TUYỆT ĐỐI GIỮ NGUYÊN 100%.**

---

### 2. Bảng Kiểm Kê & Cài Đặt Component Gốc Shadcn UI (`src/components/ui/`)

| STT | Tên Component | Đường dẫn file gốc (`src/components/ui/`) | Trạng thái hiện tại | Vị trí & Mục đích sử dụng cụ thể trong dự án |
| :---: | :--- | :--- | :---: | :--- |
| 1 | **`button`** | `src/components/ui/button.tsx` | **ĐÃ CÓ SẴN** | Nút `[+ Tạo dự án mới]`, nút `[Tiếp tục →]`, `[← Quay lại]`, `[Tạo dự án]`, nút `[Thay ảnh bìa]`, `[Xóa ảnh bìa]`, nút Play demo audio icon `[ ▶ ]`. |
| 2 | **`badge`** | `src/components/ui/badge.tsx` | **ĐÃ CÓ SẴN** | Huy hiệu chấm xanh `● Creation draft`, tag định dạng file `DOCX` / `PDF` / `TXT`, badge cờ vùng miền. |
| 3 | **`card`** | `src/components/ui/card.tsx` | **ĐÃ CÓ SẴN** | Thẻ lựa chọn phong cách đọc `Single cast` / `Multi cast`, thẻ ảnh bìa, thẻ phong cách mỹ thuật. |
| 4 | **`dialog`** | `src/components/ui/dialog.tsx` | **ĐÃ CÓ SẴN** | Khung Modal popup `CreateStoryModal` (hỗ trợ nền mờ, bo góc, tiêu đề `Story` và nút đóng `[✕]`). |
| 5 | **`input`** | `src/components/ui/input.tsx` | **ĐÃ CÓ SẴN** | Ô tìm kiếm `[ 🔍 Tìm kiếm dự án... ]`, ô tìm kiếm giọng đọc, ô nhập tên nhân vật. |
| 6 | **`table`** | `src/components/ui/table.tsx` | **ĐÃ CÓ SẴN** | Bảng hiển thị dự án (`Table`, `TableHeader`, `TableRow`, `TableCell`) cho chế độ Danh sách `ProjectTable`. |
| 7 | **`scroll-area`** | `src/components/ui/scroll-area.tsx` | **ĐÃ CÓ SẴN** | Khung cuộn văn bản xem trước 3.000 ký tự đầu ở Bước 1, danh sách cuộn giọng đọc và nhân vật. |
| 8 | **`dropdown-menu`** | `src/components/ui/dropdown-menu.tsx` | **ĐÃ CÓ SẴN** | Menu hành động nhanh `[...]` trên thẻ dự án (`ProjectCard`) và bảng danh sách (`ProjectTable`) chứa: `Đổi tên`, `Nhân bản`, `Xóa dự án`. |
| 9 | **`tooltip`** | `src/components/ui/tooltip.tsx` | **ĐÃ CÓ SẴN** | Tooltip giải thích khi hover vào nút `(i)` thông tin dự án, hoặc các trạng thái khóa. |
| 10 | **`slider`** | `src/components/ui/slider.tsx` | **ĐÃ CÓ SẴN** | Thanh trượt tiến trình phát âm thanh demo giọng đọc. |
| 11 | **`radio-group`** | `src/components/ui/radio-group.tsx` | **CẦN CÀI MỚI** | Lựa chọn phong cách đọc (`Single cast` vs `Multi cast`) và lựa chọn tỷ lệ ảnh (`16:9`, `9:16`, `1:1`, `4:3`). |
| 12 | **`select`** | `src/components/ui/select.tsx` | **CẦN CÀI MỚI** | Dropdown lựa chọn ngôn ngữ tác phẩm (`🇻🇳 Tiếng Việt`) và bộ lọc Accent, Thể loại, Giới tính. |
| 13 | **`tabs`** | `src/components/ui/tabs.tsx` | **CẦN CÀI MỚI** | Chuyển đổi 2 tab chọn giọng đọc: `Khám phá` và `Giọng của tôi`. |
| 14 | **`separator`** | `src/components/ui/separator.tsx` | **CẦN CÀI MỚI** | Đường kẻ vách ngăn phân tách giữa Header, Body, Footer của modal và các khối cấu hình. |
| 15 | **`textarea`** | `src/components/ui/textarea.tsx` | **CẦN CÀI MỚI** | Khung nhập mô tả nhân vật (`Description`) và dòng thoại mẫu (`Preview line`). |

#### Lệnh cài đặt bổ sung các component shadcn còn thiếu (chạy tại thư mục `fe/`):
```bash
cd "e:\Tài liệu\Daigaku\2026.1\GR2\Book to Video\demo-fe-prototype-S2V\demo-prototype-S2V\fe"
npx shadcn@latest add radio-group select tabs separator textarea
```

---

### 3. Ranh Giới Bất Di Bất Dịch: VÙNG TUYỆT ĐỐI GIỮ NGUYÊN (DO NOT TOUCH / FREEZE)

> [!CAUTION]
> **DANH SÁCH FILE & THƯ MỤC TUYỆT ĐỐI GIỮ NGUYÊN (CẤM SỬA / XÓA / DI CHUYỂN):**
> 
> 1. **Toàn bộ thư mục Studio Editor (`src/pages/EditorPage/**`):**
>    - `EditorPage.tsx`: Trang Studio chính nhận `projectId` từ URL.
>    - `EditorHeader.tsx`: Header Studio (Nút quay lại Dashboard, Tên dự án, Nút Xuất video).
>    - `ScriptPanel.tsx`: Cột kịch bản bên trái quản lý danh sách phân cảnh.
>    - `ShotCard.tsx`: Thẻ hiển thị và biên tập từng phân cảnh / shot.
>    - `StoryAssetsPanel.tsx`: Bảng quản lý nhân vật, bối cảnh, đạo cụ.
>    - `VisualsPanel.tsx`: Bảng quản lý hình ảnh và prompt minh họa.
>    - `FarRightSidebar.tsx`: Thanh công cụ phụ bên phải Studio.
> 2. **Toàn bộ tính năng Timeline & Canvas Preview (`src/pages/EditorPage/components/CanvasPreview/**`):**
>    - `CanvasPreview.tsx`, `ExpandedTimeline.tsx`, `CompactScrubber.tsx`, `ControlsPill.tsx`, `ColorPickerPanel.tsx`.
> 3. **Toàn bộ tính năng Chia lại phân cảnh (`src/pages/EditorPage/components/Resplit/**`):**
>    - `ResplitPopover.tsx`, `ResplitAllModal.tsx`, `DiffPreview.tsx`, `ScriptSelectionToolbar.tsx`.
> 4. **Các file Mock & Type của kịch bản Studio:**
>    - `src/mocks/mockShots.ts`: Dữ liệu phân cảnh mẫu của truyện *Văn phòng điều tra*.
>    - `src/types/script.ts`: Định nghĩa kiểu dữ liệu kịch bản (`Shot`, `Scene`, `Character`).
> 5. **Khung sườn cốt lõi & Cấu hình ứng dụng:**
>    - `src/components/MainLayout.tsx`: Layout container chuẩn bọc `<Outlet />`.
>    - `src/routes/index.tsx`: Đã cấu hình đúng 2 route `/` (`HomePage`) và `/editor/:projectId` (`EditorPage`).
>    - `src/App.tsx`, `src/main.tsx`, `src/index.css`, `vite.config.ts`, `components.json`.

---

### 4. Danh Sách Các File CẦN TẠO MỚI (New Files to Create)

Tạo mới 10 file/module dưới đây để hoàn thiện trọn vẹn luồng tương tác của Modal `Story`:

#### 4.1. `src/pages/HomePage/components/CreateStoryModal/types.ts`
* **Mục đích:** Định nghĩa toàn bộ kiểu dữ liệu cho form khởi tạo và quản lý bước.
```typescript
export type NarrationStyle = 'single' | 'multi';

export interface ArtStyleOption {
  id: string;
  name: string;
  thumbnailUrl: string; // Ảnh mẫu minh họa phong cách trực quan
}

export interface CharacterItem {
  id: string;
  name: string;
  description: string;
  previewLine: string;
  voiceId?: string;
  voiceName?: string;
  avatarUrl?: string;
  isNarrator?: boolean;
}

export interface CreateStoryFormData {
  // Bước 1: Tải lên
  file: {
    name: string;
    size: string;
    format: string;
    charCount: number;
    estimatedDuration: string;
  } | null;
  sampleText: string;

  // Bước 2: Thiết lập
  narrationStyle: NarrationStyle;
  coverImage: string | null;
  language: string; // 'vi' | 'en'
  artStyle: string; // 'anime' | 'cinematic' | 'watercolor' | 'cyberpunk'
  aspectRatio: '16:9' | '9:16' | '1:1' | '4:3';

  // Bước 3: Giọng đọc hoặc Nhân vật
  singleVoiceId?: string;
  characters: CharacterItem[];
}
```

#### 4.2. `src/pages/HomePage/components/CreateStoryModal/StepSettings.tsx`
* **Mục đích:** Giao diện Bước 2: Thiết lập cấu hình dự án.
* **Quy cách giao diện:**
  1. **Phong cách đọc:** 2 card radio chọn `Single cast` (Một giọng người kể chuyện cho toàn bộ cuốn sách) hoặc `Multi cast` (Các giọng đọc riêng biệt cho người kể chuyện và từng nhân vật). Tuyệt đối không dùng tiếng Anh trong ngoặc đơn, không để tag `[NEW]`.
  2. **Ảnh bìa sách & Ngôn ngữ tác phẩm: XẾP HÀNG DỌC (Vertical Stack):**
     * Khối trên: Ảnh bìa sách với khung xem trước ảnh bìa + 2 nút `[ Thay ảnh bìa ]` và `[ Xóa ảnh bìa ]`.
     * Khối dưới: Dropdown Ngôn ngữ tác phẩm chọn `🇻🇳 Tiếng Việt`.
  3. **Phong cách mỹ thuật:** Lưới 4 card phong cách có ảnh thumbnail mẫu minh họa (`Ghibli Anime`, `3D Cinematic`, `Watercolor`, `Cyberpunk`).
  4. **Tỷ lệ ảnh muốn sinh:** Cụm 4 nút lựa chọn `16:9 (Ngang chuẩn)`, `9:16 (Dọc)`, `1:1 (Vuông)`, `4:3 (Cổ điển)`.
* **Interface Props:**
  ```typescript
  interface StepSettingsProps {
    formData: CreateStoryFormData;
    onFormDataChange: React.Dispatch<React.SetStateAction<CreateStoryFormData>>;
  }
  ```

#### 4.3. `src/pages/HomePage/components/CreateStoryModal/StepVoice.tsx`
* **Mục đích:** Giao diện Bước 3A (khi chọn Single cast).
* **Quy cách giao diện:**
  * Thanh tìm kiếm giọng đọc + dropdown ngôn ngữ `🇻🇳 Tiếng Việt`.
  * Hàng bộ lọc nhanh: Accent (Bắc, Trung, Nam), Giới tính, Độ tuổi.
  * 2 Tab: `Khám phá` và `Giọng của tôi`.
  * Danh sách các giọng đọc: Avatar, tên giọng, mô tả âm sắc, icon tick xanh `[ ✓ ]` khi được chọn, và nút Play audio **CHỈ HIỂN THỊ ICON `[ ▶ ]`** (không để chữ "Nghe thử").
* **Interface Props:**
  ```typescript
  interface StepVoiceProps {
    formData: CreateStoryFormData;
    onFormDataChange: React.Dispatch<React.SetStateAction<CreateStoryFormData>>;
  }
  ```

#### 4.4. `src/pages/HomePage/components/CreateStoryModal/VoicePickerList.tsx`
* **Mục đích:** Component danh sách chọn giọng đọc dùng chung cho cả `StepVoice.tsx` và `CharacterDetailView.tsx`.
* **Quy cách:** Quản lý danh sách cuộn các giọng đọc, tìm kiếm, lọc, chọn giọng và phát audio preview với nút **chỉ có icon `[ ▶ ]`**.

#### 4.5. `src/pages/HomePage/components/CreateStoryModal/StepCharacters/StepCharacters.tsx`
* **Mục đích:** Bộ điều phối tương tác cho Bước 3B (khi chọn Multi cast).
* **State điều phối:** `viewState: 'skeleton' | 'list' | 'detail'`.
* **Hành vi:**
  * Khi vừa vào bước 3B: Kích hoạt `viewState = 'skeleton'` trong 1.5 giây để giả lập AI quét và nhận diện nhân vật từ kịch bản, sau đó tự chuyển sang `viewState = 'list'`.
  * Khi click vào 1 nhân vật trong danh sách: Chuyển sang `viewState = 'detail'`.
  * Khi click nút `[ < Danh sách nhân vật ]`: Quay lại `viewState = 'list'`.

#### 4.6. `src/pages/HomePage/components/CreateStoryModal/StepCharacters/CharactersSkeleton.tsx`
* **Mục đích:** Hiệu ứng shimmer giả lập quá trình AI trích xuất nhân vật.
* **Quy cách:** Dòng chữ thông báo **`Đang nhận diện nhân vật...`** kèm 4 hàng skeleton mô phỏng avatar tròn và các dòng text.

#### 4.7. `src/pages/HomePage/components/CreateStoryModal/StepCharacters/CharactersListView.tsx`
* **Mục đích:** Danh sách các nhân vật đã nhận diện trong tác phẩm.
* **Quy cách:**
  * Hiển thị từng hàng nhân vật: Avatar, tên nhân vật, tên giọng đã gán, dòng thoại mẫu trích từ kịch bản.
  * **Biểu tượng loa nghe thử `[ 🔊 ]`:** Nếu nhân vật đã gán giọng ➔ bấm nghe audio; nếu nhân vật chưa gán giọng ➔ **icon loa bị mờ (`opacity-30 cursor-not-allowed`)**, không thể click.
  * Nút `[ 🗑 ]`: Xóa nhân vật khỏi danh sách (lời thoại sẽ tự động gán về cho Người kể chuyện).
  * Nút `[ + Thêm nhân vật ]`: Thêm một nhân vật mới và chuyển thẳng sang màn hình chi tiết.

#### 4.8. `src/pages/HomePage/components/CreateStoryModal/StepCharacters/CharacterDetailView.tsx`
* **Mục đích:** Chỉnh sửa thông tin chi tiết và gán giọng cho từng nhân vật.
* **Quy cách:**
  * Đầu trang có nút `[ < Danh sách nhân vật ]`.
  * Ô nhập **Tên nhân vật**.
  * Khung nhập **Mô tả vai diễn & tông giọng** (có nút đũa thần `🪄` để AI gợi ý).
  * Khung nhập **Dòng thoại mẫu** (`Preview line`).
  * Danh sách chọn giọng đọc nhúng từ `VoicePickerList.tsx` (2 tab: `Khám phá` và `Giọng của tôi`, nút play **chỉ có icon `[ ▶ ]`**). Khi click chọn 1 giọng, lập tức cập nhật `voiceId` cho nhân vật đó.

#### 4.9. `src/pages/HomePage/components/CreateStoryModal/index.ts`
* Re-export component chính:
  ```typescript
  export { default } from "./CreateStoryModal";
  ```

#### 4.10. Các file Mock dữ liệu: `src/mocks/mockVoices.ts` & `src/mocks/mockArtStyles.ts`
* `src/mocks/mockVoices.ts`: Danh sách các giọng mẫu tiếng Việt (Triệu Dương, Cẩm Hồng, Duy Khoa...).
* `src/mocks/mockArtStyles.ts`: Danh sách các phong cách mỹ thuật kèm link ảnh thumbnail minh họa:
  * `Ghibli Anime`: Thumbnail phong cách hoạt hình Nhật Bản nhẹ nhàng.
  * `3D Cinematic`: Thumbnail phong cách phim điện ảnh 3D chân thực.
  * `Watercolor`: Thumbnail phong cách tranh màu nước nghệ thuật.
  * `Cyberpunk`: Thumbnail phong cách viễn tưởng tương lai ánh sáng neon.

---

### 5. Danh Sách Các File CẦN CHỈNH SỬA & Giới Hạn Phạm Vi Sửa (Scoped Edits)

Chỉ chỉnh sửa đúng các file và vị trí được chỉ định dưới đây, không viết lại lan man sang các khu vực khác:

#### 5.1. File `src/pages/HomePage/components/CreateStoryModal/CreateStoryModal.tsx`
* **Cái CẦN SỬA:**
  * **1. Xóa bỏ các import lỗi cũ:** Bỏ import `StepVoiceSelect` và `StepReview`. Thay bằng:
    ```tsx
    import StepUpload from "./StepUpload";
    import StepSettings from "./StepSettings";
    import StepVoice from "./StepVoice";
    import StepCharacters from "./StepCharacters/StepCharacters";
    ```
  * **2. Stepper nhãn bước động:**
    ```typescript
    const steps = [
      { step: 1, label: "Tải lên" },
      { step: 2, label: "Thiết lập" },
      {
        step: 3,
        label: formData.narrationStyle === "single" ? "Giọng đọc" : "Nhân vật",
      },
    ];
    ```
  * **3. SỬA VỊ TRÍ NÚT FOOTER CHUẨN:**
    Đổi class của `DialogFooter` từ `flex justify-between` thành `flex justify-end gap-3`. Đưa cả 2 nút **`[ ← Quay lại ]`** (ẩn ở Bước 1) và **`[ Tiếp tục → ]` / `[ Tạo dự án ]`** về nằm cạnh nhau ở **góc dưới bên phải**:
    ```tsx
    <DialogFooter className="px-6 py-3 border-t flex justify-end gap-3 shrink-0">
      {currentStep > 1 && (
        <Button variant="outline" size="sm" onClick={handleBack}>
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Quay lại
        </Button>
      )}
      {currentStep < 3 ? (
        <Button size="sm" onClick={handleNext} className="bg-yellow-500 hover:bg-yellow-600 text-slate-950 font-semibold">
          Tiếp tục
          <ArrowRight className="w-4 h-4 ml-1.5" />
        </Button>
      ) : (
        <Button size="sm" onClick={handleCreate} className="bg-yellow-500 hover:bg-yellow-600 text-slate-950 font-semibold">
          ✨ Tạo dự án
        </Button>
      )}
    </DialogFooter>
    ```
  * **4. Quản lý State `formData`:** Chuyển sang dùng `CreateStoryFormData` (hỗ trợ lưu cả `narrationStyle`, `coverImage`, `artStyle`, `aspectRatio`, `characters`).
* **Cái CẦN GIỮ NGUYÊN:**
  * Giữ nguyên cấu trúc `DialogHeader` chứa icon sách `BookOpen`, tiêu đề `Story` và nút đóng `[ ✕ ]`.
  * Giữ nguyên thanh Stepper dọc bên trái (`w-55` / ~220px) với các icon số tròn.

#### 5.2. File `src/pages/HomePage/components/CreateStoryModal/StepUpload.tsx`
* **Cái CẦN SỬA:**
  * Đồng bộ prop sang `formData: CreateStoryFormData` và `onFormDataChange`.
* **Cái CẦN GIỮ NGUYÊN:**
  * Toàn bộ giao diện Dropzone tải file (hỗ trợ DOCX, EPUB, PDF, TXT) và Text Preview Box 3.000 ký tự đầu.

#### 5.3. File `src/pages/HomePage/components/ProjectCard.tsx`
* **Cái CẦN SỬA:**
  * Kiểm tra logic hiển thị: Nếu `project.thumbnail` có giá trị ➔ render thẻ ảnh bìa `<img>`; nếu không có ➔ render thẻ trang giấy xem trước văn bản (`project.textPreview`).
  * Đảm bảo dropdown menu `[...]` có `e.stopPropagation()` khi nhấp chuột.
* **Cái CẦN GIỮ NGUYÊN:**
  * Toàn bộ layout tỉ lệ 16:9 (`aspect-video`), bo góc tròn `rounded-xl`, badge góc dưới `● Creation draft` và thông tin tác giả/thời gian tạo bên dưới.

#### 5.4. File `src/pages/HomePage/components/ProjectTable.tsx`
* **Cái CẦN SỬA:**
  * Cột `Title`: Nếu `project.thumbnail` có giá trị ➔ render ảnh bìa thu nhỏ bo tròn trong ô `w-8 h-8`; nếu không có ➔ render icon `<FileText />`.
  * Tích hợp component `Tooltip` cho nút `(i)`.
* **Cái CẦN GIỮ NGUYÊN:**
  * Cấu trúc bảng 5 cột chuẩn: `Title`, `Created`, `Created by`, `Status`, và cột menu thao tác nhanh `[...]`.

#### 5.5. File `src/pages/HomePage/HomePage.tsx`
* **Cái CẦN SỬA:**
  * Cập nhật hàm `handleCreateProject`: Nhận dữ liệu `formData`, gán `thumbnail: formData.coverImage || undefined`, thêm vào danh sách dự án và điều hướng sang `/editor/:id`.
  * Khi click dự án có tag `Creation draft` ➔ nạp dữ liệu cũ (`thumbnail`, `textPreview`) vào modal để mở lại.
* **Cái CẦN GIỮ NGUYÊN:**
  * Header thương hiệu `Story2Video` & avatar `Myanh 👤`.
  * Thanh công cụ `ProjectToolbar` với ô tìm kiếm và cụm toggle `[ ⊞ Lưới | ☰ Danh sách ]`.

---

### 6. Bảng Ma Trận Phân Định Trách Nhiệm Code (Summary Responsibility Matrix)

| Đường Dẫn Tệp (File Path) | Hành Động | Phạm Vi Chi Tiết & Ranh Giới |
| :--- | :---: | :--- |
| `src/components/ui/radio-group.tsx`, `select.tsx`, `tabs.tsx`, `separator.tsx`, `textarea.tsx` | **CÀI MỚI (SHADCN)** | Chạy lệnh `npx shadcn@latest add ...` để bổ sung các primitive còn thiếu. |
| `src/pages/HomePage/components/CreateStoryModal/types.ts` | **TẠO MỚI** | Định nghĩa `NarrationStyle`, `ArtStyleOption`, `CharacterItem`, `CreateStoryFormData`. |
| `src/pages/HomePage/components/CreateStoryModal/StepSettings.tsx` | **TẠO MỚI** | Bước 2: Thiết lập (Style đọc, Ảnh bìa & Ngôn ngữ xếp dọc, Art Style có ảnh, Tỷ lệ ảnh). Bỏ tiếng Anh trong ngoặc đơn, bỏ `[NEW]`. |
| `src/pages/HomePage/components/CreateStoryModal/StepVoice.tsx` | **TẠO MỚI** | Bước 3A: Tuyển chọn giọng đọc (Single cast). Nút play audio chỉ có icon `[ ▶ ]`. |
| `src/pages/HomePage/components/CreateStoryModal/VoicePickerList.tsx` | **TẠO MỚI** | Component danh sách giọng đọc dùng chung (2 tab `Khám phá` và `Giọng của tôi`, nút `[ ▶ ]`). |
| `src/pages/HomePage/components/CreateStoryModal/StepCharacters/StepCharacters.tsx` | **TẠO MỚI** | Bộ điều phối Bước 3B (Skeleton shimmer 1.5s ➔ List view ➔ Detail view). |
| `src/pages/HomePage/components/CreateStoryModal/StepCharacters/CharactersSkeleton.tsx` | **TẠO MỚI** | Hiệu ứng shimmer 4 hàng thông báo *"Đang nhận diện nhân vật..."*. |
| `src/pages/HomePage/components/CreateStoryModal/StepCharacters/CharactersListView.tsx` | **TẠO MỚI** | Danh sách nhân vật (icon loa `[ 🔊 ]` nghe thử thoại mẫu; loa mờ nếu chưa gán giọng). |
| `src/pages/HomePage/components/CreateStoryModal/StepCharacters/CharacterDetailView.tsx` | **TẠO MỚI** | Chỉnh Name, Description (icon `🪄`), Preview line và bảng gán giọng. |
| `src/pages/HomePage/components/CreateStoryModal/index.ts` | **TẠO MỚI** | Re-export `CreateStoryModal`. |
| `src/mocks/mockVoices.ts` & `src/mocks/mockArtStyles.ts` | **TẠO MỚI** | Danh sách giọng mẫu tiếng Việt và phong cách nghệ thuật kèm ảnh demo. |
| `src/pages/HomePage/components/CreateStoryModal/CreateStoryModal.tsx` | **SỬA CÓ GIỚI HẠN** | Nhãn bước động, footer `justify-end gap-3` (Quay lại + Tiếp tục nằm cạnh nhau bên phải). |
| `src/pages/HomePage/components/CreateStoryModal/StepUpload.tsx` | **SỬA CÓ GIỚI HẠN** | Cập nhật interface `formData`, giữ nguyên Dropzone và Text Preview Box. |
| `src/pages/HomePage/components/ProjectCard.tsx` | **SỬA CÓ GIỚI HẠN** | Render ảnh bìa hoặc text preview, giữ nguyên layout 16:9 và badge `● Creation draft`. |
| `src/pages/HomePage/components/ProjectTable.tsx` | **SỬA CÓ GIỚI HẠN** | Render ảnh bìa thu nhỏ ở cột Title, tích hợp Tooltip cho icon `(i)`. |
| `src/pages/HomePage/HomePage.tsx` | **SỬA CÓ GIỚI HẠN** | Nhận `formData` lưu dự án và chuyển trang `/editor/:id`. |
| `src/pages/EditorPage/**` (Toàn bộ) | **GIỮ NGUYÊN 100%** | Toàn bộ code Studio Editor, Kịch bản, Phân cảnh, Canvas, Resplit, Timeline. **CẤM CHẠM VÀO.** |
| `src/mocks/mockShots.ts` & `src/types/script.ts` | **GIỮ NGUYÊN 100%** | Dữ liệu và kiểu dữ liệu kịch bản phân cảnh của Studio Editor. Cấm sửa. |
| `src/components/MainLayout.tsx` & `src/routes/index.tsx` | **GIỮ NGUYÊN 100%** | Khung sườn layout và định tuyến đã chuẩn hóa. Cấm sửa. |

---

### 7. Lộ Trình 6 Bước Thực Thi Cho AI Assistant / Developer

Khi tiến hành code bằng Antigravity chat box, hãy thực hiện tuần tự theo 6 bước khép kín dưới đây để đảm bảo `npm run build` thành công ngay lần đầu:

1. **Bước 1: Cài đặt bổ sung 5 component Shadcn UI:**
   Chạy lệnh: `npx shadcn@latest add radio-group select tabs separator textarea` tại thư mục `fe/`.
2. **Bước 2: Tạo `types.ts` và dữ liệu Mock:**
   Tạo file `CreateStoryModal/types.ts`, `src/mocks/mockVoices.ts` và `src/mocks/mockArtStyles.ts`.
3. **Bước 3: Tạo `StepSettings.tsx` (Bước 2: Thiết lập):**
   Xây dựng giao diện cấu hình phong cách đọc, ảnh bìa & ngôn ngữ xếp theo hàng dọc, lưới phong cách mỹ thuật có ảnh minh họa, và chọn tỷ lệ ảnh.
4. **Bước 4: Tạo `StepVoice.tsx` và `VoicePickerList.tsx` (Bước 3A: Giọng đọc):**
   Xây dựng bộ chọn giọng đơn với 2 tab `Khám phá` / `Giọng của tôi`, các bộ lọc nhanh và nút Play audio **chỉ có icon `[ ▶ ]`**.
5. **Bước 5: Tạo module `StepCharacters/` (Bước 3B: Nhân vật):**
   Hoàn thiện 4 file: `CharactersSkeleton.tsx` ➔ `CharactersListView.tsx` ➔ `CharacterDetailView.tsx` ➔ `StepCharacters.tsx`.
6. **Bước 6: Cập nhật `CreateStoryModal.tsx` & Kiểm thử Build:**
   * Kết nối 3 bước vào modal chính, đồng bộ state `formData`.
   * Cập nhật `DialogFooter` sang `justify-end gap-3` để đưa cả 2 nút `[ ← Quay lại ]` và `[ Tiếp tục → / Tạo dự án ]` về nằm cạnh nhau ở góc dưới bên phải.
   * Chạy lệnh `npm run build` tại `fe/` để xác nhận 0 lỗi TypeScript, 0 lỗi missing module. Chạy `npm run dev` để kiểm tra toàn bộ luồng trên trình duyệt.
   * Tạo `CharacterDetailView.tsx` cho phép sửa `Name`, `Description`, `Preview line` và nhúng `VoicePickerList` (không có tab `Recommended`, không có menu 3 chấm).

6. **Bước 6: Kiểm thử tổng thể luồng tương tác**
   * Kiểm tra liên kết ảnh bìa: Upload/xóa ảnh bìa trong modal ➔ kiểm tra phản chiếu ngay trên [ProjectCard.tsx](file:///e:/Tài%20liệu/Daigaku/2026.1/GR2/Book%20to%20Video/demo-fe-prototype-S2V/demo-prototype-S2V/fe/src/pages/HomePage/components/ProjectCard.tsx) và [ProjectTable.tsx](file:///e:/Tài%20liệu/Daigaku/2026.1/GR2/Book%20to%20Video/demo-fe-prototype-S2V/demo-prototype-S2V/fe/src/pages/HomePage/components/ProjectTable.tsx).
   * Kiểm tra chuyển bước giữa Single cast (`Tải lên` ➔ `Thiết lập` ➔ `Giọng đọc`) và Multi cast (`Tải lên` ➔ `Thiết lập` ➔ `Nhân vật`).
   * Kiểm tra tạo dự án và điều hướng vào trang Studio Editor `/editor/:projectId`.
