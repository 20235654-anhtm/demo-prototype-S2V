# Cơ Chế Đổi Nhân Vật/Giọng Đọc & Tái Tạo Audio Riêng Đoạn Trong TTS Studio

> **Mục tiêu chuyên sâu:** Trả lời chính xác câu hỏi của người dùng:
> *"Khi đổi nhân vật cho một câu thoại, hệ thống sẽ tạo lại audio kiểu gì? Tạo lại riêng đoạn đó như thế nào? Dữ liệu gửi đi đâu và nhận về ra sao?"*

---

## 1. Nguyên Lý Thiết Kế Cốt Lõi: Đánh Dấu Hỏng Cục Bộ (Granular Dirty State) & Trì Hoãn Sinh TTS (Lazy Generation)

Khi người dùng đang biên soạn một cuốn sách nói hoặc kịch bản âm thanh có hàng chục hay hàng trăm câu thoại:
* Nếu người dùng đổi nhân vật/giọng đọc cho **Khối 3**, chỉ có duy nhất **Khối 3** cần phải tạo lại âm thanh. Các khối khác (Khối 1, Khối 2, Khối 4, Khối 5...) **TUYỆT ĐỐI KHÔNG BỊ TẠO LẠI** và giữ nguyên file âm thanh cũ.
* Hơn thế nữa, khi người dùng vừa nhấp chọn giọng mới trong modal, hệ thống **CHƯA GỌI API NGAY LẬP TỨC**. Hệ thống chỉ gán cờ `audioUrl = undefined` (đánh dấu khối bị "dirty" / hết hạn âm thanh).
* Việc gọi API sinh âm thanh mới chỉ thực sự diễn ra khi người dùng **bấm nút Play `[ ▶ ]` trên chính Khối 3** để nghe thử, hoặc khi bấm **Play toàn bộ kịch bản**.

---

## 2. Toàn Bộ Chu Trình Xử Lý Khi Người Dùng Đổi Nhân Vật Cho 1 Khối Thoại

```
+------------------------------------------------------------------------------------------------------------------+
| PHA 1: THAO TÁC ĐỔI GIỌNG TRÊN GIAO DIỆN                                                                         |
+------------------------------------------------------------------------------------------------------------------+
                                                        │
                                                        ▼
                        1. Người dùng bấm vào tên giọng / avatar trên Khối X (Ví dụ: Khối 3)
                                                        │
                                                        ▼
                                          handleVoiceClick(textBlockId = 3)
                                                        │
                                                        ▼
                                    ┌───────────────────────────────────────┐
                                    │ setCurrentEditingBlockId(3)           │
                                    │ setShowVoiceModal(true)               │
                                    └───────────────────────────────────────┘
                                                        │
                                                        ▼
                                    2. Hộp thoại VoiceSelectionModal hiển thị
                                       - Người dùng duyệt danh sách giọng đọc
                                       - Bấm nút Play nghe thử file demo âm thanh (demo audio URL)
                                       - Bấm chọn giọng mới: "Triệu Dương (Nam - Miền Bắc)"
                                                        │
                                                        ▼
                                        onSelectVoice(voice = Triệu Dương)
                                                        │
                                                        ▼
                                          handleSelectVoice(newVoice)
                                                        │
                                                        ▼
        ┌───────────────────────────────────────────────────────────────────────────────────────────────┐
        │ 3. XỬ LÝ STATE TRONG REACT (ProjectDetailPage.tsx):                                           │
        │                                                                                               │
        │ pushHistory(); // Ghi nhận snapshot kịch bản vào Stack để người dùng có thể Ctrl+Z hoàn tác   │
        │                                                                                               │
        │ setBlocks(prev => prev.map(block =>                                                           │
        │     block.id === 3                                                                            │
        │       ? { ...block, voice: newVoice, audioUrl: undefined } // <-- HỦY AUDIO CŨ CỦA RIÊNG KHỐI │
        │       : block                                              // Giữ nguyên 100% các khối khác   │
        │ ));                                                                                           │
        │                                                                                               │
        │ setCurrentEditingBlockId(null);                                                               │
        │ setShowVoiceModal(false);                                                                     │
        └───────────────────────────────────────────────────────────────────────────────────────────────┘
                                                        │
                                                        ▼
        ┌───────────────────────────────────────────────────────────────────────────────────────────────┐
        │ 4. TỰ ĐỘNG LƯU DỰ ÁN NGẦM (useAutoSave Hook):                                                 │
        │                                                                                               │
        │ Sau bộ trễ Debounce 2 giây (không có thao tác mới):                                           │
        │ Gửi: PUT /api/projects/dfda6f6e-789b-46df-b6dc-4bd8534dba89                                   │
        │ Payload: JSON chứa danh sách blocks mới (Khối 3 mang voiceId mới, audioUrl: null)             │
        └───────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Quá Trình Tạo Lại Audio RIÊNG Cho Khối Đó (Single-Block Regeneration Flow)

Sau khi Khối 3 đã có giọng mới nhưng `audioUrl` đang là `undefined`, người dùng bấm vào **Nút Play `[ ▶ ]` nằm ngay trên thanh tiêu đề của Khối 3**:

```
+------------------------------------------------------------------------------------------------------------------+
| PHA 2: KÍCH HOẠT PHÁT THỬ & TẠO LẠI AUDIO CHO RIÊNG KHỐI 3                                                       |
+------------------------------------------------------------------------------------------------------------------+
                                                        │
                                                        ▼
                                         Người dùng bấm nút [ ▶ ] trên Khối 3
                                                        │
                                                        ▼
                                            handlePlayBlock(blockId = 3)
                                                        │
                                                        ▼
                                              gainNodes.resumeContext()
                                         (Kích hoạt AudioContext trình duyệt)
                                                        │
                                                        ▼
                                            const audioUrl = await ensureTTS(block)
                                                        │
                                                        ▼
                                   ┌────────────────────────────────────────────┐
                                   │ KIỂM TRA ĐIỀU KIỆN TRONG ensureTTS():      │
                                   │ - block.audioUrl có chưa? --> CHƯA CÓ      │
                                   │ - block.content có rỗng không? --> CÓ CHỮ  │
                                   └────────────────────────────────────────────┘
                                                        │
                                                        ▼
        ┌───────────────────────────────────────────────────────────────────────────────────────────────┐
        │ 1. BẬT HIỆU ỨNG CHỜ (LOADING STATE) TẠI ĐÚNG KHỐI 3:                                          │
        │    setTtsLoadingBlockIds(prev => new Set(prev).add(3))                                        │
        │    ==> Nút Play trên Khối 3 lập tức biến thành icon xoay tròn:                                │
        │        <Loader2 className="w-5 h-5 animate-spin" />                                           │
        │    ==> Các nút Play ở Khối 1, 2, 4 vẫn giữ nguyên hình tam giác bình thường.                  │
        └───────────────────────────────────────────────────────────────────────────────────────────────┘
                                                        │
                                                        ▼
        ┌───────────────────────────────────────────────────────────────────────────────────────────────┐
        │ 2. THU THẬP THAM SỐ GỌI API:                                                                  │
        │    - text    = block.content ("Chào mừng quý thính giả...")                                   │
        │    - voiceId = block.voice.id ("hn_male_manhdung_full_24k-st")                                │
        │    - speed   = block.speed ("1.0")                                                            │
        │                                                                                               │
        │    Gọi: generateTTS(block.content, voiceId, speed)                                            │
        │    Gửi HTTP: GET /api/tts?text=...&voice=hn_male_manhdung...&speed=1.0                       │
        └───────────────────────────────────────────────────────────────────────────────────────────────┘
                                                        │
                                                        ▼
+------------------------------------------------------------------------------------------------------------------+
| PHA 3: MÁY CHỦ FASTAPI XỬ LÝ TẠO ÂM THANH (server/routes/tts.py)                                                 |
+------------------------------------------------------------------------------------------------------------------+
                                                        │
                                                        ▼
                        3. Tính mã băm định danh nội dung (Content Hash SHA-256):
                           cache_key = sha256(text + voice + speed)
                           filename  = "{cache_key}.mp3"
                           filepath  = "data/uploads/audios/{filename}"
                                                        │
                                       ┌────────────────┴───────────────┐
                                       │                                │
                                       ▼ (Nếu file ĐÃ CÓ trên đĩa)      ▼ (Nếu file CHƯA CÓ)
                                  [CACHE HIT]                      [CACHE MISS]
                           Trả về ngay trong 2ms:                       │
                           { "url": "/api/uploads/audios/..." }         ▼
                                                               4. GỌI VBEE CLOUD TTS API:
                                                                  POST https://dev.vbee.vn/api/v1/tts
                                                                  Payload: { text, voice_code, rate }
                                                                        │
                                                                        ▼
                                                                  RACE PATTERN (Song song):
                                                                  - Luồng A: Chờ Webhook /api/tts/callback
                                                                  - Luồng B: Polling GET /api/v1/tts/{id} mỗi 1s
                                                                        │
                                                                        ▼
                                                               5. Nhận kết quả thành công:
                                                                  Tải MP3 từ AWS S3 presigned URL
                                                                  Lưu tệp vào data/uploads/audios/{cache_key}.mp3
                                                                        │
                                                                        ▼
                                                                  Trả về response:
                                                                  { "url": "/api/uploads/audios/a8f12c.mp3" }
                                                        │
                                                        ▼
+------------------------------------------------------------------------------------------------------------------+
| PHA 4: FRONTEND TIẾP NHẬN FILE ÂM THANH & PHÁT THỬ NGAY LẬP TỨC                                                  |
+------------------------------------------------------------------------------------------------------------------+
                                                        │
                                                        ▼
        ┌───────────────────────────────────────────────────────────────────────────────────────────────┐
        │ 6. ĐO ĐỘ DÀI ÂM THANH CHÍNH XÁC (Audio Duration Measurement):                                 │
        │    duration = await getAudioDuration(audioUrl);                                               │
        │    (Tạo một đối tượng new Audio(audioUrl) chạy ngầm để lấy thuộc tính duration chính xác)     │
        └───────────────────────────────────────────────────────────────────────────────────────────────┘
                                                        │
                                                        ▼
        ┌───────────────────────────────────────────────────────────────────────────────────────────────┐
        │ 7. CẬP NHẬT TRẠNG THÁI CLIENT:                                                                │
        │    - setBlocks(prev => prev.map(s => s.id === 3 ? { ...s, audioUrl } : s));                   │
        │    - setBlockDurations(prev => ({ ...prev, [3]: duration }));                                 │
        │    - measureGain(audioUrl).then(g => gainNodes.setVoiceGain(3, g)); // Chuẩn hóa âm lượng LUFS│
        │    - setTtsLoadingBlockIds(prev => prev.delete(3)); // TẮT ICON SPINNER XOAY TRÒN             │
        └───────────────────────────────────────────────────────────────────────────────────────────────┘
                                                        │
                                                        ▼
        ┌───────────────────────────────────────────────────────────────────────────────────────────────┐
        │ 8. PHÁT ÂM THANH RIÊNG CỦA KHỐI 3:                                                            │
        │    setBlockPlayerState({ isPlaying: true, currentBlockId: 3, currentTime: 0 });               │
        │                                                                                               │
        │    const blockAudio = blockAudioRef.current;                                                  │
        │    blockAudio.src = audioUrl;                                                                 │
        │    blockAudio.play();                                                                         │
        │                                                                                               │
        │    ==> Nút Play trên Khối 3 chuyển thành icon [ ⏸ ] (Tạm dừng).                               │
        │    ==> Khi đọc hết câu (sự kiện onended): Tự động dừng lại, icon đổi lại thành [ ▶ ].         │
        │    ==> TUYỆT ĐỐI KHÔNG TỰ ĐỘNG PHÁT SANG KHỐI 4!                                              │
        └───────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Bóc Tách Mã Nguồn Code Xử Lý Thực Tế Trong Codebase

### 4.1. Hàm Xử Lý Đổi Giọng: Hủy Bỏ Audio Riêng Đoạn
*(Trích từ `src/app/pages/ProjectDetailPage.tsx` dòng 1086-1109)*

```typescript
const handleSelectVoice = (voice: Voice | TTSVoice) => {
  if ('id' in voice) setSelectedVoice(voice as TTSVoice);
  pushHistory(); // Lưu vào ngăn xếp Undo (Ctrl+Z)

  if (currentEditingBlockId !== null) {
    // Người dùng bấm đổi giọng từ chính Khối X
    setBlocks((prev: any[]) =>
      prev.map((block) =>
        block.id === currentEditingBlockId
          ? { 
              ...block, 
              voice: voice, 
              audioUrl: undefined // <-- CỐ TÌNH ĐẶT UNDEFINED ĐỂ ĐÁNH DẤU CẦN TẠO LẠI
            }
          : block
      )
    );
    setCurrentEditingBlockId(null);
  } else {
    // Đổi giọng hàng loạt cho các khối có tick chọn
    setBlocks((prev: any[]) =>
      prev.map((block) => {
        if (selectedBlocks.includes(block.id)) {
          return { ...block, voice: voice, audioUrl: undefined };
        }
        return block;
      })
    );
  }
  setShowVoiceModal(false);
};
```

### 4.2. Hàm Đảm Bảo Âm Thanh Có Sẵn (`ensureTTS`): Tạo Lại Âm Thanh Cục Bộ
*(Trích từ `src/app/pages/ProjectDetailPage.tsx` dòng 578-598)*

```typescript
const ensureTTS = async (block: any): Promise<string | null> => {
  // Nếu khối này đã có audioUrl (chưa bị đổi giọng) -> dùng luôn không tạo lại
  if (block.audioUrl) return block.audioUrl;
  if (!block.content?.trim()) return null;

  // Lấy mã giọng của riêng khối đó
  const voiceId = block.voice?.id || selectedVoice.id;
  const speed = block.speed?.replace('x', '') || '1.0';

  // Bật spinner xoay tại nút Play của khối này
  setTtsLoadingBlockIds(prev => new Set(prev).add(block.id));

  try {
    // Gọi API Backend sinh âm thanh mới
    const audioUrl = await generateTTS(block.content, voiceId, speed);
    
    // Đo thời lượng thực tế
    const duration = await getAudioDuration(audioUrl);
    
    // Gán audioUrl mới vào đúng khối này
    setBlocks(prev => prev.map(s => s.id === block.id ? { ...s, audioUrl } : s));
    if (duration > 0) setBlockDurations(prev => ({ ...prev, [block.id]: duration }));
    
    // Đo âm lượng chuẩn hóa (EBU R128) để điều chỉnh GainNode
    measureGain(audioUrl).then(g => gainNodes.setVoiceGain(block.id, g));
    
    return audioUrl;
  } catch {
    return null;
  } finally {
    // Tắt spinner xoay
    setTtsLoadingBlockIds(prev => { 
      const next = new Set(prev); 
      next.delete(block.id); 
      return next; 
    });
  }
};
```

### 4.3. Hàm Phát Âm Thanh Riêng Khối (`handlePlayBlock`)
*(Trích từ `src/app/pages/ProjectDetailPage.tsx` dòng 672-743)*

```typescript
const handlePlayBlock = async (textBlockId: number) => {
  gainNodes.resumeContext();
  const block = blocks.find((s: any) => s.id === textBlockId);
  if (!block) return;

  // Nếu khối này đang phát -> Bấm lại thì Tạm dừng (Toggle Pause)
  if (blockPlayerState.isPlaying && blockPlayerState.currentBlockId === textBlockId) {
    stopBlockPlayer();
    return;
  }

  // Dừng thanh phát toàn bộ dưới đáy (nếu đang chạy) để tránh phát đè lên nhau
  stopMediaPlayer();

  // Gọi ensureTTS để sinh âm thanh nếu khối này vừa bị đổi giọng
  const audioUrl = await ensureTTS(block);
  if (!audioUrl) return;

  // Cập nhật trạng thái phát của riêng khối này
  setBlockPlayerState({ 
    isPlaying: true, 
    currentBlockId: textBlockId, 
    currentTime: 0 
  });

  // Nạp âm thanh vào thẻ Audio ngầm và phát
  const blockAudio = blockAudioRef.current;
  if (blockAudio) {
    blockAudio.src = audioUrl;
    blockAudio.currentTime = 0;
    blockAudio.volume = volumesRef.current.voiceover / 100;
    gainNodes.applyVoiceGain(blockAudio, textBlockId);
    blockAudio.play().catch(() => {});
  }
};
```

---

## 5. Khác Biệt Khi Người Dùng Bấm Nút Phát Toàn Bộ Kịch Bản (Master Play vs Single Block)

Nếu sau khi đổi giọng cho Khối 3, người dùng **KHÔNG** bấm nút Play trên Khối 3, mà lại bấm **Nút Play màu vàng to ở thanh player dưới đáy màn hình** (`handlePlayMediaPlayer`):

1. Hệ thống sẽ phát hiện Khối 3 đang thiếu âm thanh (`!block.audioUrl`).
2. Thay vì gọi đơn lẻ, hệ thống gọi hàm **`generateAllTTS`**:
   ```typescript
   const blocksNeedTTS = blocksRef.current.filter((s: any) => !s.audioUrl && s.content?.trim());
   if (blocksNeedTTS.length > 0) {
     setIsTtsGenerating(true);
     await generateTTSParallel(blocksNeedTTS, selectedVoice.id, 5, (blockId, audioUrl, duration) => {
       // Cập nhật từng khối khi vừa sinh xong
     });
     setIsTtsGenerating(false);
   }
   ```
3. Sau khi tất cả các khối thiếu âm thanh được tạo xong, bộ máy phát sẽ bắt đầu phát lần lượt từ Khối 1, khi hết Khối 1 sẽ tự động chuyển sang Khối 2, rồi sang Khối 3 (mang giọng mới) và tiếp tục cho đến hết.
