import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { LogIn } from "lucide-react";

export default function Login() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      setLocation("/dashboard");
    }
  }, [isAuthenticated, setLocation]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-accent-foreground font-display font-bold text-2xl">D</span>
            </div>
            <span className="font-display font-bold text-2xl text-foreground">DETAILS</span>
          </div>
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
          <div className="flex flex-col gap-6">
            <div className="text-center">
              <h1 className="font-display text-3xl font-bold text-foreground mb-2">
                Bem-vindo
              </h1>
              <p className="text-muted-foreground">
                Acesse sua conta para continuar
              </p>
            </div>

            {/* Login Button */}
            <Button
              asChild
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold h-12 w-full"
            >
              <a href={getLoginUrl()} className="flex items-center justify-center gap-2">
                <LogIn className="w-5 h-5" />
                Entrar com Manus
              </a>
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card text-muted-foreground">
                  Segurança Premium
                </span>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">Autenticação Segura</p>
                  <p className="text-xs text-muted-foreground">Via Manus OAuth</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">Dados Protegidos</p>
                  <p className="text-xs text-muted-foreground">Criptografia de nível empresarial</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">Sem Compartilhamento</p>
                  <p className="text-xs text-muted-foreground">Seus dados são seus</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            Ao entrar, você concorda com nossos{" "}
            <a href="#" className="text-accent hover:underline">
              Termos de Serviço
            </a>
            {" "}e{" "}
            <a href="#" className="text-accent hover:underline">
              Política de Privacidade
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
