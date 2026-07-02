import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import React, { useEffect } from 'react';

// Contexts
import { AuthProvider } from '@/context/AuthContext';
import { AppProvider } from '@/context/AppContext';
import { AuthGate } from '@/components/AuthGate';

// Layout
import { Shell } from '@/components/Shell';

// Pages
import AuthPage from '@/pages/auth';
import RoomsPage from '@/pages/rooms';
import RoomPage from '@/pages/room';
import LeaderboardPage from '@/pages/leaderboard';
import ProfilePage from '@/pages/profile';
import AdminPage from '@/pages/admin';

const queryClient = new QueryClient();

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground flex-col gap-4">
      <h1 className="text-4xl font-black text-destructive">404</h1>
      <p>Bu arena bulunamadı.</p>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={AuthPage} />
      
      <Route path="/rooms">
        <AuthGate>
          <Shell>
            <RoomsPage />
          </Shell>
        </AuthGate>
      </Route>

      <Route path="/room/:id">
        <AuthGate>
          <Shell>
            <RoomPage />
          </Shell>
        </AuthGate>
      </Route>

      <Route path="/leaderboard">
        <AuthGate>
          <Shell>
            <LeaderboardPage />
          </Shell>
        </AuthGate>
      </Route>

      <Route path="/profile">
        <AuthGate>
          <Shell>
            <ProfilePage />
          </Shell>
        </AuthGate>
      </Route>

      <Route path="/admin">
        <AuthGate>
          <Shell>
            <AdminPage />
          </Shell>
        </AuthGate>
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Force dark mode
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <AuthProvider>
            <AppProvider>
              <Router />
            </AppProvider>
          </AuthProvider>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
