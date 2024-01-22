import {
  SignOutButton,
  useSession,
  SignInButton,
  useSignIn,
} from "@clerk/clerk-react";
import { useContext } from "react";
import { ClerkContext } from "../../store/clerk-user-context";
import { Link } from "react-router-dom";
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
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Login
            </button>
          </SignInButton>
        ) : (
          <SignOutButton>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Logout
            </button>
          </SignOutButton>
        )}
      </div>
      {ClerkCtx.isAdmin && (
        <div className="flex items-center  my-10">
          <p className=" mr-5">Administrator login: </p>
          <Link to="/admin">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Switch to admin page
            </button>
          </Link>
        </div>
      )}
      <div>Constructing ... </div>
    </div>
  );
}
