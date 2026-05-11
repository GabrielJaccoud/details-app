import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, CheckCircle2, AlertTriangle } from "lucide-react";

interface FormFieldWithIndicatorProps {
  fieldName: string;
  value: string;
  confidence?: number;
  isExtracted?: boolean;
  onChange: (value: string) => void;
  isTextArea?: boolean;
  placeholder?: string;
}

export function FormFieldWithIndicator({
  fieldName,
  value,
  confidence = 100,
  isExtracted = false,
  onChange,
  isTextArea = false,
  placeholder,
}: FormFieldWithIndicatorProps) {
  const getConfidenceColor = (conf: number) => {
    if (conf >= 90) return "border-green-500 bg-green-50 dark:bg-green-950";
    if (conf >= 70) return "border-blue-500 bg-blue-50 dark:bg-blue-950";
    if (conf >= 50) return "border-yellow-500 bg-yellow-50 dark:bg-yellow-950";
    return "border-red-500 bg-red-50 dark:bg-red-950";
  };

  const getConfidenceIcon = (conf: number) => {
    if (conf >= 90) return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    if (conf >= 70) return <CheckCircle2 className="w-4 h-4 text-blue-500" />;
    if (conf >= 50) return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    return <AlertCircle className="w-4 h-4 text-red-500" />;
  };

  const getConfidenceLabel = (conf: number) => {
    if (conf >= 90) return "Muito confiável";
    if (conf >= 70) return "Confiável";
    if (conf >= 50) return "Moderado";
    return "Baixa confiança";
  };

  const borderClass = isExtracted ? getConfidenceColor(confidence) : "border-border";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground capitalize">
          {fieldName.replace(/_/g, " ")}
        </label>
        {isExtracted && (
          <div className="flex items-center gap-1">
            {getConfidenceIcon(confidence)}
            <span className="text-xs text-muted-foreground">
              {getConfidenceLabel(confidence)} ({confidence}%)
            </span>
          </div>
        )}
      </div>

      {isTextArea ? (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`min-h-24 bg-background border-2 text-foreground transition-colors ${borderClass}`}
          placeholder={placeholder || "Edite o valor aqui"}
        />
      ) : (
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`bg-background border-2 text-foreground transition-colors ${borderClass}`}
          placeholder={placeholder || "Edite o valor aqui"}
        />
      )}

      {isExtracted && confidence < 70 && (
        <p className="text-xs text-yellow-600 dark:text-yellow-400">
          ⚠️ Revise este campo com atenção. A confiança da extração é baixa.
        </p>
      )}
    </div>
  );
}
