import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import DashboardLayout from "@/components/DashboardLayout";
import { useLocation } from "wouter";
import { FileText, Clock, AlertCircle, CheckCircle2, Plus } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  // Mock data - será substituído por dados reais do backend
  const editaisSalvos = [
    {
      id: 1,
      titulo: "Edital de Seleção para Pesquisador",
      orgao: "CNPQ",
      prazo: "2026-06-15",
      progresso: 75,
      status: "em_progresso"
    },
    {
      id: 2,
      titulo: "Chamada Pública para Inovação",
      orgao: "FINEP",
      prazo: "2026-07-30",
      progresso: 30,
      status: "em_progresso"
    },
    {
      id: 3,
      titulo: "Seleção de Bolsistas",
      orgao: "CAPES",
      prazo: "2026-05-20",
      progresso: 100,
      status: "concluido"
    }
  ];

  const alertas = [
    {
      id: 1,
      tipo: "prazo",
      mensagem: "Edital CNPQ vence em 10 dias",
      urgencia: "alta"
    },
    {
      id: 2,
      tipo: "documento",
      mensagem: "Documento de identidade expirado",
      urgencia: "media"
    }
  ];

  const stats = [
    {
      label: "Editais Salvos",
      valor: "3",
      icon: <FileText className="w-6 h-6" />,
      cor: "accent"
    },
    {
      label: "Em Progresso",
      valor: "2",
      icon: <Clock className="w-6 h-6" />,
      cor: "accent"
    },
    {
      label: "Concluídos",
      valor: "1",
      icon: <CheckCircle2 className="w-6 h-6" />,
      cor: "accent"
    },
    {
      label: "Alertas",
      valor: "2",
      icon: <AlertCircle className="w-6 h-6" />,
      cor: "destructive"
    }
  ];

  const diasParaVencer = (dataVencimento: string) => {
    const hoje = new Date();
    const vencimento = new Date(dataVencimento);
    const diferenca = Math.ceil((vencimento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
    return diferenca;
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="font-display text-4xl font-bold text-foreground">
              Bem-vindo, {user?.name || "Usuário"}
            </h1>
            <p className="text-muted-foreground mt-2">
              Gerencie seus editais e acompanhe o progresso de preenchimento
            </p>
          </div>
          <Button
            onClick={() => setLocation("/editais")}
            className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Buscar Editais
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6 border border-border hover:border-accent/50 transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
                  <p className="text-3xl font-bold text-foreground">{stat.valor}</p>
                </div>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center text-accent">
                  {stat.icon}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Alerts Section */}
        {alertas.length > 0 && (
          <div className="space-y-4">
            <h2 className="font-display text-2xl font-bold text-foreground">Alertas Importantes</h2>
            <div className="space-y-3">
              {alertas.map((alerta) => (
                <Card
                  key={alerta.id}
                  className={`p-4 border-l-4 ${
                    alerta.urgencia === "alta" ? "border-l-red-500 bg-red-50/50" : "border-l-yellow-500 bg-yellow-50/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <AlertCircle className={`w-5 h-5 ${alerta.urgencia === "alta" ? "text-red-500" : "text-yellow-500"}`} />
                    <p className="text-foreground font-medium">{alerta.mensagem}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Editais Salvos */}
        <div className="space-y-4">
          <h2 className="font-display text-2xl font-bold text-foreground">Meus Editais</h2>
          <div className="space-y-4">
            {editaisSalvos.map((edital) => {
              const diasRestantes = diasParaVencer(edital.prazo);
              const urgente = diasRestantes <= 7;

              return (
                <Card
                  key={edital.id}
                  className="p-6 border border-border hover:border-accent/50 hover:shadow-md transition-all cursor-pointer group"
                  onClick={() => setLocation(`/editais/${edital.id}`)}
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-foreground group-hover:text-accent transition-colors">
                          {edital.titulo}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">{edital.orgao}</p>
                      </div>
                      {edital.status === "concluido" ? (
                        <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          <span className="text-xs font-semibold text-green-600">Concluído</span>
                        </div>
                      ) : (
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${urgente ? "bg-red-50" : "bg-yellow-50"}`}>
                          <Clock className={`w-4 h-4 ${urgente ? "text-red-600" : "text-yellow-600"}`} />
                          <span className={`text-xs font-semibold ${urgente ? "text-red-600" : "text-yellow-600"}`}>
                            {diasRestantes} dias
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Progresso de Preenchimento</span>
                        <span className="text-xs font-semibold text-foreground">{edital.progresso}%</span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-accent transition-all duration-300"
                          style={{ width: `${edital.progresso}%` }}
                        />
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-2">
                      <p className="text-xs text-muted-foreground">
                        Prazo: {new Date(edital.prazo).toLocaleDateString("pt-BR")}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-accent hover:bg-accent/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          setLocation(`/editais/${edital.id}`);
                        }}
                      >
                        Continuar →
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Empty State */}
        {editaisSalvos.length === 0 && (
          <Card className="p-12 border-2 border-dashed border-border text-center">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="font-semibold text-foreground mb-2">Nenhum edital salvo</h3>
            <p className="text-muted-foreground mb-6">
              Comece a buscar editais para adicionar à sua lista
            </p>
            <Button
              onClick={() => setLocation("/editais")}
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              Buscar Editais
            </Button>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
