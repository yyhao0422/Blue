import { createBrowserRouter } from "react-router-dom";

import Home from "./pages/Home/Home";
import RootLayout from "./Root";
import AiChat from "./pages/AiChat/AiChat";
import AutismTest from "./pages/AutismTest/AutismTest";
import FlashCard from "./pages/FlashCard/FlashCard";
import AnimalCard from "./pages/FlashCard/flashCards/AnimalCard";
import MiniGame from "./pages/Mini Game/MiniGame";
import TicTacToe from "./pages/Mini Game/TicTacToe/TicTacToe";
import Settings from "./pages/Settings/Settings";
import Video from "./pages/Video/Video";
import ErrorPage from "./pages/ErrorPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/aichat", element: <AiChat /> },
      { path: "/autismtest", element: <AutismTest /> },
      {
        path: "/flashcard",
        element: <FlashCard />,
      },
      { path: "/minigame", element: <MiniGame /> },
      { path: "/settings", element: <Settings /> },
      { path: "/video", element: <Video /> },
      { path: "/flashcard/animal", element: <AnimalCard /> },
      { path: "/minigame/tictactoe", element: <TicTacToe /> },
    ],
  },
]);
