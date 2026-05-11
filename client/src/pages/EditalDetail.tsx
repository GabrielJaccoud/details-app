import { useLocation, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardLayout from "@/components/DashboardLayout";
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Download,
  FileText,
  CheckCircle2,
  Circle,
  AlertCircle,
  Calendar,
  DollarSign,
  Building2,
  MapPin,
  Sparkles
} from "lucide-react";
import { useState } from "react";
import { AIChatBox } from "@/components/AIChatBox";
import { DocumentUpload, DocumentList } from "@/components/DocumentUpload";
import { AutoFillForm } from "@/components/AutoFillForm";

export default function EditalDetail() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/editais/:id");
  const [salvo, setSalvo] = useState(false);
  const [progresso, setProgresso] = useState(75);
  const [selectedDocuments, setSelectedDocuments] = useState<number[]>([]);

  // Mock data - será substituído por dados reais do backend
  const edital = {
    id: params?.id,
    titulo: "Edital de Seleção para Pesquisador Sênior",
    orgao: "CNPQ",
    area: "Ciências Exatas",
    prazo: "2026-06-15",
    valor: "R$ 50.000 - R$ 100.000",
    descricao: "Seleção de pesquisadores para bolsas de produtividade em pesquisa",
    conteudo: `
      Este edital visa selecionar pesquisadores sênior para concessão de bolsas de produtividade em pesquisa.
      
      OBJETIVOS:
      - Apoiar pesquisadores em atividades de pesquisa científica
      - Fortalecer grupos de pesquisa consolidados
      - Promover a excelência em pesquisa
      
      REQUISITOS:
      - Doutorado concluído
      - Mínimo 5 anos de experiência em pesquisa
      - Produções científicas relevantes
      - Afiliação institucional
      
      DOCUMENTOS NECESSÁRIOS:
      - Currículo Lattes atualizado
      - Comprovante de titulação
      - Plano de trabalho
      - Cartas de recomendação (2)
      - Comprovante de filiação institucional
    `,
    documentosNecessarios: [
      { id: 1, nome: "Currículo Lattes", obrigatorio: true, enviado: true },
      { id: 2, nome: "Comprovante de Titulação", obrigatorio: true, enviado: true },
      { id: 3, nome: "Plano de Trabalho", obrigatorio: true, enviado: false },
      { id: 4, nome: "Carta de Recomendação 1", obrigatorio: true, enviado: false },
      { id: 5, nome: "Carta de Recomendação 2", obrigatorio: true, enviado: false },
      { id: 6, nome: "Comprovante de Filiação", obrigatorio: true, enviado: true }
    ]
  };

  const diasParaVencer = (dataVencimento: string) => {
    const hoje = new Date();
    const vencimento = new Date(dataVencimento);
    const diferenca = Math.ceil((vencimento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
    return diferenca;
  };

  const diasRestantes = diasParaVencer(edital.prazo);
  const urgente = diasRestantes <= 7;
  const documentosEnviados = edital.documentosNecessarios.filter(d => d.enviado).length;
  const documentosTotal = edital.documentosNecessarios.length;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header com Voltar */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/editais")}
            className="hover:bg-accent/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="font-display text-4xl font-bold text-foreground">
              {edital.titulo}
            </h1>
            <p className="text-muted-foreground mt-2">{edital.orgao} • {edital.area}</p>
          </div>
          <Button
            onClick={() => setSalvo(!salvo)}
            variant="outline"
            className={`flex items-center gap-2 ${salvo ? "bg-accent/10 border-accent text-accent" : ""}`}
          >
            {salvo ? (
              <>
                <BookmarkCheck className="w-5 h-5" />
                Salvo
              </>
            ) : (
              <>
                <Bookmark className="w-5 h-5" />
                Salvar
              </>
            )}
          </Button>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 border border-border">
            <div className="flex items-center gap-3">
              <Calendar className={`w-5 h-5 ${urgente ? "text-red-500" : "text-muted-foreground"}`} />
              <div>
                <p className="text-xs text-muted-foreground">Prazo</p>
                <p className={`text-sm font-semibold ${urgente ? "text-red-600" : "text-foreground"}`}>
                  {diasRestantes} dias
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 border border-border">
            <div className="flex items-center gap-3">
              <DollarSign className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Valor</p>
                <p className="text-sm font-semibold text-foreground">{edital.valor}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 border border-border">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Documentos</p>
                <p className="text-sm font-semibold text-foreground">
                  {documentosEnviados}/{documentosTotal}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 border border-border">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Progresso</p>
                <p className="text-sm font-semibold text-foreground">{progresso}%</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="detalhes" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-muted">
            <TabsTrigger value="detalhes">Detalhes</TabsTrigger>
            <TabsTrigger value="documentos">Documentos</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="assistente">Assistente IA</TabsTrigger>
          </TabsList>

          {/* Detalhes Tab */}
          <TabsContent value="detalhes" className="space-y-6">
            <Card className="p-8 border border-border">
              <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                Descrição do Edital
              </h2>
              <div className="prose prose-sm max-w-none text-foreground">
                <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
                  {edital.conteudo}
                </p>
              </div>
            </Card>

            {/* Progress Section */}
            <Card className="p-8 border border-border">
              <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                Progresso de Preenchimento
              </h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-foreground">Conclusão Geral</span>
                    <span className="text-sm font-semibold text-accent">{progresso}%</span>
                  </div>
                  <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent transition-all duration-300"
                      style={{ width: `${progresso}%` }}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Documentos Tab */}
          <TabsContent value="documentos" className="space-y-6">
            <Card className="p-8 border border-border">
              <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                Documentos Vinculados
              </h2>
              <DocumentList editalId={parseInt(params?.id || "0")} />
            </Card>

            <Card className="p-8 border border-border">
              <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                Checklist de Documentos
              </h2>
              <div className="space-y-3">
                {edital.documentosNecessarios.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center gap-4 p-4 rounded-lg border border-border hover:border-accent/50 transition-colors group"
                  >
                    <div className="flex-shrink-0">
                      {doc.enviado ? (
                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                      ) : (
                        <Circle className="w-6 h-6 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${doc.enviado ? "text-foreground line-through opacity-60" : "text-foreground"}`}>
                        {doc.nome}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {doc.obrigatorio ? "Obrigatório" : "Opcional"}
                      </p>
                    </div>
                    {doc.enviado ? (
                      <div className="text-xs font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                        Enviado
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-accent hover:bg-accent/10 group-hover:border-accent"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Enviar
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Upload Tab */}
          <TabsContent value="upload" className="space-y-6">
            <Card className="p-8 border border-border">
              <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                Enviar Novo Documento
              </h2>
              <DocumentUpload documentType="other" />
            </Card>

            <Card className="p-8 border border-border">
              <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                Preencher Formulário Automaticamente
              </h2>
              <AutoFillForm 
                editalId={parseInt(params?.id || "0")} 
                documentIds={selectedDocuments}
              />
            </Card>
          </TabsContent>

          {/* Assistente IA Tab */}
          <TabsContent value="assistente" className="space-y-6">
            <div className="h-[600px]">
              <AIChatBox
                messages={[
                  {
                    role: "system",
                    content: `Você é um assistente especializado em editais e oportunidades de financiamento. Você está ajudando o usuário com o edital: ${edital.titulo}. Órgão: ${edital.orgao}. Área: ${edital.area}. Prazo: ${edital.prazo}. Valor: ${edital.valor}. Forneça análises detalhadas, sugestões práticas e orientações claras.`
                  }
                ]}
                onSendMessage={(message: any) => {
                  console.log("Mensagem enviada:", message);
                }}
                placeholder="Faça perguntas sobre este edital..."
                emptyStateMessage="Olá! Sou seu assistente de IA. Posso ajudar você com dúvidas sobre este edital."
                suggestedPrompts={[
                  "Quais são os requisitos principais?",
                  "Como preencher o formulário?",
                  "Quais documentos preciso?",
                  "Sou elegível para este edital?"
                ]}
              />
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <Button
            onClick={() => setLocation("/editais")}
            variant="outline"
            className="flex-1"
          >
            Voltar
          </Button>
          <Button className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
            Continuar Preenchimento
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
