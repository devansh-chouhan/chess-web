import { useEffect, useState } from "react";
import Button from "../components/Button"
import ChessBoard from "../components/ChessBoard"
import useSocket from "../hooks/useSocket"
import { Chess } from "chess.js";

export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";

const Game = () => {
  const socket = useSocket();
  const [chess, setChess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event: MessageEvent) => {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case INIT_GAME: {
          setBoard(chess.board());
          console.log("Game Initialized");
          break;
        }

        case MOVE: {
          const move = message.payload;
          chess.move(move);
          setBoard(chess.board())
          console.log("Move");
          break;
        }

        case GAME_OVER: {
          console.log("Game Over");
          break;
        }
      }
    };

    socket.addEventListener("message", handleMessage);

    return () => {
      socket.removeEventListener("message", handleMessage);
    };

  }, [socket, chess])

  if (!socket) return <div>Connecting...</div>

  return (
    <div className="p-4 justify-between min-h-300 h-screen flex bg-gray-900">
      <div className="ml-60 mt-10">
        <ChessBoard chess={chess} setBoard={setBoard} socket={socket} board={board} />
      </div>
      <div className="mr-60 mt-10">
        <Button onClick={() => {
          socket.send(JSON.stringify({
            type: INIT_GAME
          }))
        }}>Play</Button>
      </div>
    </div>
  )
}

export default Game