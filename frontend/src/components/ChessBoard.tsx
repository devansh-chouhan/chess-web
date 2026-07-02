import type { Color, PieceSymbol, Square } from "chess.js";
import type { Chess } from "chess.js";
import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { MOVE } from "../screens/Game";

interface ChessBoardProps {
    board: (
        {
            square: Square;
            type: PieceSymbol;
            color: Color;
        } | null
    )[][];
    socket: WebSocket;
    setBoard: Dispatch<
        SetStateAction<
            ({
                square: Square;
                type: PieceSymbol;
                color: Color;
            } | null)[][]
        >
    >;
    chess: Chess;
}

const ChessBoard = ({ board, socket, setBoard, chess }: ChessBoardProps) => {
    const [from, setFrom] = useState<null | Square>(null);
    return (
        <div className="text-white-200">
            {board.map((row, i) => (
                <div key={i} className="flex">
                    {row.map((square, j) => {
                        const squareRepresentation = String.fromCharCode(97 + (j % 8)) + "" + (8 - i) as Square;
                        return (<div
                            onClick={() => {
                                if (!from) {
                                    setFrom(squareRepresentation)
                                } else {
                                    socket.send(JSON.stringify({
                                        type: MOVE,
                                        payload: {
                                            move: {
                                                from: from,
                                                to: squareRepresentation
                                            }
                                        }
                                    }))
                                    setFrom(null);
                                    chess.move({
                                        from: from,
                                        to: squareRepresentation
                                    });
                                    setBoard(chess.board())
                                }
                            }}
                            key={j}
                            className={`w-16 h-16 ${((i + j) % 2 === 0) ? "bg-green-500" : "bg-white"
                                }`}
                        >
                            <div className="w-full justify-center flex h-full">
                                <div className="h-full justify-center flex flex-col">
                                    {square ? square.type : ""}
                                </div>
                            </div>
                        </div>
                        )
                    })}
                </div>
            ))}
        </div>
    );
};

export default ChessBoard;