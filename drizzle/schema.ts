import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const aiConversations = mysqlTable("ai_conversations", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  editalId: int("editalId"),
  title: varchar("title", { length: 255 }).notNull(),
  topic: varchar("topic", { length: 100 }).default("general").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AIConversation = typeof aiConversations.$inferSelect;
export type InsertAIConversation = typeof aiConversations.$inferInsert;

export const aiMessages = mysqlTable("ai_messages", {
  id: int("id").autoincrement().primaryKey(),
  conversationId: int("conversationId").notNull(),
  role: mysqlEnum("role", ["user", "assistant"]).notNull(),
  content: text("content").notNull(),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AIMessage = typeof aiMessages.$inferSelect;
export type InsertAIMessage = typeof aiMessages.$inferInsert;

export const editalAnalysis = mysqlTable("edital_analysis", {
  id: int("id").autoincrement().primaryKey(),
  editalId: int("editalId").notNull(),
  userId: int("userId").notNull(),
  summary: text("summary"),
  requirements: json("requirements"),
  suggestions: json("suggestions"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type EditalAnalysis = typeof editalAnalysis.$inferSelect;
export type InsertEditalAnalysis = typeof editalAnalysis.$inferInsert;

export const userDocuments = mysqlTable("user_documents", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  fileName: varchar("fileName", { length: 255 }).notNull(),
  fileKey: varchar("fileKey", { length: 512 }).notNull(),
  fileUrl: text("fileUrl").notNull(),
  mimeType: varchar("mimeType", { length: 100 }).notNull(),
  fileSize: int("fileSize").notNull(),
  documentType: mysqlEnum("documentType", [
    "curriculum",
    "identity",
    "education",
    "experience",
    "recommendation",
    "other"
  ]).default("other").notNull(),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserDocument = typeof userDocuments.$inferSelect;
export type InsertUserDocument = typeof userDocuments.$inferInsert;

export const editalDocumentLinks = mysqlTable("edital_document_links", {
  id: int("id").autoincrement().primaryKey(),
  editalId: int("editalId").notNull(),
  documentId: int("documentId").notNull(),
  userId: int("userId").notNull(),
  linkedAt: timestamp("linkedAt").defaultNow().notNull(),
});

export type EditalDocumentLink = typeof editalDocumentLinks.$inferSelect;
export type InsertEditalDocumentLink = typeof editalDocumentLinks.$inferInsert;

export const extractedData = mysqlTable("extracted_data", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  documentId: int("documentId").notNull(),
  dataType: varchar("dataType", { length: 100 }).notNull(),
  fieldName: varchar("fieldName", { length: 255 }).notNull(),
  fieldValue: text("fieldValue").notNull(),
  confidence: int("confidence").default(100).notNull(),
  sourceText: text("sourceText"),
  sourcePageNumber: int("sourcePageNumber"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ExtractedData = typeof extractedData.$inferSelect;
export type InsertExtractedData = typeof extractedData.$inferInsert;

export const formSubmissions = mysqlTable("form_submissions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  editalId: int("editalId").notNull(),
  formData: json("formData").notNull(),
  fieldOrigins: json("fieldOrigins"),
  status: mysqlEnum("status", ["draft", "submitted", "completed"]).default("draft").notNull(),
  submittedAt: timestamp("submittedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type FormSubmission = typeof formSubmissions.$inferSelect;
export type InsertFormSubmission = typeof formSubmissions.$inferInsert;

export const userProfiles = mysqlTable("user_profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  fullName: varchar("fullName", { length: 255 }),
  cpf: varchar("cpf", { length: 20 }),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }),
  address: text("address"),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 2 }),
  zipCode: varchar("zipCode", { length: 10 }),
  organization: varchar("organization", { length: 255 }),
  position: varchar("position", { length: 255 }),
  bio: text("bio"),
  profileData: json("profileData"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = typeof userProfiles.$inferInsert;
