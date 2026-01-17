import { useState, useCallback, useMemo } from 'react';
import { Chess, Square, Move } from 'chess.js';

export interface GameState {
  fen: string;
  turn: 'w' | 'b';
  isCheck: boolean;
  isCheckmate: boolean;
  isStalemate: boolean;
  isDraw: boolean;
  isGameOver: boolean;
  moveHistory: Move[];
  lastMove: { from: Square; to: Square } | null;
}

export function useChessGame(initialFen?: string) {
  const [game] = useState(() => new Chess(initialFen));
  const [gameState, setGameState] = useState<GameState>(() => getGameState(game, null));

  const updateGameState = useCallback((lastMove: { from: Square; to: Square } | null) => {
    setGameState(getGameState(game, lastMove));
  }, [game]);

  const makeMove = useCallback((from: Square, to: Square, promotion?: string): boolean => {
    try {
      const move = game.move({ from, to, promotion: promotion || 'q' });
      if (move) {
        updateGameState({ from, to });
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, [game, updateGameState]);

  const getLegalMoves = useCallback((square: Square): Square[] => {
    try {
      const moves = game.moves({ square, verbose: true });
      return moves.map((move) => move.to as Square);
    } catch {
      return [];
    }
  }, [game]);

  const resetGame = useCallback(() => {
    game.reset();
    updateGameState(null);
  }, [game, updateGameState]);

  const loadFen = useCallback((fen: string) => {
    try {
      game.load(fen);
      updateGameState(null);
      return true;
    } catch {
      return false;
    }
  }, [game, updateGameState]);

  const undoMove = useCallback(() => {
    const move = game.undo();
    if (move) {
      updateGameState(null);
      return true;
    }
    return false;
  }, [game, updateGameState]);

  const getPieceAt = useCallback((square: Square) => {
    return game.get(square);
  }, [game]);

  const isPromotion = useCallback((from: Square, to: Square): boolean => {
    const piece = game.get(from);
    if (!piece || piece.type !== 'p') return false;
    const toRank = to[1];
    return (piece.color === 'w' && toRank === '8') || (piece.color === 'b' && toRank === '1');
  }, [game]);

  return {
    gameState,
    makeMove,
    getLegalMoves,
    resetGame,
    loadFen,
    undoMove,
    getPieceAt,
    isPromotion,
    fen: game.fen(),
  };
}

function getGameState(game: Chess, lastMove: { from: Square; to: Square } | null): GameState {
  return {
    fen: game.fen(),
    turn: game.turn(),
    isCheck: game.isCheck(),
    isCheckmate: game.isCheckmate(),
    isStalemate: game.isStalemate(),
    isDraw: game.isDraw(),
    isGameOver: game.isGameOver(),
    moveHistory: game.history({ verbose: true }),
    lastMove,
  };
}
