import { useSession } from "@clerk/clerk-react";
import { motion } from "framer-motion";

import Card from "../../components/Card";
import TicTacToe from "./TicTacToe/game-logo.png";

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
      <h1 className="text-center font-bold text-5xl mt-5">Mini Game</h1>
      <motion.div
        initial={{ opacity: 0 }}
        transition={{ delay: 0.5 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="grid grid-cols-4 grid-rows-3 gap-14 p-3.5 m-3 transition-all duration-500 "
      >
        <Card
          title="Tic Tac toe"
          image={TicTacToe}
          link="/minigame/tictactoe/home"
          alt="TicTacToe"
        />
        <Card title="Constructing" pathToImage="" link="/flashcard/t" />
      </motion.div>
    </div>
  );
}
