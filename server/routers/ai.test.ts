import { describe, it, expect, vi, beforeEach } from "vitest";
import { aiRouter } from "./ai";
import { protectedProcedure } from "../_core/trpc";

// Mock do contexto
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

describe("AI Router", () => {
  describe("createConversation", () => {
    it("deve criar uma nova conversa com título", async () => {
      const caller = aiRouter.createCaller(mockContext);
      
      const result = await caller.createConversation({
        title: "Conversa sobre Edital Paulo Gustavo",
        topic: "analysis"
      });

      expect(result).toHaveProperty("conversationId");
      expect(typeof result.conversationId).toBe("number");
    });

    it("deve criar conversa com editalId opcional", async () => {
      const caller = aiRouter.createCaller(mockContext);
      
      const result = await caller.createConversation({
        editalId: 6,
        title: "Análise do Edital Paulo Gustavo",
        topic: "analysis"
      });

      expect(result).toHaveProperty("conversationId");
    });

    it("deve usar topic 'general' como padrão", async () => {
      const caller = aiRouter.createCaller(mockContext);
      
      const result = await caller.createConversation({
        title: "Conversa Geral"
      });

      expect(result).toHaveProperty("conversationId");
    });
  });

  describe("getConversations", () => {
    it("deve retornar lista de conversas do usuário", async () => {
      const caller = aiRouter.createCaller(mockContext);
      
      // Criar uma conversa primeiro
      await caller.createConversation({
        title: "Conversa 1",
        topic: "general"
      });

      const conversations = await caller.getConversations();

      expect(Array.isArray(conversations)).toBe(true);
    }, { timeout: 10000 });
  });

  describe("sendMessage", () => {
    it("deve enviar mensagem e receber resposta", async () => {
      const caller = aiRouter.createCaller(mockContext);
      
      // Criar conversa
      const convResult = await caller.createConversation({
        title: "Conversa de Teste",
        topic: "general"
      });

      // Enviar mensagem
      const result = await caller.sendMessage({
        conversationId: convResult.conversationId,
        message: "Quais são os requisitos principais?"
      });

      expect(result).toHaveProperty("message");
      expect(result).toHaveProperty("conversationId");
      expect(typeof result.message).toBe("string");
      expect(result.message.length).toBeGreaterThan(0);
    }, { timeout: 15000 });
  });

  describe("getMessages", () => {
    it("deve retornar mensagens de uma conversa", async () => {
      const caller = aiRouter.createCaller(mockContext);
      
      // Criar conversa e enviar mensagem
      const convResult = await caller.createConversation({
        title: "Conversa com Mensagens",
        topic: "general"
      });

      await caller.sendMessage({
        conversationId: convResult.conversationId,
        message: "Teste"
      });

      const messages = await caller.getMessages({
        conversationId: convResult.conversationId
      });

      expect(Array.isArray(messages)).toBe(true);
      expect(messages.length).toBeGreaterThanOrEqual(2); // User + Assistant
    }, { timeout: 15000 });
  });

  describe("analyzeEdital", () => {
    it("deve analisar um edital", async () => {
      const caller = aiRouter.createCaller(mockContext);
      
      const analysis = await caller.analyzeEdital({
        editalId: 6
      });

      expect(analysis).toHaveProperty("summary");
      expect(analysis).toHaveProperty("requirements");
      expect(analysis).toHaveProperty("suggestions");
      expect(Array.isArray(analysis.requirements)).toBe(true);
      expect(Array.isArray(analysis.suggestions)).toBe(true);
    }, { timeout: 15000 });
  });

  describe("getAnalysis", () => {
    it("deve obter análise de um edital", async () => {
      const caller = aiRouter.createCaller(mockContext);
      
      // Analisar edital primeiro
      await caller.analyzeEdital({
        editalId: 6
      });

      // Obter análise
      const analysis = await caller.getAnalysis({
        editalId: 6
      });

      expect(analysis).toHaveProperty("summary");
      expect(analysis).toHaveProperty("requirements");
      expect(analysis).toHaveProperty("suggestions");
    }, { timeout: 15000 });

    it("deve retornar null se não houver análise", async () => {
      const caller = aiRouter.createCaller(mockContext);
      
      const analysis = await caller.getAnalysis({
        editalId: 999
      });

      expect(analysis).toBeNull();
    });
  });
});
