import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { userProfiles } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export const profileRouter = router({
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const profile = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, ctx.user.id))
      .limit(1);

    return profile[0] || null;
  }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        fullName: z.string().optional(),
        cpf: z.string().optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        zipCode: z.string().optional(),
        organization: z.string().optional(),
        position: z.string().optional(),
        bio: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const existingProfile = await db
        .select()
        .from(userProfiles)
        .where(eq(userProfiles.userId, ctx.user.id))
        .limit(1);

      if (existingProfile.length > 0) {
        // Update existing profile
        await db
          .update(userProfiles)
          .set({
            ...input,
            updatedAt: new Date(),
          })
          .where(eq(userProfiles.userId, ctx.user.id));
      } else {
        // Create new profile
        await db.insert(userProfiles).values({
          userId: ctx.user.id,
          ...input,
        });
      }

      return { success: true };
    }),

  getProfileData: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const profile = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, ctx.user.id))
      .limit(1);

    if (!profile[0]) return null;

    return {
      fullName: profile[0].fullName,
      cpf: profile[0].cpf,
      email: profile[0].email,
      phone: profile[0].phone,
      address: profile[0].address,
      city: profile[0].city,
      state: profile[0].state,
      zipCode: profile[0].zipCode,
      organization: profile[0].organization,
      position: profile[0].position,
      bio: profile[0].bio,
    };
  }),
});
