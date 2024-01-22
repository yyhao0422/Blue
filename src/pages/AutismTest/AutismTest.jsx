import { useContext, useEffect, useState } from "react";
import { useSession } from "@clerk/clerk-react";

import ErrorMessage from "../../components/ErrorMessage.jsx";
import imageTest from "./test.gif";
import Card from "../../components/Card";
import { ClerkContext } from "../../store/clerk-user-context.jsx";

export default function AutismTest() {
  const ClerkCtx = useContext(ClerkContext).user;
  const [isLoading, setIsLoading] = useState(false);
  const [autismTestData, setAutismTestData] = useState({});
  const [error, setError] = useState("");
  const { isSignedIn } = useSession();

  const clerkId = ClerkCtx?.id;

  useEffect(() => {
    async function fetchAutismTestData() {
      setIsLoading(true);
      const headers = {
        "Content-Type": "application/json",
        ClerkId: clerkId,
      };
      try {
        const response = await fetch(
          "https://api.alexsama.tech/api/autism-test-category",
          { headers }
        );
        const resData = await response.json();
        if (!response.ok) {
          throw new Error("Failed to fetch Flash Card Information");
        }
        setAutismTestData(resData.data);
      } catch (error) {
        setError({
          message: error.message || "Failed to fetch Flash Crad Information",
        });
      }
      setIsLoading(false);
    }
    if (isSignedIn) {
      fetchAutismTestData();
    }
  }, []);

  if (!isSignedIn) {
    // handle not signed in state
    return <p>Please sign in to use this page </p>;
  }
  if (error !== "") {
    console.log(error);
    return <ErrorMessage errorMessage={error.message} />;
  }

  console.log(autismTestData);

  return (
    <div className="flex flex-col">
      <h1 className="text-center font-bold text-5xl mt-5">Flash Card</h1>
      <div className="flex flex-wrap w-fit">
        {isLoading && <p>fetching the data</p>}
        {Object.keys(autismTestData).length !== 0 &&
          autismTestData.map((test) => {
            return (
              <Card
                title={test.title}
                link={`/autismtest/${test.id}`}
                key={test.id}
              >
                <img
                  className="max-h-48 rounded-3xl"
                  src={imageTest}
                  alt="test image"
                />
              </Card>
            );
          })}
      </div>
    </div>
  );
}
