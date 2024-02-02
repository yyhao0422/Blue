import { useContext, useEffect, useState } from "react";
import { useSession } from "@clerk/clerk-react";
import { motion } from "framer-motion";

import ErrorMessage from "../../components/ErrorMessage.jsx";
import imageTest from "./test.gif";
import Card from "../../components/Card";
import { ClerkContext } from "../../store/clerk-user-context.jsx";
import loader from "../../images/loader.gif";

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
          message: error.message || "Failed to fetch Flash Card Information",
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
      {!isLoading && (
        <h1 className="text-center font-bold text-5xl mt-5">Autism Test</h1>
      )}

      {isLoading && (
        <div className="postion absolute left-[700px] top-[300px]">
          <img src={loader} alt="loading.gif" height="100" width="100" />
        </div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        transition={{ delay: 0.5 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="grid grid-cols-4 grid-rows-3 gap-14 p-3.5 m-3 transition-all duration-500 "
      >
        {Object.keys(autismTestData).length !== 0 &&
          autismTestData.map((test) => {
            return (
              <Card
                title={test.title}
                link={`/autismtest/${test.id}`}
                key={test.id}
                image={imageTest}
              ></Card>
            );
          })}
      </motion.div>
    </div>
  );
}
