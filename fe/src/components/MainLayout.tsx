import { Link, Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-30 border-b px-6 py-3 flex items-center justify-between bg-white">
        <Link to="/" className="text-lg font-bold">
          Story2Video
        </Link>
        <div className="flex items-center gap-2 text-sm">
          <span>Myanh</span>
          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold">
            M
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
