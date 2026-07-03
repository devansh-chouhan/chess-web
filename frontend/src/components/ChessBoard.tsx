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
    playerColor: "white" | "black" | null;
}

const ChessBoard = ({ board, socket, setBoard, chess, playerColor }: ChessBoardProps) => {
    const [from, setFrom] = useState<null | Square>(null);

    const isMyPiece = (square: Square) => {
        if (!playerColor) return false;
        const piece = chess.get(square);
        if (!piece) return false;
        return (piece.color === "w" && playerColor === "white") || (piece.color === "b" && playerColor === "black");
    };

    const handleMove = (fromSquare: Square, toSquare: Square) => {
        try {
            // Validate move locally first
            const moveResult = chess.move({
                from: fromSquare,
                to: toSquare
            });
            
            if (moveResult) {
                socket.send(JSON.stringify({
                    type: MOVE,
                    payload: {
                        move: {
                            from: fromSquare,
                            to: toSquare
                        }
                    }
                }));
                setBoard(chess.board());
            }
        } catch (e) {
            console.error("Invalid move", e);
        }
    };

    return (
        <div className="text-white-200 rounded-lg overflow-hidden shadow-2xl border-4 border-zinc-800">
            {board.map((row, i) => (
                <div key={i} className="flex">
                    {row.map((square, j) => {
                        const squareRepresentation = String.fromCharCode(97 + (j % 8)) + "" + (8 - i) as Square;
                        const isLightSquare = (i + j) % 2 === 0;
                        const isSelected = from === squareRepresentation;

                        return (<div
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                                e.preventDefault();
                                const fromSquare = e.dataTransfer.getData("square") as Square;
                                if (fromSquare && fromSquare !== squareRepresentation) {
                                    handleMove(fromSquare, squareRepresentation);
                                    setFrom(null);
                                }
                            }}
                            onClick={() => {
                                if (!from) {
                                    if (square && isMyPiece(squareRepresentation)) setFrom(squareRepresentation);
                                } else {
                                    if (from !== squareRepresentation) {
                                        handleMove(from, squareRepresentation);
                                    }
                                    setFrom(null);
                                }
                            }}
                            key={j}
                            className={`w-16 h-16 sm:w-20 sm:h-20 flex justify-center items-center relative cursor-pointer
                                ${isLightSquare ? "bg-[#ebecd0]" : "bg-[#739552]"}
                                ${isSelected ? "ring-inset ring-4 ring-yellow-400/50" : ""}
                            `}
                        >
                            {square ? (
                                <img 
                                    draggable={isMyPiece(squareRepresentation)}
                                    onDragStart={(e) => {
                                        if (isMyPiece(squareRepresentation)) {
                                            e.dataTransfer.setData("square", squareRepresentation);
                                            setFrom(squareRepresentation);
                                        } else {
                                            e.preventDefault();
                                        }
                                    }}
                                    className="w-10 sm:w-14 hover:scale-110 transition-transform duration-200 z-10" 
                                    src={`/${square.color === "b" ? square.type : `${square.type.toUpperCase()} copy`}.png`} 
                                    alt={`${square.color}${square.type}`}
                                />
                            ) : null}
                            
                            {/* Optional: Add coordinates on edges */}
                            {j === 0 && <span className={`absolute top-1 left-1 text-[10px] font-bold ${isLightSquare ? "text-[#739552]" : "text-[#ebecd0]"}`}>{8 - i}</span>}
                            {i === 7 && <span className={`absolute bottom-1 right-1 text-[10px] font-bold ${isLightSquare ? "text-[#739552]" : "text-[#ebecd0]"}`}>{String.fromCharCode(97 + j)}</span>}
                        </div>
                        )
                    })}
                </div>
            ))}
        </div>
    );
};

export default ChessBoard;