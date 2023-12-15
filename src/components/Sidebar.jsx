import { ChevronFirst, ChevronLast, MoreVertical } from "lucide-react";
import blueLogo from "../images/logo-blue.png";
import { useContext, useState, createContext } from "react";

const SidebarContext = createContext();

export default function Sidebar({ children }) {
  const [isExpended, setIsExpended] = useState(true);

  return (
    <aside className={`h-screen ${isExpended ? "w-[300px]" : "w-[90px]"}`}>
      <nav className="h-full flex flex-col bg-white border-r shadow-sm">
        <div className="p-4 pb-2 flex justify-between items-center">
          {/* Blue Logo */}
          <img
            src={blueLogo}
            className={`overflow-hidden transition-all ${
              isExpended ? "w-32" : "w-0"
            }`}
            alt=""
          />
          {/* Expend Button */}
          <button
            onClick={() => setIsExpended((prev) => !prev)}
            className={`w-[35px] mr-4 p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100`}
          >
            {isExpended ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>

        {/* Wrapping the Children here! */}
        <SidebarContext.Provider value={{ isExpended }}>
          <ul className="flex-1 px-3">{children}</ul>
        </SidebarContext.Provider>

        {/* This is the bottom client info */}
        <div className="border-t flex p-3">
          <img
            src={blueLogo}
            alt="client logo"
            className="w-10 h-10 rounded-md"
          />
          <div
            className={`flex justify-between items-center overflow-hidden transition-all ${
              isExpended ? "w-52 ml-3" : "w-0"
            }`}
          >
            <div className="leading-4">
              <h4 className="font-semibold">Client Name</h4>
              <span className="text-xs text-gray-600">client@gmail.com</span>
            </div>
            <MoreVertical size={20} />
          </div>
        </div>
      </nav>
    </aside>
  );
}

// Sidebar Item will become children inside the component
export function SidebarItem({ icon, text, active, alert, onSelectPage }) {
  const { isExpended } = useContext(SidebarContext);
  function handleClickPage(page) {
    onSelectPage(page);
  }
  return (
    <li
      onClick={() => handleClickPage(text)}
      className="group relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors active:bg-gradient-to-tr active:from-indigo-200 active:to-indigo-100 active:text-indigo-800 hover:bg-indigo-50 text-gray-600"
    >
      {icon}
      <span
        className={`overflow-hidden transition-all ${
          isExpended ? "w-52 ml-3" : "w-0"
        }`}
      >
        {text}
      </span>
      {alert && (
        <div
          className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${
            isExpended ? "" : "top-2"
          }`}
        ></div>
      )}

      {/* Hover Effect */}
      {!isExpended && (
        <div
          className={`absolute whitespace-nowrap left-full rounded-md px-2 py-1 ml-6 bg-indigo-100 text-indigo-800 text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}
        >
          {text}
        </div>
      )}
    </li>
  );
}
