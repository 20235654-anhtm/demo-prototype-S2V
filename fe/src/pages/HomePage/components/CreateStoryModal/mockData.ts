import type { VoiceOption, CharacterItem } from "./types";
import { mockArtStyles } from "@/mocks/mockArtStyles";
import { PLACEHOLDER_IMAGE } from "@/lib/placeholderImage";
import { CHAPTER_2_TEXT } from "@/mocks/mockChapter2";

export const MOCK_ART_STYLES = mockArtStyles;

export const MOCK_VOICES: VoiceOption[] = [
  {
    id: "v-trieu-duong",
    name: "Triệu Dương",
    subtitle: "Trầm ấm, truyền cảm",
    description: "Giọng nam miền Nam, tự nhiên, thích hợp dẫn truyện & tin tức.",
    avatarUrl: PLACEHOLDER_IMAGE,
    accent: "Nam",
    gender: "Nam",
  },
  {
    id: "v-cam-hong",
    name: "Cẩm Hồng",
    subtitle: "Miền Nam bản địa",
    description: "Giọng nữ miền Nam, nhẹ nhàng, truyền cảm, thích hợp tản văn và truyện ngắn.",
    avatarUrl: PLACEHOLDER_IMAGE,
    accent: "Nam",
    gender: "Nữ",
  },
  {
    id: "v-duy-khoa",
    name: "Duy Khoa",
    subtitle: "Hà Nội chuẩn",
    description: "Giọng nam truyền cảm chuẩn miền Bắc, phong thái thời sự & phóng sự.",
    avatarUrl: PLACEHOLDER_IMAGE,
    accent: "Bắc",
    gender: "Nam",
  },
  {
    id: "v-ha-chi",
    name: "Hà Chi",
    subtitle: "Dịu dàng, truyền cảm",
    description: "Giọng nữ Bắc truyền cảm, êm dịu, đọc tiểu thuyết và văn học lãng mạn.",
    avatarUrl: PLACEHOLDER_IMAGE,
    accent: "Bắc",
    gender: "Nữ",
  },
  {
    id: "v-hoang-nam",
    name: "Hoàng Nam",
    subtitle: "Nam tính, đĩnh đạc",
    description: "Giọng nam trung niên đĩnh đạc, trầm ổn, phù hợp nhân vật nam chính.",
    avatarUrl: PLACEHOLDER_IMAGE,
    accent: "Bắc",
    gender: "Nam",
  },
  {
    id: "v-minh-triet",
    name: "Minh Triết",
    subtitle: "Miền Trung sâu lắng",
    description: "Giọng nam miền Trung đượm chất thơ, phù hợp hồi ký và thơ ca.",
    avatarUrl: PLACEHOLDER_IMAGE,
    accent: "Trung",
    gender: "Nam",
  },
  {
    id: "v-my-anh",
    name: "My Anh (Giọng clone cá nhân)",
    subtitle: "Tài khoản cá nhân",
    description: "Giọng mẫu tự nhân bản từ bản thu âm giọng đọc của bạn.",
    avatarUrl: PLACEHOLDER_IMAGE,
    accent: "Bắc",
    gender: "Nữ",
    isCustom: true,
  },
];

export const MOCK_INITIAL_CHARACTERS: CharacterItem[] = [
  {
    id: "char-narrator",
    name: "Người kể chuyện",
    description: "Dẫn truyện huyền huyễn, giọng trầm ấm, giàu nhịp điệu và cảm xúc.",
    previewLine: "Trên quảng trường, trắc nghiệm ma thạch hiện lên năm chữ chói mắt: “Đấu chi lực, tam đoạn”.",
    voiceId: "v-trieu-duong",
    voiceName: "Triệu Dương",
    avatarUrl: PLACEHOLDER_IMAGE,
    isNarrator: true,
  },
  {
    id: "char-tieu-vien",
    name: "Tiêu Viêm",
    description: "Thiếu niên từng là thiên tài trăm năm của Ô Thản Thành, một đêm mất đi đấu khí, nay chịu bao châm chọc.",
    previewLine: "Ta bây giờ còn có tư cách để ngươi gọi như vậy sao?",
    voiceId: "v-hoang-nam",
    voiceName: "Hoàng Nam",
    avatarUrl: PLACEHOLDER_IMAGE,
  },
  {
    id: "char-tieu-mi",
    name: "Tiêu Mị",
    description: "Thiếu nữ mười bốn tuổi, dung mạo thanh thuần pha chút vũ mị, được xem là hạt giống của gia tộc.",
    previewLine: "Đấu khí: Thất đoạn! Cấp bậc: Cao cấp!",
    voiceId: "v-cam-hong",
    voiceName: "Cẩm Hồng",
    avatarUrl: PLACEHOLDER_IMAGE,
  },
  {
    id: "char-tieu-huan-nhi",
    name: "Tiêu Huân Nhi",
    description: "Tử y thiếu nữ khí chất thoát tục, gia tộc tuổi trẻ đệ nhất nhân, vẫn giữ lòng tôn kính với Tiêu Viêm.",
    previewLine: "Tiêu Viêm ca ca, Huân Nhi tin tưởng người sẽ lại đứng dậy, lấy lại vinh quang và tôn nghiêm của người…",
    voiceId: "v-ha-chi",
    voiceName: "Hà Chi",
    avatarUrl: PLACEHOLDER_IMAGE,
  },
];

const MOCK_CHAPTER_1_TEXT = `“Đấu chi lực, tam đoạn”

Nhìn trắc nghiệm ma thạch có chút chói mắt năm chữ, thiếu niên mặt không chút thay đổi, thần sắc tự giễu, nắm chặt tay, bởi vì dùng lực quá mạnh làm móng tay đâm thật sâu vào trong lòng bàn tay, mang đến một trận đau đớn

“Tiêu Viêm, đấu lực, tam đoạn! Cấp bậc: Cấp thấp!”.

Bên cạnh trắc nghiệm ma thạch, một vị trung niên nam tử, thoáng nhìn tin tức trên bia, ngữ khí hờ hững công bố…

Trung niên nam tử vừa nói xong, không có gì ngoài ý muốn tại đám người trên quảng trường nhấc lên trận trận châm chọc tao động

“Tam đoạn? Hắc hắc, quả nhiên không ngoài ta dự đoán, “Thiên tài” này một năm vẫn dậm chân tại chỗ!”

“Ai, phế vật này thật sự đem gia tộc mặt mũi đều mất hết.”

“Nếu tộc trưởng không phải hắn phụ thân. Loại phế vật này sớm đã bị đuổi khỏi gia tộc, tự sinh tự diệt, đâu có cơ hội ở gia tộc ăn không uống không.”

“Ai, thiên tài thiếu niên năm đó của văn ô thản thành, tại sao hôm nay lại lạc phách thành bộ dáng đó?”

“Ai biết được? Có lẽ làm việc gì đó trái với lương tâm, làm thần linh nổi giận đi…”

Chung quanh truyền đến cười nhạo cùng tiếc hận thanh âm, dừng ở thiếu niên trong tai, như một cái mũi nhọn hung hăng đâm vào tim làm thiếu niên hô hấp có chút dồn dập

Thiếu niên chậm rãi ngẩng đầu, lộ ra thanh tú non nớt khuôn mặt, đen nhánh con ngươi mộc nhiên đảo qua chung quanh đang trào phúng đồng linh nhân, thiếu niên khóe miệng tự giễu càng thêm khổ sở

“Những người này, đều thừa hơi như vậy sao? Có lẽ vì ba năm trước bọn họ từng trước mặt mình lộ ra khiêm tốn nhất một mặt, cho nên bây giờ muốn đòi trở về…” Khổ sở cười, Tiêu Viêm chán nản xoay người, im lặng đi tới cuối đội ngũ, cô đơn thân ảnh cùng thế giới xung quanh có chút không hòa nhập

“Người tiếp theo, Tiêu Mị”

Nghe trắc nghiệm nhân gọi, một thiếu nữ rất nhanh chạy ra khỏi đám người, tiếng nghị luận ở xung quanh nhỏ đi rất nhiều, một đôi nóng cháy ánh mắt tập trung tại trên mặt thiếu nữ…

Thiếu nữ tuổi không quá mười bốn, tuy không tính là tuyệt sắc, bất quá khuôn mặt non nớt lại có nhàn nhạt vũ mị, thanh thuần cùng vũ mị, mâu thuẫn tập hợp, làm nàng thành công trở thành toàn trường tiêu điểm…

Thiếu nữ nhanh chóng đi lên, tay quen thuộc vuốt ve ma thạch bia, sau đó chậm rãi nhắm mắt…

Tại lúc thiếu nữ nhắm mắt, ma thạch bi đen nhánh lại hiện lên quang mang…

“Đấu chi khí: Thất đoạn!”

“Tiêu Mị, Đấu khí: Thất đoạn! Cấp bậc: Cao cấp”

“Da!” Nghe trắc ngiệm viên sở đọc lên thành tích, thiếu nữ ngẩng mặt lên đắc ý cười…

“Sách sách, thất đoạn đấu khí, theo tiến độ như vậy, chỉ sợ không quá ba năm thời gian, nàng có thể trở thành một chính thức đấu giả…”

“Không hổ là hạt giống của gia tộc a…”

Nghe đám người truyền đến trận trận hâm mộ thanh âm, thiếu nữ tươi cười lại nhiều thêm vài phần, hư vinh tâm, là thứ rất nhiều cô gái đều không thể kháng cự…

Cùng ngày thường mấy tỷ muội đàm tiếu, Tiêu Mị tầm mắt bỗng nhiên xuyên qua đám người, dừng trên một đạo cô đơn thân ảnh…

Nhíu mày suy nghĩ một chút, Tiêu Mị bỏ qua ý niệm trong đầu, hiện tai hai người đã không cùng một giai tầng, lấy Tiêu Viêm vài năm biểu hiện, sau khi trưởng thành, nhiều nhất cũng chỉ có thể làm gia tộc hạ tầng nhân viên, mà thiên phú vĩ đại như nàng, sẽ trở thành gia tộc trọng điểm bồi dưỡng, có thể nói tiền đồ vô lượng

“Ai…” Khẽ thở dài một tiếng, trong đầu Tiêu Mị bỗng hiện ra ba năm trước một cái ý khí phong phát thiếu niên, bốn tuổi luyện khí, mười tuổi có cửu đoạn đấu khí, mười một tuổi đột phá thập đoạn đấu khí, ngưng tụ thành công đấu khí toàn, trở thành đấu giả trẻ nhất trong trăm năm của gia tộc!

Thiếu niên trước kia, tự tin hơn nữa có tiềm lực không thể hạn lượng, không biết đã làm bao cô gái động xuân tâm, đương nhiên cũng có cả Tiêu Mị.

Nhưng con đường của thiên tài, từ trước đến giờ luôn luôn khó khăn, ba năm trước, khi danh vọng của thiên tài thiếu niên đạt tới cao nhất, cũng đột ngột thừa nhận đả kích tàn khốc nhất, không chỉ có vừa vất vả khổ tu ngưng tụ đấu khí toàn, một đêm biến mất, hơn nữa đấu khí theo thời gian trôi qua, trở nên quỷ dị càng ngày càng ít.

Đấu khí biến mất kết quả, đó là làm thực lực không ngừng giảm đi.

Từ thiên tài, một đêm trở thành ngay cả người bình thường cũng không bằng, loại đả kích này, làm thiếu niên từ đó thất hồn lạc phách, cái tên thiên tài, cũng dần dần bị khinh thường cùng châm chọc thay thế.

Trèo càng cao, ngã càng đau, lần ngã này có lẽ sẽ không có cơ hội đứng dậy

“Người tiếp theo, Tiêu Huân Nhi!”

Trong đám người huyên náo, thanh âm của trắc nghiệm nhân lại vang lên.

Theo có chút thanh nhã danh tự vang lên, đám người bỗng trở nên im lặng, ánh mắt đều dịch chuyển.

Tại chỗ ánh mắt tụ hội, một tử y thiếu nữ đang đạm nhã đứng, khuôn mặt non nớt bình tĩnh, không vì mọi người chú ý mà thay đổi chút nào.

Thiếu nữ lãnh đạm khí chất giống như hoa sen mới nở, tuổi nho nhỏ, đã có thoát tục khí chất, khó có thể tưởng tượng sau này lớn lên, thiếu nữ sẽ khuynh quốc khuynh thành như thế nào…

Tử y thiếu nữ này, nói về mỹ mạo cùng khí chất, so với Tiêu Mị phía trước càng hơn vài phần, khó trách mọi người đều có động tác như vậy.

Khẽ bước, thiếu nữ tên Tiêu Huân Nhi đi tới phía trước ma thạch bia, tay đem hắc kim tử tụ bỏ ra, lộ ra trắng nõn da thịt, sau đó đặt nhẹ tay lên thạch bia…

Có chút trầm tĩnh, trên thạch bia hiện ra chói mắt quang mang.

“Đấu chi khí: Cửu đoạn! Cấp bậc: Cao cấp!”

Nhìn mấy chữ trên thạch bia, giữa sân lâm vào một trận yên tĩnh.

“…Đã đến cửu đoạn, thật là khủng bố! Gia tộc tuổi trẻ đệ nhất nhân, chỉ sợ không ai ngoài Huân Nhi tiểu thư.” Yên tĩnh qua đi, các thiếu niên xung quanh đều không tự chủ được nuốt một ngụm nước miếng, ánh mắt tràn ngập kính sợ…

Đấu khí, con đường bắt buộc phải đi qua của mỗi đấu giả, sơ giai đấu khí chia từ một đến mười đoạn, đấu khí trong thể đạt tới mười đoạn, có thể ngưng tụ đấu khí toàn, trở thành một người đấu giả được người khác tôn trọng

Trong đám người, Tiêu Mị nhíu mày nhìn tử y cô gái đứng trước thạch bia, trên mặt hiện lên một mạt ghen tị…

Nhìn trên thạch bia tin tức, bên cạnh trung niên trắc nghiệm viên khuôn mặt hờ hững cũng hiếm hoi lộ ra một tia mỉm cười, đối với cô gái thoáng cung thanh nói: “Huân Nhi tiểu thư, nửa năm sau, ngươi có thể ngưng tụ đấu khí toàn, nếu thành công, lấy mười bốn tuổi trở thành một chân chính đấu giả, ngươi sẽ là người thứ hai của Tiêu gia trong trăm năm nay!”

Đúng vậy, người thứ hai, người thứ nhất chính là mất đi thiên tài quang hoàn Tiêu Viêm.

“Cám ơn.” Thiếu nữ có chút khẽ gật đầu, bình thản khuôn mặt không vì hắn khích lệ mà vui sướng, im lặng xoay người, tại mọi người nóng cháy ánh mắt, chậm rãi đi đến cuối đám người tới trước mặt đồi phế thiếu niên…

“Tiêu Viêm ca ca.” Tại lúc đến bên cạnh thiếu niên, thiếu nữ dừng chân, đối với Tiêu Viêm cung kính cúi người, trên xinh đẹp khuôn mặt, cư nhiên lộ ra thanh nhã nụ cười làm chung quanh cô gái ghen tị

“Ta bây giờ còn có tư cách để ngươi gọi như vậy sao?” Nhìn trước mặt đã trở thành khỏa minh châu sáng nhất trong gia tộc, Tiêu Viêm khổ sáp nói, sau khi chính mình lạc phách nàng ở trong số cực ít những người đối với hắn bảo trì tôn kính.

“Tiêu Viêm ca ca, trước kia ngươi đã từng nói cùng Huân Nhi, nếu có thể buông, mới có thể cầm, thu phóng tự nhiên mới là người tự tại!” Tiêu Huân Nhi mỉm cười ôn nhu nói, thoáng non nớt tiếng nói, cũng làm lòng người thư giãn

“A, a, người tự tại? Ta cũng chỉ biết nói mà thôi, ngươi xem bộ dáng hiện tại của ta, giống một người tự tại sao? Hơn nữa… thế giới này, cũng không thuộc về ta.” Tiêu Viêm tự giễu cười, hưng ý lan san nói.

Đối với Tiêu Viêm đồi phế, Tiêu Huân Nhi khẽ cau mày, thật lòng nói: “Tiêu Viêm ca ca, tuy ta cũng không biết ngươi vì sao lại bị như vậy, bất quá, Huân Nhi tin tưởng, người sẽ lại đứng dậy, lấy lại vinh quang và tôn nghiêm của ngươi…” Kết thúc câu nói, thiếu nữ trắng nõn khuôn mặt lần đầu hiện ra nhàn nhạt ửng đỏ: “Tiêu viêm ca ca năm đó, đích xác rất hấp dẫn…”

Đứng tại chỗ nhìn thiếu niên cô độc bóng lưng, Tiêu Huân Nhi suy nghĩ một hồi, tại phía sau vang lên một hồi ghen tị sói tru vang lên, bước nhanh theo, cùng thiếu niên sóng vai đi…

“A a…” Đối với thiếu nữ thẳng thắn lời nói, thiếu niên xấu hổ cười một tiếng, nhưng lại không nói gì, nhân không phong lưu uổng thiếu niên, nhưng hắn hiện nay thực sự không có tư cách cùng tâm tình này, lạc mịch xoay người, chậm rãi đi ra khỏi quảng trường…`;

export const MOCK_BOOK_SAMPLE_TEXT = `Chương 1

${MOCK_CHAPTER_1_TEXT}

Chương 2

${CHAPTER_2_TEXT}`;

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
