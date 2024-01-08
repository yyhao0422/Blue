import Card from "../../components/Card";
import TicTacToe from "./TicTacToe/game-logo.png";

export default function MiniGame() {
  return (
    <div className="w-full flex flex-col">
      <h1 className="text-center font-bold text-5xl mt-5">Mini Game</h1>
      <div className="flex w-fit">
        <Card
          title="Tic Tac toe"
          pathToImage={TicTacToe}
          link="/minigame/tictactoe"
        />
        <Card title="Constructing" pathToImage="" link="/flashcard/t" />
      </div>
    </div>
  );
}
