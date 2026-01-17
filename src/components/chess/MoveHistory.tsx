import { motion } from 'framer-motion';
import { Move } from 'chess.js';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MoveHistoryProps {
  moves: Move[];
}

export function MoveHistory({ moves }: MoveHistoryProps) {
  const movePairs: { number: number; white?: Move; black?: Move }[] = [];

  for (let i = 0; i < moves.length; i += 2) {
    movePairs.push({
      number: Math.floor(i / 2) + 1,
      white: moves[i],
      black: moves[i + 1],
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="chess-card p-4"
    >
      <h3 className="font-semibold mb-3 font-serif">Move History</h3>
      <ScrollArea className="h-48">
        {movePairs.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-4">
            No moves yet
          </p>
        ) : (
          <div className="space-y-1">
            {movePairs.map((pair, index) => (
              <motion.div
                key={pair.number}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.02 }}
                className="flex items-center text-sm gap-2 py-1"
              >
                <span className="text-muted-foreground w-8 text-right">
                  {pair.number}.
                </span>
                <span className="font-mono w-16">
                  {pair.white?.san || ''}
                </span>
                <span className="font-mono w-16">
                  {pair.black?.san || ''}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </ScrollArea>
    </motion.div>
  );
}
