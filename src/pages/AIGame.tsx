import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Bot, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useChessGame } from '@/hooks/useChessGame';
import { useChessAI, AIDifficulty } from '@/hooks/useChessAI';
import { ChessBoard } from '@/components/chess/ChessBoard';
import { GameInfo } from '@/components/chess/GameInfo';
import { MoveHistory } from '@/components/chess/MoveHistory';
import { Chess, Square } from 'chess.js';

export default function AIGame() {
  const [difficulty, setDifficulty] = useState<AIDifficulty>('medium');
  const [gameStarted, setGameStarted] = useState(false);
  
  const {
    gameState,
    makeMove,
    getLegalMoves,
    resetGame,
    undoMove,
    isPromotion,
    fen,
  } = useChessGame();

  const { getAIMove, isThinking } = useChessAI();

  // Get all legal moves for the current player in the format "fromto"
  const getAllLegalMoves = useCallback((currentFen: string): string[] => {
    try {
      const tempGame = new Chess(currentFen);
      const moves = tempGame.moves({ verbose: true });
      return moves.map(m => `${m.from}${m.to}`);
    } catch {
      return [];
    }
  }, []);

  // AI makes a move when it's black's turn
  useEffect(() => {
    if (!gameStarted || gameState.isGameOver || gameState.turn !== 'b' || isThinking) {
      return;
    }

    const makeAIMove = async () => {
      const legalMoves = getAllLegalMoves(fen);
      if (legalMoves.length === 0) return;

      // Small delay to make it feel more natural
      await new Promise(resolve => setTimeout(resolve, 500));

      const aiMove = await getAIMove(fen, legalMoves, difficulty);
      if (aiMove) {
        makeMove(aiMove.from, aiMove.to);
      }
    };

    makeAIMove();
  }, [gameState.turn, gameState.isGameOver, gameStarted, fen, difficulty, getAIMove, makeMove, getAllLegalMoves, isThinking]);

  const handleReset = () => {
    resetGame();
    setGameStarted(true);
  };

  const handleUndo = () => {
    // Undo twice to undo both player's and AI's move
    undoMove();
    undoMove();
  };

  const startGame = () => {
    resetGame();
    setGameStarted(true);
  };

  if (!gameStarted) {
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
            <h1 className="font-serif text-xl font-semibold flex items-center gap-2">
              <Bot className="w-5 h-5" />
              Play vs AI
            </h1>
            <div className="w-20" />
          </div>
        </header>

        {/* Difficulty Selection */}
        <main className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto text-center"
          >
            <div className="chess-card p-8">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Bot className="w-8 h-8 text-primary" />
              </div>
              <h2 className="font-serif text-2xl font-semibold mb-3">
                Choose Difficulty
              </h2>
              <p className="text-muted-foreground mb-6">
                Select how challenging you want the AI opponent to be.
              </p>
              
              <div className="space-y-3 mb-6">
                {(['easy', 'medium', 'hard'] as AIDifficulty[]).map((level) => (
                  <button
                    key={level}
                    onClick={() => setDifficulty(level)}
                    className={`w-full p-4 rounded-lg border-2 transition-all ${
                      difficulty === level
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <span className="font-medium capitalize">{level}</span>
                    <p className="text-sm text-muted-foreground mt-1">
                      {level === 'easy' && 'Relaxed gameplay, occasional mistakes'}
                      {level === 'medium' && 'Balanced challenge, solid moves'}
                      {level === 'hard' && 'Tough opponent, finds best moves'}
                    </p>
                  </button>
                ))}
              </div>

              <Button onClick={startGame} className="w-full" size="lg">
                <Bot className="w-5 h-5 mr-2" />
                Start Game
              </Button>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

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
          <h1 className="font-serif text-xl font-semibold flex items-center gap-2">
            <Bot className="w-5 h-5" />
            Play vs AI ({difficulty})
          </h1>
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
          <div className="flex justify-center lg:justify-end relative">
            <div className="w-full max-w-[560px] aspect-square">
              <ChessBoard
                fen={gameState.fen}
                onMove={makeMove}
                getLegalMoves={getLegalMoves}
                isPromotion={isPromotion}
                lastMove={gameState.lastMove}
                isCheck={gameState.isCheck}
                turn={gameState.turn}
                disabled={isThinking || gameState.turn === 'b'}
              />
            </div>
            
            {/* AI Thinking Indicator */}
            {isThinking && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm rounded-xl">
                <div className="chess-card p-4 flex items-center gap-3">
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  <span className="font-medium">AI is thinking...</span>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <GameInfo
              gameState={gameState}
              onReset={handleReset}
              onUndo={handleUndo}
              playerWhite="You"
              playerBlack={`AI (${difficulty})`}
            />
            <MoveHistory moves={gameState.moveHistory} />
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setGameStarted(false)}
            >
              Change Difficulty
            </Button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
