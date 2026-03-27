/**
 * EU AI Act conformity assessment — 6 sections, 18 questions
 */

export interface AssessmentQuestion {
  id: string
  label: string
  type: 'text' | 'boolean' | 'select'
  options?: string[]
  helpText?: string
}

export interface AssessmentSection {
  id: string
  title: string
  description: string
  icon: string // Lucide icon name
  questions: AssessmentQuestion[]
}

export const euAssessmentSections: AssessmentSection[] = [
  {
    id: 'system-info',
    title: 'System Information',
    description: 'Basic details about the AI system and its intended purpose.',
    icon: 'Info',
    questions: [
      {
        id: 'intended_use',
        label: 'What is the intended use of this AI system?',
        type: 'text',
        helpText: 'Describe the primary function and purpose',
      },
      {
        id: 'deployment_scope',
        label: 'Describe the deployment scope (users, regions, scale).',
        type: 'text',
      },
      {
        id: 'autonomous_decisions',
        label: 'Does the system make autonomous decisions?',
        type: 'boolean',
        helpText: 'Decisions without human review',
      },
    ],
  },
  {
    id: 'risk-assessment',
    title: 'Risk Assessment',
    description: 'Evaluate potential risks and impacts of the AI system.',
    icon: 'AlertTriangle',
    questions: [
      {
        id: 'fundamental_rights',
        label: 'Could this system impact fundamental rights?',
        type: 'boolean',
        helpText: 'Privacy, discrimination, freedom of expression',
      },
      {
        id: 'safety_risks',
        label: 'Describe any safety risks associated with this system.',
        type: 'text',
      },
      {
        id: 'bias_assessment',
        label: 'How has bias been assessed and mitigated?',
        type: 'text',
      },
    ],
  },
  {
    id: 'data-governance',
    title: 'Data Governance',
    description: 'Data practices, quality measures, and privacy safeguards.',
    icon: 'Database',
    questions: [
      {
        id: 'training_data',
        label: 'Describe the training data used.',
        type: 'text',
      },
      {
        id: 'data_quality',
        label: 'What data quality measures are in place?',
        type: 'text',
      },
      {
        id: 'gdpr_compliant',
        label: 'Is personal data processing GDPR compliant?',
        type: 'boolean',
      },
    ],
  },
  {
    id: 'transparency',
    title: 'Transparency & Explainability',
    description: "How the system's decisions are communicated and explained.",
    icon: 'Eye',
    questions: [
      {
        id: 'user_notification',
        label: 'How are users notified they are interacting with AI?',
        type: 'text',
      },
      {
        id: 'explainability',
        label: "Describe the system's explainability capabilities.",
        type: 'text',
      },
      {
        id: 'documentation',
        label: 'Is comprehensive technical documentation available?',
        type: 'boolean',
      },
    ],
  },
  {
    id: 'human-oversight',
    title: 'Human Oversight',
    description: 'Human-in-the-loop controls and override capabilities.',
    icon: 'Users',
    questions: [
      {
        id: 'oversight_measures',
        label: 'What human oversight measures are implemented?',
        type: 'text',
      },
      {
        id: 'override_capability',
        label: 'Can human operators override system decisions?',
        type: 'boolean',
      },
      {
        id: 'monitoring',
        label: 'Describe ongoing monitoring and performance tracking.',
        type: 'text',
      },
    ],
  },
  {
    id: 'security',
    title: 'Robustness & Security',
    description: 'System resilience, security measures, and accuracy standards.',
    icon: 'Shield',
    questions: [
      {
        id: 'accuracy_metrics',
        label: 'What accuracy metrics and benchmarks are used?',
        type: 'text',
      },
      {
        id: 'security_measures',
        label: 'Describe cybersecurity measures in place.',
        type: 'text',
      },
      {
        id: 'adversarial_testing',
        label: 'Has adversarial testing been conducted?',
        type: 'boolean',
      },
    ],
  },
]
