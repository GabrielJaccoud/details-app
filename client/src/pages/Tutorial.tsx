import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import DashboardLayout from "@/components/DashboardLayout";
import {
  ArrowLeft,
  Search,
  Filter,
  BookmarkPlus,
  FileText,
  Clock,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  ChevronRight
} from "lucide-react";

export default function Tutorial() {
  const [, setLocation] = useLocation();

  const tutorialSteps = [
    {
      id: 1,
      titulo: "Encontrar a Lupa de Busca",
      descricao: "Na página de Editais, você encontrará uma lupa de busca no topo. Clique nela para digitar o nome do edital que você procura.",
      icon: <Search className="w-8 h-8 text-accent" />,
      dica: "Você pode buscar por nome do edital, órgão ou programa (ex: 'Paulo Gustavo', 'CNPQ', 'Macaé')"
    },
    {
      id: 2,
      titulo: "Usar Filtros Avançados",
      descricao: "Abaixo da lupa de busca, você tem filtros para refinar sua busca. Filtre por Área, Órgão e outros critérios.",
      icon: <Filter className="w-8 h-8 text-accent" />,
      dica: "Combine múltiplos filtros para encontrar exatamente o que você precisa. Ex: Cultura + Instituto CÉU"
    },
    {
      id: 3,
      titulo: "Visualizar Detalhes do Edital",
      descricao: "Clique em qualquer edital para ver todos os detalhes, documentos necessários e informações importantes.",
      icon: <FileText className="w-8 h-8 text-accent" />,
      dica: "Na página de detalhes, você pode salvar o edital, ver o progresso e acessar o assistente IA"
    },
    {
      id: 4,
      titulo: "Salvar Editais Favoritos",
      descricao: "Clique no ícone de bookmark para salvar um edital. Seus editais salvos aparecerão no Dashboard.",
      icon: <BookmarkPlus className="w-8 h-8 text-accent" />,
      dica: "Editais salvos ficam organizados no seu Dashboard para acesso rápido"
    },
    {
      id: 5,
      titulo: "Acompanhar Progresso",
      descricao: "No Dashboard, você vê o progresso de preenchimento de cada edital com barras de progresso visuais.",
      icon: <Clock className="w-8 h-8 text-accent" />,
      dica: "Alertas vermelhos indicam prazos próximos (menos de 7 dias)"
    },
    {
      id: 6,
      titulo: "Usar o Assistente IA",
      descricao: "Na página de detalhes do edital, clique na aba 'Assistente IA' para obter sugestões inteligentes de preenchimento.",
      icon: <Sparkles className="w-8 h-8 text-accent" />,
      dica: "A IA analisa seu perfil e sugere preenchimentos automáticos baseados em seus dados"
    }
  ];

  const exemploBusca = [
    {
      titulo: "Buscar 'Paulo Gustavo'",
      resultado: "Encontrará todos os editais do programa Paulo Gustavo",
      passos: [
        "1. Clique na lupa de busca",
        "2. Digite 'Paulo Gustavo'",
        "3. Pressione Enter ou aguarde os resultados"
      ]
    },
    {
      titulo: "Filtrar por Instituto CÉU",
      resultado: "Mostrará apenas editais do Instituto CÉU",
      passos: [
        "1. Vá para a página de Editais",
        "2. Clique no filtro 'Órgão'",
        "3. Selecione 'Instituto CÉU'"
      ]
    },
    {
      titulo: "Buscar Editais em Macaé",
      resultado: "Encontrará oportunidades na cidade de Macaé, RJ",
      passos: [
        "1. Clique na lupa de busca",
        "2. Digite 'Macaé'",
        "3. Veja os resultados filtrados"
      ]
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/dashboard")}
            className="hover:bg-accent/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="font-display text-4xl font-bold text-foreground">
              Como Usar o DETAILS
            </h1>
            <p className="text-muted-foreground mt-2">
              Guia completo para encontrar e gerenciar seus editais
            </p>
          </div>
        </div>

        {/* Quick Start */}
        <Card className="p-8 border border-border bg-gradient-to-br from-accent/5 to-transparent">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground">
                Início Rápido
              </h2>
              <p className="text-muted-foreground mt-1">
                Comece em 3 passos simples
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <h3 className="font-semibold text-foreground">Ir para Editais</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Clique em "Editais" no menu lateral para ver todos os editais disponíveis
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <h3 className="font-semibold text-foreground">Buscar ou Filtrar</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Use a lupa para buscar por nome ou use os filtros para refinar sua busca
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <h3 className="font-semibold text-foreground">Salvar e Acompanhar</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Salve seus editais favoritos e acompanhe o progresso no Dashboard
              </p>
            </div>
          </div>
        </Card>

        {/* Tutorial Steps */}
        <div className="space-y-4">
          <h2 className="font-display text-2xl font-bold text-foreground">
            Guia Passo a Passo
          </h2>

          <div className="space-y-4">
            {tutorialSteps.map((step, index) => (
              <Card key={step.id} className="p-6 border border-border hover:border-accent/50 transition-colors">
                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    {step.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-lg text-foreground">
                        Passo {step.id}: {step.titulo}
                      </h3>
                    </div>
                    <p className="text-muted-foreground mb-3">
                      {step.descricao}
                    </p>
                    <div className="bg-accent/5 border border-accent/20 rounded-lg p-3">
                      <p className="text-sm text-foreground">
                        <span className="font-semibold">💡 Dica:</span> {step.dica}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Exemplos Práticos */}
        <div className="space-y-4">
          <h2 className="font-display text-2xl font-bold text-foreground">
            Exemplos Práticos
          </h2>

          <div className="space-y-4">
            {exemploBusca.map((exemplo, index) => (
              <Card key={index} className="p-6 border border-border">
                <h3 className="font-semibold text-lg text-foreground mb-2">
                  {exemplo.titulo}
                </h3>
                <p className="text-muted-foreground mb-4">
                  <span className="font-semibold">Resultado:</span> {exemplo.resultado}
                </p>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-foreground">Como fazer:</p>
                  {exemplo.passos.map((passo, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center text-xs font-semibold text-accent">
                        {i + 1}
                      </div>
                      <span>{passo}</span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Procurando o Paulo Gustavo */}
        <Card className="p-8 border-2 border-accent bg-accent/5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-accent" />
            </div>
            <div className="flex-1">
              <h3 className="font-display text-xl font-bold text-foreground mb-2">
                Procurando o Edital Paulo Gustavo para Macaé?
              </h3>
              <p className="text-muted-foreground mb-4">
                Siga estes passos para encontrá-lo rapidamente:
              </p>
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                  <span className="text-foreground">Clique em "Editais" no menu lateral</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                  <span className="text-foreground">Clique na lupa de busca e digite "Paulo Gustavo"</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                  <span className="text-foreground">Ou filtre por "Instituto CÉU" no campo de Órgão</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                  <span className="text-foreground">Clique no edital para ver todos os detalhes</span>
                </div>
              </div>
              <Button
                onClick={() => setLocation("/editais")}
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold flex items-center gap-2"
              >
                Ir para Editais
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* FAQ */}
        <div className="space-y-4">
          <h2 className="font-display text-2xl font-bold text-foreground">
            Perguntas Frequentes
          </h2>

          <div className="space-y-3">
            <Card className="p-4 border border-border">
              <h4 className="font-semibold text-foreground mb-2">
                Como salvo um edital?
              </h4>
              <p className="text-sm text-muted-foreground">
                Abra o edital e clique no botão "Salvar" no topo da página. O edital aparecerá no seu Dashboard.
              </p>
            </Card>

            <Card className="p-4 border border-border">
              <h4 className="font-semibold text-foreground mb-2">
                Como recebo alertas de prazos?
              </h4>
              <p className="text-sm text-muted-foreground">
                No Dashboard, você verá alertas em vermelho para editais com prazo próximo (menos de 7 dias).
              </p>
            </Card>

            <Card className="p-4 border border-border">
              <h4 className="font-semibold text-foreground mb-2">
                Como o Assistente IA me ajuda?
              </h4>
              <p className="text-sm text-muted-foreground">
                Na página de detalhes do edital, clique em "Assistente IA" para obter sugestões automáticas de preenchimento baseadas no seu perfil.
              </p>
            </Card>

            <Card className="p-4 border border-border">
              <h4 className="font-semibold text-foreground mb-2">
                Posso buscar por cidade?
              </h4>
              <p className="text-sm text-muted-foreground">
                Sim! Use a lupa de busca e digite o nome da cidade (ex: "Macaé") para encontrar editais locais.
              </p>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-4 pt-4">
          <Button
            onClick={() => setLocation("/dashboard")}
            variant="outline"
            className="flex-1"
          >
            Voltar ao Dashboard
          </Button>
          <Button
            onClick={() => setLocation("/editais")}
            className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
          >
            Ir para Editais
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
