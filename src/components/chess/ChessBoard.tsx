import { useState, useCallback, useMemo } from 'react';
import { Square } from 'chess.js';
import { motion } from 'framer-motion';

interface ChessBoardProps {
  fen: string;
  onMove: (from: Square, to: Square, promotion?: string) => boolean;
  getLegalMoves: (square: Square) => Square[];
  isPromotion: (from: Square, to: Square) => boolean;
  lastMove: { from: Square; to: Square } | null;
  isCheck: boolean;
  turn: 'w' | 'b';
  boardOrientation?: 'white' | 'black';
  disabled?: boolean;
}

const PIECE_SYMBOLS: Record<string, string> = {
  'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘', 'P': '♙',
  'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟',
};

function fenToBoard(fen: string): (string | null)[][] {
  const rows = fen.split(' ')[0].split('/');
  return rows.map(row => {
    const squares: (string | null)[] = [];
    for (const char of row) {
      if (char >= '1' && char <= '8') {
        for (let i = 0; i < parseInt(char); i++) squares.push(null);
      } else {
        squares.push(char);
      }
    }
    return squares;
  });
}

export function ChessBoard({
  fen,
  onMove,
  getLegalMoves,
  isPromotion,
  lastMove,
  isCheck,
  turn,
  boardOrientation = 'white',
  disabled = false,
}: ChessBoardProps) {
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [highlightedSquares, setHighlightedSquares] = useState<Square[]>([]);
  const [showPromotion, setShowPromotion] = useState<{ from: Square; to: Square } | null>(null);

  const board = useMemo(() => fenToBoard(fen), [fen]);
  const files = 'abcdefgh';

  const getSquare = (row: number, col: number): Square => {
    const actualRow = boardOrientation === 'white' ? row : 7 - row;
    const actualCol = boardOrientation === 'white' ? col : 7 - col;
    return `${files[actualCol]}${8 - actualRow}` as Square;
  };

  const handleSquareClick = useCallback((square: Square) => {
    if (disabled) return;

    if (selectedSquare) {
      if (highlightedSquares.includes(square)) {
        if (isPromotion(selectedSquare, square)) {
          setShowPromotion({ from: selectedSquare, to: square });
        } else {
          onMove(selectedSquare, square);
        }
      }
      setSelectedSquare(null);
      setHighlightedSquares([]);
    } else {
      const legalMoves = getLegalMoves(square);
      if (legalMoves.length > 0) {
        setSelectedSquare(square);
        setHighlightedSquares(legalMoves);
      }
    }
  }, [selectedSquare, highlightedSquares, getLegalMoves, onMove, isPromotion, disabled]);

  const handlePromotion = (piece: string) => {
    if (showPromotion) {
      onMove(showPromotion.from, showPromotion.to, piece);
      setShowPromotion(null);
      setSelectedSquare(null);
      setHighlightedSquares([]);
    }
  };

  const kingSquare = useMemo(() => {
    if (!isCheck) return null;
    const kingChar = turn === 'w' ? 'K' : 'k';
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (board[r][c] === kingChar) {
          return `${files[c]}${8 - r}` as Square;
        }
      }
    }
    return null;
  }, [isCheck, board, turn]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="board-container w-full aspect-square relative"
    >
      <div className="grid grid-cols-8 grid-rows-8 w-full h-full rounded-xl overflow-hidden">
        {Array.from({ length: 8 }).map((_, row) =>
          Array.from({ length: 8 }).map((_, col) => {
            const square = getSquare(row, col);
            const actualRow = boardOrientation === 'white' ? row : 7 - row;
            const actualCol = boardOrientation === 'white' ? col : 7 - col;
            const piece = board[actualRow]?.[actualCol];
            const isLight = (row + col) % 2 === 0;
            const isSelected = selectedSquare === square;
            const isHighlighted = highlightedSquares.includes(square);
            const isLastMove = lastMove?.from === square || lastMove?.to === square;
            const isKingInCheck = kingSquare === square;

            return (
              <button
                key={square}
                onClick={() => handleSquareClick(square)}
                className={`
                  relative flex items-center justify-center text-3xl sm:text-4xl md:text-5xl
                  transition-colors duration-150
                  ${isLight ? 'bg-board-light' : 'bg-board-dark'}
                  ${isSelected ? 'ring-4 ring-inset ring-primary/60' : ''}
                  ${isLastMove ? 'bg-board-last-move' : ''}
                  ${isKingInCheck ? 'bg-board-check' : ''}
                `}
                disabled={disabled}
              >
                {piece && (
                  <span className={`select-none ${piece === piece.toUpperCase() ? 'text-card drop-shadow-md' : 'text-foreground drop-shadow-sm'}`}>
                    {PIECE_SYMBOLS[piece]}
                  </span>
                )}
                {isHighlighted && !piece && (
                  <div className="absolute w-1/3 h-1/3 rounded-full bg-primary/40" />
                )}
                {isHighlighted && piece && (
                  <div className="absolute inset-0 ring-4 ring-inset ring-primary/50 rounded-sm" />
                )}
              </button>
            );
          })
        )}
      </div>

      {showPromotion && (
        <div className="absolute inset-0 flex items-center justify-center bg-foreground/30 backdrop-blur-sm rounded-xl z-10">
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="chess-card p-4">
            <p className="text-sm text-muted-foreground mb-3 text-center font-medium">Choose promotion</p>
            <div className="flex gap-2">
              {['q', 'r', 'b', 'n'].map((p) => (
                <button
                  key={p}
                  onClick={() => handlePromotion(p)}
                  className="w-14 h-14 chess-button-secondary flex items-center justify-center text-2xl"
                >
                  {PIECE_SYMBOLS[turn === 'w' ? p.toUpperCase() : p]}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
