import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const roastTypeEnum = pgEnum("roast_type", [
  "sarcastic",
  "constructive",
  "brutal",
]);

export const leaderboardPeriodEnum = pgEnum("leaderboard_period", [
  "daily",
  "weekly",
  "all_time",
]);

export const programmingLanguageEnum = pgEnum("programming_language", [
  "javascript",
  "typescript",
  "python",
  "java",
  "csharp",
  "go",
  "rust",
  "ruby",
  "php",
  "c",
  "cpp",
  "swift",
  "kotlin",
  "sql",
  "html",
  "css",
]);

export const submissions = pgTable("submissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: text("code").notNull(),
  language: varchar("language", { length: 50 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const roasts = pgTable("roasts", {
  id: uuid("id").primaryKey().defaultRandom(),
  submissionId: uuid("submission_id")
    .notNull()
    .references(() => submissions.id),
  content: text("content").notNull(),
  roastType: roastTypeEnum("roast_type").notNull(),
  ogImagePath: text("og_image_path"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const scores = pgTable("scores", {
  id: uuid("id").primaryKey().defaultRandom(),
  submissionId: uuid("submission_id")
    .notNull()
    .references(() => submissions.id),
  totalScore: integer("total_score").notNull(),
  codeQuality: integer("code_quality").notNull(),
  readability: integer("readability").notNull(),
  bestPractices: integer("best_practices").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const leaderboard = pgTable("leaderboard", {
  id: uuid("id").primaryKey().defaultRandom(),
  submissionId: uuid("submission_id")
    .notNull()
    .references(() => submissions.id),
  rankPosition: integer("rank_position").notNull(),
  period: leaderboardPeriodEnum("period").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type RoastType = "sarcastic" | "constructive" | "brutal";
export type LeaderboardPeriod = "daily" | "weekly" | "all_time";
export type ProgrammingLanguage =
  | "javascript"
  | "typescript"
  | "python"
  | "java"
  | "csharp"
  | "go"
  | "rust"
  | "ruby"
  | "php"
  | "c"
  | "cpp"
  | "swift"
  | "kotlin"
  | "sql"
  | "html"
  | "css";
