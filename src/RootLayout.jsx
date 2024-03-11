import { Outlet } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

import { ClerkContext } from "./store/clerk-user-context";
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
import { useEffect, useState } from "react";
import ErrorMessage from "./components/ErrorMessage";

export default function RootLayout({ children }) {
  const { user, isLoaded, isSignedIn } = useUser();
  const [isAdmin, setIsAdmin] = useState();
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchIsAdmin() {
      if (isLoaded) {
        const headers = {
          "Content-Type": "application/json",
          ClerkId: user?.id,
        };

        try {
          const response = await fetch(
            "https://api.alexsama.tech/api/users/is-admin",
            { headers }
          );
          const resData = await response.json();

          if (!response.ok) {
            throw new Error("Failed to fetch Flash Card Information");
          }
          setIsAdmin(resData.data);
        } catch (error) {
          setError({
            message: error.message || "Failed to fetch Flash Crad Information",
          });
        }
      }
    }
    if (isSignedIn) {
      fetchIsAdmin();
    }
  }, [isLoaded, isSignedIn]);

  return (
    <>
      {isLoaded && (
        <ClerkContext.Provider
          value={{
            user: user,
            isAdmin: isAdmin,
          }}
        >
          <main className="flex">
            <Sidebar>
              <SidebarItem icon={homeIcon} text="Home" />
              <SidebarItem icon={videoIcon} text="Video" />
              <SidebarItem icon={cardIcon} text="Flash Card" />
              <SidebarItem icon={cardIcon} text="Rewards" />
              <SidebarItem icon={gameIcon} text="Mini Game" />
              <SidebarItem icon={testIcon} text="Autism Test" />
              <SidebarItem icon={chatIcon} text="AI Chat" />
              <hr className="my-3" />
              <SidebarItem icon={settingIcon} text="Settings" />
            </Sidebar>

            <div className="flex justify-center items-center bg-indigo-300 dark:bg-slate-800 w-full">
              <Outlet />
            </div>
            {children}
          </main>
        </ClerkContext.Provider>
      )}
    </>
  );
}
