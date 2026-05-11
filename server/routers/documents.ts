import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { storagePut } from "../storage";
import {
  createUserDocument,
  getUserDocuments,
  getUserDocumentById,
  deleteUserDocument,
  linkDocumentToEdital,
  getEditalDocuments,
} from "../db";
import { TRPCError } from "@trpc/server";

export const documentsRouter = router({
  // Upload um novo documento
  upload: protectedProcedure
    .input(
      z.object({
        fileName: z.string().min(1).max(255),
        fileData: z.string(), // Base64 encoded
        mimeType: z.string(),
        fileSize: z.number(),
        documentType: z.enum([
          "curriculum",
          "identity",
          "education",
          "experience",
          "recommendation",
          "other",
        ]),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Converter base64 para buffer
        const buffer = Buffer.from(input.fileData, "base64");

        // Upload para S3
        const fileKey = `documents/${ctx.user.id}/${Date.now()}-${input.fileName}`;
        const { url } = await storagePut(fileKey, buffer, input.mimeType);

        // Salvar no banco de dados
        const result = await createUserDocument({
          userId: ctx.user.id,
          fileName: input.fileName,
          fileKey,
          fileUrl: url,
          mimeType: input.mimeType,
          fileSize: input.fileSize,
          documentType: input.documentType,
          description: input.description,
        });

        return {
          success: true,
          documentId: (result as any).insertId || Date.now(),
          fileUrl: url,
        };
      } catch (error) {
        console.error("Upload error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao fazer upload do documento",
        });
      }
    }),

  // Listar documentos do usuário
  list: protectedProcedure.query(async ({ ctx }) => {
    try {
      const documents = await getUserDocuments(ctx.user.id);
      return documents;
    } catch (error) {
      console.error("List documents error:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Erro ao listar documentos",
      });
    }
  }),

  // Obter um documento específico
  get: protectedProcedure
    .input(z.object({ documentId: z.number() }))
    .query(async ({ ctx, input }) => {
      try {
        const document = await getUserDocumentById(input.documentId, ctx.user.id);
        if (!document) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Documento não encontrado",
          });
        }
        return document;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error("Get document error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao obter documento",
        });
      }
    }),

  // Deletar um documento
  delete: protectedProcedure
    .input(z.object({ documentId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const document = await getUserDocumentById(input.documentId, ctx.user.id);
        if (!document) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Documento não encontrado",
          });
        }

        await deleteUserDocument(input.documentId, ctx.user.id);

        return { success: true };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error("Delete document error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao deletar documento",
        });
      }
    }),

  // Vincular documento a um edital
  linkToEdital: protectedProcedure
    .input(
      z.object({
        documentId: z.number(),
        editalId: z.number(),
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

        await linkDocumentToEdital({
          editalId: input.editalId,
          documentId: input.documentId,
          userId: ctx.user.id,
        });

        return { success: true };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error("Link document error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao vincular documento",
        });
      }
    }),

  // Obter documentos de um edital
  getEditalDocuments: protectedProcedure
    .input(z.object({ editalId: z.number() }))
    .query(async ({ ctx, input }) => {
      try {
        const documents = await getEditalDocuments(input.editalId, ctx.user.id);
        return documents;
      } catch (error) {
        console.error("Get edital documents error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao obter documentos do edital",
        });
      }
    }),
});
