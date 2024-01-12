import { Outlet } from "react-router-dom";

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

export default function AdminLayout({ children }) {
  return (
    <main className="flex">
      <Sidebar>
        <SidebarItem icon={homeIcon} text="Home" isAdmin={true} />
        <SidebarItem icon={videoIcon} text="Video" isAdmin={true} />
        <SidebarItem icon={cardIcon} text="Flash Card" isAdmin={true} />
        <SidebarItem icon={testIcon} text="Autism Test" isAdmin={true} alert />
      </Sidebar>
      <Outlet />
      {children}
    </main>
  );
}
