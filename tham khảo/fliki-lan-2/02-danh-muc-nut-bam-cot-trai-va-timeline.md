# 02 — Danh mục chi tiết các nút bấm ở Cột bên trái & Thanh Timeline phía dưới

> **Nguồn phân tích:** Bóc tách trực tiếp từ state dispatch và event listeners trong các module client `3xi8-jyno5_f-.js`, `0ld2553166s61.js` của Fliki.

---

## 1. Danh mục nút bấm ở CỘT BÊN TRÁI (Left Rail & Scene/Layer Dock)

### 1.1 Thanh Navigation Rail (Thanh icon cực trái)

| Tên nút / Icon | Vị trí | Mục đích sử dụng (User Intent) | Xử lý Frontend (UI State) | Backend Request & Payload | Ánh xạ sang Story2Video |
|---|---|---|---|---|---|
| **Scenes Tab** (`📜`) | Cực trái, trên cùng | Mở/đóng danh sách kịch bản phân cảnh | Đổi active tab, mở panel danh sách Scene. | Client state: `openPanel("scenes")` | Danh sách Shot kịch bản |
| **Media Tab** (`📁`) | Cực trái, thứ hai | Mở thư viện kho ảnh/video stock & tải lên | Mở panel tìm kiếm ảnh Stock (Unsplash/Storyblocks) và file cá nhân. | `GET /api/media/stock?query=...` | Thư viện Story Assets |
| **Templates Tab** (`📑`) | Cực trái, thứ ba | Duyệt các mẫu kịch bản/video dựng sẵn | Mở grid danh sách template. | `GET /api/templates` | Seed styles / Preset mẫu |
| **Brand Kits Tab** (`🎨`) | Cực trái, thứ tư | Quản lý bộ nhận diện thương hiệu (Màu, Font, Logo) | Mở bảng cài đặt Brand Kit. | `GET /api/brand-kits` | Visual Rules / Art Direction |

---

### 1.2 Thao tác trên từng Scene Card (Cột trái)

| Tên nút / Icon | Vị trí | Mục đích sử dụng (User Intent) | Xử lý Frontend (UI State) | Backend Request & Payload | Ánh xạ sang Story2Video |
|---|---|---|---|---|---|
| **Add Layer** (`[+]`) | Đáy mỗi Scene card | Thêm một lớp nội dung mới vào scene (Text, Media, Avatar, Audio) | Mở popover menu: `voiceover`, `media`, `text`, `avatar`. | Gửi `POST /api/scenes/{id}/layers`<br/>Payload: `{ type: "text" \| "media" \| "avatar" }` | Thêm tài sản vào Shot |
| **Drag Layer Handle** (`⠿`) | Cạnh mỗi layer | Kéo thả thay đổi thứ tự hiển thị đè lớp | Hiển thị bóng mờ drag-and-drop, hoán đổi vị trí layer. | Gửi `PATCH /api/scenes/{id}/layers/reorder`<br/>Event: `layer_dragged` | Sắp xếp thứ tự layer |
| **Delete Layer** (`🗑️`) | Menu layer | Xóa bớt một lớp không cần thiết | Xóa layer khỏi card, thu nhỏ chiều cao card. | Gửi `DELETE /api/scenes/{id}/layers/{layerId}`<br/>Event: `layer_removed` | Gỡ tài sản khỏi Shot |
| **Play Scene Audio** (`[▶]`) | Trên Voiceover layer | Nghe thử giọng đọc riêng của phân cảnh đó | Nút chuyển thành `[■ Stop]`, icon sóng âm nhảy nhót. | Phát âm thanh từ URL cache của trình duyệt qua thẻ `<audio>`. Không gọi server. | PT-07: Nghe thử audio shot |
| **Voice Picker** (`[Avatar]`) | Trên Voiceover layer | Đổi người lồng tiếng riêng cho phân cảnh này | Mở modal Voice Library (bộ lọc ngôn ngữ, giới tính, phong cách). | Gửi `PATCH /api/scenes/{id}/layers/{layerId}`<br/>Payload: `{ voiceId: "sarah" }`. Server sinh lại audio. | PT-07: Đổi giọng đọc shot |
| **Auto-pick Media** (`⚡ AI`) | Trên Media layer | Nhờ AI tự chọn ảnh phù hợp với câu kịch bản | Hiện skeleton loading trên ảnh, nút xoay vòng. | Gửi `POST /api/scenes/{id}/auto-pick`<br/>Payload: `{ prompt: text }`. Trả về media mới. | PT-06: Regenerate Illustration |
| **Transition Button** (`⧫`) | Nằm giữa 2 Scene card | Đổi hiệu ứng chuyển cảnh nối giữa 2 scene | Mở popup chọn: Fade, Slide, Zoom, Wipe, Spin. Icon đổi theo hiệu ứng. | Gửi `PATCH /api/scenes/{id}`<br/>Payload: `{ transition: { type: "zoom", durationMs: 500 } }`. | Hiệu ứng chuyển cảnh video |
| **Add Scene** (`[+ Add Scene]`) | Dưới chân danh sách | Thêm phân cảnh mới vào cuối kịch bản | Thêm card rỗng mới, focus con trỏ vào ô nhập text. | Gửi `POST /api/files/{id}/scenes`<br/>Payload: `{ orderIndex: N + 1 }`. | Tạo thêm Shot |
| **Duplicate Scene** | Menu 3 chấm Scene | Nhân đôi phân cảnh để tái sử dụng bố cục | Sao chép toàn bộ text, ảnh, giọng vào scene mới kế tiếp. | Gửi `POST /api/scenes/{id}/duplicate`. | Nhân bản Shot |

---

## 2. Danh mục nút bấm ở THANH TIMELINE PHÍA DƯỚI (Bottom Timeline Dock)

### 2.1 Thanh điều khiển Timeline (Timeline Control Bar)

| Tên nút / Icon | Vị trí | Mục đích sử dụng (User Intent) | Xử lý Frontend (UI State) | Backend / Event Handler | Ánh xạ sang Story2Video |
|---|---|---|---|---|---|
| **Toggle Dock** (`[🔲 / ⎯]`) | Góc phải thanh điều khiển đáy | Thu gọn hoặc mở rộng toàn bộ thanh Timeline | Chiều cao timeline phóng to từ 40px lên 220px (`DockResize`), đẩy canvas lên trên. | State: `setDock({ open: !isOpen })`<br/>Dispatch: `DockOpen` / `DockFolded` | Bật/tắt chế độ Timeline chi tiết |
| **View Mode Switcher** | Bên trái timeline | Chuyển đổi giữa chế độ Timeline đơn giản và Timeline Pro | Đổi cách hiển thị: từ 1 track cơ bản sang 4 track chi tiết (`mode: "pro"`). | State: `setDockView("pro")`<br/>Dispatch: `DockView` | Chế độ xem Timeline chuyên nghiệp |
| **Play / Pause** (`[▶ / ⏸]`) | Trung tâm thanh điều khiển | Phát hoặc tạm dừng toàn bộ video trên timeline | Con trỏ Playhead bắt đầu trôi từ trái sang phải theo thời gian thực. | Client Transport: `t.transport.play()` / `t.transport.pause()`. | Phát duyệt trước video |
| **Timecode Display** | Cạnh nút Play | Hiển thị vị trí thời gian hiện tại / Tổng thời lượng | Cập nhật dạng số: `00:15.2 / 01:25.0` bám sát mili-giây. | Đọc từ `t.transport.currentTime`. | Bộ đếm thời gian video |
| **Zoom In** (`[🔍+]`) | Cạnh phải timeline | Phóng to trục thời gian để căn chỉnh chi tiết từng từ | Các khối track giãn rộng theo chiều ngang, hiện rõ từng gợn sóng âm. | State: `setZoom(zoom + 0.2)`<br/>Css transform scale timeline track. | Zoom timeline |
| **Zoom Out** (`[🔍-]`) | Cạnh phải timeline | Thu nhỏ trục thời gian để nhìn bao quát toàn bộ video | Các khối track co ngắn lại, hiển thị được nhiều scene hơn trên 1 màn hình. | State: `setZoom(zoom - 0.2)`. | Thu nhỏ timeline |
| **Fit to Screen** (`[⤢]`) | Cạnh nút Zoom | Tự động căn chỉnh timeline vừa vặn toàn màn hình | Tính toán tỷ lệ zoom sao cho tổng thời lượng vừa khít chiều rộng cửa sổ. | State: `setZoom(viewportWidth / totalDuration)`. | Căn vừa khung nhìn |

---

### 2.2 Thao tác trực tiếp trên các Track của Timeline

| Tên nút / Thao tác | Vị trí trên Track | Mục đích sử dụng (User Intent) | Xử lý Frontend (UI State) | Backend / Data Payload | Ánh xạ sang Story2Video |
|---|---|---|---|---|---|
| **Playhead Scrubber** (Vạch dọc màu đỏ) | Trải dọc qua cả 4 track | Kéo rê chuột để nhảy đến bất kỳ giây nào trong video | Chuột kéo vạch đỏ đến đâu, Canvas ở giữa hiển thị ngay khung hình ở giây đó. | Client Transport: `t.transport.seek(sec)`. Không lag, phản hồi 60fps. | Rê con trỏ thời gian (Scrubbing) |
| **Split Scene** (`[✂️ Split]`) | Nằm ở thanh công cụ khi chọn 1 block | Cắt đôi Scene tại đúng vị trí con trỏ Playhead đang đứng | Khối Scene bị tách làm 2 phần độc lập, text và audio được chia đôi tương ứng. | Gửi `POST /api/scenes/{id}/split`<br/>Payload: `{ atSecond: 12.5 }`. | Tách shot kịch bản |
| **Trim Edge Handle** (Mép khối Scene) | Mép trái/phải của khối trên Track 1 | Kéo giãn hoặc thu ngắn thời lượng của hình ảnh/video | Chuột kéo mép khối, số giây hiển thị trên khối thay đổi theo thời gian thực. | Gửi `PATCH /api/scenes/{id}`<br/>Payload: `{ durationMs: 9500 }`. | Chỉnh thời lượng Shot |
| **Transition Diamond** (`⧫`) | Nằm giữa 2 khối Scene trên Track 1 | Click vào để đổi nhanh hiệu ứng chuyển cảnh | Mở popover chọn hiệu ứng chuyển cảnh (Tilt Zoom, Ken Burns, Fade, Reveal). | Gửi `PATCH /api/scenes/{id}`<br/>Payload: `{ transitionType: "ken-burns" }`. | Chuyển cảnh giữa 2 shot |
| **Waveform Bar** | Nằm trên Track 2 (Voiceover) | Quan sát hình ảnh trực quan của sóng âm giọng đọc | Hiển thị các dải sóng âm; vùng có tiếng nói nhô cao, vùng lặng phẳng lì. | Dữ liệu vẽ từ mảng biên độ âm thanh (`audioBuffer.getChannelData`). | Sóng âm thuyết minh |
| **Subtitle Word Block** | Nằm trên Track 3 (Subtitles) | Nhìn thấy từng từ phụ đề xuất hiện lúc nào | Khối từ đổi màu highlight khi con trỏ Playhead đi qua (Hiệu ứng Karaoke). | Bám theo `wordTimings` (`{ word, startMs, endMs }`). | Phụ đề nguyên văn chạy chữ |
| **Music Volume & Ducking** | Đầu Track 4 (Background Music) | Chỉnh âm lượng nhạc nền và bật tính năng tự giảm âm khi có lời nói | Mở thanh slider chỉnh % âm lượng và checkbox bật **Auto-Ducking**. | Gửi `PATCH /api/files/{id}/audio`<br/>Payload: `{ musicVolume: 0.2, autoDucking: true }`. | Nhạc nền video |
