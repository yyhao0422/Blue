import { Outlet } from "react-router-dom";

import Sidebar, { SidebarItem } from "./components/Sidebar";
import {
  homeIcon,
  cardIcon,
  gameIcon,
  chatIcon,
  settingIcon,
  testIcon,
  videoIcon,
} from "./components/icon";

export default function RootLayout() {
  return (
    <main className="flex">
      <Sidebar>
        <SidebarItem icon={homeIcon} text="Home" />
        <SidebarItem icon={videoIcon} text="Video" />
        <SidebarItem icon={cardIcon} text="Flash Card" />
        <SidebarItem icon={gameIcon} text="Mini Game" />
        <SidebarItem icon={testIcon} text="Autism Test" alert />
        <SidebarItem icon={chatIcon} text="AI Chat" alert />
        <hr className="my-3" />
        <SidebarItem icon={settingIcon} text="Settings" />
      </Sidebar>
      <Outlet />
    </main>
  );
}
