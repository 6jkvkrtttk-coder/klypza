import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const visitors = sqliteTable("visitors", {
  id: text("id").primaryKey(),
  credits: integer("credits").notNull().default(10),
  totalUses: integer("total_uses").notNull().default(0),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
});

export const rewardSessions = sqliteTable("reward_sessions", {
  id: text("id").primaryKey(),
  visitorId: text("visitor_id").notNull().references(() => visitors.id),
  startedAt: integer("started_at").notNull(),
  claimAfter: integer("claim_after").notNull(),
  claimed: integer("claimed", { mode: "boolean" }).notNull().default(false),
  advertiserId: text("advertiser_id").notNull().default("klypza-house"),
});

export const newsletterSubscribers = sqliteTable("newsletter_subscribers", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  consentAt: integer("consent_at").notNull(),
  status: text("status").notNull().default("subscribed"),
});

export const sponsorInquiries = sqliteTable("sponsor_inquiries", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company").notNull(),
  budget: text("budget").notNull(),
  message: text("message").notNull(),
  status: text("status").notNull().default("new"),
  createdAt: integer("created_at").notNull(),
});

export const contactMessages = sqliteTable("contact_messages", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  topic: text("topic").notNull(),
  message: text("message").notNull(),
  status: text("status").notNull().default("new"),
  createdAt: integer("created_at").notNull(),
});
