import { useParams } from "react-router-dom";

export default function EditorPage() {
  const { projectId } = useParams<{ projectId: string }>();

  return (
    <div className="h-full flex flex-col">
      <div className="border-b px-6 py-3 flex items-center justify-between bg-white">
        <div className="flex items-center gap-3">
          <h2 className="font-semibold text-sm">Studio</h2>
          <span className="text-xs text-muted-foreground">
            Project: {projectId}
          </span>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center bg-stone-100">
        <p className="text-muted-foreground text-sm">
          Khu vực Studio biên tập kịch bản
        </p>
      </div>
    </div>
  );
}
