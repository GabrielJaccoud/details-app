import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as TrpcContext["res"],
  };

  return ctx;
}

describe("DETAILS Backend - Editais", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should have auth context with user", () => {
    const ctx = createAuthContext();
    
    expect(ctx.user).toBeDefined();
    expect(ctx.user?.name).toBe("Test User");
    expect(ctx.user?.email).toBe("test@example.com");
    expect(ctx.user?.role).toBe("user");
  });

  it("should have router defined", () => {
    expect(appRouter).toBeDefined();
    expect(appRouter.createCaller).toBeDefined();
  });

  it("should handle auth logout", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.logout();

    expect(result).toEqual({ success: true });
  });

  it("should have auth.me procedure", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const user = await caller.auth.me();

    expect(user).toBeDefined();
    expect(user?.name).toBe("Test User");
  });
});
