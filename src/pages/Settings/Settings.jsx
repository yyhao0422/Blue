import { SignOutButton } from "@clerk/clerk-react";
export default function Settings() {
  return (
    <div>
      <SignOutButton>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Logout
        </button>
      </SignOutButton>
    </div>
  );
}
