# Thiết Kế Khung Giao Diện Studio (EditorPage Layout & Timeline)

Tài liệu đặc tả kiến trúc khung giao diện, cơ chế Pin/Dock kịch bản (Script Panel), các tùy chọn trên Sidebar phải (`Script`, `Story Assets`, `Visuals`), 2 chế độ hiển thị thanh tua, cùng **chi tiết thiết kế Thước kẻ thời gian (Time Ruler) và Con trỏ kim (Playhead) chuẩn theo `Timeline.tsx`** cho trang Studio Editor (`/editor/:projectId`).

---

## PHẦN 1: MÔ TẢ GIAO DIỆN & HÀNH VI

### 1. Bố Cục Tổng Thể & Cơ Chế Pin Kịch Bản

Khung giao diện Studio chiếm trọn toàn màn hình (`h-screen overflow-hidden flex flex-col`), có **Header riêng biệt** (không dùng chung Header có Avatar của HomePage):

```
+---------------------------------------------------------------------------------------------------------+
| [←] Dưới sự thao túng của...                                                           [ ⤓ Xuất video ] |
+-------------------+----------------------------------------------------+--------------------+-----------+
| (1) CỘT TRÁI      | (2) KHUNG CANVAS PREVIEW                           | (3) PANEL PHẢI     | (4) THANH |
| SCRIPT PANEL      |                                                    | (ASSETS / VISUALS) | SIDEBAR   |
| (Khi đã Pin 📌)   |  +----------------------------------------------+  |                    | PHẢI CÙNG |
|                   |  |                                              |  | [👥] Story Assets  | [ 📄 ]    |
| [📌][⤢][✕]        |  |          VIDEO / CANVAS MÀN HÌNH CHÍNH       |  |                    | Script    |
|                   |  |                                              |  | (Panel trống)      |           |
| Cảnh 1:           |  +----------------------------------------------+  |                    | [ 👥 ]    |
| "Bạn làm việc..." |                                                    |                    | Assets    |
|                   |  +----------------------------------------------+  |                    |           |
| Cảnh 2:           |  | (5) THANH TUA: COMPACT SCRUBBER / TIMELINE   |  |                    | [ 🖼 ]    |
| "Chỉ với thói..." |  | [ ▶ ] [ 00:31 / 00:44 ] [=====●=====] [ ⌃ ]  |  |                    | Visuals   |
|                   |  +----------------------------------------------+  |                    |           |
+-------------------+----------------------------------------------------+--------------------+-----------+
```

* **Header riêng của Studio (`EditorHeader`):**
  * Bên trái: Nút quay lại trang chủ `[←]` kèm Tên dự án (`Dưới sự thao túng của...`).
  * Bên phải: Nút hành động chính **`[ ⤓ Xuất video ]`** (Màu nổi bật).
  * *Lưu ý:* Không chứa Undo/Redo và không có Avatar/thông tin người dùng như ở trang chủ.

---

#### 1.1. Các Trạng Thái Co Giãn Cột (1, 2, 3 Cột)

* **Trạng thái 3 cột (Chuẩn làm việc chuyên nghiệp):**
  * Cột trái: Script đã được Ghim (`isScriptPinned = true`).
  * Giữa: Canvas Preview tự co giãn vừa vặn (`flex-1`).
  * Phải: Mở một panel khác (ví dụ: `Story Assets` hoặc `Visuals`).
  * Thanh sidebar phải cùng: Icon của tab tương ứng đang sáng active.

* **Trạng thái 2 cột - Đóng Cột Trái:**
  * Cột trái: Bị đóng (`isScriptOpen = false`).
  * Giữa: Canvas Preview dãn rộng sang trái chiếm trọn không gian.
  * Phải: Panel bên phải (`Story Assets` hoặc `Visuals`) vẫn mở.

* **Trạng thái 2 cột - Mở Script ở Panel Phải chưa Pin:**
  * Người dùng bấm icon `[ 📄 Script ]` trên sidebar phải.
  * Script mở ra ở **Panel Phải (3)**. Trên header của Script xuất hiện nút **`[ 📌 Pin ]`**.
  * Cột trái (1) đang đóng, Canvas Preview chiếm phía bên trái.

---

#### 1.2. Quy Tắc Hoạt Động Của Nút Ghim (Pin Logic)

```
[ Click 'Script' ở Sidebar phải ] 
            │
            ▼
[ Script mở tại Panel Phải ] ──( Bấm nút 📌 Pin )──► [ Script chuyển sang ghim Cột Trái ]
            │                                                      │
     ( Bấm nút ✕ )                                          ( Bấm ✕ hoặc 📌 Bỏ ghim )
            │                                                      │
            ▼                                                      ▼
[ Đóng Script Panel ]                                  [ Đóng Cột Trái, trả không gian cho Canvas ]
```

* **Nút `Script` trên Sidebar:**
  * Là nút duy nhất có khả năng **Pin** sang Cột Trái.
  * Khi đang mở ở Panel Phải -> Header có icon `[ 📌 Pin ]`.
  * Bấm `[ 📌 Pin ]`: Script lập tức biến mất khỏi Panel Phải và xuất hiện cố định ở Cột Trái (`Left Panel`). Lúc này Panel Phải được giải phóng (có thể mở tab khác như `Story Assets` / `Visuals` hoặc để trống).
* **Các nút khác trên Sidebar (`Story Assets`, `Visuals`):**
  * Luôn luôn chỉ mở ở **Panel Phải**.
  * Header chỉ có tiêu đề và nút đóng `[ ✕ ]`, **không có nút `[ 📌 Pin ]`**.
  * Hiện tại hiển thị dưới dạng **Panel khung trống (Placeholder Panel)** để chuẩn bị cho việc tích hợp tính năng chi tiết sau này.

---

### 2. Hai Chế Độ Thanh Tua / Timeline (Canvas Bottom Area)

Nằm ngay bên dưới màn hình video preview, có nút mũi tên ngược `[ ⌃ ]` (Caret Up) để chuyển đổi giữa 2 chế độ:

#### 2.1. Chế độ 1: Compact Scrubber (Mặc định)
Thanh điều khiển thu gọn, tiết kiệm diện tích tối đa cho màn hình video:
```
+----------------------------------------------------------------------------------------------------+
|  [ ▶ ]  [ ↺ ]  [ 🔊 ]    00:31 / 00:44    [==========●==============|===]    [ ⛶ ]    [ ⌃ ]        |
+----------------------------------------------------------------------------------------------------+
```
* `[ ▶ ]`: Play / Pause.
* `[ ↺ ]`: Tua lại 5 giây.
* `[ 🔊 ]`: Điều chỉnh âm lượng.
* `00:31 / 00:44`: Thời gian hiện tại / Tổng thời lượng video.
* `Seekbar`: Thanh trượt tiến độ (sử dụng Shadcn `Slider`), có các vạch chia ranh giới giữa các Scene.
* `[ ⛶ ]`: Toàn màn hình (Fullscreen).
* **`[ ⌃ ]` (Caret Up):** Nhấp vào để **Mở rộng thành Chế độ Timeline**.

---

#### 2.2. Chế độ 2: Expanded Timeline (Thiết kế hoàn chỉnh theo `Timeline.tsx`)

Mở rộng khung bên dưới thành bàn dựng Timeline đa tầng chuyên nghiệp, **trang bị đầy đủ Dãy mốc thời gian / Thước kẻ (Time Ruler) và Con trỏ kim định vị (Playhead)**:

```
+---------------------------------------------------------------------------------------------------------------+
| [ ▶ ] [ ↺ ] [ 🔊 ]  00:31 / 00:44  [ ⛶ ]  |  [ 🔍 ] [ - 100% + ] [ ↻ ] [Fit]                            [ ⌄ ] |
+-------+-------------------------------------------------------------------------------------------------------+
| LABEL | DÃY MỐC THỜI GIAN / THƯỚC KẺ (TIME RULER) - Click hoặc Kéo chuột để tua kim                           |
| TRACK | 00:00        00:05        00:10        00:15        00:20        00:25        00:30        00:35      |
|       | |....|....|....|....|....|....|....|....|....|....|....|....|....|....|....|....|....|...▼...|....|....|  |
+-------+---------------------------------------------------------------------------------------+---------------+
|       |                                                                                       | (Đầu kim ▼)   |
| [🎬]  | TRACK 1 (SCENES):                                                                     |               |
| Video | +--------------+     +------------------------+     +-------------------+             | (Thân kim |)  |
|       | | [1] Cảnh 1   |     | [2] Cảnh 2             |     | [3] Cảnh 3        |             | kẻ dọc dài    |
|       | | 5.2s         |     | 15.9s (Đang chọn)      |     | (⚠️ Lỗi hình)     |             | xuyên suốt    |
|       | +--------------+     +------------------------+     +-------------------+             | qua TẤT CẢ    |
|       |                                                                                       | các track)    |
| [🎤]  | TRACK 2 (VOICE):                                                                      |               |
| Voice | [ 🎵 Duy Phương nâng cao - 15.9s                                            ]         |               |
|       |                                                                                       |               |
| [🎵]  | TRACK 3 (MUSIC):                                                                      |               |
| Music | [ 🎵 Background music - Lo-fi Calm                                         ]         |               |
+-------+---------------------------------------------------------------------------------------+---------------+
|       | < ============================ Thanh cuộn ngang Timeline ========================================= > |
+---------------------------------------------------------------------------------------------------------------+
```

---

#### 2.3. Chi Tiết Cơ Chế Thước Kẻ (Time Ruler) & Khả Năng Co Dãn (Zoom)

Hệ thống Thước kẻ kế thừa nguyên lý xử lý từ [`Timeline.tsx`](file:///e:/Tài%20liệu/Daigaku/2026.1/GR2/Book%20to%20Video/demo-ai-content-studio-master/src/app/components/Timeline.tsx):

##### A. Thông số điều khiển tỷ lệ dãn (`pixelsPerSec`)
* **`pixelsPerSec` (px/giây):** Đại diện cho số lượng pixel trên màn hình tương ứng với 1 giây thời lượng video.
  * Mặc định: `pixelsPerSec = 40` (1 giây rộng 40px).
  * Phạm vi điều chỉnh: từ `MIN_PX_PER_SEC = 5` (zoom xa, thấy toàn bộ) đến `MAX_PX_PER_SEC = 120` (zoom gần, xem từng khung hình chi tiết).
  * Nút `[Fit]`: Tự động tính toán tỷ lệ để trải vừa khít toàn bộ độ dài video trong độ rộng khung nhìn hiện tại:
    $$\text{pixelsPerSec} = \frac{\text{containerWidth} - \text{LABEL\_WIDTH}}{\text{totalDuration}}$$

##### B. Khả năng dãn ngang của toàn bộ Timeline (`timelineWidth`)
* Độ rộng canvas cuộn của Timeline tự động dãn nở theo công thức:
  $$\text{timelineWidth} = \max(\text{totalDuration} \times \text{pixelsPerSec}, \text{containerWidth})$$
* Toàn bộ Thước kẻ, các block Scene và Audio track được đặt trong một container có độ rộng `timelineWidth`, cho phép cuộn ngang (`overflow-x-auto`) mượt mà khi timeline dài hơn màn hình.

##### C. Thuật toán phân vạch thích ứng (Adaptive Tick Interval)
Khoảng cách giữa các vạch số tự động điều chỉnh tránh đè chữ:
* `pixelsPerSec >= 60`: Chia vạch mỗi **1 giây** (`tickInterval = 1`).
* `pixelsPerSec >= 30`: Chia vạch mỗi **2 giây** (`tickInterval = 2`).
* `pixelsPerSec >= 20`: Chia vạch mỗi **5 giây** (`tickInterval = 5`).
* `pixelsPerSec >= 14`: Chia vạch mỗi **10 giây** (`tickInterval = 10`).
* `pixelsPerSec < 14`: Chia vạch mỗi **20 giây** (`tickInterval = 20`).

##### D. Phân cấp thị giác giữa Vạch chính & Vạch phụ
* **Vạch chính (Major Tick):** Độ cao vạch `h-3` (12px), màu xám đậm `bg-gray-400`. Có nhãn mốc thời gian `MM:SS` ngay bên dưới (`00:00`, `00:05`, `00:10`...).
* **Vạch phụ (Minor Tick):** Độ cao vạch `h-2` (8px), màu xám nhạt `bg-gray-300`, không có số.

---

#### 2.4. Chi Tiết Thiết Kế Con Trỏ Kim (Playhead) & Tương Tác

##### A. Cấu trúc hình học của Kim (Playhead Geometry)
* **Vị trí trục hoành (X position):** $\text{playheadX} = \text{displayTime} \times \text{pixelsPerSec}$.
* **Đầu kim (Triangle Pointer Cap):** Dạng tam giác chúc mũi nhọn xuống nằm ngay trên đỉnh thanh Thước kẻ:
  `w-0 h-0 border-l-[5px] border-r-[5px] border-t-[8px] border-l-transparent border-r-transparent border-t-blue-500`.
* **Thân kim (Vertical Needle Line):** Đường kẻ dọc `w-px bg-blue-500 pointer-events-none z-10` kéo dài từ chân Thước kẻ xuyên suốt qua **tất cả các Track** (Video Scenes, Voice, Background Music) xuống tận đáy Timeline.

##### B. Tương tác Tua & Kéo Kim (Playhead Seeking & Dragging)
1. **Click tua nhanh (Instant Seek):** Nhấp chuột vào bất kỳ vị trí nào trên Thước kẻ hoặc trên các track -> Kim nhảy tới vị trí đó và cập nhật thời gian phát.
2. **Kéo rê kim (Scrubbing / Dragging):** Nhấn giữ chuột trái tại Thước kẻ -> Di chuột để kim bám sát vị trí chuột theo thời gian thực -> Thả chuột để cố định.
3. **Tự động cuộn theo kim (Auto-Scroll):** Khi video đang phát hoặc khi kéo kim sát mép màn hình (< 60px), Timeline tự động cuộn ngang để giữ kim luôn trong tầm mắt.

---

## PHẦN 2: KẾ HOẠCH TRIỂN KHAI FRONTEND (`demo-fe-prototype-S2V/fe`)

### 1. Cấu Trúc Thư Mục Component Studio Mới

```
fe/src/
├── components/
│   └── ui/                                   # TẦNG GỐC SHADCN UI
│       ├── button.tsx                        # (Có sẵn)
│       ├── slider.tsx                        # (Bổ sung cho Seekbar & Zoom Slider)
│       ├── scroll-area.tsx                   # (Bổ sung cho Cuộn kịch bản)
│       └── tooltip.tsx                       # (Bổ sung cho tooltip các nút icon)
│
└── pages/
    └── EditorPage/
        ├── EditorPage.tsx                    # Khung chia 3 khu vực & State điều phối các Panel
        └── components/                       # TẦNG NGHIỆP VỤ STUDIO
            ├── EditorHeader.tsx              # Topbar: [←] Tên dự án | [Xuất video]
            ├── FarRightSidebar.tsx           # Thanh icon hẹp bên phải (Tab 'script', 'assets', 'visuals')
            ├── ScriptPanel.tsx               # Kịch bản phân cảnh (Dùng cho cả Cột Trái & Panel Phải)
            ├── StoryAssetsPanel.tsx          # Panel trống Story Assets (Placeholder có header & nút close ✕)
            ├── VisualsPanel.tsx              # Panel trống Visuals (Placeholder có header & nút close ✕)
            ├── CanvasPreview/
            │   ├── CanvasPreview.tsx         # Khung Video trung tâm
            │   ├── CompactScrubber.tsx       # Thanh tua mini (Mode 1 - dùng Shadcn Slider)
            │   └── ExpandedTimeline/         # CỤM TIMELINE MỞ RỘNG (MODE 2)
            │       ├── ExpandedTimeline.tsx  # Khung bọc Timeline, Toolbar zoom/fit & cuộn ngang
            │       ├── TimelineRuler.tsx     # Thước kẻ thời gian (vạch chính/phụ, dãn nở theo zoom)
            │       ├── TimelinePlayhead.tsx  # Con trỏ kim (đầu tam giác + vạch dọc xuyên track)
            │       ├── SceneTrack.tsx        # Track 1: Các khối Scene thumbnail & thời lượng
            │       └── AudioTrack.tsx        # Track 2 & 3: Khối Voice và Background Music
            └── SceneItem.tsx                 # Card từng phân cảnh trong ScriptPanel
```

---

### 2. Danh Sách File Cần Tạo / Chỉnh Sửa & Trách Nhiệm Chi Tiết

| STT | Đường dẫn file | Loại | Trách nhiệm chính & Thành phần kỹ thuật |
|:---:|---|:---:|---|
| 1 | `src/components/ui/slider.tsx` | Tạo mới | UI Primitive Shadcn cho thanh trượt tua và thanh zoom. |
| 2 | `src/components/ui/scroll-area.tsx` | Tạo mới | UI Primitive Shadcn cho khung cuộn dọc danh sách kịch bản. |
| 3 | `src/components/ui/tooltip.tsx` | Tạo mới | UI Primitive Shadcn hiển thị gợi ý khi hover icon. |
| 4 | `src/components/MainLayout.tsx` | Sửa | Xóa header cứng chứa avatar. Giữ container flexbox toàn màn hình. |
| 5 | `src/pages/EditorPage/EditorPage.tsx` | Sửa | Quản lý state toàn cục: `isScriptPinned`, `isScriptOpen`, `activeRightTab: 'script' \| 'assets' \| 'visuals' \| null`, `timelineMode`. |
| 6 | `src/pages/EditorPage/components/EditorHeader.tsx` | Tạo mới | Nút quay lại `[←]`, Tên dự án, nút `[ ⤓ Xuất video ]`. |
| 7 | `src/pages/EditorPage/components/FarRightSidebar.tsx` | Tạo mới | Thanh dọc chứa 3 nút: `[ 📄 Script ]`, `[ 👥 Story Assets ]` và `[ 🖼 Visuals ]`. |
| 8 | `src/pages/EditorPage/components/ScriptPanel.tsx` | Tạo mới | Danh sách cảnh (ghim trái hoặc mở phải). Header có nút `[ 📌 Pin ]` khi ở Panel Phải. **Cắm bộ 3 component chia phân cảnh tại đây**. |
| 9 | **`src/pages/EditorPage/components/StoryAssetsPanel.tsx`** | **Tạo mới** | **Panel trống Story Assets:** Header có icon `👥`, tiêu đề `Story Assets`, nút đóng `✕`. Phần thân là khung trống placeholder sẵn sàng cho các UC Asset. |
| 10 | **`src/pages/EditorPage/components/VisualsPanel.tsx`** | **Tạo mới** | **Panel trống Visuals:** Header có icon `🖼`, tiêu đề `Visuals`, nút đóng `✕`. Phần thân là khung trống placeholder sẵn sàng cho UC Sinh ảnh shot. |
| 11 | `src/pages/EditorPage/components/CanvasPreview/CanvasPreview.tsx` | Tạo mới | Khung hiển thị video và khu vực đáy chứa thanh tua. |
| 12 | `src/pages/EditorPage/components/CanvasPreview/CompactScrubber.tsx` | Tạo mới | Thanh tua mini (Chế độ 1) với nút `⌃` chuyển Mode. |
| 13 | `src/pages/EditorPage/components/CanvasPreview/ExpandedTimeline/ExpandedTimeline.tsx` | Tạo mới | Khung Timeline đa tầng, thanh công cụ Zoom (`pixelsPerSec`), nút `Fit`, nút `⌄` thu gọn. Quản lý `scrollRef`. |
| 14 | `src/pages/EditorPage/components/CanvasPreview/ExpandedTimeline/TimelineRuler.tsx` | Tạo mới | **Thước kẻ thời gian:** Tính toán `tickInterval` linh hoạt, render vạch `h-3` / `h-2` kèm mốc `MM:SS`. Bắt sự kiện kéo/bấm tua. |
| 15 | `src/pages/EditorPage/components/CanvasPreview/ExpandedTimeline/TimelinePlayhead.tsx` | Tạo mới | **Con trỏ kim:** Đầu tam giác cắm xuống trên Thước kẻ + thân kim `w-px bg-blue-500` chạy dọc xuyên suốt các track. Tự động cuộn theo kim. |
| 16 | `src/pages/EditorPage/components/CanvasPreview/ExpandedTimeline/SceneTrack.tsx` | Tạo mới | Dải thẻ Scene có ảnh đại diện, số thứ tự, thời lượng phân cảnh (dãn theo `pixelsPerSec`). |
| 17 | `src/pages/EditorPage/components/CanvasPreview/ExpandedTimeline/AudioTrack.tsx` | Tạo mới | Dải track âm thanh (lồng tiếng và nhạc nền). |

---

### 3. Kế Hoạch Triển Khai Cho 2 Panel Mới (`Story Assets` & `Visuals`)

#### A. Cập nhật State trong `EditorPage.tsx`
```typescript
// Định nghĩa kiểu cho tab mở ở Panel Phải
type RightTabType = 'script' | 'assets' | 'visuals' | null;

const [activeRightTab, setActiveRightTab] = useState<RightTabType>(null);
const [isScriptPinned, setIsScriptPinned] = useState<boolean>(true); // Mặc định Script đã ghim ở Cột Trái
const [isScriptOpen, setIsScriptOpen] = useState<boolean>(true);
```

#### B. Cơ chế Toggle trên `FarRightSidebar.tsx`
* Bấm vào nút `[ 📄 Script ]`:
  * Nếu Script **đã pin sang trái**: Bấm vào nút này sẽ đóng/mở Cột Trái (`setIsScriptOpen(!isScriptOpen)`).
  * Nếu Script **chưa pin**: Bấm vào sẽ mở Script ở Panel Phải (`setActiveRightTab(activeRightTab === 'script' ? null : 'script')`).
* Bấm vào nút `[ 👥 Story Assets ]`:
  * Nếu đang mở `assets` -> Đóng lại (`setActiveRightTab(null)`).
  * Nếu chưa mở -> Chuyển sang mở tab này (`setActiveRightTab('assets')`).
* Bấm vào nút `[ 🖼 Visuals ]`:
  * Nếu đang mở `visuals` -> Đóng lại (`setActiveRightTab(null)`).
  * Nếu chưa mở -> Chuyển sang mở tab này (`setActiveRightTab('visuals')`).

#### C. Cấu trúc Panel Trống Placeholder (`StoryAssetsPanel.tsx` & `VisualsPanel.tsx`)
Cả 2 component đều có khung giao diện chuẩn mực, đồng bộ về mặt thẩm mỹ:

```tsx
// Ví dụ cấu trúc StoryAssetsPanel.tsx
interface StoryAssetsPanelProps {
  onClose: () => void;
}

export function StoryAssetsPanel({ onClose }: StoryAssetsPanelProps) {
  return (
    <div className="w-[360px] h-full bg-[#18181b] text-white flex flex-col border-l border-white/10 shrink-0">
      {/* 1. Header chuẩn có tiêu đề và nút đóng ✕ */}
      <div className="h-12 px-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2 font-medium text-sm">
          <span>👥</span>
          <span>Story Assets</span>
        </div>
        <button 
          onClick={onClose} 
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>

      {/* 2. Phần thân trống (Placeholder) */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-gray-400">
        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-2xl mb-3">
          👥
        </div>
        <h4 className="text-white text-sm font-medium mb-1">Quản lý Story Assets</h4>
        <p className="text-xs text-gray-500 max-w-[220px]">
          Khu vực phân tích nhân vật, vật phẩm, bối cảnh và sinh ảnh tham chiếu.
        </p>
      </div>
    </div>
  );
}
```

Tương tự với `VisualsPanel.tsx` sử dụng icon `🖼`, tiêu đề `Visuals` và phần thân placeholder hướng dẫn sinh ảnh minh họa cho các phân cảnh.

#### D. Render Panel Phải Trong `EditorPage.tsx`
```tsx
{/* Panel Phải động theo activeRightTab */}
{activeRightTab === 'script' && !isScriptPinned && (
  <ScriptPanel 
    isPinned={false} 
    onPin={() => { setIsScriptPinned(true); setIsScriptOpen(true); setActiveRightTab(null); }}
    onClose={() => setActiveRightTab(null)} 
  />
)}

{activeRightTab === 'assets' && (
  <StoryAssetsPanel onClose={() => setActiveRightTab(null)} />
)}

{activeRightTab === 'visuals' && (
  <VisualsPanel onClose={() => setActiveRightTab(null)} />
)}
```

---

### 4. Kết Nối Trực Tiếp Với Tài Liệu Chia Phân Cảnh

Khu vực **`ScriptPanel.tsx`** chính là khung chứa trực tiếp cho 3 component chia phân cảnh đã đặc tả trong:  
👉 [`thiet-ke-component-chia-lai-phan-canh.md`](file:///e:/Tài%20liệu/Daigaku/2026.1/GR2/Book%20to%20Video/demo-fe-prototype-S2V/demo-prototype-S2V/docs/thiet-ke-component-chia-lai-phan-canh.md):
1. **`ScriptSelectionToolbar`**: Ghim trên đầu `ScriptPanel` khi tick chọn phân cảnh.
2. **`ResplitPopover`**: Mở popover nhập prompt chia lại.
3. **`DiffPreview`**: Hiển thị so sánh trực tiếp bên trong danh sách kịch bản của `ScriptPanel`.
