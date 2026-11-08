# Bóc Tách Chi Tiết Giao Diện Màn Hình TTS Studio (Trạng Thái Bình Thường Để Code UI)

> **URL phân tích:** `https://vbee-aivoice-demo.vercel.app/projects/dfda6f6e-789b-46df-b6dc-4bd8534dba89`  
> **Source code gốc tham chiếu:** `src/app/pages/ProjectDetailPage.tsx`, `src/app/components/VirtualizedBlockList.tsx`, `src/app/components/VoiceoverBlock.tsx`  
> **Mục đích:** Cung cấp tài liệu quy chuẩn thiết kế giao diện (UI Specs) ở **TRẠNG THÁI BÌNH THƯỜNG (Normal State / Default UI)** - không phải trạng thái tick chọn hàng loạt, giúp lập trình viên frontend dựng giao diện chuẩn xác 100%.

---

## 1. Bản Vẽ Bố Cục Giao Diện Màn Hình Bình Thường (Normal Screen Wireframe)

Khi người dùng mở một dự án chuyển văn bản thành giọng nói (chưa tick chọn khối nào, `selectedBlocks = []`), toàn bộ màn hình hiển thị như sau:

```
+----+--------------------------------------------------------------------------------------------------------------------+
| S  | [←] Vbee AIVoice - Nền tảng chuyển văn bản thành giọng nói                           [ 💾 Lưu ]   [ ⬇ Tải xuống [v] ] |
| I  |     5 blocks                                                                                                       |
| D  +--------------------------------------------------------------------------------------------------------------------+
| E  |                                  KHU VỰC CUỘN NỘI DUNG CHÍNH (Căn giữa, max-w-[1400px])                            |
| B  |                                                                                                                    |
| A  |  1. Block 1 ------------------------------------------------------------------------- [Hover: ☍ Hợp nhất | ✚ Chèn]   |
| R  |  +----------------------------------------------------------------------------------------------------------------+ |
|    |  | [ ] | 👤 Triệu Dương (Nam) [v]   [⏱ 1.0x]                       [ ▶ ] (Play riêng block)    [ ⋮ Menu ]        | |
| (80|  | -------------------------------------------------------------------------------------------------------------- | |
| px)|  | | "Cơn mưa rào đầu mùa trút xuống thành phố lúc nửa đêm mang theo hơi lạnh buốt giá."                         | |
|    |  | |                                                                                                      73/500  | |
| 🎙 |  +----------------------------------------------------------------------------------------------------------------+ |
|    |                                                                                                                    |
| 📁 |  2. Block 2 ------------------------------------------------------------------------- [Hover: ☍ Hợp nhất | ✚ Chèn]   |
|    |  +----------------------------------------------------------------------------------------------------------------+ |
| ⚙  |  | [ ] | 👩 Hoài My (Nữ) [v]        [⏱ 1.1x]                       [ ▶ ] (Play riêng block)    [ ⋮ Menu ]        | |
|    |  | -------------------------------------------------------------------------------------------------------------- | |
|    |  | | "Thám tử Minh bước vào văn phòng, rũ bỏ chiếc áo khoác ướt sũng rồi châm một điếu thuốc."                    | |
|    |  | |                                                                                                      82/500  | |
|    |  +----------------------------------------------------------------------------------------------------------------+ |
|    |                                                                                                                    |
|    |  3. Block 3 ------------------------------------------------------------------------- [Hover: ☍ Hợp nhất | ✚ Chèn]   |
|    |  +----------------------------------------------------------------------------------------------------------------+ |
|    |  | [ ] | 👤 Duy Khoa (Nam) [v]      [⏱ 1.0x]                       [ ▶ ] (Play riêng block)    [ ⋮ Menu ]        | |
|    |  | -------------------------------------------------------------------------------------------------------------- | |
|    |  | | "Hắn ta đã để lại một phong bì kỳ lạ ngay trên bàn làm việc của tôi từ sáng nay."                            | |
|    |  | |                                                                                                      71/500  | |
|    |  +----------------------------------------------------------------------------------------------------------------+ |
|    |                                                                                                                    |
|    |                                          [ + Thêm khối mới ]                                                       |
+----+--------------------------------------------------------------------------------------------------------------------+
| THANH AUDIO PLAYER PHÁT TOÀN BỘ CỐ ĐỊNH DƯỚI ĐÁY (Fixed Bottom Media Player Bar - Cao 80px):                            |
| [ 🎵 ] Khối 1 - Vbee AIVoice...        [⏮ Lùi]   [ ▶ Phát toàn bộ / ⏸ Tạm dừng ]   [⏭ Tiến]          [⚙]  [🔊]  [☰]       |
|        00:00 / 02:45                   [===========================●==============================] (Thanh tua)         |
+-------------------------------------------------------------------------------------------------------------------------+
```

---

## 2. Bóc Tách Chi Tiết Từng Component & Thuộc Tính Styling

### 2.1. Thanh Header Cố Định Trên Cùng (Sticky Header)
* **Vị trí & Kích thước:** `sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm`.
* **Cột trái:**
  * **Nút Quay lại (`ArrowLeft`):** Kích thước `w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100`.
  * **Cụm tiêu đề:**
    * Tiêu đề kịch bản: `font-['SF_Pro_Text:Semibold'] text-[16px] text-[#1c1c1e] truncate`.
    * Dòng phụ: `font-['SF_Pro_Text:Regular'] text-[12px] text-[rgba(28,28,30,0.64)]` hiển thị số lượng khối (ví dụ: `5 blocks`).
* **Cụm nút bên phải:**
  * **Nút Lưu thủ công (`Save`):**
    * Style: `px-3 py-1.5 border border-[rgba(30,22,78,0.16)] rounded-[8px] text-[13px] font-medium text-[#1c1c1e] hover:bg-gray-50 flex items-center gap-1.5`.
    * Icon `Save` kích thước `w-4 h-4`.
  * **Nút Tải xuống (`Download`):**
    * Style: `px-3 py-1.5 bg-[#ffd60a] hover:bg-[#ffc107] text-[#1e164e] font-semibold text-[13px] rounded-[8px] flex items-center gap-1.5 shadow-sm`.
    * Icon `Download` (`w-4 h-4`) + chữ "Tải xuống" + Icon mũi tên xổ xuống `ChevronDown` (`w-3.5 h-3.5`).
    * Khi click mở dropdown gồm: `[ Film Tải video ]` và `[ FileAudio Tải SRT ]`.

---

### 2.2. Khu Vực Kịch Bản Chính: `VirtualizedBlockList`
* **Container bọc ngoài:** `max-w-[1400px] mx-auto px-6 pb-32 pt-4`.
* **Cơ chế render:** Danh sách ảo hóa (`react-window` hoặc mapping thông thường với `margin-top: 40px` giữa các khối).
* **Mỗi hàng gồm 2 thành phần:**
  1. Hàng nhãn phân cách trên (Label & Hover Divider).
  2. Thẻ Khối Thoại (`VoiceoverBlock`).

---

### 2.3. Bóc Tách Chi Tiết Khối Thoại: `VoiceoverBlock` (TRỌNG TÂM CỐT LÕI)

Mỗi khối thoại là một phân cảnh độc lập có cấu trúc cực kỳ rõ ràng:

#### A. Hàng Phân Cách Trên (Top Divider Row - Nằm ở vị trí `-top-8`):
* **Nhãn số thứ tự (Bên trái):**
  * `1. Block 1`, `2. Block 2`, `3. Block 3`...
  * Style: `font-['SF_Pro_Text:Semibold'] text-[14px] text-[rgba(28,28,30,0.64)] shrink-0`.
* **Cụm nút ẩn hiện khi hover (`group-hover/divider:opacity-100 transition-opacity`):**
  * Bình thường cụm nút này tàng hình (`opacity-0`), khi rê chuột vào khoảng giữa 2 khối thì hiện lên:
    * Đường kẻ xám: `flex-1 h-px bg-gray-300`.
    * **Nút Hợp nhất (`onMergeWithPrev`):** Nút tròn `w-6 h-6 rounded-full border border-gray-200 bg-white hover:bg-gray-50 shadow-sm flex items-center justify-center`. Icon 2 mũi tên ép vào nhau. Title: "Hợp nhất khối".
    * **Nút Chèn khối mới ở giữa (`onInsertBefore`):** Nút tròn `w-6 h-6 rounded-full border border-gray-200 bg-white hover:bg-gray-50 shadow-sm flex items-center justify-center`. Icon dấu cộng `<Plus className="w-3 h-3 text-gray-500" />`. Title: "Thêm khối mới".
    * Đường kẻ xám tiếp theo: `flex-1 h-px bg-gray-300`.

#### B. Khung Thẻ Card (`Card Container`):
* **Kích thước & Bo góc:** Bo góc tròn `rounded-[12px]`, chiều cao tối thiểu `min-h-[136px]`.
* **Màu sắc & Viền ở trạng thái bình thường:**
  * Nền trắng mờ: `bg-white/90 hover:bg-white`.
  * Viền trong suốt: `border border-transparent`.
  * Đổ bóng nhẹ: `shadow-[0_1px_4px_rgba(30,22,78,0.06)]`.
  * Khi hover chuột vào thẻ: `hover:shadow-[0_4px_16px_rgba(30,22,78,0.1)]`.
* **Khi được Highlight (Đang phát câu này hoặc đang click soạn thảo):**
  * Viền đổi thành màu tím đậm: `border-[#1E164E]`.
  * Đổ bóng tím: `shadow-[0_4px_20px_rgba(30,22,78,0.12)]`.

#### C. Hàng Header Bên Trong Khối (`Block Header Row` - `px-4 py-3 flex items-center`):
1. **Ô Checkbox (Bên trái):**
   * Ô vuông nhỏ `w-5 h-5 rounded border-2 border-gray-300 hover:border-gray-400 cursor-pointer flex items-center justify-center`.
   * Ở trạng thái bình thường: Ô trống trắng (chưa tick).
2. **Vách ngăn dọc:** Đường kẻ dọc mảnh `w-px h-6 bg-[rgba(60,60,67,0.16)] mx-3`.
3. **Cụm Thông Tin Nhân Vật / Giọng Đọc (Speaker Info):**
   * **Avatar:** Vòng tròn `w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex-shrink-0`.
   * **Tên Nhân vật / Giọng đọc:**
     * Nút text: `text-[14px] font-medium text-[rgba(30,22,78,0.8)] hover:text-[#007aff] transition-colors truncate max-w-[180px] cursor-pointer`.
     * Ví dụ hiển thị: `Triệu Dương (Nam)`, `Hoài My (Nữ)`.
     * **Sự kiện click:** Bấm vào đây để mở `VoiceSelectionModal` đổi nhân vật cho riêng câu thoại này.
   * **Mũi tên dropdown:** Icon tam giác nhỏ hướng xuống `[v]` màu tím đậm `fill-[rgba(30,22,78,0.8)]`.
4. **Nút Chọn Tốc Độ Đọc (`SpeedPicker Button`):**
   * Nút nhỏ gọn: `flex items-center gap-1 px-2 py-1 rounded-md text-[12px] text-gray-400 hover:bg-gray-100 hover:text-gray-600 cursor-pointer`.
   * Icon đồng hồ bấm giờ `11x11px` + Text tốc độ: `1.0x` (hoặc `0.8x`, `1.2x`).
   * Khi click mở popup danh sách tốc độ từ `0.5x` đến `2.0x`.
5. **NÚT PLAY RIÊNG CỦA CÂU THOẠI (`handlePlayBlock`):**
   * Nút bấm: `p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer`.
   * **Trạng thái 1 (Bình thường):** Icon Play tam giác `[ ▶ ]` (`<Play className="w-5 h-5 text-[rgba(30,22,78,0.8)]" />`). Click vào để nghe thử riêng câu này.
   * **Trạng thái 2 (Đang tạo lại âm thanh sau khi đổi giọng):** Icon xoay tròn `<Loader2 className="w-5 h-5 text-[rgba(30,22,78,0.8)] animate-spin" />`. Nút tạm thời bị disabled.
   * **Trạng thái 3 (Đang phát câu này):** Icon Tạm dừng `[ ⏸ ]` (`<Pause className="w-5 h-5 text-[rgba(30,22,78,0.8)]" />`).
6. **Nút Menu 3 Chấm (`MoreVertical`):**
   * Nút `p-2 hover:bg-gray-100 rounded-lg cursor-pointer`. Icon 3 chấm dọc `w-5 h-5`.
   * Khi click mở popup menu nhỏ gồm:
     * `[ 🗑 Xoá block ]`: Xóa câu này.
     * `[ 🗑 Xoá từ đây trở về sau ]`: Xóa toàn bộ từ câu này đến hết kịch bản.

#### D. Khu Vực Soạn Thảo Văn Bản Thoại (`Content Area` - `px-4 pb-3 flex flex-col`):
1. **Đường kẻ lề bên trái (Vertical Accent Bar):**
   * Vạch kẻ dọc `w-px rounded-full mr-4 self-stretch`.
   * Trạng thái bình thường: Màu xám nhạt `bg-[rgba(28,28,30,0.24)]`.
   * Khi click vào soạn thảo hoặc khi đang phát: Đổi sang màu đen đậm `bg-[#1C1C1E]`.
2. **Khu vực hiển thị / chỉnh sửa chữ:**
   * **Khi không click vào:** Hiển thị thẻ `<p className="text-[14px] leading-[20px] cursor-text hover:bg-white/50 rounded px-1 -mx-1 text-[rgba(28,28,30,0.8)] whitespace-pre-wrap">`.
   * **Khi click chuột vào:** Lập tức biến thành `<textarea autoFocus>` không viền `bg-transparent border-none outline-none resize-none`, tự động mở rộng chiều cao theo số dòng chữ (`scrollHeight`).
3. **Bộ đếm ký tự (Góc dưới bên phải):**
   * Căn phải: `flex justify-end mt-auto`.
   * Số ký tự đã gõ màu xanh dương: `<span className="text-[12px] text-[#007aff]">73</span>`.
   * Giới hạn ký tự màu xám: `<span className="text-[12px] text-[rgba(28,28,30,0.64)]">/500</span>`.

---

### 2.4. Thanh Audio Player Cố Định Dưới Đáy Màn Hình (`Bottom Fixed Media Player Bar`)

Thanh điều khiển âm thanh toàn cục luôn nằm cố định ở chân trang (`fixed bottom-0 left-[80px] right-0 bg-white border-t border-gray-200 shadow-lg z-40`):
* **Chiều cao:** Khoảng `80px - 90px`.
* **Hàng trên (Cụm điều khiển):**
  * **Cột trái - Thông tin bài phát:**
    * Khối Album Art: Hình vuông `48x48px` bo góc `rounded-[8px]` nền gradient xanh - tím kèm icon `Volume2` màu trắng.
    * Tiêu đề: Tên khối đang phát (ví dụ: "Khối 1") hoặc tiêu đề truyện.
    * Thời gian: `00:00 / 02:45` (Thời gian hiện tại / Tổng thời lượng).
  * **Cột giữa - Bộ nút phát toàn bộ kịch bản:**
    * Nút `[⏮ SkipBack]`: Lùi về câu trước.
    * **Nút Play chính toàn bộ:** Nút tròn to `p-3 rounded-full bg-[#ffd60a] hover:bg-[#ffc107] transition-colors shadow-sm`.
      * Icon Play tam giác `[ ▶ ]` hoặc icon Pause `[ ⏸ ]` màu tím đậm `#1e164e` kích thước `w-6 h-6`.
      * Khi bấm nút này: Toàn bộ kịch bản được phát liên tục từ Khối 1 đến hết. Khối nào đang đọc sẽ tự động sáng viền tím và màn hình tự cuộn đến khối đó.
    * Nút `[⏭ SkipForward]`: Tiến sang câu kế tiếp.
  * **Cột phải - Công cụ bổ trợ:**
    * Nút Cài đặt `Settings` (`w-5 h-5`).
    * Nút Âm lượng `Volume2` (`w-5 h-5`).
    * Nút Danh sách `List` (`w-5 h-5`).
* **Hàng dưới (Thanh trượt tiến trình - Progress Bar):**
  * Thanh trượt mỏng `h-1 bg-gray-200 rounded-full overflow-hidden cursor-pointer mt-2`.
  * Dải tiến độ màu vàng `#ffd60a` chạy mượt mà từ trái sang phải theo thời gian phát thực tế.
