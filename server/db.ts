import { drizzle } from "drizzle-orm/mysql2";
import { eq, and } from "drizzle-orm";
import { 
  InsertUser, 
  users, 
  aiConversations, 
  aiMessages, 
  editalAnalysis, 
  InsertAIConversation, 
  InsertAIMessage, 
  InsertEditalAnalysis,
  userDocuments,
  InsertUserDocument,
  editalDocumentLinks,
  InsertEditalDocumentLink,
  extractedData,
  formSubmissions
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// AI Conversation helpers
export async function createAIConversation(data: InsertAIConversation) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(aiConversations).values(data);
}

export async function getAIConversations(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(aiConversations).where(eq(aiConversations.userId, userId));
}

export async function addAIMessage(data: InsertAIMessage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(aiMessages).values(data);
}

export async function getAIMessages(conversationId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(aiMessages).where(eq(aiMessages.conversationId, conversationId));
}

export async function createEditalAnalysis(data: InsertEditalAnalysis) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(editalAnalysis).values(data);
}

export async function getEditalAnalysis(editalId: number, userId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(editalAnalysis).where(
    and(eq(editalAnalysis.editalId, editalId), eq(editalAnalysis.userId, userId))
  ).limit(1);
  
  return result.length > 0 ? result[0] : null;
}

// Document helpers
export async function createUserDocument(data: InsertUserDocument) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(userDocuments).values(data);
}

export async function getUserDocuments(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(userDocuments).where(eq(userDocuments.userId, userId));
}

export async function getUserDocumentById(documentId: number, userId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(userDocuments).where(
    and(eq(userDocuments.id, documentId), eq(userDocuments.userId, userId))
  ).limit(1);
  
  return result.length > 0 ? result[0] : null;
}

export async function deleteUserDocument(documentId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.delete(userDocuments).where(
    and(eq(userDocuments.id, documentId), eq(userDocuments.userId, userId))
  );
}

export async function linkDocumentToEdital(data: InsertEditalDocumentLink) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(editalDocumentLinks).values(data);
}

export async function getEditalDocuments(editalId: number, userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const links = await db.select().from(editalDocumentLinks).where(
    and(eq(editalDocumentLinks.editalId, editalId), eq(editalDocumentLinks.userId, userId))
  );
  
  if (links.length === 0) return [];
  
  const documentIds = links.map(link => link.documentId);
  return await db.select().from(userDocuments).where(
    and(eq(userDocuments.userId, userId))
  );
}


// Form helpers
export async function createFormSubmission(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(formSubmissions).values(data);
}

export async function getFormSubmission(submissionId: number, userId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(formSubmissions).where(
    and(eq(formSubmissions.id, submissionId), eq(formSubmissions.userId, userId))
  ).limit(1);
  
  return result.length > 0 ? result[0] : null;
}

export async function getEditalFormSubmission(editalId: number, userId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(formSubmissions).where(
    and(eq(formSubmissions.editalId, editalId), eq(formSubmissions.userId, userId))
  ).limit(1);
  
  return result.length > 0 ? result[0] : null;
}

export async function updateFormSubmission(submissionId: number, userId: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.update(formSubmissions).set(data).where(
    and(eq(formSubmissions.id, submissionId), eq(formSubmissions.userId, userId))
  );
}

// Extracted data helpers
export async function saveExtractedData(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(extractedData).values(data);
}

export async function getExtractedDataByDocument(documentId: number, userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(extractedData).where(
    and(eq(extractedData.documentId, documentId), eq(extractedData.userId, userId))
  );
}

export async function getExtractedDataByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(extractedData).where(eq(extractedData.userId, userId));
}
