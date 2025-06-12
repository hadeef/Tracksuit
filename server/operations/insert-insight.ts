import type { Insight } from "$models/insight.ts";
import type { HasDBClient } from "../shared.ts";
import type * as insightsTable from "$tables/insights.ts";

// Input type: all fields except id and createdAt
export type InsertInsightInput =
  & HasDBClient
  & Omit<insightsTable.Row, "id" | "createdAt">;

export default function insertInsight(input: InsertInsightInput): Insight {
  const createdAt = new Date();
  const result = input.db.sql<insightsTable.Row>`
    INSERT INTO insights (brand, createdAt, text)
    VALUES (${input.brand}, ${createdAt.toISOString()}, ${input.text})
    RETURNING *
  `;

  const [row] = result;
  if (!row) throw new Error("Failed to insert insight");
  return { ...row, createdAt: new Date(row.createdAt) };
}
