import Card from "../../components/Card";
import { useSession } from "@clerk/clerk-react";
import imageTest from "./test.gif";
import { AUTISMTESTDUMMY } from "./AUTISMTESTDUMMY.js";

export default function AutismTest() {
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
        {AUTISMTESTDUMMY.map((test) => {
          return (
            <Card
              title={test.title}
              link={`/autismtest/${test.id}`}
              key={test.id}
            >
              <img
                className="max-h-48 rounded-3xl"
                src={imageTest}
                alt="test"
              />
            </Card>
          );
        })}
      </div>
    </div>
  );
}
