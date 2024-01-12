import { useSession } from "@clerk/clerk-react";
import Card from "../../components/Card";
import { FLASHCARDDUMMY } from "./FLASHCARDDUMMY";

export default function FlashCard() {
  const { isLoaded, session, isSignedIn } = useSession();
  if (!isLoaded) {
    // handle loading state
    return <p>loading</p>;
  }

  if (!isSignedIn) {
    // handle not signed in state
    return <p>Please sign in to use this page </p>;
  }

  return (
    <div className="flex flex-col">
      <h1 className="text-center font-bold text-5xl mt-5">Flash Card</h1>
      <div className="flex flex-wrap w-fit">
        {FLASHCARDDUMMY.map((card) => {
          return (
            <Card
              title={card.title}
              link={`/flashcard/${card.flashCardId}/0`}
              image={card.image}
              alt={card.alt}
              key={card.flashCardId}
            />
          );
        })}
      </div>
    </div>
  );
}
