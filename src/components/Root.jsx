import { Outlet } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

import { ClerkContext } from "../store/clerk-user-context";
import Sidebar, { SidebarItem } from "./Sidebar";
import {
  homeIcon,
  cardIcon,
  gameIcon,
  chatIcon,
  settingIcon,
  testIcon,
  videoIcon,
} from "./icon";

export default function RootLayout({ children }) {
  const { user, isLoaded } = useUser();

  return (
    <>
      {isLoaded && (
        <ClerkContext.Provider value={user}>
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
            {children}
          </main>
        </ClerkContext.Provider>
      )}
    </>
  );
}
