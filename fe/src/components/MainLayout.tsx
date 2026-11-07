import { Outlet } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function MainLayout() {
  return (
    <TooltipProvider>
      <div className="h-screen w-screen overflow-hidden flex flex-col bg-background">
        <Outlet />
      </div>
    </TooltipProvider>
  );
}
