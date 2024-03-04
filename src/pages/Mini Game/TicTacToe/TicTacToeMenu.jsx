import { Link } from "react-router-dom";
import gameLogo from "./game-logo.png";
import { motion } from "framer-motion";
import { Button, Card, Typography } from "@mui/material";

function TicTacToeMenu() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      transition={{ delay: 0.5 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="m-auto flex "
    >
      <Card className="p-10 mr-24" sx={{ bgcolor: "#ffd6ff" }}>
        <Typography variant="h3" sx={{ marginBottom: 3 }}>
          Tic Tac Toe
        </Typography>
        <hr className="bg-black h-1" />
        <img className="w-48 m-5" src={gameLogo} alt="Tic Tac Toe Logo" />
        <Link to="/minigame/tictactoe/play">
          <Button variant="contained" className="translate-x-20">
            Play Now
          </Button>
        </Link>
      </Card>
      <Card className="p-10 ml-6 ">
        <Typography variant="h6" sx={{ marginBottom: 3 }}>
          Tic Tac Toe - Rules
        </Typography>
        <hr className="bg-black h-[3px] " />
        <iframe key="vid-1"
          title="Tic Tac Toe"
          width="500"
          height="300"
          src="https://www.youtube.com/embed/ZBZcnImNmhk"
          allowFullScreen />
      </Card>
    </motion.div>
  );
}

export default TicTacToeMenu;
