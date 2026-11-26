import { sql } from "drizzle-orm";
import {
  check,
  index,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

const createdAt = timestamp("created_at", { withTimezone: true })
  .notNull()
  .defaultNow();

/** An event with its public info and order deadline. */
export const events = pgTable("events", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  /** Used in the public URL, e.g. /43-is-a-party. */
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
  endsAt: timestamp("ends_at", { withTimezone: true }),
  /** Orders are accepted until this moment (stored in UTC). */
  orderDeadline: timestamp("order_deadline", { withTimezone: true }),
  /**
   * Hard close: after this moment the form and changes are no longer
   * possible. The order deadline above is then only a "preferably before"
   * date. Empty means the order deadline is also the hard close.
   */
  registrationClosesAt: timestamp("registration_closes_at", {
    withTimezone: true,
  }),
  /** Path of the event image under /public, e.g. /events/43-is-a-party.jpg. */
  imagePath: text("image_path"),
  createdAt,
});

/** The parts of an event guests can RSVP for (e.g. afternoon and evening). */
export const eventParts = pgTable(
  "event_parts",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    eventId: integer("event_id")
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
    endsAt: timestamp("ends_at", { withTimezone: true }),
    /** Shown on the page. Optional; left empty when the address must not be public. */
    location: text("location"),
    /**
     * Used only by the Route redirect (Google Maps / Waze), never rendered in
     * the page. Private addresses are set directly in the database, never in
     * migrations (the repository is public).
     */
    routeAddress: text("route_address"),
    /** Programme or short text for this part, one line per item. */
    description: text("description"),
    /** Visual style of this part on the event page. */
    theme: text("theme", { enum: ["day", "night"] })
      .notNull()
      .default("day"),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (t) => [index("event_parts_event_id_idx").on(t.eventId)],
);

/** The options guests can order for an event. */
export const menuItems = pgTable(
  "menu_items",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    eventId: integer("event_id")
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    /** Optional; empty means free. */
    priceCents: integer("price_cents"),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (t) => [
    index("menu_items_event_id_idx").on(t.eventId),
    check(
      "menu_items_price_cents_non_negative",
      sql`${t.priceCents} IS NULL OR ${t.priceCents} >= 0`,
    ),
  ],
);

/** One order per guest. */
export const orders = pgTable(
  "orders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    eventId: integer("event_id")
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),
    guestName: text("guest_name").notNull(),
    /** Optional, e.g. allergies. */
    note: text("note"),
    /** Secret token in the guest's personal link to change or cancel the order. */
    editToken: text("edit_token").notNull().unique(),
    /**
     * Anonymous, daily-changing connection id (hash), only used to limit
     * the number of sign-ups per hour. Never an IP address.
     */
    connectionHash: text("connection_hash"),
    createdAt,
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("orders_event_id_idx").on(t.eventId),
    index("orders_connection_idx").on(t.connectionHash, t.createdAt),
  ],
);

/** How many portions of each menu item an order contains. */
export const orderLines = pgTable(
  "order_lines",
  {
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    menuItemId: integer("menu_item_id")
      .notNull()
      // "no action" (checked at end of statement) so deleting an event can
      // cascade through orders and menu items in one go.
      .references(() => menuItems.id, { onDelete: "no action" }),
    quantity: integer("quantity").notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.orderId, t.menuItemId] }),
    check("order_lines_quantity_positive", sql`${t.quantity} >= 1`),
  ],
);

/** Which event parts a guest is coming to (RSVP). */
export const orderParts = pgTable(
  "order_parts",
  {
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    eventPartId: integer("event_part_id")
      .notNull()
      // "no action" so deleting an event can cascade in one statement.
      .references(() => eventParts.id, { onDelete: "no action" }),
    /** How many people of this sign-up come to this part. */
    people: integer("people").notNull().default(1),
  },
  (t) => [
    primaryKey({ columns: [t.orderId, t.eventPartId] }),
    check(
      "order_parts_people_range",
      sql`${t.people} >= 1 AND ${t.people} <= 30`,
    ),
  ],
);

/**
 * Anonymous visit statistics. No cookies, no IP addresses: a visitor is
 * recognised for one day only, via a salted hash that changes daily.
 */
export const pageVisits = pgTable(
  "page_visits",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    eventId: integer("event_id")
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),
    /** "view" (page visit), "cta" ("Ik kom feesten" click) or "route". */
    kind: text("kind", { enum: ["view", "cta", "route"] }).notNull(),
    /** Daily anonymous visitor id (hash); cannot be linked across days. */
    visitorHash: text("visitor_hash").notNull(),
    /** Where the visitor came from, as a category (e.g. "whatsapp", "direct"). */
    referrer: text("referrer").notNull(),
    /** "mobile", "tablet" or "desktop". */
    device: text("device").notNull(),
    /** Two-letter country code from Vercel, if known. */
    country: text("country"),
    createdAt,
  },
  (t) => [index("page_visits_event_created_idx").on(t.eventId, t.createdAt)],
);
