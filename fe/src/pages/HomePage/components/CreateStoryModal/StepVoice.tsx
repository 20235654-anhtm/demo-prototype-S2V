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
          Chọn giọng đọc cho người dẫn truyện
        </h3>
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
