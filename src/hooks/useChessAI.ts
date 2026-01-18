import { useState, useCallback } from 'react';
import { Square } from 'chess.js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export type AIDifficulty = 'easy' | 'medium' | 'hard';

export function useChessAI() {
  const [isThinking, setIsThinking] = useState(false);

  const getAIMove = useCallback(async (
    fen: string,
    legalMoves: string[],
    difficulty: AIDifficulty
  ): Promise<{ from: Square; to: Square } | null> => {
    if (legalMoves.length === 0) return null;

    setIsThinking(true);

    try {
      const { data, error } = await supabase.functions.invoke('chess-ai', {
        body: { fen, legalMoves, difficulty }
      });

      if (error) {
        console.error('AI move error:', error);
        toast({
          title: "AI Error",
          description: "Failed to get AI move. Making random move.",
          variant: "destructive"
        });
        // Fallback to random move
        const randomMove = legalMoves[Math.floor(Math.random() * legalMoves.length)];
        return {
          from: randomMove.slice(0, 2) as Square,
          to: randomMove.slice(2, 4) as Square
        };
      }

      if (data?.error) {
        toast({
          title: "AI Error",
          description: data.error,
          variant: "destructive"
        });
        // Fallback to random move
        const randomMove = legalMoves[Math.floor(Math.random() * legalMoves.length)];
        return {
          from: randomMove.slice(0, 2) as Square,
          to: randomMove.slice(2, 4) as Square
        };
      }

      const move = data.move;
      if (move && move.length >= 4) {
        return {
          from: move.slice(0, 2) as Square,
          to: move.slice(2, 4) as Square
        };
      }

      // Fallback
      const randomMove = legalMoves[Math.floor(Math.random() * legalMoves.length)];
      return {
        from: randomMove.slice(0, 2) as Square,
        to: randomMove.slice(2, 4) as Square
      };
    } catch (error) {
      console.error('AI move error:', error);
      toast({
        title: "AI Error",
        description: "Failed to connect to AI. Making random move.",
        variant: "destructive"
      });
      const randomMove = legalMoves[Math.floor(Math.random() * legalMoves.length)];
      return {
        from: randomMove.slice(0, 2) as Square,
        to: randomMove.slice(2, 4) as Square
      };
    } finally {
      setIsThinking(false);
    }
  }, []);

  return { getAIMove, isThinking };
}
