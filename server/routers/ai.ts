import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { 
  createAIConversation, 
  getAIConversations, 
  addAIMessage, 
  getAIMessages,
  createEditalAnalysis,
  getEditalAnalysis
} from "../db";
import { invokeLLM } from "../_core/llm";

const editalData = {
  id: 1,
  titulo: "Edital de Seleção para Pesquisador Sênior",
  orgao: "CNPQ",
  area: "Ciências Exatas",
  prazo: "2026-06-15",
  valor: "R$ 50.000 - R$ 100.000",
  descricao: "Seleção de pesquisadores para bolsas de produtividade em pesquisa",
  requisitos: [
    "Doutorado completo",
    "Experiência mínima de 5 anos em pesquisa",
    "Publicações em periódicos indexados",
    "Currículo Lattes atualizado"
  ]
};

export const aiRouter = router({
  // Criar uma nova conversa com IA
  createConversation: protectedProcedure
    .input(z.object({
      editalId: z.number().optional(),
      title: z.string(),
      topic: z.enum(["analysis", "filling", "general"]).default("general")
    }))
    .mutation(async ({ ctx, input }) => {
      await createAIConversation({
        userId: ctx.user.id,
        editalId: input.editalId,
        title: input.title,
        topic: input.topic
      });

      // Obter a conversa criada
      const conversations = await getAIConversations(ctx.user.id);
      const latest = conversations[conversations.length - 1];
      
      return { conversationId: latest?.id || 0 };
    }),

  // Obter conversas do usuário
  getConversations: protectedProcedure
    .query(async ({ ctx }) => {
      return await getAIConversations(ctx.user.id);
    }),

  // Enviar mensagem para IA
  sendMessage: protectedProcedure
    .input(z.object({
      conversationId: z.number(),
      message: z.string(),
      editalId: z.number().optional()
    }))
    .mutation(async ({ ctx, input }) => {
      // Salvar mensagem do usuário
      await addAIMessage({
        conversationId: input.conversationId,
        role: "user",
        content: input.message
      });

      // Construir contexto para a IA
      let systemPrompt = `Você é um assistente especializado em ajudar usuários a preencher editais e oportunidades de financiamento. 
Você fornece análises detalhadas, sugestões práticas e orientações claras.
Sempre seja educado, profissional e direto ao ponto.
Forneça informações estruturadas quando possível.`;

      if (input.editalId) {
        systemPrompt += `\n\nEdital em análise: ${editalData.titulo}
Órgão: ${editalData.orgao}
Área: ${editalData.area}
Prazo: ${editalData.prazo}
Valor: ${editalData.valor}
Requisitos: ${editalData.requisitos.join(", ")}`;
      }

      // Obter histórico de mensagens
      const messages = await getAIMessages(input.conversationId);
      
      const conversationHistory = messages.map(msg => ({
        role: msg.role as "user" | "assistant",
        content: msg.content
      }));

      // Chamar LLM
      const response = await invokeLLM({
        messages: [
          { role: "system", content: systemPrompt },
          ...conversationHistory,
          { role: "user", content: input.message }
        ]
      });

      const assistantMessage = typeof response.choices[0]?.message?.content === 'string' 
        ? response.choices[0].message.content 
        : "Desculpe, não consegui processar sua solicitação.";

      // Salvar resposta da IA
      await addAIMessage({
        conversationId: input.conversationId,
        role: "assistant",
        content: assistantMessage,
        metadata: {
          model: response.model,
          usage: response.usage
        }
      });

      return {
        message: assistantMessage,
        conversationId: input.conversationId
      };
    }),

  // Obter mensagens de uma conversa
  getMessages: protectedProcedure
    .input(z.object({
      conversationId: z.number()
    }))
    .query(async ({ input }) => {
      return await getAIMessages(input.conversationId);
    }),

  // Analisar um edital
  analyzeEdital: protectedProcedure
    .input(z.object({
      editalId: z.number()
    }))
    .mutation(async ({ ctx, input }) => {
      // Verificar se já existe análise
      const existingAnalysis = await getEditalAnalysis(input.editalId, ctx.user.id);
      if (existingAnalysis) {
        return existingAnalysis;
      }

      // Gerar análise com IA
      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: "Você é um especialista em análise de editais e oportunidades de financiamento. Forneça análises estruturadas em JSON."
          },
          {
            role: "user",
            content: `Analise este edital e forneça em JSON com os campos: summary (resumo), requirements (lista de requisitos), suggestions (sugestões de preenchimento).

Edital: ${editalData.titulo}
Órgão: ${editalData.orgao}
Área: ${editalData.area}
Prazo: ${editalData.prazo}
Valor: ${editalData.valor}
Descrição: ${editalData.descricao}
Requisitos: ${editalData.requisitos.join(", ")}`
          }
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "edital_analysis",
            strict: true,
            schema: {
              type: "object",
              properties: {
                summary: { type: "string" },
                requirements: { type: "array", items: { type: "string" } },
                suggestions: { type: "array", items: { type: "string" } }
              },
              required: ["summary", "requirements", "suggestions"],
              additionalProperties: false
            }
          }
        }
      });

      const analysisText = typeof response.choices[0]?.message?.content === 'string' 
        ? response.choices[0].message.content 
        : "{}";
      const analysis = JSON.parse(analysisText);

      // Salvar análise
      const result = await createEditalAnalysis({
        editalId: input.editalId,
        userId: ctx.user.id,
        summary: analysis.summary,
        requirements: analysis.requirements,
        suggestions: analysis.suggestions
      });

      return {
        ...analysis
      };
    }),

  // Obter análise de um edital
  getAnalysis: protectedProcedure
    .input(z.object({
      editalId: z.number()
    }))
    .query(async ({ ctx, input }) => {
      return await getEditalAnalysis(input.editalId, ctx.user.id);
    })
});
