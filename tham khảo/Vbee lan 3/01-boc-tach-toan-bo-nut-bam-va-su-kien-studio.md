# Bóc Tách Toàn Bộ Cấu Trúc Màn Hình Studio, Danh Mục Nút Bấm & Đích Đến Dữ Liệu

> **URL phân tích:** `https://vbee-aivoice-demo.vercel.app/projects/dfda6f6e-789b-46df-b6dc-4bd8534dba89`  
> **Source code tham chiếu:** `demo-ai-content-studio-master/src/app/pages/ProjectDetailPage.tsx`, `ProjectSidebar.tsx`, `VirtualizedBlockList.tsx`, `VoiceoverBlock.tsx`, `VoiceSelectionModal.tsx`, `SpeedPicker.tsx`  
> **Mục tiêu:** Bóc tách chính xác từng thành phần giao diện, mọi nút bấm, sự kiện kích hoạt và đường đi của dữ liệu để lập trình viên triển khai giao diện Frontend.

---

## 1. Sơ Đồ Bố Cục Không Gian Thực Tế Màn Hình Studio TTS

Toàn bộ màn hình được chia thành 4 khu vực làm việc:

```
+----+-------------------------------------------------------------------------------------------------------------------+
| S  | [←] Vbee AIVoice - Nền tảng chuyển văn bản thành giọng nói                          [ 💾 Lưu ]  [ ⬇ Tải xuống [v] ] |
| I  |     5 blocks                                                                                                      |
| D  +-------------------------------------------------------------------------------------------------------------------+
| E  |                                  KHU VỰC CUỘN NỘI DUNG CHÍNH (Căn giữa, max-w-[1400px])                           |
| B  |                                                                                                                   |
| A  |  1. Block 1 ------------------------------------------------------------------------ [Hover: ☍ Hợp nhất | ✚ Chèn]  |
| R  |  +---------------------------------------------------------------------------------------------------------------+ |
|    |  | [ ] | 👤 Triệu Dương (Nam) [v]   [⏱ 1.0x]                      [ ▶ ] (Play riêng block)    [ ⋮ Menu ]       | |
| (80|  | ------------------------------------------------------------------------------------------------------------- | |
| px)|  | | "Cơn mưa rào đầu mùa trút xuống thành phố lúc nửa đêm mang theo hơi lạnh buốt giá."                        | |
|    |  | |                                                                                                     73/500  | |
| 🎙 |  +---------------------------------------------------------------------------------------------------------------+ |
|    |                                                                                                                   |
| 📁 |  2. Block 2 ------------------------------------------------------------------------ [Hover: ☍ Hợp nhất | ✚ Chèn]  |
|    |  +---------------------------------------------------------------------------------------------------------------+ |
| ⚙  |  | [ ] | 👩 Hoài My (Nữ) [v]        [⏱ 1.1x]                      [ ▶ ] (Play riêng block)    [ ⋮ Menu ]       | |
|    |  | ------------------------------------------------------------------------------------------------------------- | |
|    |  | | "Thám tử Minh bước vào văn phòng, rũ bỏ chiếc áo khoác ướt sũng rồi châm một điếu thuốc."                   | |
|    |  | |                                                                                                     82/500  | |
|    |  +---------------------------------------------------------------------------------------------------------------+ |
|    |                                                                                                                   |
|    |                                          [ + Thêm khối mới ]                                                      |
+----+-------------------------------------------------------------------------------------------------------------------+
| THANH AUDIO PLAYER PHÁT TOÀN BỘ CỐ ĐỊNH DƯỚI ĐÁY (Fixed Bottom Media Player Bar - Cao 80px):                           |
| [ 🎵 ] Khối 1 - Vbee AIVoice...        [⏮ Lùi]   [ ▶ Phát toàn bộ / ⏸ Tạm dừng ]   [⏭ Tiến]         [⚙]  [🔊]  [☰]      |
|        00:00 / 02:45                   [===========================●==============================] (Thanh tua)        |
+------------------------------------------------------------------------------------------------------------------------+
```

---

## 2. Bảng Danh Mục Chi Tiết 100% Nút Bấm, Sự Kiện Xử Lý & Đích Đến Dữ Liệu

### 2.1. Khu vực Cột Sidebar Bên Trái (`ProjectSidebar` - Rộng 80px)

| Nút bấm / Phần tử | Icon / Hiển thị | Sự kiện xử lý | State quản lý | Đích gửi dữ liệu & Tác vụ hệ thống |
| :--- | :---: | :--- | :--- | :--- |
| **Logo Vbee** | Logo vector Vbee | `onClick` chuyển trang | Không | Chuyển hướng router về trang danh sách `/`. |
| **Tab "Speech"** | Icon sóng âm + "Speech" | `onClick={() => onTabChange('text')}` | `activeTab = 'text'` | Kích hoạt giao diện biên tập kịch bản thoại (mặc định). |
| **Tab "Phụ đề"** | Icon CC + "Phụ đề" | `onClick={() => onTabChange('caption')}` | `activeTab = 'caption'` | Mở giao diện tùy chỉnh font chữ, màu sắc phụ đề. |
| **Avatar User** | Avatar tròn nhỏ ở đáy | `onClick` mở menu | `UserMenu` state | Hiển thị menu người dùng: Hồ sơ, Gói cước, Đăng xuất. |

---

### 2.2. Khu vực Thanh Header Trên Cùng (Sticky Header)

| Nút bấm / Phần tử | Icon / Hiển thị | Sự kiện xử lý | State quản lý | Đích gửi dữ liệu & Tác vụ hệ thống |
| :--- | :---: | :--- | :--- | :--- |
| **Nút Quay lại** | `ArrowLeft` | `onClick={() => navigate('/')}` | Router | Điều hướng về `/`. Kích hoạt hook `useAutoSave` lưu snapshot kịch bản cuối cùng vào database. |
| **Tiêu đề dự án** | Text hiển thị | Chế độ xem tên | `projectName` | Hiển thị tên tệp dự án hiện tại. |
| **Số lượng blocks** | Text phụ `5 blocks` | Đếm tự động | `blocks.length` | Hiển thị tổng số đoạn thoại trong kịch bản. |
| **Nút "Lưu" thủ công** | Icon `Save` + chữ "Lưu" | `onClick={handleManualSave}` | `isSaving` | Gửi request `PUT /api/projects/{id}` lưu toàn bộ dữ liệu dự án lên server. Hiện thông báo toast "Đã lưu". |
| **Nút "Tải xuống"** | Icon `Download` + `ChevronDown` (Nút màu vàng `#ffd60a`) | `onClick={() => setShowDownloadMenu(v => !v)}` | `showDownloadMenu` (boolean) | Bật/tắt menu xổ xuống gồm 2 lệnh xuất bản: |
| ↳ **Lệnh "Tải video"** | Icon `Film` + chữ "Tải video" | `onClick={() => { setShowDownloadMenu(false); setShowExportModal(true); }}` | `showExportModal = true` | Mở hộp thoại `ExportModal` để cấu hình xuất video sóng âm MP4 (chọn độ phân giải 1080p, 720p). |
| ↳ **Lệnh "Tải SRT"** | Icon `FileAudio` + chữ "Tải SRT" | `onClick={handleExportSRT}` | Không | Tính toán mốc thời gian của từng câu thoại, tạo chuỗi phụ đề SRT và kích hoạt trình duyệt tải file `.srt` trực tiếp về máy. |

---

### 2.3. Khu vực Khối Thoại: Danh Sách `VirtualizedBlockList` & `VoiceoverBlock`

Đây là trung tâm giao diện của ứng dụng. Mỗi khối thoại gồm các nút bấm chi tiết sau:

| Nút bấm / Tương tác | Vị trí | Sự kiện xử lý | State quản lý | Đích gửi dữ liệu & Tác vụ hệ thống |
| :--- | :--- | :--- | :--- | :--- |
| **Nút "Hợp nhất khối"** | Nằm trên vạch kẻ giữa 2 khối (hover mới hiện) | `onClick={onMergeWithPrev}` | `blocks` | Gộp toàn bộ văn bản của khối hiện tại vào cuối khối phía trên. Xóa khối hiện tại. Đánh số lại ID các khối. Đẩy vào lịch sử `pushHistory()`. |
| **Nút "Thêm khối ở giữa"** | Nằm trên vạch kẻ giữa 2 khối (hover mới hiện) | `onClick={onInsertBefore}` | `blocks` | Chèn một khối thoại trống mới vào ngay phía trên khối này. Tự động focus con trỏ vào ô nhập văn bản mới. |
| **Checkbox chọn khối** | Góc trên bên trái của thẻ | `onClick={(e) => { e.stopPropagation(); onCheckboxChange(block.id); }}` | `selectedBlocks` | Thêm hoặc loại bỏ `block.id` vào mảng chọn `selectedBlocks`. (Nếu mảng này có phần tử, thanh banner chọn màu đen trên header sẽ hiện ra). |
| **Nút "Tên Nhân vật / Giọng đọc"** | Cạnh avatar tròn trên thẻ | `onClick={(e) => { e.stopPropagation(); onVoiceClick(block.id); }}` | `currentEditingBlockId = block.id`, `showVoiceModal = true` | Mở hộp thoại `VoiceSelectionModal` để chọn nhân vật/giọng đọc cho **RIÊNG CÂU THOẠI NÀY**. |
| **Nút "Tốc độ đọc"** | Nút `⏱ 1.0x` | `onClick={(e) => { e.stopPropagation(); setShowSpeedPicker(p => !p); }}` | `showSpeedPicker` (boolean) | Mở popover `SpeedPicker`. Khi chọn tốc độ mới (ví dụ `1.2x`): cập nhật `block.speed`, **đặt `audioUrl: undefined`**, kích hoạt `useAutoSave`. |
| **NÚT PLAY RIÊNG CỦA KHỐI** | Nút tròn cạnh menu 3 chấm | `onClick={(e) => { e.stopPropagation(); onPlayBlock(block.id); }}` | `ttsLoadingBlockIds`, `blockPlayerState` | **Kích hoạt luồng nghe thử riêng đoạn này:**<br/>- Nếu khối chưa có âm thanh: Gọi `ensureTTS(block)` ➔ Hiển thị spinner `<Loader2 className="animate-spin" />` ➔ Gọi `GET /api/tts` ➔ Nhận file MP3 ➔ Gán `audioUrl` mới ➔ Tắt spinner ➔ Phát âm thanh qua `blockAudioRef`.<br/>- Nếu câu thoại đang phát: Bấm vào sẽ tạm dừng (Pause). |
| **Nút Menu 3 chấm** | Góc trên bên phải của thẻ | `onClick={(e) => { e.stopPropagation(); setShowMenu(v => !v); }}` | `showMenu` (boolean) | Mở dropdown menu chứa 2 lệnh xóa: |
| ↳ **Lệnh "Xóa block"** | Trong menu 3 chấm | `onClick={() => onDelete(block.id)}` | `blocks` | Xóa bỏ khối thoại này khỏi danh sách. Gọi hàm `reindex()` đánh số lại thứ tự. Đẩy vào `pushHistory()`. |
| ↳ **Lệnh "Xóa từ đây trở về sau"** | Trong menu 3 chấm | `onClick={() => onDeleteFromHere(block.id)}` | `blocks` | Cắt bỏ toàn bộ kịch bản từ khối này đến cuối trang. |
| **Ô soạn thảo văn bản** | Khu vực nội dung thẻ | `onClick` chuyển `<p>` thành `<textarea>`; `onChange` gõ chữ; `onBlur` kết thúc sửa | `isEditing`, `editedContent` | Khi người dùng gõ xong và click chuột ra ngoài (`onBlur`): Nếu nội dung có thay đổi, cập nhật `block.content = newContent`, **đặt `audioUrl: undefined`** (đánh dấu cần tạo lại audio), kích hoạt `useAutoSave` gửi `PUT /api/projects/{id}` sau 2 giây. |
| **Nút "+ Thêm khối"** | Nằm ở cuối cùng danh sách kịch bản | `onClick={handleAddNewBlock}` | `blocks` | Tạo thêm một khối thoại mới ở cuối danh sách kịch bản với giọng đọc kế thừa từ khối trước. |

---

### 2.4. Khu vực Thanh Audio Player Cố Định Dưới Đáy Màn Hình

| Nút bấm / Phần tử | Icon / Thể hiện | Sự kiện xử lý | State quản lý | Đích gửi dữ liệu & Tác vụ hệ thống |
| :--- | :---: | :--- | :--- | :--- |
| **Nút Lùi khối** | `SkipBack` | `onClick={handlePrevBlock}` | `currentBlockIndex` | Chuyển trình phát lùi về câu thoại liền trước. |
| **NÚT PLAY/PAUSE TOÀN BỘ KỊCH BẢN** | Nút tròn màu vàng to `#ffd60a` chứa icon `Play` hoặc `Pause` | `onClick={handlePlayMediaPlayer}` | `mediaPlayerState.isPlaying` | **Phát toàn bộ kịch bản kịch tính từ đầu đến cuối:**<br/>- Kiểm tra toàn bộ các khối thoại trong dự án.<br/>- Nếu có bất kỳ khối nào chưa có audio (do vừa đổi giọng hoặc vừa sửa text): Gọi `generateTTSParallel` chạy song song tối đa 5 luồng để tạo đủ âm thanh.<br/>- Bắt đầu phát từ Khối 1 ➔ Khối 2 ➔ Khối 3... Câu nào đang đọc sẽ tự động sáng viền tím `#1E164E` và màn hình tự động cuộn đến câu đó. |
| **Nút Tiến khối** | `SkipForward` | `onClick={handleNextBlock}` | `currentBlockIndex` | Chuyển trình phát tiến sang câu thoại kế tiếp. |
| **Nút Cài đặt âm thanh** | `Settings` | `onClick` | UI state | Tùy chỉnh chất lượng âm thanh phát thử. |
| **Nút Âm lượng** | `Volume2` | `onClick` | `volumes` | Điều chỉnh âm lượng thanh phát (0% - 100%). |
| **Nút Danh sách phát** | `List` | `onClick` | UI state | Bật/tắt chế độ tự động cuộn màn hình theo câu thoại đang phát. |
| **Thanh trượt tua tiến trình (Progress Bar)** | Dải màu vàng trên vạch xám | `onClick={handleProgressClick}` | `mediaPlayerState.currentTime` | Tính toán tỷ lệ phần trăm vị trí click chuột, tua kịch bản đến đúng mốc thời gian đó và phát tiếp. |

---

### 2.5. Hộp Thoại Chọn Nhân Vật / Giọng Đọc (`VoiceSelectionModal`)

Hộp thoại này bật lên khi người dùng click vào tên nhân vật trên một khối thoại:

| Nút bấm / Phần tử | Sự kiện xử lý | State quản lý | Đích gửi dữ liệu & Tác vụ hệ thống |
| :--- | :--- | :--- | :--- |
| **Ô tìm kiếm giọng** | `onChange={(e) => setSearch(e.target.value)}` | `searchQuery` | Lọc danh sách giọng đọc theo tên nhân vật (Client filter realtime). |
| **Bộ lọc Vùng miền** | `onClick` chọn tab: Tất cả, Bắc, Trung, Nam | `selectedRegion` | Lọc danh sách giọng theo vùng miền. |
| **Nút Nghe thử giọng mẫu** | Icon Play nhỏ `[ ▶ ]` bên cạnh mỗi giọng | `audio.play()` | Phát file MP3 demo có sẵn trên CDN của Vbee để người dùng nghe thử âm sắc. |
| **Click chọn dòng giọng đọc** | `onClick={() => onSelectVoice(voice)}` | `voice` object | Kích hoạt hàm `handleSelectVoice(voice)`: Cập nhật `block.voice = voice`, **đặt `audioUrl: undefined`** trên khối đang chọn, lưu lịch sử `pushHistory()`, đóng modal. |
| **Nút Đóng `[✕]`** | `onClick={onClose}` | `showVoiceModal = false` | Đóng modal mà không thay đổi nhân vật. |
