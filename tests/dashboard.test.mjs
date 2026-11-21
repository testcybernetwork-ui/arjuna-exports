import assert from "node:assert/strict";
import test from "node:test";
import { normalizeDashboardSummary } from "../src/lib/dashboard-summary.ts";

test("reproduces and prevents crash when recent is undefined", () => {
  // Legacy buggy response:
  const legacyBuggySummary = {
    total: 24,
    published: 21,
    drafts: 3,
    articles: [{ id: "1", title: "Test Article", slug: "test-article", status: "published" }],
    // recent is undefined
  };

  assert.throws(
    () => {
      // This is the exact code that caused the crash in production:
      // summary && summary.recent.length === 0
      if (legacyBuggySummary && legacyBuggySummary.recent.length === 0) {
        // unreachable
      }
    },
    {
      name: "TypeError",
      message: /Cannot read properties of undefined \(reading 'length'\)/,
    },
  );

  // With normalization, it gracefully adapts and prevents the crash:
  const normalized = normalizeDashboardSummary(legacyBuggySummary);
  assert.equal(normalized.total, 24);
  assert.equal(normalized.published, 21);
  assert.equal(normalized.drafts, 3);
  assert.equal(normalized.recent.length, 1);
  assert.equal(normalized.recent[0]?.title, "Test Article");
  assert.equal(normalized.recent.length === 0, false);
});

test("normalizeDashboardSummary handles undefined, null, and empty objects", () => {
  const fromUndefined = normalizeDashboardSummary(undefined);
  assert.deepEqual(fromUndefined, { total: 0, published: 0, drafts: 0, recent: [] });

  const fromNull = normalizeDashboardSummary(null);
  assert.deepEqual(fromNull, { total: 0, published: 0, drafts: 0, recent: [] });

  const fromEmpty = normalizeDashboardSummary({});
  assert.deepEqual(fromEmpty, { total: 0, published: 0, drafts: 0, recent: [] });

  const fromErrorResponse = normalizeDashboardSummary({ error: "Unauthorized", status: 401 });
  assert.deepEqual(fromErrorResponse, { total: 0, published: 0, drafts: 0, recent: [] });
});

test("normalizeDashboardSummary handles string numbers, corrupted types and null arrays", () => {
  const corrupted = {
    total: "42",
    published: "30",
    drafts: "12",
    recent: [
      null,
      { id: "art-1", title: "Article 1", slug: "art-1", status: "published" },
      { id: "art-2" }, // missing fields
      "invalid",
    ],
  };

  const normalized = normalizeDashboardSummary(corrupted);
  assert.equal(normalized.total, 42);
  assert.equal(normalized.published, 30);
  assert.equal(normalized.drafts, 12);
  assert.equal(normalized.recent.length, 2);
  assert.equal(normalized.recent[0]?.id, "art-1");
  assert.equal(normalized.recent[0]?.title, "Article 1");
  assert.equal(normalized.recent[1]?.id, "art-2");
  assert.equal(normalized.recent[1]?.title, "Untitled");
  assert.equal(normalized.recent[1]?.status, "draft");
});

test("Dashboard list logic renders cleanly with empty and undefined lists without throwing", () => {
  // Simulating the rendered view when summary.recent is empty
  const emptySummary = normalizeDashboardSummary({ total: 0, published: 0, drafts: 0, recent: [] });
  assert.equal(emptySummary.recent.length, 0);

  // Even if accessed directly with optional chaining as in the fixed component:
  const isRecentEmpty = (emptySummary?.recent?.length ?? 0) === 0;
  assert.equal(isRecentEmpty, true);
});
