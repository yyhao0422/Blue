import { useSession } from "@clerk/clerk-react";

export default function AiChat() {
  const { isLoaded, session, isSignedIn } = useSession();

  if (!isLoaded) {
    // handle loading state
    return <p>loading</p>;
  }

  if (!isSignedIn) {
    // handle not signed in state
    return <p>Please sign in to use this page </p>;
  }

  return <div>AI Chat</div>;
}
