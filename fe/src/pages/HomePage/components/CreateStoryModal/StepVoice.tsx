import VoicePickerList from "./VoicePickerList";
import type { CreateStoryFormData, VoiceOption } from "./types";

interface StepVoiceProps {
  formData: CreateStoryFormData;
  onFormDataChange: React.Dispatch<React.SetStateAction<CreateStoryFormData>>;
}

export default function StepVoice({ formData, onFormDataChange }: StepVoiceProps) {
  const handleSelectVoice = (voice: VoiceOption) => {
    onFormDataChange((prev) => ({
      ...prev,
      singleVoiceId: voice.id,
    }));
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col h-full">
      <div className="mb-3 shrink-0">
        <h3 className="text-sm font-semibold text-foreground">
          Chọn giọng đọc
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Giọng đọc được chọn sẽ đọc toàn bộ cuốn sách. Nhấp vào icon play để nghe thử mẫu giọng.
        </p>
      </div>

      <div className="flex-1 min-h-0">
        <VoicePickerList
          selectedVoiceId={formData.singleVoiceId}
          onSelectVoice={handleSelectVoice}
        />
      </div>
    </div>
  );
}
