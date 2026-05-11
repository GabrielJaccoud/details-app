import { describe, it, expect } from "vitest";
import { documentsRouter } from "./documents";

const mockContext = {
  user: {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user" as const,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date()
  },
  req: {} as any,
  res: {} as any
};

describe("Documents Router", () => {
  describe("upload", () => {
    it("deve fazer upload de um documento", async () => {
      const caller = documentsRouter.createCaller(mockContext);
      
      const result = await caller.upload({
        fileName: "curriculum.pdf",
        fileData: "JVBERi0xLjQK",
        mimeType: "application/pdf",
        fileSize: 1024,
        documentType: "curriculum",
        description: "Meu currículo"
      });

      expect(result).toHaveProperty("success", true);
      expect(result).toHaveProperty("documentId");
      expect(result).toHaveProperty("fileUrl");
    }, { timeout: 15000 });

    it("deve fazer upload com tipo education", async () => {
      const caller = documentsRouter.createCaller(mockContext);
      
      const result = await caller.upload({
        fileName: "diploma.pdf",
        fileData: "JVBERi0xLjQK",
        mimeType: "application/pdf",
        fileSize: 2048,
        documentType: "education"
      });

      expect(result).toHaveProperty("success", true);
    }, { timeout: 15000 });

    it("deve fazer upload com tipo recommendation", async () => {
      const caller = documentsRouter.createCaller(mockContext);
      
      const result = await caller.upload({
        fileName: "recomendacao.pdf",
        fileData: "JVBERi0xLjQK",
        mimeType: "application/pdf",
        fileSize: 1500,
        documentType: "recommendation"
      });

      expect(result).toHaveProperty("success", true);
    }, { timeout: 15000 });
  });

  describe("list", () => {
    it("deve listar documentos do usuário", async () => {
      const caller = documentsRouter.createCaller(mockContext);
      
      const documents = await caller.list();

      expect(Array.isArray(documents)).toBe(true);
    }, { timeout: 10000 });
  });

  describe("getEditalDocuments", () => {
    it("deve obter documentos de um edital", async () => {
      const caller = documentsRouter.createCaller(mockContext);
      
      const documents = await caller.getEditalDocuments({
        editalId: 6
      });

      expect(Array.isArray(documents)).toBe(true);
    }, { timeout: 10000 });
  });

  describe("error handling", () => {
    it("deve retornar erro para documento não encontrado", async () => {
      const caller = documentsRouter.createCaller(mockContext);
      
      try {
        await caller.get({ documentId: 99999 });
        expect.fail("Deveria ter lançado erro");
      } catch (error: any) {
        expect(error.code).toBe("NOT_FOUND");
      }
    });
  });
});
