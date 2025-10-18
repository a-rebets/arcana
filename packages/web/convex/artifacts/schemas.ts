import { vThreadDoc } from "@convex-dev/agent";
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const datasets = defineTable({
  name: v.string(), // A human-readable name for the dataset (e.g., "Projects by Artem")
  rows: v.any(), // The actual data (array of JSON objects). Use v.any() for flexibility.
  schema: v.optional(v.string()), // Typescript types (with comments) describing the dataset.
  hash: v.string(), // SHA-256 hash of the 'rows' content for deduplication/caching.
  threadId: vThreadDoc.fields._id, // Link to the conversation thread this dataset belongs to.
  userId: v.id("users"), // User who created this dataset.
})
  .index("by_thread", ["threadId"]) // Essential for loading all datasets within a specific chat.
  .index("by_user", ["userId"]) // For gallery/listing user's datasets.
  .index("by_hash", ["hash"]); // For deduplication: quickly check if this exact dataset already exists.

export const artifacts = defineTable({
  threadId: vThreadDoc.fields._id, // Link to the conversation thread.
  userId: v.id("users"), // User who owns this artifact.
  type: v.literal("vega-lite"), // Explicitly 'vega-lite' for extensibility.
  title: v.string(), // Human-readable title for the chart.
  vlSpec: v.string(), // The raw Vega-Lite v5 specification as JSON string.
  vegaSpec: v.string(), // The compiled Vega specification as JSON string.
  datasetId: v.id("datasets"), // ID of dataset referenced by this artifact.
  parentArtifactId: v.optional(v.id("artifacts")), // For tracking versions and diffs.
  modelUsed: v.optional(v.string()), // Records the model that generated this artifact.
})
  .index("by_thread", ["threadId"]) // Essential for loading all charts within a specific chat.
  .index("by_user", ["userId"]) // For gallery/listing user's charts.
  .index("by_parent", ["parentArtifactId"]); // For querying all versions of a specific artifact.
