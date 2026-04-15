import { Suspense } from 'react';
import { 
  Toaster, 
  Sonner, 
  TooltipProvider, 
  ThemeProvider,
  LinkProvider,
  RouterProvider,
  IndexPage,
  KidsGameSelector,
  GameTypeSelector,
  GameSettingsPage,
  TeamConfigurator,
  GameModeSelector,
  KidsGameModeSelector,
  NotFound,
  Header,
  Footer,
  getGameConfig,
  type LinkComponent
} from "@powerletter/ui";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useParams, useNavigate, useLocation, Link as RouterLink } from "react-router-dom";
import { setupI18n } from "@powerletter/core";

// Initialize shared i18n
setupI18n();

const queryClient = new QueryClient();

/**
 * Platform-specific Router Adapter for React Router (Vite/Tauri)
 */
const ReactRouterAdapter = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const router = {
    push: (href: string) => navigate(href),
    replace: (href: string) => navigate(href, { replace: true }),
    back: () => navigate(-1),
    prefetch: () => {},
  };

  const appLocation = {
    pathname: location.pathname,
    search: location.search,
    hash: location.hash,
    state: location.state,
  };

  return (
    <RouterProvider router={router} location={appLocation} params={params}>
      <LinkProvider component={RouterLink as LinkComponent}>
        {children}
      </LinkProvider>
    </RouterProvider>
  );
};

const GameScreenWrapper = () => {
  const { gameType } = useParams<{ gameType: string }>();
  const config = getGameConfig(gameType || '');

  if (!config) {
    return <NotFound />;
  }

  const GameComponent = config.component;
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading Game...</div>}>
      <GameComponent />
    </Suspense>
  );
};

const GameModeSelectorWrapper = () => {
  const { gameType } = useParams<{ gameType: string }>();
  const config = getGameConfig(gameType || '');
  
  if (config?.type === 'kids') {
    return <KidsGameModeSelector gameType={gameType} />;
  }
  return <GameModeSelector gameType={gameType} />;
};

const TeamConfiguratorWrapper = () => {
  const { gameType } = useParams<{ gameType: string }>();
  return <TeamConfigurator gameType={gameType} />;
};

const GameSettingsPageWrapper = () => {
  const { settingType, gameType } = useParams<{ settingType: 'difficulty' | 'category', gameType: string }>();
  return <GameSettingsPage settingType={settingType} gameType={gameType} />;
};

const SharedLayout = ({ children }: { children?: React.ReactNode }) => (
  <div className="flex flex-col min-h-screen">
    <Header />
    <main className="flex-1">
      {children}
    </main>
    <Footer />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ReactRouterAdapter>
            <Suspense fallback={<div className="flex justify-center items-center h-screen w-full">Loading...</div>}>
              <SharedLayout>
                <Routes>
                  <Route path="/" element={<IndexPage />} />
                  <Route path="/games" element={<GameTypeSelector />} />
                  <Route path="/kids-games" element={<KidsGameSelector />} />
                  <Route path="/game-mode/:gameType" element={<GameModeSelectorWrapper />} />
                  
                  {/* Reusing shared pages across shells */}
                  <Route path="/team-config/:gameType" element={<TeamConfiguratorWrapper />} />
                  <Route path="/settings/teams/:gameType" element={<TeamConfiguratorWrapper />} />
                  <Route path="/settings/:settingType/:gameType" element={<GameSettingsPageWrapper />} />

                  <Route path="/game/:gameType" element={<GameScreenWrapper />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </SharedLayout>
            </Suspense>
          </ReactRouterAdapter>
        </BrowserRouter>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
