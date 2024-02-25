import { useSession } from "@clerk/clerk-react";
import { motion } from "framer-motion";

import Card from "../../components/Card";
import TicTacToe from "../../images/tictactoe.png";

export default function MiniGame() {
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
    <div className="w-full flex flex-col">
      <h1 className="text-center font-bold text-5xl m-10">Mini Game</h1>
      <div className="flex justify-center">
        <Card
          title="Tic Tac toe"
          image={TicTacToe}
          link="/minigame/tictactoe/home"
          alt="TicTacToe"
        />
      </div>
    </div>
  );
}
