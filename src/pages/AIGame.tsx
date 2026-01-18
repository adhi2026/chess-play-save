import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Bot, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

export default function AIGame() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
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
            <h1 className="font-serif text-xl font-semibold">Play vs AI</h1>
            <div className="w-20" />
          </div>
        </header>

        {/* Login Required */}
        <main className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto text-center"
          >
            <div className="chess-card p-8">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Lock className="w-8 h-8 text-primary" />
              </div>
              <h2 className="font-serif text-2xl font-semibold mb-3">
                Login Required
              </h2>
              <p className="text-muted-foreground mb-6">
                Sign in to play against the AI and save your game progress. Your games will be automatically saved so you can resume anytime.
              </p>
              <div className="space-y-3">
                <Link to="/auth" className="block">
                  <Button className="w-full chess-button-primary gap-2">
                    <Bot className="w-4 h-4" />
                    Sign In to Play
                  </Button>
                </Link>
                <Link to="/local">
                  <Button variant="outline" className="w-full">
                    Play Local Instead
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  // AI game will be implemented after auth
  return null;
}
