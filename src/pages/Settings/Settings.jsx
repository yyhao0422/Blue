import { SignOutButton, useSession, SignInButton } from "@clerk/clerk-react";
export default function Settings() {
  const { isLoaded, session, isSignedIn } = useSession();
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
      <div className="flex items-center  my-10">
        <p className=" mr-5">Administrator login: </p>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Switch to admin
        </button>
      </div>
      <div>Constructing ... </div>
    </div>
  );
}
