import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle, Zap, CheckCircle2, Download } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { AnalysisProgress, type AnalysisStep } from "@/components/AnalysisProgress";
import { FormFieldWithIndicator } from "@/components/FormFieldWithIndicator";
import { FieldTooltip } from "@/components/FieldTooltip";
import { exportFormToPDF } from "@/lib/pdfExport";

interface AutoFillFormProps {
  editalId: number;
  editalTitle?: string;
  editalOrgan?: string;
  editalDeadline?: string;
  documentIds: number[];
  onFormCreated?: (submissionId: number) => void;
}

interface ExtractedField {
  value: string;
  confidence: number;
  isExtracted: boolean;
  sourceText?: string;
  sourcePageNumber?: number;
}

export function AutoFillForm({
  editalId,
  editalTitle = "Edital",
  editalOrgan = "Órgão",
  editalDeadline = "N/A",
  documentIds,
  onFormCreated,
}: AutoFillFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<AnalysisStep>("extracting");
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const [formData, setFormData] = useState<Record<string, ExtractedField>>({});
  const [submissionId, setSubmissionId] = useState<number | null>(null);

  const createFormMutation = trpc.forms.createFormSubmission.useMutation();
  const autoFillMutation = trpc.forms.autoFillForm.useMutation();
  const updateFormMutation = trpc.forms.updateFormSubmission.useMutation();

  const handleAutoFill = async () => {
    if (documentIds.length === 0) {
      toast.error("Selecione pelo menos um documento");
      return;
    }

    setIsLoading(true);
    setAnalysisStep("extracting");
    setProgress(10);
    setStatusMessage("Iniciando análise dos documentos...");

    try {
      // Criar formulário se não existir
      let formId = submissionId;
      if (!formId) {
        setStatusMessage("Criando formulário...");
        setProgress(20);
        const createResult = await createFormMutation.mutateAsync({
          editalId,
        });
        formId = createResult.submissionId;
        setSubmissionId(formId);
      }

      // Preencher automaticamente
      if (formId) {
        setAnalysisStep("processing");
        setProgress(40);
        setStatusMessage("Processando dados extraídos...");

        const result = await autoFillMutation.mutateAsync({
          submissionId: formId,
          documentIds,
        });

        // Transformar dados para o formato esperado
        const transformedData: Record<string, ExtractedField> = {};
        for (const [key, value] of Object.entries(result.formData)) {
          if (typeof value === "object" && value !== null && "value" in value) {
            transformedData[key] = value as ExtractedField;
          } else {
            transformedData[key] = {
              value: String(value),
              confidence: 100,
              isExtracted: true,
            };
          }
        }

        setAnalysisStep("validating");
        setProgress(80);
        setStatusMessage("Validando campos...");

        setFormData(transformedData);

        setAnalysisStep("completed");
        setProgress(100);
        setStatusMessage("Análise concluída com sucesso!");

        toast.success(`${result.filledFields} campos preenchidos automaticamente!`);
        onFormCreated?.(formId);

        // Auto-hide progress after 2 seconds
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
      }
    } catch (error) {
      setAnalysisStep("error");
      setStatusMessage("Erro ao preencher formulário automaticamente");
      toast.error("Erro ao preencher formulário automaticamente");
      console.error(error);
      setIsLoading(false);
    }
  };

  const handleFieldChange = (fieldName: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        value,
      },
    }));
  };

  const handleSave = async () => {
    if (!submissionId) return;

    setIsLoading(true);
    try {
      const dataToSave: Record<string, any> = {};
      for (const [key, field] of Object.entries(formData)) {
        dataToSave[key] = field.value;
      }

      await updateFormMutation.mutateAsync({
        submissionId,
        formData: dataToSave,
        status: "draft",
      });
      toast.success("Formulário salvo com sucesso");
    } catch (error) {
      toast.error("Erro ao salvar formulário");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!submissionId) return;

    setIsLoading(true);
    try {
      const dataToSave: Record<string, any> = {};
      for (const [key, field] of Object.entries(formData)) {
        dataToSave[key] = field.value;
      }

      await updateFormMutation.mutateAsync({
        submissionId,
        formData: dataToSave,
        status: "submitted",
      });
      toast.success("Formulário enviado com sucesso");
    } catch (error) {
      toast.error("Erro ao enviar formulário");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportPDF = async () => {
    try {
      const dataToExport: Record<string, any> = {};
      for (const [key, field] of Object.entries(formData)) {
        dataToExport[key] = field.value;
      }

      await exportFormToPDF({
        editalTitle,
        editalOrgan,
        editalDeadline,
        submissionDate: new Date().toLocaleDateString("pt-BR"),
        formData: dataToExport,
      });

      toast.success("Formulário exportado em PDF com sucesso!");
    } catch (error) {
      toast.error("Erro ao exportar formulário em PDF");
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <AnalysisProgress
        isActive={isLoading}
        currentStep={analysisStep}
        progress={progress}
        message={statusMessage}
        fieldsProcessed={Object.keys(formData).length}
        totalFields={documentIds.length * 5} // Estimativa
      />

      {/* Auto-fill Button */}
      {!submissionId && !isLoading && (
        <Card className="p-6 border border-border bg-accent/5">
          <div className="flex items-start gap-4">
            <Zap className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-2">
                Preencher Automaticamente
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Use a IA para preencher automaticamente os campos do formulário com base nos
                documentos que você enviou. Isso economizará tempo e reduzirá erros.
              </p>
              <Button
                onClick={handleAutoFill}
                disabled={isLoading || documentIds.length === 0}
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
              >
                <Zap className="w-4 h-4 mr-2" />
                Preencher com IA
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Form Fields */}
      {submissionId && Object.keys(formData).length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <p className="text-sm font-medium text-foreground">
                {Object.keys(formData).length} campos preenchidos
              </p>
            </div>
            <Button
              onClick={handleExportPDF}
              disabled={isLoading}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Exportar PDF
            </Button>
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(formData).map(([fieldName, fieldData]) => (
              <FieldTooltip
                key={fieldName}
                sourceText={fieldData.sourceText}
                sourcePageNumber={fieldData.sourcePageNumber}
                confidence={fieldData.confidence}
              >
                <FormFieldWithIndicator
                  fieldName={fieldName}
                  value={fieldData.value}
                  confidence={fieldData.confidence}
                  isExtracted={fieldData.isExtracted}
                  onChange={(value) => handleFieldChange(fieldName, value)}
                  isTextArea={fieldData.value.length > 100}
                  placeholder="Edite o valor aqui"
                />
              </FieldTooltip>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-border">
            <Button
              onClick={handleSave}
              disabled={isLoading}
              variant="outline"
              className="flex-1"
            >
              Salvar Rascunho
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
            >
              Enviar Formulário
            </Button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!submissionId && !isLoading && documentIds.length === 0 && (
        <Card className="p-6 border border-border text-center">
          <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            Envie documentos na aba "Upload" para usar o preenchimento automático
          </p>
        </Card>
      )}
    </div>
  );
}
