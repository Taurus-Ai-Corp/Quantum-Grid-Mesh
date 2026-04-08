# GRIDERA GUARD Spec

**Goal:** Validate every LLM call in the comply assessment engine — input guardrails, output guardrails, PQC-signed attestations, Hedera HCS audit anchoring. Enterprise buyers get proof that AI decisions are safe and compliant.

**Approach:** Single module (~300 LOC), not a fork. Wraps all AI Gateway calls. Uses existing `@taurus/pqc-crypto` for signing, `@taurus/hedera` for anchoring, `audit_trail` table for storage.

---

## Architecture

```
Assessment Request
  ↓
api/reports/route.ts
  ↓
aiGuard.execute(prompt, options)
  ├── INPUT GUARD: validate prompt
  │   ├── PII detection (email, phone, SSN patterns)
  │   ├── Token limit enforcement (model-specific)
  │   ├── Prompt injection detection (basic patterns)
  │   └── Jurisdiction-aware regulation references
  │
  ├── LLM CALL: sovereign AI gateway
  │   ├── Primary: Ollama/vLLM (self-hosted)
  │   └── Fallback: Cloud AI Gateway (Gemini/Claude)
  │
  ├── OUTPUT GUARD: validate response
  │   ├── JSON schema validation (report structure)
  │   ├── Hallucination check (referenced regulations exist)
  │   ├── Risk level consistency (matches input classification)
  │   └── Completeness check (all required sections present)
  │
  ├── ATTESTATION: sign verdict
  │   ├── ML-DSA-65 sign guard result (pass/fail + reasons)
  │   └── Include: model, tokens, latency, jurisdiction
  │
  └── AUDIT: anchor to ledger
      ├── Write to audit_trail table
      └── Submit to Hedera HCS topic
```

## Files

| File | Purpose | LOC |
|------|---------|-----|
| `apps/comply/src/lib/ai-guard.ts` | Core guard module — execute(), validateInput(), validateOutput() | ~200 |
| `apps/comply/src/lib/ai-guard-rules.ts` | Guard rules config — PII patterns, token limits, schema validators | ~80 |
| `apps/comply/src/lib/ai-guard.test.ts` | Tests — input rejection, output validation, attestation signing | ~120 |

## Guard Rules

### Input Rules
```typescript
interface InputRule {
  name: string
  check: (prompt: string, context: GuardContext) => GuardVerdict
}
```

- **no-pii**: Reject prompts containing email/phone/SSN patterns
- **token-limit**: Reject prompts exceeding model token limit (configurable per model)
- **no-injection**: Reject known prompt injection patterns ("ignore previous", "system prompt")
- **jurisdiction-valid**: Ensure referenced regulations match the active jurisdiction

### Output Rules
```typescript
interface OutputRule {
  name: string
  check: (response: string, context: GuardContext) => GuardVerdict
}
```

- **valid-json**: Response parses as valid JSON matching expected schema
- **known-regulations**: All cited regulation names exist in jurisdiction config
- **risk-consistent**: Output risk level aligns with input risk classification
- **sections-complete**: All required report sections are present

### GuardVerdict
```typescript
interface GuardVerdict {
  pass: boolean
  rule: string
  reason?: string       // Why it failed
  severity: 'block' | 'warn'
  timestamp: string
}
```

### GuardAttestation
```typescript
interface GuardAttestation {
  input_verdicts: GuardVerdict[]
  output_verdicts: GuardVerdict[]
  model: string
  tokens_in: number
  tokens_out: number
  latency_ms: number
  jurisdiction: string
  signature: string      // ML-DSA-65
  hedera_tx_id?: string  // HCS anchor
}
```

## Integration Point

The guard wraps the existing report generation flow. Currently:
```typescript
// Before: direct LLM call (unguarded)
const report = await generateReport(assessment)
```

After:
```typescript
// After: guarded LLM call
const { result, attestation } = await aiGuard.execute({
  prompt: buildReportPrompt(assessment),
  schema: reportSchema,
  jurisdiction: assessment.jurisdiction,
  model: 'ollama/qwen3-coder' // or cloud fallback
})
```

## What We Are NOT Building

- No Colang DSL or custom language (plain TypeScript rules)
- No NeMo Guardrails fork (wrong domain — LLM steering ≠ PQC compliance)
- No standalone service (module within comply app)
- No ML-based content moderation (rule-based is sufficient and auditable)
- No real-time streaming validation (batch per request)

## EU AI Act Compliance Mapping

| Article | Guard Feature |
|---------|--------------|
| Article 9 (Risk Management) | Input validation prevents unsafe prompts |
| Article 11 (Technical Documentation) | Every guard verdict logged + signed |
| Article 14 (Human Oversight) | `severity: 'block'` halts automation, requires human review |
| Article 15 (Accuracy) | Output validation checks regulation references + risk consistency |

## Verification

- Input with PII → blocked, attestation logged
- Output with hallucinated regulation → blocked, attestation logged
- Valid flow → attestation signed with ML-DSA-65, anchored to HCS
- Guard verdicts queryable in `/dashboard/audit-trail`
- 100% of LLM calls have guard attestations (no unguarded paths)
