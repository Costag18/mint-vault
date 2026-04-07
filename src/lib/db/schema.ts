import {
  pgTable,
  uuid,
  text,
  timestamp,
  decimal,
  date,
  boolean,
  serial,
  integer,
  jsonb,
} from "drizzle-orm/pg-core";

export const collections = pgTable("collections", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const pricechartingProducts = pgTable("pricecharting_products", {
  id: serial("id").primaryKey(),
  externalId: text("external_id").notNull().unique(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  currentPrice: decimal("current_price", { precision: 12, scale: 2 }),
  imageUrl: text("image_url"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>(),
  lastFetchedAt: timestamp("last_fetched_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const items = pgTable("items", {
  id: uuid("id").defaultRandom().primaryKey(),
  collectionId: uuid("collection_id")
    .notNull()
    .references(() => collections.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull(),
  pricechartingId: integer("pricecharting_id").references(
    () => pricechartingProducts.id
  ),
  name: text("name").notNull(),
  variant: text("variant"),
  grade: text("grade"),
  gradingService: text("grading_service"),
  certNumber: text("cert_number"),
  purchasePrice: decimal("purchase_price", { precision: 12, scale: 2 }),
  purchaseDate: date("purchase_date"),
  notes: text("notes"),
  imageUrl: text("image_url"),
  tags: jsonb("tags").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const wishlistItems = pgTable("wishlist_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),
  pricechartingId: integer("pricecharting_id").references(
    () => pricechartingProducts.id
  ),
  name: text("name").notNull(),
  targetPrice: decimal("target_price", { precision: 12, scale: 2 }),
  alertsEnabled: boolean("alerts_enabled").default(false).notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const priceSnapshots = pgTable("price_snapshots", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .notNull()
    .references(() => pricechartingProducts.id, { onDelete: "cascade" }),
  price: decimal("price", { precision: 12, scale: 2 }).notNull(),
  source: text("source").notNull(),
  recordedAt: timestamp("recorded_at").defaultNow().notNull(),
});

export const activityLog = pgTable("activity_log", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  type: text("type").notNull(),
  itemId: uuid("item_id"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userPreferences = pgTable("user_preferences", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull().unique(),
  emailAlertsEnabled: boolean("email_alerts_enabled").default(false).notNull(),
  defaultView: text("default_view").default("grid").notNull(),
  defaultCategory: text("default_category"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});
