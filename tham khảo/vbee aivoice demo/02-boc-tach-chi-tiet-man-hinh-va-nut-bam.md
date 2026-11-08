# Bóc Tách Chi Tiết Cấu Trúc Màn Hình, Nút Bấm & Cơ Chế Xử Lý Sự Kiện

---

## 1. MÀN HÌNH 1: DASHBOARD DANH SÁCH DỰ ÁN (`ProjectListPage`)

### 1.1. Bố cục tổng thể (Layout)
* **Sidebar trái (`HomeSidebar`):** Logo Vbee, menu điều hướng nhanh (Dự án của tôi, Thùng rác, Nâng cấp tài khoản).
* **Header trên (`HomeHeader`):** Thanh tìm kiếm toàn cục, thông báo (`NotificationsRounded`), huy hiệu phần thưởng (`EmojiEventsRounded`), menu đại diện người dùng (`UserMenu`).
* **Khu vực nội dung chính:**
  * **Hàng thẻ tạo dự án nhanh (3 Cards):**
    1. `TaoAudioCard` (Tạo Audio từ văn bản - Tạm thời disabled).
    2. `LongTiengVideoCard` (Lồng tiếng video - Nút kích hoạt chính).
    3. `LongTiengSlideCard` (Lồng tiếng slide thuyết trình - Tạm thời disabled).
  * **Bảng danh sách dự án gần đây:**
    * Thanh công cụ: Tiêu đề "Danh sách dự án", Ô tìm kiếm `Search` (lọc realtime theo tên dự án).
    * Bảng danh sách: Tên dự án, thời gian cập nhật gần nhất (`timeAgo`), icon định dạng (`VideoProjectIcon`), nút menu hành động 3 chấm (`MoreVertical`).
    * Phân trang (`Pagination`): Phân trang động (10, 20, 50 mục/trang).

### 1.2. Danh mục nút bấm & Cơ chế xử lý sự kiện tại `ProjectListPage`

| Nút bấm / Tương tác | Vị trí | Sự kiện xử lý (`Event Handler`) | Dữ liệu & Trạng thái UI | API & Đích gửi dữ liệu |
|---|---|---|---|---|
| **Lồng tiếng video** (`LongTiengVideoCard`) | Hàng thẻ phía trên | `onClick={() => setShowVideoModal(true)}` | Mở hộp thoại `VideoUploadModal`. | Không gọi API (thao tác UI). |
| **Ô tìm kiếm dự án** (`input`) | Góc phải danh sách | `onChange={(e) => setSearch(e.target.value)}` | Cập nhật state `search`, lọc mảng `projects` qua `useMemo`, tự động đưa `page` về 1. | Client-side filter. |
| **Click vào dòng dự án** | Bảng danh sách | `onClick={() => navigate('/project/' + project.id)}` | Chuyển hướng sang màn hình Studio biên tập chi tiết. | Client routing (`react-router`). |
| **Menu 3 chấm** (`MoreVertical`) | Cột cuối mỗi dòng | `onClick={(e) => setMenuOpenId(...)}` | Mở dropdown menu: Đổi tên / Xóa. Ngăn chặn click lan truyền (`stopPropagation`). | Không gọi API (thao tác UI). |
| **Nút Đổi tên** (`Pencil`) | Trong menu 3 chấm | `onClick={() => handleRenameStart(project)}` | Mở chế độ chỉnh sửa tên inline (`editingId`, `editName`). | `PUT /api/projects/{id}` payload: `{ name: editName.trim() }`. |
| **Nút Xóa dự án** (`Trash2`) | Trong menu 3 chấm | `onClick={() => handleDelete(project.id)}` | Hiển thị hộp thoại xác nhận `confirm('Xóa dự án này?')`. Nếu đồng ý, lọc bỏ dự án khỏi state `projects`. | `DELETE /api/projects/{id}`. |
| **Nút Chuyển trang** (`ChevronLeft` / `ChevronRight`) | Chân bảng | `onClick={() => setPage(p => p - 1 / p + 1)}` | Cập nhật state `page`, tính toán lại vị trí `slice(start, end)`. | Client pagination. |

### 1.3. Hộp thoại Tải Video (`VideoUploadModal`)
* **Kéo thả / Chọn file:**
  * Giới hạn: Định dạng `.mp4` hoặc `.mov`; Dung lượng tối đa: `200MB`; Thời lượng tối đa: `30 phút`.
  * Validate metadata: Tạo thẻ `<video>` ảo để lấy `duration` trước khi cho phép upload.
* **Nút "Tiếp tục" (`handleContinue`):**
  1. Gửi `POST /api/upload` dạng `FormData` chứa file video.
  2. Nhận lại URL video máy chủ: `{ url: "/api/uploads/videos/video_xxxx.mp4" }`.
  3. Khởi tạo một `BlockData` mặc định đầu tiên (`Khối 1`).
  4. Gửi `POST /api/projects` với payload:
     ```json
     {
       "name": "ten-file-video",
       "type": "video",
       "data": {
         "blocks": [{ "id": 1, "title": "Khối 1", "content": "", "startSeconds": 0, "endSeconds": 0 }],
         "videoUrl": "/api/uploads/videos/video_xxxx.mp4",
         "fileName": "ten-file-video.mp4"
       }
     }
     ```
  5. Điều hướng sang `/project/{project.id}` mang theo trạng thái ban đầu.

---

## 2. MÀN HÌNH 2: TRÌNH BIÊN TẬP TOÀN DIỆN STUDIO (`ProjectDetailPage`)

Giao diện Studio được chia thành 4 khu vực chức năng chính:
1. **Thanh điều hướng đỉnh (Top Navigation Bar / Header)**
2. **Cột biên soạn nội dung bên trái (Left Content Panel)**
3. **Khu vực trình chiếu Video & Canvas trung tâm (Center Preview Canvas)**
4. **Thanh Timeline biên tập đa rãnh phía dưới (Bottom Multi-track Timeline)**

---

### 2.1. Thanh điều hướng đỉnh (Top Navigation Bar)

| Nút bấm / Điều khiển | Sự kiện (`Event Handler`) | Hành vi & Xử lý trạng thái | Dữ liệu & Đích đến |
|---|---|---|---|
| **Nút Quay lại** (`ArrowLeft`) | `onClick={() => navigate('/')}` | Điều hướng trở về Dashboard danh sách dự án. | Client routing. |
| **Tên dự án (Editable Title)** | `onBlur={handleTitleSave}` | Cho phép đổi tên trực tiếp tại thanh tiêu đề. | Tự động cập nhật vào `projectData` và lưu qua `useAutoSave`. |
| **Chỉ báo Tự động lưu (`useAutoSave`)** | Tự động kích hoạt khi có thay đổi state | Hiển thị biểu tượng đám mây (`Save`): "Đang lưu..." hoặc "Đã lưu vào đám mây". Debounce 1.5 giây. | `PUT /api/projects/{id}` kèm toàn bộ state JSON hiện tại. |
| **Hoàn tác / Làm lại** (`Undo2` / `Redo2`) | `onClick={undo} / onClick={redo}` | Khôi phục hoặc đi tới trạng thái trước đó của mảng `blocks`, `mediaBlocks`, `musicBlocks`. | State history stack (`useUndoRedo`). |
| **Chọn giọng đọc mặc định** | `onClick={() => setShowVoiceModal(true)}` | Mở hộp thoại chọn giọng đọc Vbee (`VoiceSelectionModal`) để áp dụng cho toàn bộ dự án. | Cập nhật `projectData.voice`. |
| **Chọn tốc độ đọc toàn cục** (`SpeedPicker`) | `onClick={() => setShowSpeedDropdown(true)}` | Mở menu chọn dải tốc độ: `0.75x`, `1.0x`, `1.25x`, `1.5x`, `2.0x`. | Cập nhật `projectData.readingSpeed`. |
| **Nút Xuất Video (`ExportModal`)** | `onClick={() => setShowExportModal(true)}` | Mở hộp thoại Export video, kích hoạt A/B test variant (`isBoldExportCta`). | Bắn sự kiện `analytics.exportCtaClicked()`. |

---

### 2.2. Cột biên soạn bên trái (Left Content Panel)

Được điều khiển bởi 2 tab chính:
* **Tab 1: "Nội dung" (`text`):** Chứa danh sách các thẻ thoại (`VoiceoverBlock`) được bọc trong `VirtualizedBlockList`.
* **Tab 2: "Phụ đề" (`caption`):** Bộ công cụ tinh chỉnh kiểu dáng hiển thị phụ đề (`CaptionStyleEditor`).

#### 2.2.1. Cấu trúc và Nút bấm trên mỗi Khối Thoại (`VoiceoverBlock`)

| Nút bấm / Vùng tương tác | Sự kiện (`Event Handler`) | Cơ chế xử lý | Dữ liệu / API ngầm |
|---|---|---|---|
| **Thanh phân cách trên (Divider Row):** | Nằm giữa 2 block liền kề, hiển thị khi hover. | | |
| ↳ **Nút Hợp nhất khối** (`onMergeWithPrev`) | `onClick={onMergeWithPrev}` | Gộp văn bản của block hiện tại vào cuối block trước, cộng dồn thời lượng, xóa block sau. | Cập nhật lại mảng `blocks` và đẩy lịch sử vào `Undo`. |
| ↳ **Nút Thêm khối mới** (`onInsertBefore`) | `onClick={onInsertBefore}` | Chèn một block thoại rỗng mới ngay vị trí giữa 2 block, tự động focus vào ô nhập (`autoEdit`). | Sinh mới `id = nextBlockId++` và `uid = crypto.randomUUID()`. |
| **Checkbox chọn khối** | `onClick={onCheckboxChange}` | Chọn/bỏ chọn khối để thực hiện thao tác hàng loạt (đổi giọng hàng loạt, xóa hàng loạt). | Cập nhật mảng `selectedBlocks: number[]`. |
| **Tên người lồng tiếng (Speaker badge)** | `onClick={onVoiceClick}` | Mở modal chọn giọng đọc riêng biệt cho duy nhất block này. | Thay đổi `block.voice = selectedVoice`. |
| **Chỉ báo tốc độ đọc (`SpeedPicker`)** | `onClick={toggleSpeedPicker}` | Bật popup điều chỉnh tốc độ riêng cho block này. | Thay đổi `block.speed`. |
| **Nút Nghe thử block `[▶ / ⏸]`** | `onClick={() => onPlayBlock(block.id)}` | - Nếu chưa có âm thanh: Gọi sinh TTS ngay lập tức (hiển thị spinner `Loader2`).<br>- Nếu đã có: Phát âm thanh qua thẻ `<audio>` độc lập, cập nhật thời gian phát thời gian thực. | Gọi `generateTTS(block.content, voice.id, speed)` → `GET/POST /api/tts` → Nhận URL `.mp3`. |
| **Menu 3 chấm (`MoreVertical`)** | `onClick={() => setShowMenu(v => !v)}` | Mở menu tùy chọn: Xóa block này hoặc Xóa từ đây trở về sau (`onDeleteFromHere`). | Điều chỉnh mảng `blocks` tương ứng. |
| **Khung nhập văn bản (`textarea`)** | `onChange={handleTextareaChange}`<br>`onBlur={handleContentBlur}` | Tự động tính toán lại chiều cao (`scrollHeight`), đếm ký tự (`{count}/500`). Khi blur ra ngoài: đánh dấu âm thanh cũ là lỗi thời (`stale`), sẵn sàng sinh lại TTS. | Kích hoạt `onContentChange(id, newText)`. |

#### 2.2.2. Bộ tinh chỉnh phụ đề (`CaptionStyleEditor`)
* **Chọn mẫu preset (`CaptionStyleSelector`):** Danh sách mẫu thiết kế sẵn (Minimal, Highlight Word, Karaoke Gold, Box Red, Neon Glow).
* **Font chữ & Cỡ chữ:** Danh sách font tiếng Việt chuẩn (Inter, Montserrat, Be Vietnam Pro, Roboto, Oswald).
* **Màu sắc & Hiệu ứng:**
  * Màu chữ chính (`color`) & Màu từ đang được đọc highlight (`highlightColor`).
  * Viền chữ (`strokeColor`, `strokeWidth`).
  * Đổ bóng (`shadowColor`, `shadowBlur`, `shadowOffsetY`).
  * Hộp nền (`backgroundColor`, `backgroundPadding`, `borderRadius`).
* **Vị trí hiển thị:** Căn lề trái/giữa/phải, Vị trí Y: Trên cùng (`Top`), Giữa (`Center`), Dưới đáy (`Bottom`), bù trừ khoảng cách `marginY`.

---

### 2.3. Khu vực trình chiếu trung tâm (Center Video Preview Canvas)

* **Trình phát kết hợp (Hybrid Sync Engine):**
  * Đồng bộ chặt chẽ 3 thành phần theo một đồng hồ chủ (`usePlaybackEngine` master clock):
    1. Video HTML5 gốc (`<video ref={videoRef}>`).
    2. Audio TTS của các block thoại qua `AudioContext` & `GainNode`.
    3. Phụ đề vẽ thời gian thực trên Canvas 2D (`@vbee-holding/video-renderer/draw`).
* **Các nút điều khiển khung Canvas:**
  * **Tùy chọn tỉ lệ khung hình (`Aspect Ratios`):**
    * `Original`: Tỉ lệ gốc của video tải lên.
    * `16:9`: Chuẩn Youtube / Màn hình ngang.
    * `9:16`: Chuẩn TikTok, Youtube Shorts, Reels.
    * `4:5`: Chuẩn bài đăng Facebook, LinkedIn.
    * `1:1`: Chuẩn bài đăng vuông Instagram.
    * `Custom`: Nhập độ phân giải chiều rộng (W) và chiều cao (H) thủ công.
  * **Chọn màu nền canvas (`exportBgColor`):** Mở bảng chọn màu `ColorPickerPanel` để tô màu cho phần viền trống khi video không vừa tỉ lệ.
  * **Phóng to/Thu nhỏ khung hình (`onToggleExpand`):** Thu gọn thanh timeline phía dưới để mở rộng tối đa không gian màn hình preview.

---

### 2.4. Thanh Timeline đa rãnh phía dưới (`Timeline`)

Quản lý 3 rãnh âm thanh & hình ảnh trực quan:
1. **Rãnh 1: Rãnh Lồng tiếng (`Voice Track`):** Các đoạn âm thanh TTS tương ứng với các khối ở cột trái.
2. **Rãnh 2: Rãnh Video / Ảnh (`Video / Media Track`):** Dải video nền hoặc các slide ảnh chèn thêm.
3. **Rãnh 3: Rãnh Nhạc nền (`Music Track`):** Các đoạn nhạc nền BGM hoặc hiệu ứng SFX.

#### Bảng điều khiển nút bấm trên thanh Timeline:

| Nút bấm / Tương tác | Sự kiện (`Event Handler`) | Hành vi tương tác người dùng | Trạng thái kỹ thuật |
|---|---|---|---|
| **Play / Pause (`Play` / `Pause`)** | `onClick={onPlayPause}` hoặc phím tắt `Space` | Bật/tắt phát toàn bộ dự án từ vị trí con trỏ `currentTime`. | Điều khiển `usePlaybackEngine`. |
| **Skip Back / Skip Forward** | `onClick={...}` | Nhảy lùi 5 giây hoặc tiến 5 giây. | Cập nhật `onSeek(currentTime ± 5)`. |
| **Thanh trượt Playhead (Scrubber)** | `onMouseDown` + `onMouseMove` | Kéo con trỏ thời gian đỏ dọc theo thước đo thời gian để xem trước khung hình tương ứng. | Cập nhật liên tục `currentTime`. |
| **Phóng to / Thu nhỏ Timeline** | `onClick={ZoomIn / ZoomOut}` | Thay đổi độ giãn của thước đo từ `5px/giây` đến `120px/giây`. | Điều chỉnh tỉ lệ biến đổi tọa độ `pxPerSecond`. |
| **Công cụ Kéo cắt (`Scissors`)** | `onClick={handleSplitAtPlayhead}` | Cắt đôi block đang chọn tại đúng vị trí Playhead hiện tại. | Tạo ra 2 block mới với `duration` và `startTime` tương ứng. |
| **Kéo dãn biên khối (Trim Handles)** | Drag tay cầm mép trái / mép phải của block | Điều chỉnh điểm bắt đầu phát (`trimStart`) và thời lượng hiển thị (`duration`) của video/nhạc. | Giới hạn không vượt quá `naturalDuration` gốc. |
| **Kéo di chuyển khối (Drag & Drop)** | Drag thân block dọc theo rãnh | Di chuyển thời điểm bắt đầu phát (`startTime`) của âm thanh hoặc video. | Cập nhật `onBlockChange` / `onMediaBlockChange`. |
| **Nút Âm lượng từng rãnh (`Volume2`)** | `onClick={toggleVolumePopover}` | Mở thanh trượt điều chỉnh âm lượng riêng biệt cho: Lồng tiếng (0-100%), Video gốc (0-100%), Nhạc nền (0-100%). | Điều chỉnh hệ số khuếch đại `GainNode.gain.value`. |
| **Nút Thêm Media (`+ Video/Ảnh`)** | `onClick={onAddMediaBlock}` | Mở kho media `MediaLibraryModal`. | Chèn `MediaBlock` vào rãnh Video. |
| **Nút Thêm Nhạc (`+ Nhạc nền`)** | `onClick={onAddBackgroundMusic}` | Mở kho âm thanh `AudioLibraryModal`. | Chèn `MusicBlock` vào rãnh Music. |
| **Mở rộng/Thu gọn Timeline** | `onClick={toggleCollapse}` | Chuyển đổi chiều cao timeline giữa 52px (thu gọn) và 232px (đầy đủ 3 track). | Cập nhật `timelineHeight`. |

---

### 2.5. Hộp thoại Xuất Video (`ExportModal`)

* **Lựa chọn chế độ xuất video:**
  * **Chế độ 1: Local Desktop Agent (Vbee Studio Plugin qua `vbeestudio://`):**
    * Client kiểm tra agent cục bộ qua `pingAgent()` (`http://127.0.0.1:PORT`).
    * Nếu tìm thấy: Gửi lệnh render xuống client, tận dụng GPU máy tính, không lo timeout.
    * Sau khi xuất xong: Cung cấp 2 nút **"Mở file" (`agentOpenFile`)** và **"Mở thư mục chứa" (`agentRevealFile`)**.
  * **Chế độ 2: Cloud Render (FastAPI Server):**
    * Gửi `POST /api/export` lên server.
    * Nhận `job_id`, tiến hành Polling mỗi 1 giây vào `GET /api/export/{job_id}` để nhận phần trăm tiến độ (`progress`), trạng thái (`serverStatus`) và thời gian ước tính còn lại (`formatCountdown(eta)`).
    * Khi hoàn thành: Cung cấp nút **"Tải video về máy" (`Download`)** dẫn tới link file `/api/exports/{fileName}.mp4`.
