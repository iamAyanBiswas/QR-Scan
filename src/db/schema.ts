export * from '@/db/auth/auth.schema'
export * from '@/db/qr.schema'

import { relations } from 'drizzle-orm';
import { user, session, account } from '@/db/auth/auth.schema'
import { qrcodes } from '@/db/qr.schema'

export const userRelations = relations(user, ({ many }) => ({
    sessions: many(session),
    accounts: many(account),
    qrcodes: many(qrcodes),
}));

export const sessionRelations = relations(session, ({ one }) => ({
    user: one(user, {
        fields: [session.userId],
        references: [user.id],
    }),
}));

export const accountRelations = relations(account, ({ one }) => ({
    user: one(user, {
        fields: [account.userId],
        references: [user.id],
    }),
}));

export const qrRelations = relations(qrcodes, ({ one }) => ({
    owner: one(user, {
        fields: [qrcodes.userId],
        references: [user.id],
    }),
}));
