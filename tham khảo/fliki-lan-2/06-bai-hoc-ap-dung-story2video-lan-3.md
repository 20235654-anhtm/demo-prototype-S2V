# 06 — Bài học thiết kế Wireframe Story2Video (Phiên bản nâng cấp lần 3)

> **Mục tiêu:** Tích hợp đầy đủ các phát hiện về **Cột bên trái (Scene & Layers)** và **Thanh Timeline phía dưới (Bottom Multi-Track Dock)** từ Fliki vào bản thiết kế màn hình làm việc tập trung (All-in-One Studio Canvas) của Story2Video.

---

## 1. Điểm đột phá từ phân tích Fliki lần 3 cho Story2Video

Ở các bản phác thảo trước, chúng ta chỉ mới hình dung giao diện gồm 3 cột dọc (Assets bên trái — Shot feed ở giữa — Inspector bên phải). 
Tuy nhiên, qua việc bóc tách mã nguồn Fliki lần này, chúng ta phát hiện ra **2 thành phần then chốt** giúp nâng tầm trải nghiệm người dùng lên chuẩn thương mại:

1. **Khái niệm "Layers trong Shot" ở Cột trái:**
   * Trong một phân cảnh (Shot), nội dung không bị dồn thành một cục văn bản thô, mà được bóc tách thành các lớp rõ ràng:
     - `voiceover layer`: Quản lý giọng đọc TTS và nút nghe thử.
     - `media layer`: Quản lý hình ảnh minh họa shot và nút vẽ lại AI.
     - `character layer / tag`: Gắn các nhân vật xuất hiện trong shot (@Lan, @Minh).
   * Điều này giúp người dùng nhìn vào là thấy ngay quan hệ giữa chữ - hình - tiếng.

2. **Thanh Timeline Đa Track ở Đáy màn hình (Bottom Dock):**
   * Đây chính là **"mắt xích còn thiếu"** quan trọng nhất!
   * Khi làm video từ truyện chữ, nếu chỉ cuộn chuột đọc dọc từng card, người dùng sẽ không cảm nhận được **nhịp điệu thời gian (Pacing)** của video (đoạn nào dài, đoạn nào ngắn, khoảng lặng giữa các câu ra sao).
   * Nhờ có thanh Timeline đáy với **Con trỏ Playhead (vạch đỏ)** và **Dải sóng âm (Waveform)**, người dùng có thể kéo rê chuột (Scrubbing) để nghe lướt toàn bộ câu chuyện và nhìn thấy phụ đề chạy theo thời gian thực!

---

## 2. Bản vẽ Wireframe nâng cấp cho Prototype Story2Video (Chuẩn 4 vùng)

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [Logo Story2Video]  Dự án: "Tiếng Thu" | Tỷ lệ: 16:9 | Style: Watercolor | [⏱️ 01:25]      [🎬 Tạo Video Hoàn Chỉnh]│
├─────────────────────┬──────────────────────────────────────────┬─────────────────────────────────────────────────┤
│ CỘT TRÁI: ASSETS    │ CỘT GIỮA: STORYBOARD SHOT FEED           │ CỘT PHẢI: LIVE PREVIEW & INSPECTOR              │
│ (Thế giới truyện)   │ (Danh sách phân cảnh & các Layers)       │ (Trình chiếu Video Canvas + Thuộc tính)         │
├─────────────────────┼──────────────────────────────────────────┼─────────────────────────────────────────────────┤
│ 👥 NHÂN VẬT (2)     │ [ Shot #01 ] 00:00 - 00:08 (8s)          │ ┌─────────────────────────────────────────────┐ │
│ • Lan (Nữ, áo dài)  │ ┌──────────────────────────────────────┐ │ │                                             │ │
│   [Ảnh 1:1] [Sửa]   │ │ 🖼️ [Ảnh 16:9]   [⚡ Vẽ lại AI]       │ │ │          CANVAS PREVIEW 16:9              │ │
│ • Minh (Nam, thư)   │ │ 👤 Voice: Nam Bắc (1.0x) [▶ Nghe]    │ │ │          (Mô phỏng video thời gian thực)  │ │
│   [Ảnh 1:1] [Sửa]   │ │ 🔤 "Em không nghe mùa thu, dưới..." │ │ │                                             │ │
│                     │ │ 🏷️ Nhân vật: [@Lan]                  │ │ │       "Lá thu rơi xào xạc..."               │ │
│ 🏡 ĐỊA ĐIỂM (1)     │ └──────────────────────────────────────┘ │ └─────────────────────────────────────────────┘ │
│ • Rừng phong lá đỏ  │ [ ⧫ Chuyển cảnh Ken Burns: Zoom In ]     │                                                 │
│   [Ảnh 16:9] [Sửa]  │ ──────────────────────────────────────── │ ◀◀  [ ▶ Play Toàn Bộ ]  ▶▶   [ 00:12 / 01:25 ]  │
│                     │ [ Shot #02 ] 00:08 - 00:16 (8s)          │ ─────────────────────────────────────────────── │
│ 🗡️ ĐẠO CỤ (0)       │ ┌──────────────────────────────────────┐ │ 🎨 Inspector Chi Tiết Shot Đang Chọn:          │
│                     │ │ 🖼️ [Ảnh 16:9]   [⚡ Vẽ lại AI]       │ │ • Prompt Brief: [Lan walking in autumn...]    │
│ [+ Thêm Asset mới]  │ │ 👤 Voice: Nam Bắc (1.0x) [▶ Nghe]    │ │ • Cấu hình đọc: Giọng Nam Bắc | Speed 1.0x     │
│                     │ │ 🔤 "Lá thu rơi xào xạc..."           │ │ • Hiệu ứng ảnh: Ken Burns Zoom In 10%         │
│                     │ │ 🏷️ Nhân vật: [@Lan, @Rừng phong]    │ │                                                 │
│                     │ └──────────────────────────────────────┘ │                                                 │
├─────────────────────┴──────────────────────────────────────────┴─────────────────────────────────────────────────┤
│ 🔲 THANH TIMELINE ĐA TRACK Ở ĐÁY MÀN HÌNH (BOTTOM TIMELINE DOCK - Có thể thu gọn/mở rộng)                        │
│ [Mode: Timeline Pro]  [🔍 Zoom: ───●───]  [⤢ Fit Screen]  [✂️ Tách Shot]             [⏱️ 00:12.4 / 01:25.0]       │
├────────────────┬─────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Track 1: Ảnh   │ [    Shot 1: Ảnh rừng thu (8s)    ] ⧫ZoomIn [     Shot 2: Ảnh con nai vàng (8s)    ] ⧫Fade     │
├────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Track 2: Audio │ ∿∿∿ "Em không nghe mùa thu..." ∿∿∿         | ∿∿∿ "Lá thu rơi xào xạc..." ∿∿∿                     │
├────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Track 3: Phụ đề│ [ Em không nghe ] [ mùa thu ]               | [ Lá thu rơi ] [ xào xạc ]                         │
└────────────────┴─────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Lợi ích vượt trội của thiết kế nâng cấp này

1. **Thỏa mãn đúng 100% mong muốn của bạn:**
   - Vừa **nghe thử giọng đọc** từng đoạn (nút [▶] inline tại card hoặc track audio sóng âm dưới đáy).
   - Vừa **nhìn thấy phân cảnh có ảnh gì** (thumbnail 16:9 tại card và khối ảnh trên timeline).
   - Vừa **xem và chỉnh setting từng nhân vật** (cột trái Story Assets).
   - Vừa **đối chiếu được toàn bộ kịch bản theo trục thời gian** (con trỏ Playhead kéo rê mượt mà).

2. **Chế độ làm việc linh hoạt (Dock Folded vs Dock Open):**
   - Khi người dùng muốn tập trung đọc duyệt câu chữ kịch bản: Bấm nút **[⎯ Thu gọn Timeline]** để mở rộng không gian cho Cột giữa cuộn đọc thoải mái.
   - Khi người dùng muốn nghiệm thu nhịp điệu video và âm thanh: Bấm nút **[🔲 Mở rộng Timeline]** để nhìn thấy toàn bộ sóng âm và các hiệu ứng chuyển cảnh Ken Burns.

3. **Ánh xạ hoàn hảo vào Kiến trúc Kỹ thuật (`02-thiet-ke-ky-thuat.md`):**
   - Không phát sinh thêm bảng DB mới: Vẫn dựa trên các bảng `shots`, `illustrations`, `narrations`, `timelines`, `timeline_tracks`.
   - Tiến trình render cuối cùng vẫn do FFmpeg Render Worker đảm nhiệm dựa trên `timeline_snapshot` chuẩn chỉnh.
