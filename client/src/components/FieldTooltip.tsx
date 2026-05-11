import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

interface FieldTooltipProps {
  sourceText?: string;
  sourcePageNumber?: number;
  confidence?: number;
  children: React.ReactNode;
}

export function FieldTooltip({
  sourceText,
  sourcePageNumber,
  confidence = 100,
  children,
}: FieldTooltipProps) {
  if (!sourceText) {
    return <>{children}</>;
  }

  const displayText = sourceText.substring(0, 200) + (sourceText.length > 200 ? "..." : "");

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2 cursor-help">
            {children}
            <HelpCircle className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-sm">
          <div className="space-y-2">
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Origem do Documento:</p>
              <p className="text-sm italic text-foreground">"{displayText}"</p>
            </div>
            {sourcePageNumber && (
              <p className="text-xs text-muted-foreground">
                📄 Página {sourcePageNumber}
              </p>
            )}
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-background rounded h-1.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-green-500 to-blue-500 h-full"
                  style={{ width: `${confidence}%` }}
                />
              </div>
              <span className="text-xs font-medium">{confidence}%</span>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
