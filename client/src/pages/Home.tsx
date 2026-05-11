import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { ArrowRight, CheckCircle2, Zap, Shield, BarChart3, Bell } from "lucide-react";

export default function Home() {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Busca Inteligente",
      description: "Encontre editais relevantes com filtros avançados por área, prazo, valor e órgão."
    },
    {
      icon: <CheckCircle2 className="w-8 h-8" />,
      title: "Preenchimento Automático",
      description: "Assistente IA analisa seus documentos e preenche automaticamente os campos necessários."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Segurança Premium",
      description: "Seus dados são protegidos com criptografia de nível empresarial."
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Acompanhamento",
      description: "Monitore o progresso de preenchimento de cada edital em tempo real."
    },
    {
      icon: <Bell className="w-8 h-8" />,
      title: "Alertas Inteligentes",
      description: "Receba notificações automáticas sobre prazos e atualizações importantes."
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Dashboard Completo",
      description: "Visualize todos os seus editais, documentos e status em um único lugar."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-accent-foreground font-display font-bold text-lg">D</span>
            </div>
            <span className="font-display font-bold text-xl text-foreground">DETAILS</span>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <Button variant="default" className="bg-accent hover:bg-accent/90">
                Dashboard
              </Button>
            ) : (
              <>
                <Button variant="ghost">Sobre</Button>
                <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  <a href={getLoginUrl()}>Entrar</a>
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                <h1 className="font-display text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                  Conectando <span className="text-accent">Oportunidades</span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Transforme a forma como você busca e preenche editais. Plataforma inteligente com assistente IA para otimizar seu tempo e aumentar suas chances de sucesso.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
                  <a href={getLoginUrl()} className="flex items-center gap-2">
                    Começar Agora
                    <ArrowRight className="w-5 h-5" />
                  </a>
                </Button>
                <Button variant="outline" size="lg" className="border-2 border-accent text-accent hover:bg-accent/5">
                  Saiba Mais
                </Button>
              </div>

              {/* Stats */}
              <div className="flex gap-8 pt-8">
                <div className="flex flex-col">
                  <span className="text-3xl font-bold text-accent">1000+</span>
                  <span className="text-sm text-muted-foreground">Editais Catalogados</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-bold text-accent">500+</span>
                  <span className="text-sm text-muted-foreground">Usuários Ativos</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-bold text-accent">95%</span>
                  <span className="text-sm text-muted-foreground">Taxa de Sucesso</span>
                </div>
              </div>
            </div>

            {/* Right Visual */}
            <div className="hidden lg:flex items-center justify-center">
              <div className="relative w-full aspect-square">
                {/* Decorative background */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent rounded-3xl" />
                
                {/* Logo placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-64 h-64 bg-gradient-to-br from-accent/20 to-accent/5 rounded-full blur-3xl" />
                </div>
                
                {/* Content cards */}
                <div className="absolute top-12 right-8 bg-card border border-border rounded-xl p-6 shadow-lg w-64">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-accent" />
                    </div>
                    <span className="font-semibold text-foreground">Preenchimento Rápido</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Economize horas com preenchimento automático</p>
                </div>

                <div className="absolute bottom-12 left-8 bg-card border border-border rounded-xl p-6 shadow-lg w-64">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                      <Bell className="w-6 h-6 text-accent" />
                    </div>
                    <span className="font-semibold text-foreground">Alertas Inteligentes</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Nunca perca um prazo importante</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-card/50">
        <div className="container max-w-6xl mx-auto">
          <div className="flex flex-col gap-4 mb-16 text-center">
            <h2 className="font-display text-4xl font-bold text-foreground">
              Recursos <span className="text-accent">Premium</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tudo que você precisa para gerenciar editais de forma profissional e eficiente
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-xl p-8 hover:border-accent/50 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                  <div className="text-accent">{feature.icon}</div>
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 rounded-2xl p-12 text-center">
            <h2 className="font-display text-4xl font-bold text-foreground mb-4">
              Pronto para transformar sua busca por editais?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Junte-se a centenas de profissionais que já estão economizando tempo e aumentando suas chances de sucesso
            </p>
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
              <a href={getLoginUrl()} className="flex items-center gap-2">
                Começar Gratuitamente
                <ArrowRight className="w-5 h-5" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4 bg-card/50">
        <div className="container max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                  <span className="text-accent-foreground font-display font-bold">D</span>
                </div>
                <span className="font-display font-bold text-lg">DETAILS</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Conectando oportunidades. Transformando propostas.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Produto</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-accent transition-colors">Recursos</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Preços</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Segurança</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-accent transition-colors">Sobre</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Contato</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-accent transition-colors">Privacidade</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Termos</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © 2026 DETAILS. Todos os direitos reservados.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="text-muted-foreground hover:text-accent transition-colors">
                Twitter
              </a>
              <a href="#" className="text-muted-foreground hover:text-accent transition-colors">
                LinkedIn
              </a>
              <a href="#" className="text-muted-foreground hover:text-accent transition-colors">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
