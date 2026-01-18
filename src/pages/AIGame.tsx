import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AIGame() {
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

      {/* AI Game Content */}
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="chess-card p-8">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Bot className="w-8 h-8 text-primary" />
            </div>
            <h2 className="font-serif text-2xl font-semibold mb-3">
              AI Game Mode
            </h2>
            <p className="text-muted-foreground mb-6">
              Challenge the computer and improve your chess skills. AI opponent coming soon!
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
