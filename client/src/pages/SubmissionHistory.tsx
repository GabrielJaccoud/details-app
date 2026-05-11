import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Download, Edit2, Eye, Trash2, FileText } from "lucide-react";
import { toast } from "sonner";
import { exportFormToPDF } from "@/lib/pdfExport";
import DashboardLayout from "@/components/DashboardLayout";

interface FormSubmissionWithEdital {
  id: number;
  editalId: number;
  editalTitle: string;
  editalOrgan: string;
  editalDeadline: string;
  formData: Record<string, any>;
  status: "draft" | "submitted" | "completed";
  submittedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export default function SubmissionHistory() {
  const [, setLocation] = useLocation();
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmissionWithEdital | null>(
    null
  );
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editedData, setEditedData] = useState<Record<string, any>>({});

  // Mock data - em produção, viria do backend
  const submissions: FormSubmissionWithEdital[] = [
    {
      id: 1,
      editalId: 1,
      editalTitle: "Edital de Seleção para Pesquisador",
      editalOrgan: "CNPQ",
      editalDeadline: "15/06/2026",
      formData: {
        nome_completo: "João Silva Santos",
        email: "joao@example.com",
        cpf: "123.456.789-00",
        area_pesquisa: "Inteligência Artificial",
        experiencia_anos: "5",
      },
      status: "submitted",
      submittedAt: new Date("2026-05-10"),
      createdAt: new Date("2026-05-08"),
      updatedAt: new Date("2026-05-10"),
    },
    {
      id: 2,
      editalId: 2,
      editalTitle: "Paulo Gustavo - Cultura",
      editalOrgan: "Instituto CÉU",
      editalDeadline: "30/06/2026",
      formData: {
        nome_projeto: "Projeto Cultural Macaé",
        descricao: "Projeto de desenvolvimento cultural",
        orcamento: "R$ 50.000,00",
        beneficiarios: "500 pessoas",
      },
      status: "draft",
      submittedAt: null,
      createdAt: new Date("2026-05-09"),
      updatedAt: new Date("2026-05-09"),
    },
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      draft: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      submitted: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    };
    const labels = {
      draft: "Rascunho",
      submitted: "Enviado",
      completed: "Concluído",
    };
    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  const handleView = (submission: FormSubmissionWithEdital) => {
    setSelectedSubmission(submission);
    setIsViewOpen(true);
  };

  const handleEdit = (submission: FormSubmissionWithEdital) => {
    setSelectedSubmission(submission);
    setEditedData(submission.formData);
    setIsEditOpen(true);
  };

  const handleDownload = async (submission: FormSubmissionWithEdital) => {
    try {
      await exportFormToPDF({
        editalTitle: submission.editalTitle,
        editalOrgan: submission.editalOrgan,
        editalDeadline: submission.editalDeadline,
        submissionDate: new Date(submission.submittedAt || submission.updatedAt).toLocaleDateString(
          "pt-BR"
        ),
        formData: submission.formData,
      });
      toast.success("Formulário baixado com sucesso!");
    } catch (error) {
      toast.error("Erro ao baixar formulário");
      console.error(error);
    }
  };

  const handleSaveEdit = async () => {
    if (!selectedSubmission) return;
    try {
      // Aqui você chamaria uma mutação para atualizar o formulário
      toast.success("Formulário atualizado com sucesso!");
      setIsEditOpen(false);
    } catch (error) {
      toast.error("Erro ao atualizar formulário");
      console.error(error);
    }
  };

  const handleDelete = (submission: FormSubmissionWithEdital) => {
    if (confirm("Tem certeza que deseja deletar este formulário?")) {
      toast.success("Formulário deletado com sucesso!");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Histórico de Submissões</h1>
            <p className="text-muted-foreground mt-1">
              Visualize, edite e baixe seus formulários preenchidos anteriormente
            </p>
          </div>
          <Button
            onClick={() => setLocation("/editais")}
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            <FileText className="w-4 h-4 mr-2" />
            Novo Formulário
          </Button>
        </div>

        {/* Submissions Table */}
        {submissions.length > 0 ? (
          <Card className="border border-border overflow-hidden">
            <Table>
              <TableHeader className="bg-accent/5">
                <TableRow className="border-b border-border hover:bg-transparent">
                  <TableHead className="text-foreground font-semibold">Edital</TableHead>
                  <TableHead className="text-foreground font-semibold">Órgão</TableHead>
                  <TableHead className="text-foreground font-semibold">Status</TableHead>
                  <TableHead className="text-foreground font-semibold">Data</TableHead>
                  <TableHead className="text-right text-foreground font-semibold">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((submission) => (
                  <TableRow
                    key={submission.id}
                    className="border-b border-border hover:bg-accent/5 transition-colors"
                  >
                    <TableCell className="font-medium text-foreground">
                      {submission.editalTitle}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {submission.editalOrgan}
                    </TableCell>
                    <TableCell>{getStatusBadge(submission.status)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(submission.updatedAt).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          onClick={() => handleView(submission)}
                          variant="ghost"
                          size="sm"
                          title="Visualizar"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleEdit(submission)}
                          variant="ghost"
                          size="sm"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleDownload(submission)}
                          variant="ghost"
                          size="sm"
                          title="Baixar PDF"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleDelete(submission)}
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-600"
                          title="Deletar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        ) : (
          <Card className="p-12 text-center border border-border">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Nenhuma submissão</h3>
            <p className="text-muted-foreground mb-6">
              Você ainda não preencheu nenhum formulário. Comece agora!
            </p>
            <Button
              onClick={() => setLocation("/editais")}
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              Explorar Editais
            </Button>
          </Card>
        )}

        {/* View Dialog */}
        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedSubmission?.editalTitle}</DialogTitle>
            </DialogHeader>
            {selectedSubmission && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Órgão</p>
                    <p className="font-medium text-foreground">{selectedSubmission.editalOrgan}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <div className="mt-1">{getStatusBadge(selectedSubmission.status)}</div>
                  </div>
                </div>
                <div className="border-t border-border pt-4">
                  <h4 className="font-semibold text-foreground mb-3">Dados do Formulário</h4>
                  <div className="space-y-3">
                    {Object.entries(selectedSubmission.formData).map(([key, value]) => (
                      <div key={key} className="p-3 bg-accent/5 rounded-lg border border-border">
                        <p className="text-sm text-muted-foreground capitalize">
                          {key.replace(/_/g, " ")}
                        </p>
                        <p className="font-medium text-foreground mt-1">
                          {typeof value === "object" ? JSON.stringify(value) : String(value)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar Formulário</DialogTitle>
            </DialogHeader>
            {selectedSubmission && (
              <div className="space-y-4">
                <div className="space-y-3">
                  {Object.entries(editedData).map(([key, value]) => (
                    <div key={key}>
                      <label className="text-sm font-medium text-foreground capitalize">
                        {key.replace(/_/g, " ")}
                      </label>
                      <input
                        type="text"
                        value={String(value)}
                        onChange={(e) =>
                          setEditedData((prev) => ({
                            ...prev,
                            [key]: e.target.value,
                          }))
                        }
                        className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 pt-4 border-t border-border">
                  <Button
                    onClick={() => setIsEditOpen(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleSaveEdit}
                    className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
                  >
                    Salvar Alterações
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
