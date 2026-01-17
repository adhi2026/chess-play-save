import { motion } from 'framer-motion';
import { GameState } from '@/hooks/useChessGame';
import { Crown, RotateCcw, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GameInfoProps {
  gameState: GameState;
  onReset: () => void;
  onUndo?: () => void;
  playerWhite?: string;
  playerBlack?: string;
  showUndo?: boolean;
}

export function GameInfo({
  gameState,
  onReset,
  onUndo,
  playerWhite = 'White',
  playerBlack = 'Black',
  showUndo = true,
}: GameInfoProps) {
  const { turn, isCheck, isCheckmate, isStalemate, isDraw, isGameOver, moveHistory } = gameState;

  const getStatusMessage = () => {
    if (isCheckmate) {
      return `${turn === 'w' ? playerBlack : playerWhite} wins by checkmate!`;
    }
    if (isStalemate) return 'Draw by stalemate';
    if (isDraw) return 'Draw';
    if (isCheck) return `${turn === 'w' ? playerWhite : playerBlack} is in check!`;
    return `${turn === 'w' ? playerWhite : playerBlack} to move`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="chess-card p-6 space-y-6"
    >
      {/* Current Turn Indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-full border-2 ${
              turn === 'w' ? 'bg-card border-border' : 'bg-foreground border-foreground'
            } shadow-sm`}
          />
          <div>
            <p className="text-sm text-muted-foreground">Current Turn</p>
            <p className="font-medium">{turn === 'w' ? playerWhite : playerBlack}</p>
          </div>
        </div>
        {isGameOver && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-2 text-primary"
          >
            <Crown className="w-5 h-5" />
            <span className="font-semibold">Game Over</span>
          </motion.div>
        )}
      </div>

      {/* Status Message */}
      <div
        className={`p-4 rounded-lg text-center font-medium ${
          isCheck && !isCheckmate
            ? 'bg-destructive/10 text-destructive'
            : isGameOver
            ? 'bg-primary/10 text-primary'
            : 'bg-secondary text-secondary-foreground'
        }`}
      >
        {getStatusMessage()}
      </div>

      {/* Move Counter */}
      <div className="flex justify-between items-center text-sm">
        <span className="text-muted-foreground">Moves played</span>
        <span className="font-medium">{Math.ceil(moveHistory.length / 2)}</span>
      </div>

      {/* Players */}
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-card border border-border shadow-sm" />
            <span className="font-medium">{playerWhite}</span>
          </div>
          {turn === 'w' && !isGameOver && (
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse-subtle" />
          )}
        </div>
        <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-foreground border border-foreground" />
            <span className="font-medium">{playerBlack}</span>
          </div>
          {turn === 'b' && !isGameOver && (
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse-subtle" />
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        {showUndo && onUndo && moveHistory.length > 0 && (
          <Button
            variant="outline"
            onClick={onUndo}
            className="flex-1 gap-2"
            disabled={isGameOver}
          >
            <RotateCcw className="w-4 h-4" />
            Undo
          </Button>
        )}
        <Button
          variant="outline"
          onClick={onReset}
          className="flex-1 gap-2"
        >
          <Flag className="w-4 h-4" />
          New Game
        </Button>
      </div>
    </motion.div>
  );
}
