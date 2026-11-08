# Tổng Hợp Các Sơ Đồ User Flow Tương Tác Trong Studio (Mermaid Charts)

> **Mục đích:** Hiển thị trực quan 6 sơ đồ luồng người dùng (User Flow) tách rời bằng Mermaid để xem trực tiếp ngay trong trình đọc Markdown.

---

## 1. User Flow 1: Luồng Đổi Nhân Vật / Giọng Đọc Cho Câu Thoại

```mermaid
flowchart TD
    A["Khối X đang mang nhân vật cũ (ví dụ: Henry)"] --> B["Người dùng click vào Tên nhân vật hoặc Avatar trên Khối X"]
    B --> C["Hộp thoại 'Chọn giọng đọc / Nhân vật' mở lên"]
    C --> D["Người dùng xem danh sách, lọc theo vùng miền hoặc bấm [ ▶ ] nghe thử giọng mẫu"]
    D --> E["Bấm chọn nhân vật mới: 'Triệu Dương (Nam)'"]
    E --> F["Hộp thoại tự động đóng lại"]
    F --> G["Trên thẻ Khối X đổi thành tên 'Triệu Dương (Nam)'"]
    G --> H["Tệp âm thanh cũ của Khối X bị xóa bỏ (trạng thái Dirty)"]
    H --> I["Kịch bản tự động lưu cấu hình mới sau 2 giây"]
```

---

## 2. User Flow 2: Luồng Nghe Thử Riêng Câu Thoại (Tạo Lại Audio Riêng Đoạn)

```mermaid
flowchart TD
    A["Khối X vừa được đổi nhân vật mới"] --> B["Người dùng bấm nút Play [ ▶ ] nhỏ trên thanh tiêu đề Khối X"]
    B --> C["Nút Play Khối X lập tức biến thành icon xoay tròn (Spinner loading)"]
    C --> D["Hệ thống tạo âm thanh mới cho câu thoại (1-2 giây)"]
    D --> E["Icon xoay tròn biến mất, nút đổi thành icon Tạm dừng [ ⏸ ]"]
    E --> F["Loa phát duy nhất câu thoại của Khối X bằng giọng nhân vật mới"]
    F --> G["Khi đọc xong hết câu thoại, nút tự động chuyển về lại icon [ ▶ ]"]
    G --> H["Kết thúc: Dừng lại, không tự động đọc sang Khối kế tiếp"]
```

---

## 3. User Flow 3: Luồng Soạn Thảo Văn Bản Câu Thoại

```mermaid
flowchart TD
    A["Người dùng click chuột vào văn bản câu thoại Khối X"] --> B["Đoạn văn bản chuyển thành khung soạn thảo Textarea tự dãn nở chiều cao"]
    B --> C["Người dùng gõ chỉnh sửa nội dung văn bản"]
    C --> D["Bộ đếm ký tự góc dưới tự động nhảy số theo thời gian thực (X/500)"]
    D --> E["Người dùng click chuột ra ngoài (Blur)"]
    E --> F["Khung soạn thảo lưu nội dung mới"]
    F --> G["Âm thanh cũ của Khối X bị xóa bỏ để chuẩn bị tạo lại theo chữ mới"]
```

---

## 4. User Flow 4: Luồng Nghe Thử Toàn Bộ Kịch Bản (Master Play)

```mermaid
flowchart TD
    A["Người dùng nhìn xuống thanh Player cố định dưới chân màn hình"] --> B["Bấm Nút Play tròn màu vàng to [ ▶ ]"]
    B --> C{"Có câu thoại nào chưa có âm thanh?"}
    C -- "Có" --> D["Thanh player hiển thị trạng thái chuẩn bị âm thanh cho các câu còn thiếu"]
    D --> E["Tất cả các câu thoại thiếu âm thanh được xử lý xong"]
    C -- "Đã đủ" --> E
    E --> F["Bắt đầu phát tuần tự từ Khối 1 đến khối cuối cùng"]
    F --> G["Khối thoại nào đang được đọc thì tự động sáng viền tím và màn hình tự cuộn đến đó"]
    G --> H["Người dùng có thể bấm nút vàng [ ⏸ ] để tạm dừng bất cứ lúc nào"]
```

---

## 5. User Flow 5: Luồng Quản Lý Cấu Trúc Khối Kịch Bản (Thêm / Gộp / Xóa)

```mermaid
flowchart TD
    Start["Người dùng muốn thay đổi cấu trúc kịch bản"] --> Branch{"Chọn thao tác nào?"}

    Branch -- "Thêm câu mới ở cuối" --> AddEnd["Cuộn xuống cuối trang, bấm nút [+ Thêm khối mới]"]
    AddEnd --> FocusNew["Khối thoại mới xuất hiện ở cuối, con trỏ tự động nhảy vào để gõ chữ"]

    Branch -- "Chèn câu ở giữa" --> HoverDivider1["Rê chuột vào vách ngăn giữa 2 khối, bấm nút tròn [+]"]
    HoverDivider1 --> InsertBetween["Một khối thoại rỗng xuất hiện ngay giữa 2 khối đó"]

    Branch -- "Hợp nhất 2 câu" --> HoverDivider2["Rê chuột vào vách ngăn giữa 2 khối, bấm nút tròn [☍ Hợp nhất]"]
    HoverDivider2 --> MergeTwo["Nội dung câu dưới được gộp vào đuôi câu trên, câu dưới biến mất"]

    Branch -- "Xóa câu thoại" --> ClickMenu["Click nút Menu 3 chấm [ ⋮ ] trên khối"]
    ClickMenu --> ChooseDelete{"Chọn lệnh xóa"}
    ChooseDelete -- "Xóa block" --> DeleteOne["Chỉ xóa câu thoại này"]
    ChooseDelete -- "Xóa từ đây về sau" --> DeleteFromHere["Cắt bỏ toàn bộ các câu từ vị trí này đến cuối"]
```

---

## 6. User Flow 6: Luồng Xuất Bản Tác Phẩm

```mermaid
flowchart TD
    A["Người dùng bấm nút [⬇ Tải xuống] màu vàng trên thanh Header"] --> B["Menu xổ xuống gồm 2 lựa chọn xuất bản"]
    B --> C{"Chọn định dạng nào?"}
    
    C -- "Tải video MP4" --> D["Bấm 'Tải video'"]
    D --> E["Hộp thoại ExportModal xuất hiện để chọn độ phân giải 1080p / 720p"]
    E --> F["Bấm 'Bắt đầu xuất' và chờ hệ thống tạo video sóng âm hoàn tất để tải về"]

    C -- "Tải phụ đề SRT" --> G["Bấm 'Tải SRT'"]
    G --> H["Trình duyệt tự động tải ngay file phụ đề .srt về máy tính trong 1 giây"]
```
