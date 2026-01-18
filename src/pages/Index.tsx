import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Users, Bot, Crown, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

export default function Index() {
  const { user, loading, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header with auth status */}
      {user && (
        <header className="p-4 flex justify-end">
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user.email}</span>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </header>
      )}

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo/Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-6">
              <Crown className="w-10 h-10 text-primary" />
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold mb-6"
          >
            Simple Chess
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto"
          >
          {user 
              ? "Welcome back! Choose your game mode below."
              : "A clean, elegant chess experience. Play locally with a friend or challenge the AI."}
          </motion.p>

          {!user ? (
            /* Play Options for guests */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid sm:grid-cols-2 gap-4 max-w-lg mx-auto"
            >
              {/* Local Game */}
              <Link to="/local" className="block">
                <div className="chess-card p-6 h-full hover:border-primary/50 transition-all duration-300 group cursor-pointer">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                      <Users className="w-7 h-7 text-primary" />
                    </div>
                    <h2 className="font-serif text-xl font-semibold mb-2">
                      Local Play
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Two players, one device. Perfect for casual games with friends.
                    </p>
                  </div>
                </div>
              </Link>

              {/* AI Game */}
              <Link to="/ai" className="block">
                <div className="chess-card p-6 h-full hover:border-primary/50 transition-all duration-300 group cursor-pointer">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                      <Bot className="w-7 h-7 text-primary" />
                    </div>
                    <h2 className="font-serif text-xl font-semibold mb-2">
                      Play vs AI
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Challenge the computer and improve your skills.
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ) : (
            /* Play Options for logged-in users */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid sm:grid-cols-2 gap-4 max-w-lg mx-auto"
            >
              {/* Local Game */}
              <Link to="/local" className="block">
                <div className="chess-card p-6 h-full hover:border-primary/50 transition-all duration-300 group cursor-pointer">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                      <Users className="w-7 h-7 text-primary" />
                    </div>
                    <h2 className="font-serif text-xl font-semibold mb-2">
                      Local Play
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Two players, one device. Perfect for casual games with friends.
                    </p>
                  </div>
                </div>
              </Link>

              {/* AI Game */}
              <Link to="/ai" className="block">
                <div className="chess-card p-6 h-full hover:border-primary/50 transition-all duration-300 group cursor-pointer">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                      <Bot className="w-7 h-7 text-primary" />
                    </div>
                    <h2 className="font-serif text-xl font-semibold mb-2">
                      Play vs AI
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Challenge the computer. Your progress is saved automatically.
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}

          {/* Features */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto text-center"
          >
            {[
              { label: 'Move Highlights', desc: 'See legal moves' },
              { label: 'Check Detection', desc: 'Visual warnings' },
              { label: 'Auto Save', desc: 'Resume anytime' },
            ].map((feature) => (
              <div key={feature.label} className="space-y-1">
                <p className="font-medium text-foreground">{feature.label}</p>
                <p className="text-xs text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-muted-foreground border-t border-border">
        <p>Built with ♟️ for chess enthusiasts</p>
      </footer>
    </div>
  );
}
