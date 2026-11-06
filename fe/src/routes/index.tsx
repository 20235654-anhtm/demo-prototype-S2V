import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import HomePage from "@/pages/HomePage/HomePage";
import EditorPage from "@/pages/EditorPage/EditorPage";

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/project", element: <Navigate to="/" replace /> },
      { path: "/editor/:projectId", element: <EditorPage /> },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);
