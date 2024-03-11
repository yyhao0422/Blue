import {
  SignOutButton,
  useSession,
  SignInButton,
  useSignIn,
} from "@clerk/clerk-react";
import { useContext } from "react";
import { ClerkContext } from "../../store/clerk-user-context";
import { Link } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { Button } from "@mui/material";
import Switch from "@mui/material/Switch";
export default function Settings() {
  const { isLoaded, session, isSignedIn } = useSession();
  const ClerkCtx = useContext(ClerkContext);

  function handleThemeChange() {
    const html = document.querySelector("html");
    if (html) {
      html.classList.toggle("dark");
    }
    localStorage.setItem(
      "theme",
      html?.classList.contains("dark") ? "dark" : "light"
    );
  }

  return (
    <div className="p-20 bg-white">
      <h1 className="">Personal Information</h1>
      <hr />
      <div className="flex items-center  my-10">
        <p className=" mr-5">Account:</p>
        {!isSignedIn ? (
          <SignInButton>
            <Button>Login</Button>
          </SignInButton>
        ) : (
          <SignOutButton>
            <Button variant="contained">Logout</Button>
          </SignOutButton>
        )}
      </div>
      {ClerkCtx.isAdmin && (
        <div className="flex items-center  my-10">
          <p className=" mr-5">Administrator login: </p>
          <Link to="/admin">
            <Button variant="contained">Switch to admin page</Button>
          </Link>
        </div>
      )}
      <br></br>
      <h1 className="">Layout Option</h1>
      <hr />

      <div className="flex items-center  my-10">
        <p className=" mr-5">Switch Light theme</p>
        <MaterialUISwitch sx={{ m: 1 }} onChange={handleThemeChange} />
      </div>
    </div>
  );
}

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  "& .MuiSwitch-switchBase": {
    margin: 1,
    padding: 0,
    transform: "translateX(6px)",
    "&.Mui-checked": {
      color: "#fff",
      transform: "translateX(22px)",
      "& .MuiSwitch-thumb:before": {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          "#fff"
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: theme.palette.mode === "dark" ? "#003892" : "#001e3c",
    width: 32,
    height: 32,
    "&::before": {
      content: "''",
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      top: 0,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        "#fff"
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
  },
  "& .MuiSwitch-track": {
    opacity: 1,
    backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
    borderRadius: 20 / 2,
  },
}));
