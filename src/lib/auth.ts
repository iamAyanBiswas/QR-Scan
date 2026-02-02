import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { ORIGIN } from "@/config/name";
import { db } from "@/db/index";

export const auth = betterAuth({
    // configure e.g. trustedOrigins, database adapter, email/password etc
    baseURL: process.env.BETTER_AUTH_URL,
    basePath: '/api/auth',
    trustedOrigins: ORIGIN,
    database: drizzleAdapter(db, {
        provider: "pg",
    }),
    emailAndPassword: { enabled: true },
    socialProviders:
    {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        },
    }
});
