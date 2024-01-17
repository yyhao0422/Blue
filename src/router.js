import { createBrowserRouter } from "react-router-dom";

import Home from "./pages/Home/Home";
import AdminHome from "./admin/pages/Home";
import AdminFlashCard from "./admin/pages/FlashCard";
import AdminAutismTest from "./admin/pages/AutismTest";
import AdminVideo from "./admin/pages/Video";
import RootLayout from "./RootLayout";
import AiChat from "./pages/AiChat/AiChat";
import AutismTest from "./pages/AutismTest/AutismTest";
import Quiz from "./pages/AutismTest/Quiz";
import FlashCard from "./pages/FlashCard/FlashCard";
import CardContent from "./pages/FlashCard/CardContent";
import MiniGame from "./pages/Mini Game/MiniGame";
import TicTacToe from "./pages/Mini Game/TicTacToe/TicTacToe";
import Settings from "./pages/Settings/Settings";
import Video from "./pages/Video/Video";
import ErrorPage from "./pages/ErrorPage";

import AdminLayout from "./components/AdminLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "/aichat", element: <AiChat /> },
      { path: "/autismtest", element: <AutismTest /> },
      { path: "/autismtest/:testId", element: <Quiz /> },
      {
        path: "/flashcard",
        element: <FlashCard />,
      },
      { path: "/minigame", element: <MiniGame /> },
      { path: "/settings", element: <Settings /> },
      { path: "/video", element: <Video /> },
      { path: "/flashcard/:flashCardId", element: <CardContent /> },
      { path: "/minigame/tictactoe", element: <TicTacToe /> },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminHome /> },
      { path: "flashcard", element: <AdminFlashCard /> },
      { path: "autismtest", element: <AdminAutismTest /> },
      { path: "video", element: <AdminVideo /> },
    ],
  },
]);
