import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { invokeLLM } from "../_core/llm";
import {
  createFormSubmission,
  getFormSubmission,
  getEditalFormSubmission,
  updateFormSubmission,
  saveExtractedData,
  getExtractedDataByDocument,
  getExtractedDataByUser,
  getUserDocumentById,
} from "../db";
import { TRPCError } from "@trpc/server";

export const formsRouter = router({
  // Extrair dados de um documento usando IA
  extractDataFromDocument: protectedProcedure
    .input(
      z.object({
        documentId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Verificar se o documento pertence ao usuário
        const document = await getUserDocumentById(input.documentId, ctx.user.id);
        if (!document) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Documento não encontrado",
          });
        }

        // Chamar IA para extrair dados
        const systemPrompt = "Você é um assistente especializado em extrair dados de documentos. Extraia nome, email, telefone, CPF, data de nascimento, endereço, formação acadêmica, experiência profissional e habilidades. Retorne APENAS JSON válido.";
        const userPrompt = `Extraia os dados do documento em: ${document.fileUrl}`;
        
        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content: systemPrompt,
            },
            {
              role: "user",
              content: userPrompt,
            },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "extracted_document_data",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  personal: {
                    type: "object",
                    properties: {
                      fullName: { type: "string" },
                      email: { type: "string" },
                      phone: { type: "string" },
                      cpf: { type: "string" },
                      birthDate: { type: "string" },
                      address: { type: "string" },
                    },
                  },
                  education: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        degree: { type: "string" },
                        institution: { type: "string" },
                        year: { type: "string" },
                      },
                    },
                  },
                  experience: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        position: { type: "string" },
                        company: { type: "string" },
                        period: { type: "string" },
                        description: { type: "string" },
                      },
                    },
                  },
                  skills: {
                    type: "array",
                    items: { type: "string" },
                  },
                  confidenceScores: {
                    type: "object",
                    additionalProperties: { type: "number" },
                  },
                },
                required: ["personal", "education", "experience", "skills", "confidenceScores"],
                additionalProperties: false,
              },
            },
          },
        });

        // Parse da resposta
        let extractedContent: any = {};
        if (response.choices?.[0]?.message?.content) {
          try {
            const content = response.choices[0].message.content;
            const contentStr = typeof content === 'string' ? content : JSON.stringify(content);
            extractedContent = JSON.parse(contentStr);
          } catch (e) {
            console.error("Failed to parse LLM response:", e);
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Erro ao processar resposta da IA",
            });
          }
        }

        // Salvar dados extraídos no banco
        const dataToSave: any[] = [];

        // Personal data
        if (extractedContent.personal && typeof extractedContent.personal === 'object') {
          for (const [key, value] of Object.entries(extractedContent.personal)) {
            if (value) {
              dataToSave.push({
                userId: ctx.user.id,
                documentId: input.documentId,
                dataType: "personal",
                fieldName: key,
                fieldValue: String(value),
                confidence: (extractedContent.confidenceScores as any)?.[key] || 100,
              });
            }
          }
        }

        // Education data
        if (extractedContent.education && Array.isArray(extractedContent.education)) {
          extractedContent.education.forEach((edu: any, index: number) => {
            for (const [key, value] of Object.entries(edu)) {
              if (value) {
                dataToSave.push({
                  userId: ctx.user.id,
                  documentId: input.documentId,
                  dataType: "education",
                  fieldName: `${key}_${index}`,
                  fieldValue: String(value),
                  confidence: extractedContent.confidenceScores?.[`education_${index}_${key}`] || 100,
                });
              }
            }
          });
        }

        // Experience data
        if (extractedContent.experience && Array.isArray(extractedContent.experience)) {
          extractedContent.experience.forEach((exp: any, index: number) => {
            for (const [key, value] of Object.entries(exp)) {
              if (value) {
                dataToSave.push({
                  userId: ctx.user.id,
                  documentId: input.documentId,
                  dataType: "experience",
                  fieldName: `${key}_${index}`,
                  fieldValue: String(value),
                  confidence: extractedContent.confidenceScores?.[`experience_${index}_${key}`] || 100,
                });
              }
            }
          });
        }

        // Skills data
        if (extractedContent.skills && Array.isArray(extractedContent.skills)) {
          extractedContent.skills.forEach((skill: string, index: number) => {
            dataToSave.push({
              userId: ctx.user.id,
              documentId: input.documentId,
              dataType: "skills",
              fieldName: `skill_${index}`,
              fieldValue: skill,
              confidence: extractedContent.confidenceScores?.skills || 100,
            });
          });
        }

        // Salvar todos os dados
        for (const data of dataToSave) {
          try {
            await saveExtractedData(data);
          } catch (e) {
            console.error("Error saving extracted data:", e);
          }
        }

        return {
          success: true,
          extractedData: extractedContent,
          savedFields: dataToSave.length,
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error("Extract data error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao extrair dados do documento",
        });
      }
    }),

  // Obter dados extraídos de um documento
  getExtractedData: protectedProcedure
    .input(z.object({ documentId: z.number() }))
    .query(async ({ ctx, input }) => {
      try {
        const data = await getExtractedDataByDocument(input.documentId, ctx.user.id);
        return data;
      } catch (error) {
        console.error("Get extracted data error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao obter dados extraídos",
        });
      }
    }),

  // Criar novo formulário para um edital
  createFormSubmission: protectedProcedure
    .input(
      z.object({
        editalId: z.number(),
        formData: z.record(z.string(), z.any()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const result = await createFormSubmission({
          userId: ctx.user.id,
          editalId: input.editalId,
          formData: input.formData || {},
          status: "draft",
        });

        return {
          success: true,
          submissionId: (result as any).insertId || Date.now(),
        };
      } catch (error) {
        console.error("Create form submission error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao criar formulário",
        });
      }
    }),

  // Obter formulário de um edital
  getFormSubmission: protectedProcedure
    .input(z.object({ editalId: z.number() }))
    .query(async ({ ctx, input }) => {
      try {
        const submission = await getEditalFormSubmission(input.editalId, ctx.user.id);
        return submission;
      } catch (error) {
        console.error("Get form submission error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao obter formulário",
        });
      }
    }),

  // Atualizar formulário
  updateFormSubmission: protectedProcedure
    .input(
      z.object({
        submissionId: z.number(),
        formData: z.record(z.string(), z.any()),
        status: z.enum(["draft", "submitted", "completed"]).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const submission = await getFormSubmission(input.submissionId, ctx.user.id);
        if (!submission) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Formulário não encontrado",
          });
        }

        const updateData: any = {
          formData: input.formData,
          updatedAt: new Date(),
        };

        if (input.status) {
          updateData.status = input.status;
          if (input.status === "submitted") {
            updateData.submittedAt = new Date();
          }
        }

        await updateFormSubmission(input.submissionId, ctx.user.id, updateData);

        return { success: true };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error("Update form submission error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao atualizar formulário",
        });
      }
    }),

  // Preencher formulário automaticamente com dados extraídos
  autoFillForm: protectedProcedure
    .input(
      z.object({
        submissionId: z.number(),
        documentIds: z.array(z.number()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const submission = await getFormSubmission(input.submissionId, ctx.user.id);
        if (!submission) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Formulário não encontrado",
          });
        }

        // Coletar todos os dados extraídos dos documentos
        const allExtractedData: any = {};

        for (const docId of input.documentIds) {
          const data = await getExtractedDataByDocument(docId, ctx.user.id);
          data.forEach((item) => {
            if (!allExtractedData[item.dataType]) {
              allExtractedData[item.dataType] = {};
            }
            allExtractedData[item.dataType][item.fieldName] = {
              value: item.fieldValue,
              confidence: item.confidence,
            };
          });
        }

        // Mesclar com dados existentes
        const mergedFormData = {
          ...(typeof submission.formData === 'object' ? submission.formData : {}),
          ...allExtractedData,
        };

        // Atualizar formulário
        await updateFormSubmission(input.submissionId, ctx.user.id, {
          formData: mergedFormData,
          updatedAt: new Date(),
        });

        return {
          success: true,
          filledFields: Object.keys(allExtractedData).length,
          formData: mergedFormData,
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error("Auto fill form error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao preencher formulário automaticamente",
        });
      }
    }),

  // Exportar múltiplos formulários em lote
  batchExportPDFs: protectedProcedure
    .input(
      z.object({
        submissionIds: z.array(z.number()),
        format: z.enum(["zip", "individual"]).default("zip"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        if (input.submissionIds.length === 0) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Nenhum formulário selecionado",
          });
        }

        // Verificar se todos os formulários pertencem ao usuário
        const submissions = await Promise.all(
          input.submissionIds.map((id) => getFormSubmission(id, ctx.user.id))
        );

        const validSubmissions = submissions.filter((s) => s !== null);
        if (validSubmissions.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Nenhum formulário encontrado",
          });
        }

        // Gerar URLs de download para cada PDF
        const downloadUrls = validSubmissions.map((sub) => ({
          id: sub.id,
          fileName: `formulario-${sub.id}.pdf`,
          url: `/api/forms/download/${sub.id}`,
        }));

        // Retornar URL de download do ZIP
        const zipFileName = `formularios-${new Date().toISOString().split("T")[0]}.zip`;
        const downloadUrl = `/api/forms/download-batch?ids=${input.submissionIds.join(",")}`;

        return {
          success: true,
          downloadUrl,
          fileName: zipFileName,
          count: validSubmissions.length,
          files: downloadUrls,
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error("Batch export error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao exportar formulários em lote",
        });
      }
    }),
});
