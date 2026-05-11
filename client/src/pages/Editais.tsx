import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import DashboardLayout from "@/components/DashboardLayout";
import { Search, Filter, MapPin, DollarSign, Calendar, Building2, ChevronRight } from "lucide-react";

export default function Editais() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [filtros, setFiltros] = useState({
    area: "",
    prazo: "",
    valor: "",
    orgao: ""
  });

  // Mock data - será substituído por dados reais do backend
  const editais = [
    {
      id: 1,
      titulo: "Edital de Seleção para Pesquisador Sênior",
      orgao: "CNPQ",
      area: "Ciências Exatas",
      prazo: "2026-06-15",
      valor: "R$ 50.000 - R$ 100.000",
      descricao: "Seleção de pesquisadores para bolsas de produtividade em pesquisa",
      salvo: false
    },
    {
      id: 2,
      titulo: "Chamada Pública para Projetos de Inovação",
      orgao: "FINEP",
      area: "Tecnologia",
      prazo: "2026-07-30",
      valor: "R$ 100.000 - R$ 500.000",
      descricao: "Financiamento de projetos inovadores em tecnologia e inovação",
      salvo: false
    },
    {
      id: 3,
      titulo: "Seleção de Bolsistas de Pós-Doutorado",
      orgao: "CAPES",
      area: "Educação",
      prazo: "2026-05-20",
      valor: "R$ 30.000 - R$ 60.000",
      descricao: "Bolsas de pós-doutorado para pesquisadores brasileiros",
      salvo: true
    },
    {
      id: 4,
      titulo: "Edital para Pesquisa em Saúde Pública",
      orgao: "FAPESP",
      area: "Saúde",
      prazo: "2026-08-10",
      valor: "R$ 200.000 - R$ 800.000",
      descricao: "Financiamento para pesquisa em saúde pública e epidemiologia",
      salvo: false
    },
    {
      id: 5,
      titulo: "Chamada para Pesquisa em Sustentabilidade",
      orgao: "CNPq",
      area: "Meio Ambiente",
      prazo: "2026-06-30",
      valor: "R$ 80.000 - R$ 300.000",
      descricao: "Projetos de pesquisa em sustentabilidade ambiental",
      salvo: false
    },
    {
      id: 6,
      titulo: "Edital Paulo Gustavo - Cultura",
      orgao: "Instituto CÉU",
      area: "Cultura",
      prazo: "2026-07-15",
      valor: "R$ 10.000 - R$ 50.000",
      descricao: "Edital Paulo Gustavo para apoio a projetos culturais em Macaé, RJ. Programa de financiamento de ações culturais em municípios brasileiros.",
      salvo: false,
      cidade: "Macaé",
      estado: "RJ"
    }
  ];

  const editaisFiltrados = editais.filter(edital => {
    const matchSearch = edital.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       edital.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    const matchArea = !filtros.area || edital.area === filtros.area;
    const matchOrgao = !filtros.orgao || edital.orgao === filtros.orgao;
    
    return matchSearch && matchArea && matchOrgao;
  });

  const areas = ["Ciências Exatas", "Tecnologia", "Educação", "Saúde", "Meio Ambiente", "Cultura"];
  const orgaos = ["CNPQ", "FINEP", "CAPES", "FAPESP", "Instituto CÉU"];

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
        <div>
          <h1 className="font-display text-4xl font-bold text-foreground">
            Explorar Editais
          </h1>
          <p className="text-muted-foreground mt-2">
            Encontre oportunidades de financiamento e bolsas
          </p>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          {/* Search Bar - Highlighted */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-accent/10 rounded-lg blur-sm group-hover:blur-md transition-all" />
            <div className="relative flex items-center gap-3 bg-card border-2 border-accent/50 rounded-lg px-4 py-3 hover:border-accent transition-colors">
              <Search className="w-6 h-6 text-accent flex-shrink-0" />
              <Input
                placeholder="🔍 Buscar editais... (ex: Paulo Gustavo, Macaé, Instituto CÉU)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-0 bg-transparent text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-0 text-base"
              />
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-accent" />
              <span className="text-sm font-semibold text-foreground">Filtrar por:</span>
            </div>

            {/* Area Filter */}
            <select
              value={filtros.area}
              onChange={(e) => setFiltros({ ...filtros, area: e.target.value })}
              className="px-3 py-2 rounded-lg border border-border bg-card text-foreground text-sm hover:border-accent/50 transition-colors cursor-pointer font-medium"
            >
              <option value="">📚 Todas as Áreas</option>
              {areas.map(area => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>

            {/* Orgao Filter */}
            <select
              value={filtros.orgao}
              onChange={(e) => setFiltros({ ...filtros, orgao: e.target.value })}
              className="px-3 py-2 rounded-lg border border-border bg-card text-foreground text-sm hover:border-accent/50 transition-colors cursor-pointer font-medium"
            >
              <option value="">🏛️ Todos os Órgãos</option>
              {orgaos.map(orgao => (
                <option key={orgao} value={orgao}>{orgao}</option>
              ))}
            </select>

            {/* Clear Filters */}
            {(filtros.area || filtros.orgao || searchTerm) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm("");
                  setFiltros({ area: "", prazo: "", valor: "", orgao: "" });
                }}
                className="text-accent hover:bg-accent/10"
              >
                Limpar Filtros
              </Button>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {editaisFiltrados.length} edital{editaisFiltrados.length !== 1 ? "is" : ""} encontrado{editaisFiltrados.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Editais Grid */}
        <div className="space-y-4">
          {editaisFiltrados.length > 0 ? (
            editaisFiltrados.map(edital => {
              const diasRestantes = diasParaVencer(edital.prazo);
              const urgente = diasRestantes <= 7;

              return (
                <Card
                  key={edital.id}
                  className="p-6 border border-border hover:border-accent/50 hover:shadow-lg transition-all cursor-pointer group"
                  onClick={() => setLocation(`/editais/${edital.id}`)}
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg text-foreground group-hover:text-accent transition-colors line-clamp-2">
                          {edital.titulo}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {edital.descricao}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {edital.salvo && (
                          <div className="px-3 py-1 rounded-full bg-accent/10 border border-accent/50">
                            <span className="text-xs font-semibold text-accent">Salvo</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {/* Orgao */}
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs text-muted-foreground">Órgão</p>
                          <p className="text-sm font-medium text-foreground truncate">{edital.orgao}</p>
                        </div>
                      </div>

                      {/* Area */}
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs text-muted-foreground">Área</p>
                          <p className="text-sm font-medium text-foreground truncate">{edital.area}</p>
                        </div>
                      </div>

                      {/* Valor */}
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs text-muted-foreground">Valor</p>
                          <p className="text-sm font-medium text-foreground truncate">{edital.valor}</p>
                        </div>
                      </div>

                      {/* Prazo */}
                      <div className="flex items-center gap-2">
                        <Calendar className={`w-4 h-4 flex-shrink-0 ${urgente ? "text-red-500" : "text-muted-foreground"}`} />
                        <div className="min-w-0">
                          <p className="text-xs text-muted-foreground">Prazo</p>
                          <p className={`text-sm font-medium truncate ${urgente ? "text-red-600" : "text-foreground"}`}>
                            {diasRestantes} dias
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <p className="text-xs text-muted-foreground">
                        Vence em {new Date(edital.prazo).toLocaleDateString("pt-BR")}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-accent hover:bg-accent/10 group-hover:translate-x-1 transition-transform"
                        onClick={(e) => {
                          e.stopPropagation();
                          setLocation(`/editais/${edital.id}`);
                        }}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })
          ) : (
            <Card className="p-12 border-2 border-dashed border-border text-center">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="font-semibold text-foreground mb-2">Nenhum edital encontrado</h3>
              <p className="text-muted-foreground">
                Tente ajustar seus filtros ou termos de busca
              </p>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
