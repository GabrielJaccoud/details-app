import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface AutoFillIndicatorProps {
  isAutoFilled: boolean;
  confidence?: number;
  source?: string;
  fieldName?: string;
}

export function AutoFillIndicator({
  isAutoFilled,
  confidence = 100,
  source = "Perfil do usuário",
  fieldName,
}: AutoFillIndicatorProps) {
  if (!isAutoFilled) return null;

  const getConfidenceColor = () => {
    if (confidence >= 90) return "text-green-500";
    if (confidence >= 70) return "text-blue-500";
    if (confidence >= 50) return "text-yellow-500";
    return "text-red-500";
  };

  const getConfidenceLabel = () => {
    if (confidence >= 90) return "Alta confiança";
    if (confidence >= 70) return "Média confiança";
    if (confidence >= 50) return "Baixa confiança";
    return "Verificar";
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.2 }}
        className="flex items-center gap-2"
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className={`${getConfidenceColor()}`}
            >
              {confidence >= 70 ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : confidence >= 50 ? (
                <AlertCircle className="w-5 h-5" />
              ) : (
                <Info className="w-5 h-5" />
              )}
            </motion.div>
          </TooltipTrigger>
          <TooltipContent side="right" className="max-w-xs">
            <div className="space-y-2">
              <p className="font-semibold">
                {fieldName ? `Campo: ${fieldName}` : "Auto-preenchido"}
              </p>
              <p className="text-sm">
                Fonte: <span className="font-medium">{source}</span>
              </p>
              <p className="text-sm">
                Confiança: <span className="font-medium">{confidence}%</span>
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                {getConfidenceLabel()}
              </p>
            </div>
          </TooltipContent>
        </Tooltip>
      </motion.div>
    </AnimatePresence>
  );
}

interface AutoFillBannerProps {
  fieldsCount: number;
  onDismiss?: () => void;
}

export function AutoFillBanner({ fieldsCount, onDismiss }: AutoFillBannerProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="bg-gradient-to-r from-gold-50 to-gold-100 border border-gold-300 rounded-lg p-4 mb-6 flex items-start justify-between"
      >
        <div className="flex items-start gap-3">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <CheckCircle2 className="w-5 h-5 text-gold-600 mt-0.5 flex-shrink-0" />
          </motion.div>
          <div>
            <p className="font-semibold text-gold-900">
              ✨ Formulário pré-preenchido com seus dados!
            </p>
            <p className="text-sm text-gold-700 mt-1">
              {fieldsCount} campo{fieldsCount !== 1 ? "s" : ""} foram preenchido{fieldsCount !== 1 ? "s" : ""} automaticamente com as informações do seu perfil. Revise e ajuste conforme necessário.
            </p>
          </div>
        </div>
        {onDismiss && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onDismiss}
            className="text-gold-600 hover:text-gold-900 flex-shrink-0 ml-4"
          >
            ✕
          </motion.button>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

interface FieldWithAutoFillProps {
  label: string;
  value: string;
  isAutoFilled: boolean;
  confidence?: number;
  source?: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function FieldWithAutoFill({
  label,
  value,
  isAutoFilled,
  confidence = 100,
  source,
  onChange,
  placeholder,
}: FieldWithAutoFillProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">{label}</label>
        <AutoFillIndicator
          isAutoFilled={isAutoFilled}
          confidence={confidence}
          source={source}
          fieldName={label}
        />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
          isAutoFilled
            ? "border-gold-300 focus:ring-gold-400 bg-gold-50"
            : "border-input focus:ring-ring"
        }`}
      />
    </div>
  );
}
