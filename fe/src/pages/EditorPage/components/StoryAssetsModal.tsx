import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import StoryAssetsPanel from "./StoryAssetsPanel";

interface StoryAssetsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedAssetId?: string | null;
  onSelectAssetId?: (id: string | null) => void;
}

export default function StoryAssetsModal({
  open,
  onOpenChange,
  selectedAssetId,
  onSelectAssetId,
}: StoryAssetsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        showOverlay={false}
        className="sm:max-w-xl w-[94vw] h-[80vh] flex flex-col p-0 gap-0 overflow-hidden shadow-2xl rounded-2xl border-border bg-white dark:bg-neutral-900"
      >
        <DialogTitle className="sr-only">Tài sản truyện</DialogTitle>
        <div className="flex-1 min-h-0 flex [&>div]:flex-1 [&>div]:w-full [&>div]:border-l-0">
          <StoryAssetsPanel
            width={undefined}
            onClose={() => onOpenChange(false)}
            selectedAssetId={selectedAssetId}
            onSelectAssetId={onSelectAssetId}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
