import { useEffect, useRef, useCallback, useState } from "react";
import { toast } from "sonner";

interface UseAutoSaveOptions {
  interval?: number;
  onSave: () => Promise<void>;
  enabled?: boolean;
}

interface UseAutoSaveReturn {
  isSaving: boolean;
  lastSavedAt: Date | null;
  manualSave: () => Promise<void>;
}

export function useAutoSave({
  interval = 30000,
  onSave,
  enabled = true,
}: UseAutoSaveOptions): UseAutoSaveReturn {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const manualSave = useCallback(async () => {
    if (isSaving) return;

    setIsSaving(true);
    try {
      await onSave();
      setLastSavedAt(new Date());
      toast.success("Formulário salvo automaticamente", {
        duration: 2000,
        description: new Date().toLocaleTimeString("pt-BR"),
      });
    } catch (error) {
      toast.error("Erro ao salvar formulário automaticamente");
      console.error("Auto-save error:", error);
    } finally {
      setIsSaving(false);
    }
  }, [isSaving, onSave]);

  useEffect(() => {
    if (!enabled) return;

    const scheduleAutoSave = () => {
      timeoutRef.current = setTimeout(() => {
        manualSave().then(() => {
          scheduleAutoSave();
        });
      }, interval);
    };

    scheduleAutoSave();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [enabled, interval, manualSave]);

  return {
    isSaving,
    lastSavedAt,
    manualSave,
  };
}
