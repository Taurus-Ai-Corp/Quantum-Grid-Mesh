# HEDERA Archival Log

**Date:** 2026-04-07
**Reason:** Consolidate 39 dirs → ~15. Gen 3 (q-grid-platform) is canonical.

## Pre-Archival Safety Check (2026-04-07)

### Remote Verification — ALL OK
| Directory | GitHub Remote | Status |
|-----------|-------------|--------|
| Comply.Q-Grid.EU | https://github.com/Taurus-Ai-Corp/Comply.Q-Grid | OK |
| Comply.Q-Grid.in | git@github.com:Taurus-Ai-Corp/Comply.Q-Grid.git | OK |
| Q-Grid.IN | https://github.com/Taurus-Ai-Corp/Q-GRID.IN | OK |
| Rupee_Grid_pay_Q-Grid.in | https://github.com/Taurus-Ai-Corp/Q-GRID.IN.git | OK |
| Q-Grid.CA | https://github.com/Taurus-Ai-Corp/Q-GRID.git | OK |
| OpsFlow.Taurusai.io | https://github.com/Taurus-Ai-Corp/opsflow-taurusai.git | OK |
| fraud-detection-demo | https://github.com/Taurus-Ai-Corp/fraud-detection-demo-private.git | OK |
| multi-ai-devops | https://github.com/Taurus-Ai-Corp/multi-ai-devops.git | OK |
| INNOVATIVE_IDEAS_DOCS | https://github.com/Taurus-Ai-Corp/innovative-ideas-docs.git | OK |
| taurus-cli | https://github.com/Taurus-Ai-Corp/taurus-cli.git | OK |
| huggingface-spaces | https://github.com/Taurus-Ai-Corp/huggingface-spaces.git | OK |
| ml-pipeline | https://github.com/Taurus-Ai-Corp/ml-pipeline.git | OK |

### Unpushed Work — 2 BLOCKERS
| Directory | Branch | Unpushed | Dirty | Notes |
|-----------|--------|----------|-------|-------|
| Comply.Q-Grid.EU | main | 0 | 24 | Untracked files only (build artifacts, docs) |
| Comply.Q-Grid.in | main | 0 | 3 | Untracked: .sisyphus/, .vercel/, publications/ |
| Q-Grid.IN | main | 0 | 4 | 2 modified + 2 untracked |
| **Rupee_Grid_pay_Q-Grid.in** | copilot/fix-hardcoded-secrets | **2** | **20** | **BLOCKER: 2 unpushed commits + 20 dirty files (screenshots, demos)** |
| Q-Grid.CA | main | 0 | 2 | 1 modified + 1 untracked |
| OpsFlow.Taurusai.io | main | 0 | 0 | CLEAN |
| **fraud-detection-demo** | main | **1** | **0** | **BLOCKER: 1 unpushed commit (initial private commit)** |
| multi-ai-devops | main | 0 | 0 | CLEAN |
| INNOVATIVE_IDEAS_DOCS | main | 0 | 2 | Renamed .txt → .md |
| taurus-cli | main | 0 | 12 | Duplicate files with "2" suffix |
| huggingface-spaces | main | 0 | 0 | CLEAN |
| ml-pipeline | main | 0 | 6 | .DS_Store files + INTEGRATION_GUIDE.md |

### Blocker Details
1. **Rupee_Grid_pay_Q-Grid.in** — Branch `copilot/fix-hardcoded-secrets` has 2 unpushed commits:
   - `fce35fb` Fix hardcoded secrets: remove default password, tighten CI scan patterns, add .env.example
   - `35b8ae9` Initial plan
   - ACTION NEEDED: Push branch or cherry-pick before archival

2. **fraud-detection-demo** — Main branch has 1 unpushed commit:
   - `69e10fd` chore: initial private commit for fraud-detection-demo
   - ACTION NEEDED: Push to origin/main before archival

## Archived Repos (moved to _archive/)
| Directory | GitHub Remote | Reason |
|-----------|-------------|--------|
| Comply.Q-Grid.EU/ | Taurus-Ai-Corp/Comply.Q-Grid | Gen 2 reference, superseded by q-grid-platform |
| Q-Grid.IN/ | Taurus-Ai-Corp/Q-GRID.IN | Gen 1, 24-agent system reference |
| Q-Grid.CA/ | Taurus-Ai-Corp/Q-GRID | Hedera integration reference |
| fraud-detection-demo/ | Taurus-Ai-Corp/fraud-detection-demo-private | Demo, not product |
| multi-ai-devops/ | Taurus-Ai-Corp/multi-ai-devops | Stale |
| INNOVATIVE_IDEAS_DOCS/ | Taurus-Ai-Corp/innovative-ideas-docs | Stale docs |
| taurus-cli/ | Taurus-Ai-Corp/taurus-cli | Superseded by q-grid-platform |
| huggingface-spaces/ | Taurus-Ai-Corp/huggingface-spaces | Reference only |
| ml-pipeline/ | Taurus-Ai-Corp/ml-pipeline | Reference only |

## Deleted (duplicates/empties)
| Directory | Reason |
|-----------|--------|
| Comply.Q-Grid.in/ | Duplicate of Comply.Q-Grid.EU/ (same remote + commit 79c9199) |
| Rupee_Grid_pay_Q-Grid.in/ | Duplicate of Q-Grid.IN/ (same remote Taurus-Ai-Corp/Q-GRID.IN, branch pushed) |
| node_modules/ | Orphan — old monorepo deps, 2GB (q-grid-platform is canonical) |
| dist/ | Orphan build artifact (4KB) |
| docker-extract/ | Empty directory |
| Comply.Q-Grid.net/ | Empty Next.js scaffold, not a git repo |

## Archived (old monorepo remnants)
| Directory | Archived To | Reason |
|-----------|-------------|--------|
| apps/ | _archive/monorepo-apps/ | Old monorepo remnant, superseded by q-grid-platform/apps/ |
| packages/ | _archive/monorepo-packages/ | Old monorepo remnant (includes @taurus/agent-handoff v1.0.0), superseded by q-grid-platform/packages/ |

## Parked (future projects — will resume)
| Directory | Reason | Resume When |
|-----------|--------|-------------|
| Obidien.taurusai.io/ | Phase 0, Pi 5 project | TBD |
| OpsFlow.Taurusai.io/ | Phase 2 of 7, paused | After Comply ships |
| OBD2-Ai-Diagnostic/ | Phase 0, vehicle diagnostics | TBD |

## Consolidated
| From | To | Reason |
|------|-----|--------|
| emails/ | grants/emails/ | Single file, logically belongs with grants |
| genmedia-mcp-bridge/ | gemini-integration/ | Single file, same system |
| Q-GRID-ECOSYSTEM/ | docs/architecture/ | Architecture docs belong in docs/ |
| tooling/ | _archive/tooling/ | Stale scripts |
