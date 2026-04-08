# GRIDERA OBSERVE Spec

**Goal:** Full observability of AI decision-making — cost tracking, latency, guard pass/fail rates, compliance score trends. Extends existing audit trail, not a separate system. EU AI Act Article 11 (technical documentation) compliance.

**Approach:** Add trace columns to existing `audit_trail` table + build dashboard page. Guard (from GRIDERA GUARD) writes traces automatically. No new services, no Langfuse fork.

---

## Architecture

```
GUARD attestation (from ai-guard.ts)
  ↓
audit_trail table (extended with trace columns)
  ↓
/dashboard/observe page (reads + visualizes)
```

OBSERVE doesn't intercept anything. It reads what GUARD writes. This is intentional — separation of concerns. GUARD enforces, OBSERVE reports.

## Schema Migration

Add 6 columns to existing `audit_trail` table:

```typescript
// packages/db/src/schema/audit-trail.ts — additions
model: text('model'),                    // 'ollama/qwen3-coder', 'gemini-1.5-flash'
tokens_in: integer('tokens_in'),          // prompt tokens
tokens_out: integer('tokens_out'),        // completion tokens
cost_usd: real('cost_usd'),              // calculated cost (tokens × model rate)
latency_ms: integer('latency_ms'),        // end-to-end LLM call time
guard_verdict: text('guard_verdict'),     // 'pass' | 'block' | 'warn'
```

These columns are nullable — existing audit records (non-LLM) continue working unchanged.

## Model Pricing Config

```typescript
// apps/comply/src/lib/observe-pricing.ts
const MODEL_RATES: Record<string, { input: number; output: number }> = {
  'ollama/qwen3-coder': { input: 0, output: 0 },           // self-hosted, free
  'gemini-1.5-flash':   { input: 0.000075, output: 0.0003 }, // per 1K tokens
  'gemini-1.5-pro':     { input: 0.00125, output: 0.005 },
  'claude-sonnet-4-6':  { input: 0.003, output: 0.015 },
}
```

Cost calculated at write time by GUARD, stored in `cost_usd`.

## Dashboard Page

**Route:** `/dashboard/observe`
**Layout:** Fits in existing dashboard sidebar (Systems, Assessments, Audit Trail, **Observe**, Documents)

### Sections

**1. Cost Summary (top cards)**
- Total cost this month (USD)
- Cost per assessment (average)
- Self-hosted vs cloud ratio
- Projected monthly cost at current rate

**2. Guard Health (middle row)**
- Pass/block/warn rates (pie or bar chart)
- Top blocked rules (which rules fire most)
- Block rate trend (are we getting better or worse)

**3. Performance (bottom row)**
- Latency P50/P95/P99
- Tokens per assessment (average)
- Model usage breakdown (which models used how often)

**4. Compliance Score Trends (timeline)**
- Average QRS score over time
- Score distribution by jurisdiction
- Assessment completion rates

### Data Source

All queries hit the `audit_trail` table with `action = 'ai_guard_attestation'` filter. No new tables needed.

```typescript
// Example query for cost summary
const costData = await db
  .select({
    total: sql<number>`sum(cost_usd)`,
    count: sql<number>`count(*)`,
    avg: sql<number>`avg(cost_usd)`,
  })
  .from(auditTrail)
  .where(and(
    eq(auditTrail.action, 'ai_guard_attestation'),
    gte(auditTrail.createdAt, startOfMonth),
    eq(auditTrail.jurisdiction, jurisdiction),
  ))
```

## Files

| File | Purpose | LOC |
|------|---------|-----|
| `packages/db/src/schema/audit-trail.ts` | Add 6 trace columns (modify existing) | +10 |
| `apps/comply/src/lib/observe-pricing.ts` | Model pricing rates | ~30 |
| `apps/comply/src/app/dashboard/observe/page.tsx` | Dashboard page | ~200 |
| `apps/comply/src/app/dashboard/observe/components/` | Chart components (cost, guard, perf, trends) | ~300 |
| `apps/comply/src/app/api/observe/route.ts` | API endpoint for dashboard data | ~80 |
| `apps/comply/src/lib/observe.test.ts` | Tests — cost calculation, query logic | ~60 |

## Dependencies on GUARD

OBSERVE reads what GUARD writes. Build order matters:
1. GUARD ships first (writes attestations)
2. OBSERVE ships second (reads + visualizes them)

Without GUARD, OBSERVE has nothing to show.

## What We Are NOT Building

- No Langfuse fork (dashboard bloat for 5 extra columns)
- No separate tracing database (audit_trail is the trace store)
- No OpenTelemetry integration (overkill for single-app compliance)
- No real-time streaming dashboard (page load refresh is fine for compliance)
- No alerting system (Phase 2 — after there's enough data to set thresholds)

## EU AI Act Compliance Mapping

| Article | Observe Feature |
|---------|----------------|
| Article 11 (Technical Documentation) | Full trace of every AI decision: model, tokens, cost, verdict |
| Article 12 (Record-Keeping) | All traces PQC-signed + Hedera HCS anchored |
| Article 13 (Transparency) | Dashboard shows exactly what AI did and why |
| Article 61 (Post-Market Monitoring) | Trend analysis shows quality over time |

## Verification

- After 10 guarded assessments: `/dashboard/observe` shows cost, latency, guard rates
- Cost calculation matches manual token count × model rate
- Guard verdict breakdown matches actual pass/block counts in audit_trail
- PQC signatures on all trace records verify successfully
- Dashboard loads in <2 seconds with 1000 trace records
