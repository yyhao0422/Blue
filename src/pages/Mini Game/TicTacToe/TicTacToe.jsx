import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./TicTacToe.css";

import {
  EarnPointFunction,
  fetchUserDetailAndAddPoint,
} from "../../../components/EarnPointFunction";

import { useUser } from "@clerk/clerk-react";

import Player from "./TicTacToeComponent/Player";
import GameBoard from "./TicTacToeComponent/GameBoard";
import Log from "./TicTacToeComponent/Log";
import { WINNING_COMBINATIONS } from "./TicTacToeComponent/winning-combinations";
import GameOver from "./TicTacToeComponent/GameOver";

const PLAYERS = {
  X: "Player 1",
  O: "Player 2",
};
const INITIAL_GAME_BOARD = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

function deriveGameBoard(gameTurns) {
  let gameBoard = [...INITIAL_GAME_BOARD.map((array) => [...array])];

  for (const turn of gameTurns) {
    const { square, player } = turn;
    const { row, col } = square;

    gameBoard[row][col] = player;
  }

  return gameBoard;
}

function deriveActivePlayer(gameTurns) {
  let currentPlayer = "X";

  if (gameTurns.length > 0 && gameTurns[0].player === "X") {
    currentPlayer = "O";
  }
  return currentPlayer;
}

function deriveWinner(gameBoard, players) {
  let winner;

  for (const combination of WINNING_COMBINATIONS) {
    const firstSquareSymbol =
      gameBoard[combination[0].row][combination[0].column];
    const secondSquareSymbol =
      gameBoard[combination[1].row][combination[1].column];
    const thirdSquareSymbol =
      gameBoard[combination[2].row][combination[2].column];

    if (
      firstSquareSymbol &&
      firstSquareSymbol === secondSquareSymbol &&
      firstSquareSymbol === thirdSquareSymbol
    ) {
      winner = players[firstSquareSymbol];
    }
  }

  return winner;
}

function TicTacToe() {
  const [players, setPlayers] = useState(PLAYERS);
  const [gameTurns, setGameTurns] = useState([]);
  const { user } = useUser();
  console.log(user);

  const activePlayer = deriveActivePlayer(gameTurns);
  const gameBoard = deriveGameBoard(gameTurns);
  const winner = deriveWinner(gameBoard, players);
  const hasDraw = gameTurns.length === 9 && !winner;
  useEffect(() => {
    if (winner || hasDraw) {
      fetchUserDetailAndAddPoint(user);
      async function postGameStats() {
        const res = await fetch(
          "https://api.alexsama.tech/api/mini-game-statistic",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              clerkId: user.id,
            },
            body: JSON.stringify({
              miniGameType: "tictactoe",
              playCount: 1,
            }),
          }
        );
      }
      postGameStats();
    }
  }, [winner, hasDraw, user]);

  function handleSelectSquare(rowIndex, colIndex) {
    setGameTurns((prevTurns) => {
      let currentPlayer = deriveActivePlayer(prevTurns);
      if (prevTurns.length > 0 && prevTurns[0].player === "X") {
        currentPlayer = "O";
      }
      const updatedTurns = [
        { square: { row: rowIndex, col: colIndex }, player: currentPlayer },
        ...prevTurns,
      ];
      return updatedTurns;
    });
  }

  function handleRestart() {
    setGameTurns([]);
  }

  function handlePlayerNameChange(symbol, newName) {
    setPlayers((prevPlayers) => {
      return {
        ...prevPlayers,
        [symbol]: newName,
      };
    });
  }

  return (
    <main className="w-full flex justify-center">
      <div id="game-container">
        <ol id="players" className="highlight-player">
          <Player
            initialName={PLAYERS.X}
            symbol="X"
            isActive={activePlayer === "X"}
            onChangeName={handlePlayerNameChange}
          />
          <Player
            initialName={PLAYERS.O}
            symbol="O"
            isActive={activePlayer === "O"}
            onChangeName={handlePlayerNameChange}
          />
        </ol>
        {(winner || hasDraw) && (
          <>
            <GameOver winner={winner} onRestart={handleRestart} />
            <EarnPointFunction />
          </>
        )}
        <GameBoard
          onSelectSquare={handleSelectSquare}
          turns={gameTurns}
          board={gameBoard}
        />
      </div>
      <Log turns={gameTurns} />
      <div className="position absolute bottom-0 right-0 m-5 bg-blue-300 rounded-xl p-3">
        <Link to="/minigame">Game Menu</Link>
      </div>
    </main>
  );
}

export default TicTacToe;
