import {
  SignOutButton,
  useSession,
  SignInButton,
  useSignIn,
} from "@clerk/clerk-react";
import { useContext } from "react";
import { ClerkContext } from "../../store/clerk-user-context";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
export default function Settings() {
  const { isLoaded, session, isSignedIn } = useSession();
  const ClerkCtx = useContext(ClerkContext);

  return (
    <div className="m-20">
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
      <div>Constructing ... </div>
    </div>
  );
}
