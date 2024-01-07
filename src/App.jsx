import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
} from "@clerk/clerk-react";

import Home from "./pages/Home/Home";
import RootLayout from "./Root";
import AiChat from "./pages/AiChat/AiChat";
import AutismTest from "./pages/AutismTest/AutismTest";
import FlashCard from "./pages/FlashCard/FlashCard";
import MiniGame from "./pages/Mini Game/MiniGame";
import Settings from "./pages/Settings/Settings";
import Video from "./pages/Video/Video";
// Clerk Auth Key

if (!process.env.REACT_APP_CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/aichat", element: <AiChat /> },
      { path: "/autismtest", element: <AutismTest /> },
      { path: "/flashcard", element: <FlashCard /> },
      { path: "/minigame", element: <MiniGame /> },
      { path: "/settings", element: <Settings /> },
      { path: "/video", element: <Video /> },
    ],
  },
]);

function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <SignedIn>
        <RouterProvider router={router} />
      </SignedIn>

      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </ClerkProvider>
  );
}

export default App;
