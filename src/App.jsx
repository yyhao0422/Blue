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

function Home() {
  return <>Home</>;
}

function App() {
  return (
    <main>
      <Sidebar>
        <SidebarItem icon={homeIcon} text="Home" onCLick={Home} />
        <SidebarItem icon={videoIcon} text="Video" />
        <SidebarItem icon={cardIcon} text="Flash Card" />
        <SidebarItem icon={gameIcon} text="Mini Games" />
        <SidebarItem icon={testIcon} text="Autism Test" alert />
        <SidebarItem icon={chatIcon} text="AI Chat" alert />
        <hr className="my-3" />
        <SidebarItem icon={settingIcon} text="Settings" />
      </Sidebar>
    </main>
  );
}

export default App;
