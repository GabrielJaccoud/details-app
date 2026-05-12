import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

interface BatchExportButtonProps {
  selectedIds: number[];
  onExportComplete?: () => void;
}

export function BatchExportButton({
  selectedIds,
  onExportComplete,
}: BatchExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportStatus, setExportStatus] = useState<"idle" | "exporting" | "success" | "error">(
    "idle"
  );

  const batchExportMutation = trpc.forms.batchExportPDFs.useMutation();

  const handleExport = async () => {
    if (selectedIds.length === 0) {
      toast.error("Selecione pelo menos um formulário para exportar");
      return;
    }

    setIsExporting(true);
    setExportStatus("exporting");
    setExportProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setExportProgress((prev) => Math.min(prev + Math.random() * 30, 90));
      }, 300);

      const result = await batchExportMutation.mutateAsync({
        submissionIds: selectedIds,
        format: "zip",
      });

      clearInterval(progressInterval);
      setExportProgress(100);
      setExportStatus("success");

      // Create download link
      if (result.downloadUrl) {
        const link = document.createElement("a");
        link.href = result.downloadUrl;
        link.download = `formularios-${new Date().toISOString().split("T")[0]}.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success(
          `${selectedIds.length} formulário${selectedIds.length !== 1 ? "s" : ""} exportado${selectedIds.length !== 1 ? "s" : ""} com sucesso!`
        );
      }

      setTimeout(() => {
        setIsOpen(false);
        setExportStatus("idle");
        setExportProgress(0);
        onExportComplete?.();
      }, 2000);
    } catch (error) {
      setExportStatus("error");
      toast.error("Erro ao exportar formulários");
      console.error("Export error:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button
          onClick={() => setIsOpen(true)}
          disabled={selectedIds.length === 0}
          variant="outline"
          className="gap-2 border-gold-300 hover:bg-gold-50"
        >
          <Download className="w-4 h-4" />
          Exportar em Lote ({selectedIds.length})
        </Button>
      </motion.div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Exportar Formulários</DialogTitle>
            <DialogDescription>
              Você está prestes a exportar {selectedIds.length} formulário
              {selectedIds.length !== 1 ? "s" : ""} em formato PDF compactado.
            </DialogDescription>
          </DialogHeader>

          <AnimatePresence mode="wait">
            {exportStatus === "idle" && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4 py-4"
              >
                <div className="bg-gold-50 border border-gold-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-gold-900">
                    Formato: ZIP com PDFs individuais
                  </p>
                  <p className="text-xs text-gold-700 mt-2">
                    Todos os formulários serão compactados em um único arquivo para fácil download.
                  </p>
                </div>
              </motion.div>
            )}

            {exportStatus === "exporting" && (
              <motion.div
                key="exporting"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4 py-4"
              >
                <div className="flex items-center justify-center gap-3">
                  <Loader2 className="w-5 h-5 text-gold-600 animate-spin" />
                  <p className="text-sm font-medium">Exportando...</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Progresso</span>
                    <span className="font-medium">{Math.round(exportProgress)}%</span>
                  </div>
                  <motion.div
                    className="h-2 bg-gold-100 rounded-full overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <motion.div
                      className="h-full bg-gradient-to-r from-gold-400 to-gold-600"
                      initial={{ width: 0 }}
                      animate={{ width: `${exportProgress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.div>
                </div>
              </motion.div>
            )}

            {exportStatus === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="space-y-4 py-4 text-center"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.6 }}
                  className="flex justify-center"
                >
                  <CheckCircle2 className="w-12 h-12 text-green-500" />
                </motion.div>
                <div>
                  <p className="font-semibold text-foreground">Exportação concluída!</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Seu arquivo está pronto para download.
                  </p>
                </div>
              </motion.div>
            )}

            {exportStatus === "error" && (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="space-y-4 py-4 text-center"
              >
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
                <div>
                  <p className="font-semibold text-foreground">Erro na exportação</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Ocorreu um erro ao exportar os formulários. Tente novamente.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <DialogFooter>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-sm font-medium text-foreground hover:bg-accent rounded-lg transition-colors"
            >
              {exportStatus === "success" ? "Fechar" : "Cancelar"}
            </motion.button>

            {exportStatus === "idle" && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleExport}
                disabled={isExporting}
                className="px-4 py-2 text-sm font-medium bg-gold-600 text-white rounded-lg hover:bg-gold-700 transition-colors disabled:opacity-50"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin inline" />
                    Exportando...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2 inline" />
                    Exportar
                  </>
                )}
              </motion.button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

interface BatchSelectCheckboxProps {
  isSelected: boolean;
  onChange: (selected: boolean) => void;
}

export function BatchSelectCheckbox({ isSelected, onChange }: BatchSelectCheckboxProps) {
  return (
    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
      <Checkbox checked={isSelected} onCheckedChange={onChange} />
    </motion.div>
  );
}
