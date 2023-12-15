import { useState } from "react";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
  RedirectToSignIn,
} from "@clerk/clerk-react";

import Sidebar, { SidebarItem } from "./components/Sidebar";
import Home from "./pages/Home/Home";
import Video from "./pages/Video/Video";
import FlashCard from "./pages/FlashCard/FlashCard";
import MiniGame from "./pages/Mini Game/MiniGame";
import AutismTest from "./pages/AutismTest/AutismTest";
import AiChat from "./pages/AiChat/AiChat";
import Settings from "./pages/Settings/Settings";

import {
  homeIcon,
  cardIcon,
  gameIcon,
  chatIcon,
  settingIcon,
  testIcon,
  videoIcon,
} from "./components/icon";

// Clerk Auth Key

if (!process.env.REACT_APP_CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

function App() {
  const [activepage, setActivePage] = useState("Home");

  function handleSelectPage(page) {
    setActivePage(page);
  }

  let currentPage;

  switch (activepage) {
    case "Home":
      currentPage = <Home />;
      break;
    case "Video":
      currentPage = <Video />;
      break;
    case "Settings":
      currentPage = <Settings />;
      break;
    case "Flash Card":
      currentPage = <FlashCard />;
      break;
    case "Mini Games":
      currentPage = <MiniGame />;
      break;
    case "Autism Test":
      currentPage = <AutismTest />;
      break;
    case "AI Chat":
      currentPage = <AiChat />;
      break;
    default:
      currentPage = <Home />;
      break;
  }

  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <SignedIn>
        <main className="flex">
          <Sidebar>
            <SidebarItem
              icon={homeIcon}
              text="Home"
              onCLick={Home}
              onSelectPage={handleSelectPage}
            />
            <SidebarItem
              icon={videoIcon}
              text="Video"
              onSelectPage={handleSelectPage}
            />
            <SidebarItem
              icon={cardIcon}
              text="Flash Card"
              onSelectPage={handleSelectPage}
            />
            <SidebarItem
              icon={gameIcon}
              text="Mini Games"
              onSelectPage={handleSelectPage}
            />
            <SidebarItem
              icon={testIcon}
              text="Autism Test"
              onSelectPage={handleSelectPage}
              alert
            />
            <SidebarItem
              icon={chatIcon}
              text="AI Chat"
              onSelectPage={handleSelectPage}
              alert
            />
            <hr className="my-3" />
            <SidebarItem
              icon={settingIcon}
              text="Settings"
              onSelectPage={handleSelectPage}
            />
          </Sidebar>
          {/* Render different Page Based On Click   */}
          {currentPage}
        </main>
      </SignedIn>

      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </ClerkProvider>
  );
}

export default App;
