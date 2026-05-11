import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Clock, Zap } from "lucide-react";

export type AnalysisStep = "extracting" | "processing" | "validating" | "completed" | "error";

interface AnalysisProgressProps {
  isActive: boolean;
  currentStep: AnalysisStep;
  progress: number;
  message: string;
  fieldsProcessed?: number;
  totalFields?: number;
}

const stepConfig = {
  extracting: {
    label: "Extraindo dados dos documentos",
    icon: Zap,
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  processing: {
    label: "Processando informações",
    icon: Clock,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  validating: {
    label: "Validando campos",
    icon: AlertCircle,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  completed: {
    label: "Análise concluída",
    icon: CheckCircle2,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  error: {
    label: "Erro na análise",
    icon: AlertCircle,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
};

export function AnalysisProgress({
  isActive,
  currentStep,
  progress,
  message,
  fieldsProcessed = 0,
  totalFields = 0,
}: AnalysisProgressProps) {
  const [displayProgress, setDisplayProgress] = useState(0);
  const config = stepConfig[currentStep];
  const Icon = config.icon;

  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => {
        setDisplayProgress(Math.min(progress, 100));
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [progress, isActive]);

  if (!isActive) return null;

  return (
    <Card className={`p-6 border border-border ${config.bgColor}`}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Icon className={`w-5 h-5 ${config.color} flex-shrink-0`} />
          <div className="flex-1">
            <h3 className={`font-semibold ${config.color}`}>{config.label}</h3>
            <p className="text-sm text-muted-foreground mt-1">{message}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={displayProgress} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{displayProgress}%</span>
            {totalFields > 0 && (
              <span>
                {fieldsProcessed}/{totalFields} campos
              </span>
            )}
          </div>
        </div>

        {/* Status Message */}
        {currentStep === "completed" && (
          <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <p className="text-sm text-green-700 dark:text-green-300">
              ✓ Formulário preenchido com sucesso! Você pode editar os campos abaixo.
            </p>
          </div>
        )}

        {currentStep === "error" && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-sm text-red-700 dark:text-red-300">{message}</p>
          </div>
        )}
      </div>
    </Card>
  );
}
