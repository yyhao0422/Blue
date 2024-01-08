import { createBrowserRouter } from "react-router-dom";

import Home from "./pages/Home/Home";
import RootLayout from "./Root";
import AiChat from "./pages/AiChat/AiChat";
import AutismTest from "./pages/AutismTest/AutismTest";
import FlashCard from "./pages/FlashCard/FlashCard";
import AnimalCard from "./pages/FlashCard/flashCards/AnimalCard";
import MiniGame from "./pages/Mini Game/MiniGame";
import Settings from "./pages/Settings/Settings";
import Video from "./pages/Video/Video";
import BodyPart from "./pages/FlashCard/flashCards/BodyPart";
import DailyRoutine from "./pages/FlashCard/flashCards/DailyRoutine";
import TellingTime from "./pages/FlashCard/flashCards/TellingTime";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
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
      { path: "/flashcard/bodypart", element: <BodyPart /> },
      { path: "/flashcard/dailyroutine", element: <DailyRoutine /> },
      { path: "/flashcard/time", element: <TellingTime /> },
    ],
  },
]);
