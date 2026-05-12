import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Editais from "./pages/Editais";
import EditalDetail from "./pages/EditalDetail";
import Tutorial from "./pages/Tutorial";
import SubmissionHistory from "./pages/SubmissionHistory";
import Profile from "./pages/Profile";
import { useAuth } from "./_core/hooks/useAuth";

function Router() {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-muted border-t-accent rounded-full animate-spin" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }
  
  return (
    <Switch>
      <Route path={"/(.*)?"} component={() => {
        if (isAuthenticated) {
          return (
            <Switch>
              <Route path={"/dashboard"} component={Dashboard} />
              <Route path={"/editais"} component={Editais} />
              <Route path={"/editais/:id"} component={EditalDetail} />
              <Route path={"/historico"} component={SubmissionHistory} />
              <Route path={"/perfil"} component={Profile} />
              <Route path={"/tutorial"} component={Tutorial} />
              <Route path={"/"} component={Dashboard} />
              <Route path={"/404"} component={NotFound} />
              <Route component={NotFound} />
            </Switch>
          );
        }
        
        return (
          <Switch>
            <Route path={"/login"} component={Login} />
            <Route path={"/"} component={Home} />
            <Route path={"/404"} component={NotFound} />
            <Route component={NotFound} />
          </Switch>
        );
      }} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
