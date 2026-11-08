# 01 — Kiến trúc tổng thể Fliki Editor (Bổ sung toàn diện Cột trái & Thanh Timeline phía dưới)

> **Mục tiêu:** Khắc phục triệt để các phần thiếu sót ở bản phân tích trước, tập trung bóc tách chuyên sâu **Cột bên trái (Sidebar, Navigation Rail, Layer Manager)** và **Thanh Timeline phía dưới (Bottom Timeline Dock / Pro Multi-Track)** dựa trên kết quả reverse-engineering bundle mã nguồn Next.js của Fliki.

---

## 1. Bản đồ bố cục không gian Fliki Editor (Layout Wireframe)

Giao diện Fliki Editor thực chất là một kiến trúc **4 vùng làm việc tích hợp (Integrated 4-Area Workspace)**:

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│  [Logo Fliki]  Tiêu đề File | [Tỷ lệ: 16:9 ▼] | [⏱️ 01:25]         [👁️ Preview All]   [⚙️ File Settings] [🎬 Export] │
├────┬──────────────────────────────────────────┬────────────────────────────────────────┬─────────────────────────┤
│ 1  │ 2. CỘT BÊN TRÁI: SCENE & LAYER DOCK      │ 3. CỘT GIỮA: LIVE CANVAS PLAYER        │ 4. CỘT PHẢI: INSPECTOR  │
│ R  │ (Quản lý phân cảnh & các lớp nội dung)   │ (Màn hình trình chiếu Remotion 16:9)   │ (Thuộc tính chi tiết)   │
│ A  ├──────────────────────────────────────────┼────────────────────────────────────────┼─────────────────────────┤
│ I  │ [ Scene #1 ] 00:00 - 00:08 (8s)          │ ┌────────────────────────────────────┐ │ Đang chọn: Scene #2     │
│ L  │ ┌──────────────────────────────────────┐ │ │                                    │ │                         │
│    │ │ 🖼️ [Media Layer: Ảnh 16:9]           │ │ │          CANVAS PREVIEW            │ │ 🎙️ Voiceover Layer     │
│ 📜 │ │ 👤 [Voiceover: Sarah (1.0x)] [▶ Nghe]│ │ │       (Remotion Player Engine)     │ │ • Voice: Sarah        │
│ S  │ │ 🔤 "Em không nghe mùa thu, dưới..." │ │ │                                    │ │ • Speed: 1.0x         │
│ c  │ │ [+ Thêm Layer: Text / Avatar / SFX]  │ │ │    "Lá thu rơi xào xạc..."         │ │ • Pitch: 0%           │
│ e  │ └──────────────────────────────────────┘ │ └────────────────────────────────────┘ │                         │
│ n  │ [ ⧫ Chuyển cảnh: Zoom In ]               │                                        │ 🖼️ Media Layer          │
│ e  │ ──────────────────────────────────────── │ ◀◀  [ ▶ Play ]  ▶▶   [ 00:12 / 01:25 ] │ • Fit: Cover / Fit      │
│ s  │ [ Scene #2 ] 00:08 - 00:16 (8s)          │                                        │ • Pan / Zoom (Ken Burns)│
│    │ ┌──────────────────────────────────────┐ │ [🔲 Tắt/Bật Timeline Đáy: DockOpen]    │ • Prompt sinh ảnh AI    │
│ 📁 │ │ 🖼️ [Media Layer: Ảnh 16:9]           │ │                                        │                         │
│ M  │ │ 👤 [Voiceover: Sarah (1.0x)] [▶ Nghe]│ │                                        │ 🔤 Subtitle Layer       │
│ e  │ │ 🔤 "Lá thu rơi xào xạc..."           │ │                                        │ • Font, Color, Highlight│
│ d  │ └──────────────────────────────────────┘ │                                        │                         │
│ i  │ [+ Add Scene]  [⚡ AI Auto-pick All]     │                                        │                         │
│ a  │                                          │                                        │                         │
├────┴──────────────────────────────────────────┴────────────────────────────────────────┴─────────────────────────┤
│ 5. THANH TIMELINE PHÍA DƯỚI (BOTTOM TIMELINE DOCK / PRO MODE)                                                     │
│ [Mode: Pro Timeline ▼]  [🔍 Zoom: ──●──]  [Fit Screen]  [✂️ Split]  [🗑️ Delete]           [⏱️ 00:12.4 / 01:25.0]     │
├───────────────┬──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Track 1: Media│ [    Scene 1: Ảnh rừng thu (8s)    ] ⧫Zoom [     Scene 2: Ảnh con nai vàng (8s)    ] ⧫Fade       │
├───────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Track 2: Voice│ ∿∿∿ "Em không nghe mùa thu..." ∿∿∿        | ∿∿∿ "Lá thu rơi xào xạc..." ∿∿∿                      │
├───────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Track 3: Subs │ [ Em không nghe ] [ mùa thu ]              | [ Lá thu rơi ] [ xào xạc ]                          │
├───────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Track 4: Music│ ♫ Nhạc nền: Autumn Melody (Volume: 20% | Auto-ducking: On) ───────────────────────────────────── │
└───────────────┴──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Bóc tách chi tiết: CỘT BÊN TRÁI (Left Navigation Rail & Scene/Layer Dock)

Trong mã nguồn client Fliki (`3xi8-jyno5_f-.js` và `0ld2553166s61.js`), cột bên trái được chia thành **2 thành phần con**:
1. **Navigation Rail (Thanh điều hướng cực trái):** Chứa các biểu tượng danh mục.
2. **Scene & Layer Dock (Khung biên tập phân cảnh):** Nơi người dùng trực tiếp sửa kịch bản, gán giọng và cấu trúc các lớp nội dung.

### 2.1 Navigation Rail (Thanh icon cực trái)
* **Scenes Icon (`editor.navigation.scenes`):** Mở danh sách các phân cảnh (mặc định luôn mở).
* **Media Library (`stockMedia`):** Truy cập kho tài nguyên ảnh/video/GIF (hàng triệu stock từ Unsplash, Storyblocks).
* **Brand Kits (`brandKits`):** Quản lý màu thương hiệu, custom font và logo watermark (`watermark layer`).
* **Templates (`templates`):** Thư viện mẫu video dựng sẵn.

### 2.2 Kiến trúc Hệ thống Layer (Layer System) trong mỗi Scene
Mỗi Scene của Fliki không phải là một khối văn bản phẳng, mà là một **Container chứa nhiều Layer độc lập** (`LayersPanel`):
* **`voiceover layer` (Lớp thuyết minh):** Quản lý giọng đọc TTS (`Create audio using text-to-speech using voiceover layer`). Gồm: Avatar diễn viên, tên giọng (Sarah), nút nghe thử `[▶]`, số giây thời lượng (`duration`).
* **`media layer` (Lớp hình ảnh/video):** Chứa hình ảnh hoặc clip minh họa (`Add images, videos, or GIFs using media layer`). Hỗ trợ: Auto-pick AI, Prompt sinh ảnh mới, hiệu ứng chuyển động Ken Burns.
* **`text layer` (Lớp chữ/tiêu đề):** Chèn các dòng chữ tiêu đề, phụ đề hoặc ghi chú nổi trên video (`Add headings or paragraphs using text layer`).
* **`avatar layer` (Lớp nhân vật ảo nói):** Thêm người ảo nói cử động môi đồng bộ với giọng đọc (`Add talking head with lip-sync to your video using avatar layer`).
* **`audio layer / sfx` (Lớp hiệu ứng âm thanh):** Thêm tiếng động đặc biệt cho phân cảnh (tiếng chuông, tiếng bước chân, tiếng gió).

### 2.3 Các thao tác trên Scene Card ở cột trái
* **Kéo thả sắp xếp Layer (`layer_dragged`):** Có thể kéo thứ tự đè lớp của Media và Text.
* **Nhóm / Hủy nhóm Layer (`layers_grouped`, `ungroupLayer`):** Gom các layer lại để di chuyển cùng nhau.
* **Tự động sinh lại ảnh cho các layer trống (`regenerateEmptyMediaLayers`):** Nút bấm 1-click để AI quét các scene chưa có ảnh và tự động vẽ bổ sung.
* **Chuyển cảnh giữa các Scene (`Edit scene transition`):** Biểu tượng hình quả trám `rotate-45` nằm ngay giữa 2 Scene card, cho phép chọn hiệu ứng: Fade, Slide, Zoom, Wipe, Dissolve.

---

## 3. Bóc tách chi tiết: THANH TIMELINE PHÍA DƯỚI (Bottom Timeline Dock / Pro Mode)

Đây là thành phần cốt lõi bị thiếu ở bản phân tích trước. Trong mã nguồn Fliki (`3xi8-jyno5_f-.js`), thanh timeline này được điều khiển bởi state **`dockView`** và **`dockOpen`**.

### 3.1 Hai chế độ hiển thị của Timeline Đáy (Dock View Modes)
1. **Chế độ Rail / Collapsed (Thu gọn):** 
   - Đáy màn hình chỉ hiển thị thanh điều khiển mini: Nút Play/Pause, mốc thời gian `00:15 / 01:30`, và nút bấm **[Mở Timeline]**.
2. **Chế độ Timeline Pro (`dockView: "timeline"` / `mode: "pro"`):**
   - Đáy màn hình mở rộng thành một **Trình biên tập đa track (Multi-track Timeline)** chuyên nghiệp, cho phép kéo giãn chiều cao (`DockResize`), phóng to/thu nhỏ trục thời gian (`zoom`), và cắt ghép trực quan.

### 3.2 Cấu trúc 4 Track trên Timeline Fliki
1. **Track 1: Media / Visual Track (`InputVideoTrack`):**
   * Hiển thị độ dài từng Scene dưới dạng các khối chữ nhật tỷ lệ thuận với số giây.
   * Trên mỗi khối có thumbnail ảnh, tên scene, và thanh kéo ở mép (Trim handle) để tăng/giảm thời lượng.
   * Giữa 2 khối scene có nút chuyển cảnh (Transition Marker) để đổi hiệu ứng nối tiếp.
2. **Track 2: Voiceover / Speech Track (`InputAudioTrack`):**
   * Hiển thị dạng sóng âm (Waveform) của giọng đọc TTS tương ứng với từng câu thoại.
   * Giúp người dùng nhìn thấy ngay chỗ nào có tiếng nói, chỗ nào có khoảng lặng (Pause) để cắt ghép chuẩn nhịp.
3. **Track 3: Subtitles / Caption Track (`TrackCueList`):**
   * Hiển thị các khối từ phụ đề bám sát theo mốc thời gian (`atWord`, `atTypewriter`, `wordTimings`).
   * Người dùng có thể kéo chỉnh vị trí xuất hiện của chữ sớm hoặc muộn hơn giọng đọc.
4. **Track 4: Background Music Track (`music`):**
   * Trải dài xuyên suốt toàn bộ video.
   * Tích hợp tính năng **Auto-Ducking**: Khi Track Voiceover có tiếng người nói thì Track Music tự động hạ âm lượng xuống 15-20%, khi hết lời nói thì nhạc tự động nổi lên mức 100%.

### 3.3 Các công cụ thao tác trên Timeline Đáy
* **Con trỏ thời gian (Playhead / Scrubber):** Vạch dọc màu đỏ hiển thị vị trí hiện tại của video. Kéo con trỏ đến đâu, Canvas ở cột giữa hiển thị khung hình tại thời điểm đó (`t.transport.seek(sec)`).
* **Nút Cắt / Tách phân cảnh (`[✂️ Split]`):** Đặt con trỏ tại vị trí mong muốn và bấm Split để chia 1 Scene dài thành 2 Scene ngắn.
* **Thanh trượt Thu phóng (`[🔍 Zoom Slider]`):**
   - Kéo sang phải để phóng to trục thời gian (phóng đại từng mili-giây, dễ chỉnh phụ đề và ngắt câu).
   - Kéo sang trái để thu nhỏ trục thời gian (nhìn bao quát toàn bộ video 5-10 phút).
* **Nút Vừa màn hình (`[Fit to Screen]`):** Tự động co giãn toàn bộ timeline vừa vặn với chiều ngang màn hình máy tính.
