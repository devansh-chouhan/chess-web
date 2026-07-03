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
  const [started, setStarted] = useState(false);
  const [playerColor, setPlayerColor] = useState<"white" | "black" | null>(null);

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event: MessageEvent) => {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case INIT_GAME: {
          setBoard(chess.board());
          setStarted(true);
          setPlayerColor(message.payload.color);
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

  if (!socket) return (
    <div className="h-screen bg-zinc-950 flex items-center justify-center text-zinc-400 text-2xl font-semibold">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-[#81b64c] border-t-transparent rounded-full animate-spin"></div>
        Connecting to server...
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-6xl flex flex-col md:flex-row gap-12 items-center md:items-start justify-center">
        
        <div className="flex-shrink-0">
          <ChessBoard chess={chess} setBoard={setBoard} socket={socket} board={board} playerColor={playerColor} />
        </div>
        
        <div className="flex flex-col gap-6 w-full max-w-sm bg-zinc-900 rounded-xl p-8 shadow-2xl border border-zinc-800">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold text-zinc-100 mb-2">Play Chess</h2>
            <p className="text-zinc-400 mb-4">
              {started ? "Game is in progress." : "Waiting to start..."}
            </p>
            {started && (
              <div className="mt-2 p-4 bg-zinc-800/50 rounded-lg border border-zinc-700/50 flex items-center justify-between">
                <span className="text-zinc-400 font-medium">Turn</span>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full shadow-sm ${chess.turn() === 'w' ? 'bg-zinc-100 border border-zinc-300' : 'bg-zinc-900 border border-zinc-600'}`}></div>
                  <span className={`text-lg font-bold ${chess.turn() === 'w' ? 'text-zinc-100' : 'text-zinc-400'}`}>
                    {chess.turn() === 'w' ? "White" : "Black"}
                  </span>
                </div>
              </div>
            )}
          </div>
          
          {!started && (
            <div className="flex justify-center md:justify-start w-full">
              <Button onClick={() => {
                socket.send(JSON.stringify({
                  type: INIT_GAME
                }))
              }}>
                Find Match
              </Button>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default Game