import { motion } from 'framer-motion';
import { useChessGame } from '@/hooks/useChessGame';
import { ChessBoard } from '@/components/chess/ChessBoard';
import { GameInfo } from '@/components/chess/GameInfo';
import { MoveHistory } from '@/components/chess/MoveHistory';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LocalGame() {
  const {
    gameState,
    makeMove,
    getLegalMoves,
    resetGame,
    undoMove,
    isPromotion,
  } = useChessGame();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
          <h1 className="font-serif text-xl font-semibold">Local Game</h1>
          <div className="w-20" />
        </div>
      </header>

      {/* Game Area */}
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid lg:grid-cols-[1fr_320px] gap-8 max-w-5xl mx-auto"
        >
          {/* Board */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-[560px] aspect-square">
              <ChessBoard
                fen={gameState.fen}
                onMove={makeMove}
                getLegalMoves={getLegalMoves}
                isPromotion={isPromotion}
                lastMove={gameState.lastMove}
                isCheck={gameState.isCheck}
                turn={gameState.turn}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <GameInfo
              gameState={gameState}
              onReset={resetGame}
              onUndo={undoMove}
              playerWhite="Player 1"
              playerBlack="Player 2"
            />
            <MoveHistory moves={gameState.moveHistory} />
          </div>
        </motion.div>
      </main>
    </div>
  );
}
