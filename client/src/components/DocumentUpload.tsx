import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, File, X, CheckCircle2, AlertCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

type DocumentType = "curriculum" | "identity" | "education" | "experience" | "recommendation" | "other";

interface DocumentUploadProps {
  onUploadComplete?: (documentId: number) => void;
  documentType?: DocumentType;
}

export function DocumentUpload({ onUploadComplete, documentType = "other" }: DocumentUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadMutation = trpc.documents.upload.useMutation();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = (e.target?.result as string).split(",")[1];
        
        const result = await uploadMutation.mutateAsync({
          fileName: selectedFile.name,
          fileData: base64,
          mimeType: selectedFile.type,
          fileSize: selectedFile.size,
          documentType,
          description: description || undefined,
        });

        toast.success("Documento enviado com sucesso!");
        setSelectedFile(null);
        setDescription("");
        onUploadComplete?.(result.documentId);
      };
      reader.readAsDataURL(selectedFile);
    } catch (error) {
      toast.error("Erro ao fazer upload do documento");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 transition-colors ${
          isDragging
            ? "border-accent bg-accent/5"
            : "border-border hover:border-accent/50"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          className="hidden"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.txt"
        />

        <div className="flex flex-col items-center justify-center gap-3">
          <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
            <Upload className="w-6 h-6 text-accent" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-foreground">
              Arraste arquivos aqui ou clique para selecionar
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              PDF, Word, Excel, Imagens (máx. 10MB)
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="mt-2"
          >
            Selecionar Arquivo
          </Button>
        </div>
      </div>

      {/* Selected File Preview */}
      {selectedFile && (
        <Card className="p-4 border border-border">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-accent/10 rounded flex items-center justify-center flex-shrink-0">
              <File className="w-5 h-5 text-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">{selectedFile.name}</p>
              <p className="text-sm text-muted-foreground">
                {formatFileSize(selectedFile.size)}
              </p>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descrição do documento (opcional)"
                className="mt-3 w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                rows={2}
              />
            </div>
            <button
              onClick={() => setSelectedFile(null)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-4">
            <Button
              onClick={handleUpload}
              disabled={isUploading}
              className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
            >
              {isUploading ? "Enviando..." : "Enviar Documento"}
            </Button>
            <Button
              onClick={() => setSelectedFile(null)}
              variant="outline"
              disabled={isUploading}
            >
              Cancelar
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}

interface DocumentListProps {
  editalId?: number;
}

export function DocumentList({ editalId }: DocumentListProps) {
  const { data: documents, isLoading } = trpc.documents.list.useQuery();
  const deleteMutation = trpc.documents.delete.useMutation();
  const linkMutation = trpc.documents.linkToEdital.useMutation();

  const handleDelete = async (documentId: number) => {
    try {
      await deleteMutation.mutateAsync({ documentId });
      toast.success("Documento deletado com sucesso");
    } catch (error) {
      toast.error("Erro ao deletar documento");
    }
  };

  const handleLink = async (documentId: number) => {
    if (!editalId) return;
    try {
      await linkMutation.mutateAsync({ documentId, editalId });
      toast.success("Documento vinculado ao edital");
    } catch (error) {
      toast.error("Erro ao vincular documento");
    }
  };

  if (isLoading) {
    return <div className="text-muted-foreground">Carregando documentos...</div>;
  }

  if (!documents || documents.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhum documento enviado ainda
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {documents.map((doc) => (
        <Card key={doc.id} className="p-4 border border-border hover:border-accent/50 transition-colors">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-accent/10 rounded flex items-center justify-center flex-shrink-0">
              <File className="w-5 h-5 text-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">{doc.fileName}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {doc.documentType} • {formatFileSize(doc.fileSize)}
              </p>
              {doc.description && (
                <p className="text-sm text-muted-foreground mt-2">{doc.description}</p>
              )}
            </div>
            <div className="flex gap-2 flex-shrink-0">
              {editalId && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleLink(doc.id)}
                  className="text-accent hover:bg-accent/10"
                >
                  Vincular
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleDelete(doc.id)}
                className="text-destructive hover:bg-destructive/10"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function formatFileSize(bytes: number) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}
