# Cơ Chế Đổi Nhân Vật & Tạo Lại Audio Riêng Cho Câu Thoại

> **Trọng tâm giải đáp câu hỏi của người dùng:**  
> *"Khi đổi nhân vật cho một câu thoại, hệ thống sẽ tạo lại audio kiểu gì? Tạo lại riêng đoạn đó như thế nào? Dữ liệu gửi đi đâu và phát như thế nào?"*

---

## 1. Nguyên Lý Thiết Kế: Trì Hoãn Tạo Âm Thanh (Lazy Generation & Dirty State)

Trong Studio TTS chuyên nghiệp, việc chuyển văn bản thành giọng nói (Text-to-Speech) tốn chi phí API và mất từ 1 - 3 giây xử lý. Nếu người dùng vừa chọn giọng mới trong modal mà hệ thống tự động sinh audio ngay lập tức, sẽ dẫn đến:
* Lãng phí tài nguyên nếu người dùng liên tục đổi giọng để thử nghiệm.
* Tạo ra các yêu cầu mạng thừa thãi và xung đột tiến trình (Race Condition).

Vì vậy, Vbee AIVoice áp dụng nguyên lý **"Dirty Block" (Đánh dấu khối hết hạn âm thanh)**:
1. **Khi đổi nhân vật:** Chỉ cập nhật tên và mã giọng đọc mới vào khối, đồng thời **xóa bỏ tệp âm thanh cũ (`audioUrl: undefined`)**.
2. **Khi nào mới tạo lại audio?** Hệ thống chỉ thực sự gửi request tạo audio khi người dùng **bấm nút Play `[ ▶ ]` trên chính khối đó** để nghe thử, hoặc khi bấm **Play toàn bộ kịch bản**.

---

## 2. Toàn Bộ Quy Trình Khi Đổi Nhân Vật & Tạo Lại Audio Riêng Đoạn

```
+---------------------------------------------------------------------------------------------------------------+
| GIAI ĐOẠN 1: THAO TÁC ĐỔI NHÂN VẬT TRÊN GIAO DIỆN                                                             |
+---------------------------------------------------------------------------------------------------------------+
                                                       │
                                                       ▼
                       1. Người dùng bấm vào Tên giọng đọc / Avatar trên Khối X (Ví dụ: Khối 2)
                                                       │
                                                       ▼
                                         onVoiceClick(blockId = 2)
                                                       │
                                                       ▼
                                   ┌────────────────────────────────────────┐
                                   │ setCurrentEditingBlockId(2)            │
                                   │ setShowVoiceModal(true)                │
                                   └────────────────────────────────────────┘
                                                       │
                                                       ▼
                       2. Hộp thoại VoiceSelectionModal mở lên
                          - Người dùng bấm nút Play nhỏ nghe thử giọng mẫu
                          - Người dùng bấm chọn giọng mới: "Triệu Dương (Nam)"
                                                       │
                                                       ▼
                                         handleSelectVoice(voice)
                                                       │
                                                       ▼
       ┌────────────────────────────────────────────────────────────────────────────────────────────────┐
       │ 3. CẬP NHẬT STATE TRONG CODE (ProjectDetailPage.tsx):                                          │
       │                                                                                                │
       │ pushHistory(); // Ghi nhận lịch sử hoàn tác (Ctrl+Z)                                           │
       │                                                                                                │
       │ setBlocks(prev => prev.map(block =>                                                            │
       │   block.id === 2                                                                               │
       │     ? { ...block, voice: newVoice, audioUrl: undefined } // <-- CỐ TÌNH ĐẶT audioUrl = undefined│
       │     : block                                                                                    │
       │ ));                                                                                            │
       │                                                                                                │
       │ setCurrentEditingBlockId(null);                                                                │
       │ setShowVoiceModal(false);                                                                      │
       └────────────────────────────────────────────────────────────────────────────────────────────────┘
                                                       │
                                                       ▼
       ┌────────────────────────────────────────────────────────────────────────────────────────────────┐
       │ 4. TỰ ĐỘNG LƯU NGẦM LÊN SERVER (useAutoSave Hook):                                             │
       │    Sau 2 giây không có thao tác mới, hệ thống tự động gửi:                                     │
       │    PUT /api/projects/dfda6f6e...                                                               │
       │    Payload: JSON cập nhật thông tin voice mới của Khối 2.                                      │
       └────────────────────────────────────────────────────────────────────────────────────────────────┘

+---------------------------------------------------------------------------------------------------------------+
| GIAI ĐOẠN 2: TẠO LẠI AUDIO RIÊNG CHO ĐOẠN ĐÓ KHI NGƯỜI DÙNG BẤM NGHE THỬ                                      |
+---------------------------------------------------------------------------------------------------------------+
                                                       │
                                                       ▼
                       5. Người dùng bấm nút Play [ ▶ ] nhỏ trên chính Khối 2
                                                       │
                                                       ▼
                                         handlePlayBlock(blockId = 2)
                                                       │
                                                       ▼
                                         const audioUrl = await ensureTTS(block)
                                                       │
                                                       ▼
                                  Kiểm tra: block.audioUrl có sẵn chưa?
                                                       │
                                      ┌────────────────┴───────────────┐
                                      │ Có sẵn                         │ Chưa có (Đang undefined)
                                      ▼                                ▼
                               [Phát luôn file cũ]           [BẮT ĐẦU TẠO LẠI RIÊNG ĐOẠN NÀY]
                                                                       │
                                                                       ▼
       ┌────────────────────────────────────────────────────────────────────────────────────────────────┐
       │ 6. HIỂN THỊ TRẠNG THÁI LOADING TẠI ĐÚNG KHỐI 2:                                                │
       │    setTtsLoadingBlockIds.add(2)                                                                │
       │    ==> Nút Play [ ▶ ] trên Khối 2 biến thành icon xoay tròn:                                   │
       │        <Loader2 className="w-5 h-5 animate-spin" />                                            │
       │    ==> Các khối khác (Khối 1, 3, 4...) vẫn giữ nguyên hình tam giác bình thường.               │
       └────────────────────────────────────────────────────────────────────────────────────────────────┘
                                                       │
                                                       ▼
       ┌────────────────────────────────────────────────────────────────────────────────────────────────┐
       │ 7. GỬI DỮ LIỆU ĐI ĐÂU? (API CALL):                                                             │
       │    Gọi hàm: generateTTS(block.content, voiceId, speed)                                         │
       │    Gửi request HTTP:                                                                           │
       │    GET /api/tts?text=Thám tử bước vào...&voice=hn_male_manhdung...&speed=1.0                   │
       └────────────────────────────────────────────────────────────────────────────────────────────────┘
                                                       │
                                                       ▼
       ┌────────────────────────────────────────────────────────────────────────────────────────────────┐
       │ 8. MÁY CHỦ XỬ LÝ (server/routes/tts.py):                                                       │
       │    - Tính mã băm nội dung: cache_key = sha256(text + voice + speed)                            │
       │    - Kiểm tra file: data/uploads/audios/{cache_key}.mp3                                        │
       │      + Nếu có sẵn (Cache Hit): Trả về ngay trong 2ms { "url": "/api/uploads/audios/xxx.mp3" }  │
       │      + Nếu chưa có (Cache Miss): Gửi yêu cầu sang Vbee Cloud TTS API (https://dev.vbee.vn),   │
       │        tải file MP3 từ AWS S3 về lưu vào đĩa cứng server rồi trả về URL.                       │
       └────────────────────────────────────────────────────────────────────────────────────────────────┘
                                                       │
                                                       ▼
       ┌────────────────────────────────────────────────────────────────────────────────────────────────┐
       │ 9. FRONTEND NHẬN URL AUDIO & CẬP NHẬT TRẠNG THÁI:                                              │
       │    - Đo độ dài âm thanh chính xác: duration = await getAudioDuration(audioUrl)                 │
       │    - Cập nhật State: gán audioUrl mới vào Khối 2, cập nhật blockDurations[2] = duration        │
       │    - Tắt icon xoay tròn: setTtsLoadingBlockIds.delete(2)                                       │
       │    - Đổi icon nút Play thành icon Tạm dừng [ ⏸ ]                                              │
       └────────────────────────────────────────────────────────────────────────────────────────────────┘
                                                       │
                                                       ▼
       ┌────────────────────────────────────────────────────────────────────────────────────────────────┐
       │ 10. PHÁT ÂM THANH RIÊNG ĐOẠN ĐÓ:                                                               │
       │    - Gán blockAudioRef.src = audioUrl                                                          │
       │    - blockAudioRef.play()                                                                      │
       │    - Loa phát câu thoại với giọng "Triệu Dương" vừa đổi.                                       │
       │    - Khi đọc hết câu thoại (sự kiện onended): Tự động dừng lại, nút chuyển về lại icon [ ▶ ].   │
       │    - TUYỆT ĐỐI KHÔNG TỰ ĐỘNG ĐỌC SANG CÂU THOẠI TIẾP THEO (KHỐI 3)!                           │
       └────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Mã Nguồn Trực Tiếp Xử Lý Luồng Này Trong Codebase

### 3.1. Lúc Đổi Giọng (Chỉ đổi State, xóa audio cũ):
*(Trích từ `src/app/pages/ProjectDetailPage.tsx`)*
```typescript
const handleSelectVoice = (voice: Voice | TTSVoice) => {
  if ('id' in voice) setSelectedVoice(voice as TTSVoice);
  pushHistory(); // Cho phép bấm Ctrl+Z quay lại giọng cũ

  if (currentEditingBlockId !== null) {
    // Đổi giọng cho RIÊNG khối đang chọn
    setBlocks((prev: any[]) =>
      prev.map((block) =>
        block.id === currentEditingBlockId
          ? { 
              ...block, 
              voice: voice, 
              audioUrl: undefined // <-- CỐ TÌNH ĐẶT RỖNG ĐỂ ĐÁNH DẤU CẦN TẠO LẠI
            }
          : block
      )
    );
    setCurrentEditingBlockId(null);
  }
  setShowVoiceModal(false);
};
```

### 3.2. Lúc Bấm Play Nghe Thử Đoạn Đó (Tạo lại audio riêng đoạn):
*(Trích từ `src/app/pages/ProjectDetailPage.tsx`)*
```typescript
const handlePlayBlock = async (textBlockId: number) => {
  gainNodes.resumeContext();
  const block = blocks.find((s: any) => s.id === textBlockId);
  if (!block) return;

  // Dừng thanh phát toàn bộ ở đáy (nếu đang chạy) để tránh tiếng đè lên nhau
  stopMediaPlayer();

  // Gọi hàm ensureTTS để kiểm tra và sinh âm thanh mới nếu khối này bị rỗng audio
  const audioUrl = await ensureTTS(block);
  if (!audioUrl) return;

  // Phát duy nhất âm thanh của khối này
  setBlockPlayerState({ isPlaying: true, currentBlockId: textBlockId, currentTime: 0 });
  const blockAudio = blockAudioRef.current;
  if (blockAudio) {
    blockAudio.src = audioUrl;
    blockAudio.currentTime = 0;
    blockAudio.volume = volumesRef.current.voiceover / 100;
    blockAudio.play().catch(() => {});
  }
};
```

### 3.3. Hàm `ensureTTS` (Kích hoạt Spinner & Gửi API):
```typescript
const ensureTTS = async (block: any): Promise<string | null> => {
  if (block.audioUrl) return block.audioUrl; // Nếu đã có âm thanh thì dùng luôn
  if (!block.content?.trim()) return null;

  const voiceId = block.voice?.id || selectedVoice.id;
  const speed = block.speed?.replace('x', '') || '1.0';

  // 1. Bật icon xoay tròn tại đúng nút Play của khối này
  setTtsLoadingBlockIds(prev => new Set(prev).add(block.id));

  try {
    // 2. Gửi request sinh âm thanh mới
    const audioUrl = await generateTTS(block.content, voiceId, speed);
    const duration = await getAudioDuration(audioUrl);

    // 3. Gán file audio mới vào khối này
    setBlocks(prev => prev.map(s => s.id === block.id ? { ...s, audioUrl } : s));
    if (duration > 0) setBlockDurations(prev => ({ ...prev, [block.id]: duration }));

    return audioUrl;
  } catch {
    return null;
  } finally {
    // 4. Tắt icon xoay tròn
    setTtsLoadingBlockIds(prev => {
      const next = new Set(prev);
      next.delete(block.id);
      return next;
    });
  }
};
```

---

## 4. So Sánh: Tạo Lại Riêng Đoạn Đó vs Tạo Lại Hàng Loạt

| Tiêu chí | Tạo lại RIÊNG ĐOẠN ĐÓ (Single Block) | Tạo lại HÀNG LOẠT (Batch) |
| :--- | :--- | :--- |
| **Nút bấm kích hoạt** | Người dùng bấm nút Play `[ ▶ ]` nhỏ trên chính khối thoại đó. | Người dùng bấm **Nút Play tròn màu vàng to** ở thanh Player cố định dưới đáy màn hình. |
| **Phạm vi xử lý** | Duy nhất 1 khối thoại đó. | Quét toàn bộ kịch bản, gom tất cả các khối đang thiếu audio (`!block.audioUrl`). |
| **Cơ chế gọi API** | Gọi 1 request đơn lẻ `generateTTS`. | Gọi hàng đợi song song `generateTTSParallel` với tối đa **5 luồng đồng thời** (concurrency = 5). |
| **Phản hồi giao diện** | Icon spinner xoay tròn xuất hiện duy nhất trên nút Play của khối đó. | Thanh player ở đáy hiển thị thanh tiến độ chuẩn bị âm thanh. |
| **Hành vi phát âm thanh** | **Chỉ phát đúng 1 câu thoại của khối đó rồi dừng lại.** | **Tự động phát liên tục từ Khối 1 đến khối cuối cùng của toàn bộ kịch bản.** |
