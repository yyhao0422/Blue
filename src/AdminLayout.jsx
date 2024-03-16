import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar, { SidebarItem } from "./components/Sidebar";
import { AdminClerkContext } from "./store/admin-clerk-user-context";

import { useUser } from "@clerk/clerk-react";
import {
  homeIcon,
  cardIcon,
  testIcon,
  videoIcon,
  backIcon,
  dashboardIcon,
} from "./components/icon";
import ErrorMessage from "./components/ErrorMessage";

export default function AdminLayout({ children }) {
  const { isSignedIn, user, isLoaded } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState();
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchIsAdmin() {
      setIsLoading(true);

      if (!isSignedIn) {
        return <p>Please Sign In your admin account.</p>;
      }
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
            message: error.message || "Failed to fetch Auth Information",
          });
        }
      }
      setIsLoading(false);
    }
    fetchIsAdmin();
  }, [user]);

  return (
    <>
      {isLoading && <p>Authenticating your credential...</p>}
      {error !== "" && <ErrorMessage errorMessage={error.message} />}
      {isAdmin && isLoaded && (
        <AdminClerkContext.Provider value={{ user: user, isAdmin: isAdmin }}>
          <main className="flex">
            <Sidebar>
              <SidebarItem icon={videoIcon} text="Video" isAdmin={true} />
              <SidebarItem icon={cardIcon} text="Flash Card" isAdmin={true} />
              <SidebarItem icon={testIcon} text="Autism Test" isAdmin={true} />
              <br />
              <hr />

              <SidebarItem
                icon={dashboardIcon}
                text="Dashboard"
                isAdmin={true}
              />
              <SidebarItem
                icon={backIcon}
                text="Back To User"
                isAdmin={false}
              />
            </Sidebar>
            <Outlet />
            {children}
          </main>
        </AdminClerkContext.Provider>
      )}
      {!isAdmin && !isLoading && (
        <ErrorMessage errorMessage="You dont have admin permission. Access deny!" />
      )}
    </>
  );
}
