import { loadEnvConfig } from "@next/env";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "./cms-db";
import { authAccount, authRateLimit, authSession, authUser, authVerification } from "./schema";

loadEnvConfig(process.cwd());

export const auth = betterAuth({
  appName: "Casa Kruyff",
  baseURL: process.env.BETTER_AUTH_URL || undefined,
  secret: process.env.BETTER_AUTH_SECRET || (process.env.NODE_ENV === "production" ? undefined : "local-only-casa-kruyff-auth-secret-change-before-deploy"),
  database: drizzleAdapter(db(), {
    provider: "pg",
    schema: {
      user: authUser,
      session: authSession,
      account: authAccount,
      verification: authVerification,
      rateLimit: authRateLimit,
    },
    transaction: true,
  }),
  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
    minPasswordLength: 12,
    maxPasswordLength: 128,
    revokeSessionsOnPasswordReset: true,
  },
  user: {
    changeEmail: { enabled: false },
    deleteUser: { enabled: false },
  },
  session: {
    expiresIn: 60 * 60 * 8,
    updateAge: 60 * 60,
  },
  rateLimit: {
    enabled: true,
    storage: "database",
    window: 15 * 60,
    max: 100,
    customRules: {
      "/sign-in/email": { window: 15 * 60, max: 20 },
      "/change-password": { window: 15 * 60, max: 20 },
    },
  },
  advanced: {
    cookiePrefix: "ck-admin",
    useSecureCookies: process.env.NODE_ENV === "production",
    defaultCookieAttributes: { sameSite: "strict", httpOnly: true },
  },
  plugins: [nextCookies()],
});
