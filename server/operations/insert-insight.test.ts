import { beforeAll, describe, it } from "jsr:@std/testing/bdd";
import { expect } from "jsr:@std/expect";
import { withDB } from "../testing.ts";
import type { Insight } from "$models/insight.ts";
import insertInsight from "./insert-insight.ts";

describe("inserting insights into the database", () => {
  withDB((fixture) => {
    let inserted: Insight;

    const input = {
      ...fixture,
      brand: 2,
      text: "Inserted insight",
    };

    beforeAll(() => {
      inserted = insertInsight(input);
    });

    it("returns the inserted insight with an id and createdAt", () => {
      expect(inserted).toHaveProperty("id");
      expect(inserted).toHaveProperty("createdAt");
      expect(inserted.brand).toEqual(2);
      expect(inserted.text).toEqual("Inserted insight");
      expect(inserted.id).toBeGreaterThan(0);
      expect(inserted.createdAt).toBeInstanceOf(Date);
    });

    it("can be found in the database", () => {
      const found = fixture.db
        .sql`SELECT * FROM insights WHERE id = ${inserted.id}`;
      expect(found.length).toEqual(1);
      expect(found[0].text).toEqual("Inserted insight");
    });
  });
});

//deno test -A server/operations/insert-insight.test.ts
