/**
 * EU AI Act recommendation engine.
 *
 * Generates prioritised recommendations from assessment responses and category scores.
 * Priority order: critical → high → medium → low
 *
 * Key EU AI Act articles addressed:
 *   Article 9  — FRIA for fundamental rights impacts
 *   Article 11 — Technical documentation
 *   Article 14 — Human oversight and override capability
 *   Article 15 — Robustness and adversarial testing
 */

import type { Recommendation } from './assessment-store'

export type { Recommendation }

const PRIORITY_ORDER: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 }

// Human-readable labels for category IDs used in medium-priority recommendations
const CATEGORY_LABELS: Record<string, string> = {
  'system-info': 'System Information',
  'risk-assessment': 'Risk Assessment',
  'data-governance': 'Data Governance',
  transparency: 'Transparency',
  'human-oversight': 'Human Oversight',
  security: 'Robustness & Security',
}

/**
 * Generate prioritised EU AI Act recommendations.
 *
 * @param categoryScores - Section scores keyed by section ID (0-100)
 * @param responses      - Raw assessment responses keyed by question ID
 * @returns Sorted array of Recommendation objects (critical first)
 */
export function generateRecommendations(
  categoryScores: Record<string, number>,
  responses: Record<string, string | boolean>,
): Recommendation[] {
  const recs: Recommendation[] = []

  // ─── CRITICAL: Autonomous decisions without human override (Article 14) ─────
  if (responses['autonomous_decisions'] === true && responses['override_capability'] === false) {
    recs.push({
      id: 'rec-human-override',
      priority: 'critical',
      category: 'Human Oversight',
      title: 'Implement Human Override Capability',
      description:
        'Your system makes autonomous decisions without a human override mechanism. ' +
        'EU AI Act Article 14 mandates that operators must be able to intervene, suspend, ' +
        'or override AI outputs. Implement override controls before any EU deployment.',
    })
  }

  // ─── CRITICAL: Fundamental rights impact → FRIA (Article 9) ─────────────────
  if (responses['fundamental_rights'] === true) {
    recs.push({
      id: 'rec-fria',
      priority: 'critical',
      category: 'Risk Assessment',
      title: 'Conduct Fundamental Rights Impact Assessment (FRIA)',
      description:
        'Systems that impact fundamental rights require a formal Fundamental Rights ' +
        'Impact Assessment under EU AI Act Article 9 before deployment. ' +
        'Engage legal counsel and data-protection officers to complete the FRIA.',
    })
  }

  // ─── HIGH: GDPR non-compliance → data governance review ──────────────────────
  if (responses['gdpr_compliant'] === false) {
    recs.push({
      id: 'rec-gdpr-governance',
      priority: 'high',
      category: 'Data Governance',
      title: 'Data Governance Review — Establish GDPR Compliance',
      description:
        'GDPR compliance is a prerequisite for deploying AI systems that process personal ' +
        'data in the EU. Engage a Data Protection Officer, conduct a Data Protection Impact ' +
        'Assessment (DPIA), and document lawful bases for all personal-data processing.',
    })
  }

  // ─── HIGH: No technical documentation (Article 11) ───────────────────────────
  if (responses['documentation'] === false) {
    recs.push({
      id: 'rec-article11-docs',
      priority: 'high',
      category: 'Transparency',
      title: 'Create Technical Documentation per Article 11',
      description:
        'Technical documentation is mandatory under EU AI Act Article 11 and Annex IV. ' +
        'It must cover system description, intended purpose, development process, ' +
        'risk management measures, and testing results.',
    })
  }

  // ─── HIGH: No adversarial testing (Article 15) ───────────────────────────────
  if (responses['adversarial_testing'] === false) {
    recs.push({
      id: 'rec-article15-robustness',
      priority: 'high',
      category: 'Robustness & Security',
      title: 'Conduct Robustness Testing per Article 15',
      description:
        'EU AI Act Article 15 requires high-risk AI systems to be resilient against ' +
        'adversarial inputs. Perform adversarial robustness testing — including data ' +
        'poisoning, model evasion, and adversarial-example scenarios — and document results.',
    })
  }

  // ─── MEDIUM: Any category scoring below 50% ──────────────────────────────────
  for (const [sectionId, score] of Object.entries(categoryScores)) {
    if (score < 50) {
      const label = CATEGORY_LABELS[sectionId] ?? sectionId
      recs.push({
        id: `rec-improve-${sectionId}`,
        priority: 'medium',
        category: label,
        title: `Improve ${label} Compliance`,
        description:
          `Your ${label} section scored ${score}% — below the 50% threshold. ` +
          'Review the relevant EU AI Act requirements for this area and address ' +
          'the identified gaps to reduce compliance risk.',
      })
    }
  }

  // Sort by priority: critical → high → medium → low
  return recs.sort(
    (a, b) => (PRIORITY_ORDER[a.priority] ?? 3) - (PRIORITY_ORDER[b.priority] ?? 3),
  )
}
