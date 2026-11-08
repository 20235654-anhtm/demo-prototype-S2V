import type { VoiceOption, CharacterItem } from "./types";
import { mockArtStyles } from "@/mocks/mockArtStyles";

export const MOCK_ART_STYLES = mockArtStyles;

export const MOCK_VOICES: VoiceOption[] = [
  {
    id: "v-trieu-duong",
    name: "Triệu Dương",
    subtitle: "Trầm ấm, truyền cảm",
    description: "Giọng nam miền Nam, tự nhiên, thích hợp dẫn truyện & tin tức.",
    avatarUrl: "https://api.dicebear.com/9.x/micah/svg?seed=trieuduong",
    accent: "Nam",
    gender: "Nam",
  },
  {
    id: "v-cam-hong",
    name: "Cẩm Hồng",
    subtitle: "Miền Nam bản địa",
    description: "Giọng nữ miền Nam, nhẹ nhàng, truyền cảm, thích hợp tản văn và truyện ngắn.",
    avatarUrl: "https://api.dicebear.com/9.x/micah/svg?seed=camhong",
    accent: "Nam",
    gender: "Nữ",
  },
  {
    id: "v-duy-khoa",
    name: "Duy Khoa",
    subtitle: "Hà Nội chuẩn",
    description: "Giọng nam truyền cảm chuẩn miền Bắc, phong thái thời sự & phóng sự.",
    avatarUrl: "https://api.dicebear.com/9.x/micah/svg?seed=duykhoa",
    accent: "Bắc",
    gender: "Nam",
  },
  {
    id: "v-ha-chi",
    name: "Hà Chi",
    subtitle: "Dịu dàng, truyền cảm",
    description: "Giọng nữ Bắc truyền cảm, êm dịu, đọc tiểu thuyết và văn học lãng mạn.",
    avatarUrl: "https://api.dicebear.com/9.x/micah/svg?seed=hachi",
    accent: "Bắc",
    gender: "Nữ",
  },
  {
    id: "v-hoang-nam",
    name: "Hoàng Nam",
    subtitle: "Nam tính, đĩnh đạc",
    description: "Giọng nam trung niên đĩnh đạc, trầm ổn, phù hợp nhân vật nam chính.",
    avatarUrl: "https://api.dicebear.com/9.x/micah/svg?seed=hoangnam",
    accent: "Bắc",
    gender: "Nam",
  },
  {
    id: "v-minh-triet",
    name: "Minh Triết",
    subtitle: "Miền Trung sâu lắng",
    description: "Giọng nam miền Trung đượm chất thơ, phù hợp hồi ký và thơ ca.",
    avatarUrl: "https://api.dicebear.com/9.x/micah/svg?seed=minhtriet",
    accent: "Trung",
    gender: "Nam",
  },
  {
    id: "v-my-anh",
    name: "Myanh (Giọng clone cá nhân)",
    subtitle: "Tài khoản cá nhân",
    description: "Giọng mẫu tự nhân bản từ bản thu âm giọng đọc của bạn.",
    avatarUrl: "https://api.dicebear.com/9.x/personas/svg?seed=myanh",
    accent: "Bắc",
    gender: "Nữ",
    isCustom: true,
  },
];

export const MOCK_INITIAL_CHARACTERS: CharacterItem[] = [
  {
    id: "char-narrator",
    name: "Người kể chuyện",
    description: "Phóng viên tường thuật khách quan diễn biến phiên tòa pháp lý.",
    previewLine: "Căn cứ kết quả giám định ADN và lời khai của các bên, tòa công nhận Jack là cha của bé Sol và được quyền thăm nom con theo quy định pháp luật.",
    voiceId: "v-trieu-duong",
    voiceName: "Triệu Dương",
    avatarUrl: "https://api.dicebear.com/9.x/bottts/svg?seed=narrator",
    isNarrator: true,
  },
  {
    id: "char-jack",
    name: "Jack",
    description: "Nam ca sĩ trẻ trong vụ kiện quyền làm cha, tâm trạng mong mỏi nhận lại con.",
    previewLine: "Tôi chỉ muốn được tòa ghi nhận quyền làm cha, không muốn tách bé khỏi mẹ, chỉ mong được cùng gánh vác nuôi dạy con.",
    voiceId: "v-hoang-nam",
    voiceName: "Hoàng Nam",
    avatarUrl: "https://api.dicebear.com/9.x/personas/svg?seed=jack",
  },
  {
    id: "char-thien-an",
    name: "Thiên An",
    description: "Người mẹ đơn thân nuôi con, thể hiện sự ấm ức nhưng đồng thuận vì tương lai của con gái.",
    previewLine: "Tôi cảm thấy ấm ức vì ba năm đầu sinh và chăm con vất vả mà không có sự đồng hành, nhưng tôi đồng ý phán quyết của tòa.",
    voiceId: "v-ha-chi",
    voiceName: "Hà Chi",
    avatarUrl: "https://api.dicebear.com/9.x/personas/svg?seed=thienan",
  },
  {
    id: "char-unnamed",
    name: "Nhân vật chưa đặt tên",
    description: "Người qua đường hoặc nhân vật phụ xuất hiện thoáng qua trong bối cảnh.",
    previewLine: "Tiếng người dân xôn xao bàn tán trước cổng phiên tòa sau khi phán quyết chính thức được tuyên bố.",
    voiceId: undefined,
    voiceName: undefined,
    avatarUrl: "https://api.dicebear.com/9.x/personas/svg?seed=unnamed",
  },
];

export const MOCK_BOOK_SAMPLE_TEXT = `Căn cứ kết quả giám định ADN và lời khai của các bên tại phiên xét xử sơ thẩm, Tòa án nhân dân đã chính thức công nhận quan hệ cha con giữa Jack và bé Sol.

Trước tòa, Jack chia sẻ trong sự xúc động: "Tôi chỉ muốn được tòa ghi nhận quyền làm cha, không muốn tách bé khỏi mẹ. Tôi cam kết sẽ hoàn thành đầy đủ nghĩa vụ cấp dưỡng định kỳ và dành thời gian thăm nom con theo thỏa thuận."

Phía Thiên An sau thời gian tranh luận đã bày tỏ: "Tôi cảm thấy ấm ức vì ba năm đầu sinh và chăm con vất vả mà không có sự đồng hành. Tuy nhiên vì tương lai và sự phát triển tốt nhất của bé Sol, tôi đồng ý tạo điều kiện để hai cha con gặp gỡ."

Tiếng người dân xôn xao bàn tán trước cổng phiên tòa sau khi phán quyết chính thức được tuyên bố. Sự việc khép lại trong sự đồng thuận và nhân văn giữa đôi bên.`;

// Demo Audio Player
class DemoAudioSynthesizer {
  private ctx: AudioContext | null = null;
  private currentTimeout: any = null;

  public playTone(pitch: number = 440, onEnd?: () => void) {
    try {
      if (this.currentTimeout) {
        clearTimeout(this.currentTimeout);
      }
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        this.ctx = new AudioCtx();
      }
      if (this.ctx.state === "suspended") {
        this.ctx.resume();
      }

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(pitch, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(pitch * 1.15, this.ctx.currentTime + 0.3);
      osc.frequency.exponentialRampToValueAtTime(pitch * 0.95, this.ctx.currentTime + 0.8);

      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.12, this.ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 1.2);

      this.currentTimeout = setTimeout(() => {
        if (onEnd) onEnd();
      }, 1200);
    } catch {
      if (onEnd) setTimeout(onEnd, 1000);
    }
  }
}

export const demoAudio = new DemoAudioSynthesizer();
