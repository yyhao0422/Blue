import { useContext, useState, createContext, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { ChevronFirst, ChevronLast, MoreVertical } from "lucide-react";
import { UserButton, useUser, SignInButton } from "@clerk/clerk-react";
import { Button } from "@mui/material";

import blueLogo from "../images/logo-blue.png";
import userLogo from "../images/user-logo.jpg";

const SidebarContext = createContext();

export default function Sidebar({ children }) {
  const [isExpended, setIsExpended] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const { isSignedIn, user, isLoaded } = useUser();

  useEffect(() => {
    const checkCursorPos = (e) => {
      const windowWidth = window.innerWidth;
      const cursorPosition = e.clientX;

      if (cursorPosition < windowWidth / 2) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    document.addEventListener("mousemove", checkCursorPos);
    return () => {
      document.removeEventListener("mousemove", checkCursorPos);
    };
  }, []);

  return (
    <aside
      onMouseEnter={() => setIsExpended(true)}
      onMouseLeave={() => setIsExpended(false)}
      className={`h-screen sticky top-0 transition-all duration-500  ${
        isExpended ? "w-[300px]" : isVisible ? "w-[100px]" : "w-[0px]"
      }`}
    >
      <nav className="h-full flex flex-col dark:bg-slate-600 bg-white border-r shadow-sm">
        <div className="p-4 pb-2 flex justify-between items-center">
          {/* Blue Logo */}
          <img
            src={blueLogo}
            className={`overflow-hidden transition-all duration-500 pb-4 ${
              isExpended ? "w-48" : "w-0"
            }`}
            alt=""
          />
          {/* Expend Button */}
          <button
            onClick={() => setIsExpended((prev) => !prev)}
            className={`w-[35px] mr-4 p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100`}
          >
            {isVisible ? isExpended ? <ChevronFirst /> : <ChevronLast /> : ""}
          </button>
        </div>

        {/* Wrapping the Children here! */}
        <SidebarContext.Provider value={{ isExpended, setIsExpended }}>
          <ul
            className={`flex flex-col mx-3 h-min mb-auto ${
              !isExpended ? "mt-[30px]" : ""
            }`}
          >
            {children}
          </ul>
        </SidebarContext.Provider>

        {/* This is the bottom client info */}
        <div
          className={`border-t flex justify-center p-3 ${!isVisible && "w-0"}`}
        >
          {isSignedIn ? (
            <div className="w-10 h-10 flex items-center justify-center">
              {isVisible && <UserButton />}
            </div>
          ) : (
            <>
              {isVisible && (
                <SignInButton>
                  <div className="rounded-xl bg-cyan-300  hover:bg-cyan-500 p-[10px] w-48 text-center cursor-pointer">
                    <Button>Sign In</Button>
                  </div>
                </SignInButton>
              )}
            </>
          )}

          {isSignedIn && (
            <div
              className={`flex justify-between items-center overflow-hidden transition-all duration-500 ${
                isExpended ? "w-52 ml-3" : "w-0"
              }`}
            >
              <div className="leading-4">
                <h4 className="font-semibold">{user.fullName}</h4>
                <span className="text-xs text-gray-600">
                  {user.primaryEmailAddress.emailAddress}
                </span>
              </div>
              <MoreVertical size={20} />
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
}

// Sidebar Item will become children inside the component
export function SidebarItem({ icon, text, active, alert, isAdmin }) {
  const { isExpended, setIsExpended } = useContext(SidebarContext);
  const linkText = text.toLowerCase().replaceAll(" ", "");

  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const checkCursorPos = (e) => {
      const windowWidth = window.innerWidth;
      const cursorPosition = e.clientX;

      if (cursorPosition < windowWidth / 2) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    document.addEventListener("mousemove", checkCursorPos);
    return () => {
      document.removeEventListener("mousemove", checkCursorPos);
    };
  }, []);

  return (
    <NavLink
      to={
        linkText === "home" || linkText === "backtouser"
          ? `${isAdmin === true ? "/admin" : ""}/`
          : linkText
      }
      className={({ isActive }) =>
        isActive && isVisible ? "activeNavLink" : undefined
      }
      end
    >
      <li className="group relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors active:bg-gradient-to-tr active:from-indigo-200 active:to-indigo-100 active:text-indigo-800 hover:bg-indigo-50 dark:text-white hover:text-indigo-800">
        {isVisible && <i className="dark:bg-white rounded-3xl">{icon}</i>}
        <span
          className={`overflow-hidden transition-all  ${
            isExpended ? "w-52 ml-3" : " w-0"
          }`}
        >
          <p className={`text-nowrap ${isExpended ? "" : "hidden"}`}> {text}</p>
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
            className={`absolute whitespace-nowrap left-full rounded-md px-2 py-1 ml-6 dark:bg-indigo-100  text-indigo-800 text-sm invisible opacity-20 -translate-x-3 transition-all  group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}
          >
            {text}
          </div>
        )}
      </li>
    </NavLink>
  );
}
