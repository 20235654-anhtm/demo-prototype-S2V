# Sơ Đồ User Flow & Hành Trình Tương Tác Của Người Dùng Trong TTS Studio (Mermaid)

> **Mục đích:** Mô tả trực quan 100% hành vi tương tác của người dùng trên giao diện Studio chuyển văn bản thành giọng nói (User Journey & Interaction Flow) mà không có bất kỳ chi tiết kỹ thuật backend nào.

---

## 1. Sơ Đồ User Flow Tổng Quan Khi Làm Việc Trong Studio

```mermaid
flowchart TD
    Start([Người dùng mở màn hình Studio TTS]) --> ViewScreen["Xem danh sách các câu thoại (Block 1, 2, 3...) & Thanh Player ở đáy"]
    
    ViewScreen --> ActionBranch{"Người dùng muốn thực hiện thao tác gì?"}

    %% Nhánh 1: Chỉnh sửa nội dung câu thoại
    ActionBranch -- "1. Chỉnh sửa chữ" --> EditClick["Click vào ô văn bản câu thoại"]
    EditClick --> EnterText["Gõ chỉnh sửa nội dung văn bản (đếm ký tự /500)"]
    EnterText --> BlurText["Click chuột ra ngoài (Blur) -> Câu thoại tự động lưu"]

    %% Nhánh 2: Đổi nhân vật / giọng đọc
    ActionBranch -- "2. Đổi nhân vật cho câu thoại" --> ClickVoiceName["Click vào Avatar hoặc Tên nhân vật trên câu thoại"]
    ClickVoiceName --> OpenVoiceModal["Hộp thoại 'Chọn giọng đọc / Nhân vật' mở ra"]
    OpenVoiceModal --> PickNewVoice["Người dùng nghe thử mẫu và bấm chọn giọng mới (ví dụ: Triệu Dương)"]
    PickNewVoice --> CloseVoiceModal["Hộp thoại đóng lại -> Tên nhân vật trên câu thoại lập tức thay đổi"]

    %% Nhánh 3: Nghe thử riêng câu thoại
    ActionBranch -- "3. Nghe thử RIÊNG câu thoại" --> ClickPlayBlock["Bấm nút Play [ ▶ ] nhỏ trên chính câu thoại đó"]
    ClickPlayBlock --> ShowSpinner["Nút Play chuyển thành vòng xoay đang tải (Spinner) trong 1-2s"]
    ShowSpinner --> PlaySingleAudio["Vòng xoay biến mất, đổi thành icon [ ⏸ ] và phát duy nhất câu này"]
    PlaySingleAudio --> StopSingleAudio["Hết câu thoại -> Nút tự động chuyển lại thành [ ▶ ]"]

    %% Nhánh 4: Nghe thử toàn bộ kịch bản
    ActionBranch -- "4. Nghe thử TOÀN BỘ kịch bản" --> ClickMasterPlay["Bấm nút tròn màu vàng [ ▶ ] ở thanh Player cố định dưới đáy"]
    ClickMasterPlay --> PlaySequential["Trình phát đọc tuần tự từ câu đầu tiên đến câu cuối cùng"]
    PlaySequential --> HighlightActiveBlock["Câu nào đang đọc thì tự động sáng viền tím và màn hình tự cuộn đến câu đó"]
    HighlightActiveBlock --> PauseOrFinish["Người dùng bấm [ ⏸ ] để tạm dừng hoặc nghe hết toàn bộ kịch bản"]

    %% Nhánh 5: Tải xuống / Xuất file
    ActionBranch -- "5. Xuất file" --> ClickDownload["Bấm nút [⬇ Tải xuống] trên Header"]
    ClickDownload --> ChooseFormat{"Chọn định dạng xuất"}
    ChooseFormat -- "Tải video" --> OpenExportModal["Mở hộp thoại tùy chỉnh độ phân giải -> Xuất file MP4"]
    ChooseFormat -- "Tải SRT" --> DownloadSRT["Trình duyệt tải ngay file phụ đề .srt về máy"]

    BlurText --> ContinueLoop{"Tiếp tục làm việc?"}
    CloseVoiceModal --> ContinueLoop
    StopSingleAudio --> ContinueLoop
    PauseOrFinish --> ContinueLoop

    ContinueLoop -- "Tiếp tục biên soạn" --> ViewScreen
    ContinueLoop -- "Hoàn thành" --> ClickBack["Bấm nút [← Quay lại] ở góc trên bên trái -> Trở về Dashboard"]
    ClickBack --> End([Kết thúc])
```

---

## 2. Sơ Đồ User Flow Chi Tiết: Hành Trình Đổi Nhân Vật & Nghe Thử Riêng Đoạn

Sơ đồ này mô tả chính xác từng thao tác của người dùng từ lúc bấm đổi nhân vật đến lúc nghe câu thoại vừa đổi:

```mermaid
flowchart TD
    A["Bước 1: Người dùng nhìn thấy Khối thoại đang có giọng 'Henry (M)'"] --> B["Bước 2: Click vào chữ 'Henry (M)' hoặc Avatar tròn"]
    B --> C["Bước 3: Hộp thoại chọn giọng mở lên"]
    C --> D["Bước 4: Người dùng bấm nút [ ▶ ] nghe thử vài giọng đọc mẫu trong danh sách"]
    D --> E["Bước 5: Bấm chọn giọng 'Triệu Dương (Nam)'"]
    E --> F["Bước 6: Hộp thoại tự động đóng lại"]
    F --> G["Bước 7: Trên thẻ khối thoại, chữ đổi thành 'Triệu Dương (Nam)'"]
    
    G --> H["Bước 8: Người dùng muốn nghe xem Triệu Dương đọc câu này ra sao -> Bấm nút [ ▶ ] nhỏ trên khối"]
    H --> I["Bước 9: Nút [ ▶ ] biến thành icon xoay tròn (Đang chuẩn bị âm thanh)"]
    I --> J["Bước 10: Sau 1 giây, icon chuyển thành [ ⏸ ] và tiếng Triệu Dương phát ra từ loa"]
    J --> K["Bước 11: Khi đọc xong câu thoại, nút tự chuyển về [ ▶ ] bình thường"]
```

---

## 3. Sơ Đồ Thành Phần Trực Quan Của Một Khối Thoại (VoiceoverBlock UI Mapping)

```mermaid
flowchart LR
    subgraph BlockUI ["CẤU TRÚC 1 THẺ KHỐI THOẠI (BÌNH THƯỜNG)"]
        direction TB
        subgraph TopBar ["1. Hàng Tiêu Đề"]
            direction LR
            C1["[ ] Checkbox"] --- C2["|"] --- C3["👤 Triệu Dương [v]"] --- C4["⏱ 1.0x"] --- C5["[ ▶ ] Nút Play riêng"] --- C6["[ ⋮ ] Menu"]
        end
        subgraph TextContent ["2. Khu Vực Nội Dung"]
            direction LR
            T1["| Vạch trang trí"] --- T2["Nội dung văn bản câu thoại (Click vào để gõ sửa)"]
        end
        subgraph FooterCount ["3. Chân Khối"]
            Count["73/500 ký tự (Căn phải)"]
        end
    end
```
