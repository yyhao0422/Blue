import { useEffect, useState, useContext, Fragment } from "react";
import { useSession } from "@clerk/clerk-react";
import Card from "../../components/Card";
import ErrorMessage from "../../components/ErrorMessage";
import { ClerkContext } from "../../store/clerk-user-context";
import loader from "../../images/loader.gif";
import { motion } from "framer-motion";

export default function FlashCard() {
  const [flashCardInfo, setFlashCardInfo] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { isLoaded, isSignedIn } = useSession();
  const clerkCtx = useContext(ClerkContext).user;
  const clerkId = clerkCtx?.id;

  useEffect(() => {
    async function fetchFlashCard() {
      setIsLoading(true);
      const headers = {
        "Content-Type": "application/json",
        ClerkId: clerkId,
      };

      try {
        const response = await fetch(
          "https://api.alexsama.tech/api/flash-card-category",
          { headers }
        );
        const resData = await response.json();
        if (!response.ok) {
          throw new Error("Failed to fetch Flash Card Information");
        }
        setFlashCardInfo(resData.data);
      } catch (error) {
        setError({
          message: error.message || "Failed to fetch Flash Crad Information",
        });
      }
      setIsLoading(false);
    }

    if (isSignedIn) fetchFlashCard();
  }, []);

  if (error !== "") {
    console.log(error);
    return <ErrorMessage errorMessage={error.message} />;
  }

  if (!isLoaded) {
    // handle loading state
    return <p>loading</p>;
  }

  if (!isSignedIn) {
    // handle not signed in state
    return <p>Please sign in to use this page </p>;
  }
  console.log(flashCardInfo);

  return (
    <Fragment>
      {isLoading ? (
        <div className="flex h-screen w-full justify-center items-center">
          <img src={loader} alt="loading.gif" height="100" width="100" />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          transition={{ delay: 0.5 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex flex-col"
        >
          <h1 className="text-center font-bold text-5xl mt-5">Flash Card</h1>
          <div className="grid grid-cols-4 grid-rows-3 gap-14 p-3.5 m-3 transition-all duration-500 ">
            {flashCardInfo.map((card) => (
              <Card
                title={card.title}
                link={`/flashcard/${card.id}`}
                image={card.imageUrl}
                alt={card.description}
                key={card.id}
              />
            ))}
          </div>
        </motion.div>
      )}
    </Fragment>
  );
}
