import { useState } from "react";

import Sidebar, { SidebarItem } from "./components/Sidebar";
import Home from "./components/Home";
import Video from "./components/Video";
import FlashCard from "./components/FlashCard";
import MiniGame from "./components/MiniGame";
import AutismTest from "./components/AutismTest";
import AiChat from "./components/AiChat";
import Settings from "./components/Settings";

import {
  homeIcon,
  cardIcon,
  gameIcon,
  chatIcon,
  settingIcon,
  testIcon,
  videoIcon,
} from "./components/icon";

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
  );
}

export default App;
