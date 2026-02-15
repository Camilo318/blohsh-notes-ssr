import { relations, sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgTableCreator,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `blohsh-notes-ssr_${name}`);

// Importance enum values
export const importanceValues = ["High", "Medium", "Low"] as const;
export type Importance = (typeof importanceValues)[number];

// Notebooks table
export const notebooks = createTable(
  "notebook",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: varchar("name", { length: 255 }).notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    userNameIdx: uniqueIndex("notebook_user_name_idx").on(
      table.userId,
      table.name,
    ),
  }),
);

// Tags table
export const tags = createTable(
  "tag",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: varchar("name", { length: 255 }).notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => ({
    userNameIdx: uniqueIndex("tag_user_name_idx").on(table.userId, table.name),
  }),
);

// Notes to Tags join table
export const notesToTags = createTable(
  "notes_to_tags",
  {
    noteId: text("note_id")
      .notNull()
      .references(() => notes.id, { onDelete: "cascade", onUpdate: "cascade" }),
    tagId: text("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade", onUpdate: "cascade" }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.noteId, table.tagId] }),
  }),
);

export const notes = createTable(
  "note",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    title: varchar("title", { length: 255 }).notNull(),
    content: text("content").notNull(),
    notebookId: text("notebook_id").references(() => notebooks.id, {
      onDelete: "set null",
      onUpdate: "cascade",
    }),
    importance: varchar("importance", { length: 10 })
      .notNull()
      .default("Medium"),
    color: varchar("color", { length: 50 }),
    isFavorite: boolean("is_favorite").notNull().default(false),
    createdById: text("createdById")
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt", { withTimezone: true })
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (example) => ({
    createdByIdIdx: index("createdById_idx").on(example.createdById),
    userFavoriteIdx: index("note_user_favorite_idx").on(
      example.createdById,
      example.isFavorite,
    ),
  }),
);

export const images = createTable("images", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  altText: text("atl_text"),
  contentType: text("content_type"),
  imageSrc: varchar("image_src", { length: 255 }),
  key: varchar("key", { length: 255 }),
  noteId: text("note_id")
    .notNull()
    .references(() => notes.id, { onDelete: "cascade", onUpdate: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const users = createTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
  image: varchar("image", { length: 255 }),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  notes: many(notes),
  images: many(images),
  notebooks: many(notebooks),
  tags: many(tags),
}));

export const notesRelations = relations(notes, ({ one, many }) => ({
  author: one(users, { fields: [notes.createdById], references: [users.id] }),
  images: many(images),
  notebook: one(notebooks, {
    fields: [notes.notebookId],
    references: [notebooks.id],
  }),
  noteTags: many(notesToTags),
}));

export const imagesRelations = relations(images, ({ one }) => ({
  note: one(notes, { fields: [images.noteId], references: [notes.id] }),
  user: one(users, { fields: [images.userId], references: [users.id] }),
}));

export const notebooksRelations = relations(notebooks, ({ one, many }) => ({
  user: one(users, { fields: [notebooks.userId], references: [users.id] }),
  notes: many(notes),
}));

export const tagsRelations = relations(tags, ({ one, many }) => ({
  user: one(users, { fields: [tags.userId], references: [users.id] }),
  noteTags: many(notesToTags),
}));

export const notesToTagsRelations = relations(notesToTags, ({ one }) => ({
  note: one(notes, { fields: [notesToTags.noteId], references: [notes.id] }),
  tag: one(tags, { fields: [notesToTags.tagId], references: [tags.id] }),
}));

export const accounts = createTable(
  "account",
  {
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("account_userId_idx").on(account.userId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  {
    sessionToken: varchar("sessionToken", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (session) => ({
    userIdIdx: index("session_userId_idx").on(session.userId),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verificationToken",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;

export type InserNote = typeof notes.$inferInsert;

export type SelectNote = typeof notes.$inferSelect & {
  images?: SelectImage[];
  notebook?: string | null;
  tags?: string[];
};

export type InsertImage = typeof images.$inferInsert;
export type SelectImage = typeof images.$inferSelect;

export type InsertNotebook = typeof notebooks.$inferInsert;
export type SelectNotebook = typeof notebooks.$inferSelect;

export type InsertTag = typeof tags.$inferInsert;
export type SelectTag = typeof tags.$inferSelect;
