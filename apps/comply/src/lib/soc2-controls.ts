/**
 * SOC 2 Type II Trust Services Criteria (TSC) control definitions.
 *
 * 33 controls across 5 categories: Security (CC1-CC9), Availability (A1),
 * Processing Integrity (PI1), Confidentiality (C1), and Privacy (P1-P8).
 *
 * Used for self-assessment readiness and customer-facing compliance reporting.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Soc2Control {
  id: string
  category: 'Security' | 'Availability' | 'Processing Integrity' | 'Confidentiality' | 'Privacy'
  title: string
  description: string
  guidance: string
}

// ---------------------------------------------------------------------------
// Control definitions — 33 total
// ---------------------------------------------------------------------------

export const SOC2_CONTROLS: Soc2Control[] = [
  // ─── Security (CC1-CC9) — 19 controls ────────────────────────────────────

  {
    id: 'CC1.1',
    category: 'Security',
    title: 'Control Environment',
    description:
      'The entity demonstrates a commitment to integrity and ethical values.',
    guidance:
      'Document a code of conduct, establish ethics policies, and ensure leadership sets tone at the top with regular communications on security expectations.',
  },
  {
    id: 'CC1.2',
    category: 'Security',
    title: 'Board Oversight',
    description:
      'The board of directors demonstrates independence from management and exercises oversight of internal controls.',
    guidance:
      'Establish a board or advisory committee with security oversight responsibilities. Document meeting minutes and control review cadence.',
  },
  {
    id: 'CC2.1',
    category: 'Security',
    title: 'Internal Communication',
    description:
      'The entity internally communicates information necessary to support the functioning of internal controls.',
    guidance:
      'Implement internal security bulletins, onboarding training, and incident notification procedures. Document communication channels and escalation paths.',
  },
  {
    id: 'CC2.2',
    category: 'Security',
    title: 'External Communication',
    description:
      'The entity communicates with external parties regarding matters affecting the functioning of internal controls.',
    guidance:
      'Publish security contact information, vulnerability disclosure policy, and status pages. Document external communication procedures for incidents.',
  },
  {
    id: 'CC3.1',
    category: 'Security',
    title: 'Risk Identification',
    description:
      'The entity identifies and assesses risks to the achievement of its objectives.',
    guidance:
      'Perform regular risk assessments covering technology, personnel, and third-party risks. Maintain a risk register with likelihood and impact ratings.',
  },
  {
    id: 'CC3.2',
    category: 'Security',
    title: 'Fraud Risk',
    description:
      'The entity considers the potential for fraud in assessing risks to the achievement of objectives.',
    guidance:
      'Assess fraud risk across management override, asset misappropriation, and data manipulation. Implement separation of duties and anomaly detection.',
  },
  {
    id: 'CC4.1',
    category: 'Security',
    title: 'Monitoring Activities',
    description:
      'The entity selects, develops, and performs ongoing evaluations to ascertain whether components of internal control are present and functioning.',
    guidance:
      'Deploy continuous monitoring dashboards, automated alerting, and scheduled control reviews. Document monitoring scope and frequency.',
  },
  {
    id: 'CC5.1',
    category: 'Security',
    title: 'Control Activities Policies',
    description:
      'The entity selects and develops control activities that contribute to the mitigation of risks.',
    guidance:
      'Define and document security policies covering access control, encryption, change management, and incident response. Review annually.',
  },
  {
    id: 'CC6.1',
    category: 'Security',
    title: 'Logical Access',
    description:
      'The entity implements logical access security software, infrastructure, and architectures over protected information assets.',
    guidance:
      'Implement identity provider with SSO, MFA, and session management. Document access control architecture and authentication flows.',
  },
  {
    id: 'CC6.2',
    category: 'Security',
    title: 'User Registration',
    description:
      'Prior to issuing system credentials and granting system access, the entity registers and authorizes new users.',
    guidance:
      'Implement user onboarding workflows with approval chains. Document registration process, identity verification steps, and access provisioning.',
  },
  {
    id: 'CC6.3',
    category: 'Security',
    title: 'Role-Based Access',
    description:
      'The entity authorizes, modifies, or removes access to data and functionality based on roles.',
    guidance:
      'Implement RBAC with principle of least privilege. Conduct quarterly access reviews and document role definitions and permission matrices.',
  },
  // NOTE: CC6.4 (Restrictions for New Users), CC6.5 (Identification of Unauthorized Access),
  // CC6.7 (Transmission Protections beyond Encryption), and CC6.8 (Malicious Software Prevention)
  // are physical/operational controls (badge access, hardware disposal, anti-malware on endpoints)
  // and are excluded from this software-only assessment scope.
  {
    id: 'CC6.6',
    category: 'Security',
    title: 'Encryption',
    description:
      'The entity implements controls to prevent or detect unauthorized access to information during transmission and at rest.',
    guidance:
      'Encrypt data in transit (TLS 1.3) and at rest (AES-256). Implement post-quantum cryptography for long-term data protection. Document key management procedures.',
  },
  {
    id: 'CC7.1',
    category: 'Security',
    title: 'System Monitoring',
    description:
      'The entity monitors system components and the operation of those components for anomalies.',
    guidance:
      'Deploy observability stack with metrics, logs, and traces. Monitor application performance, error rates, and resource utilization.',
  },
  {
    id: 'CC7.2',
    category: 'Security',
    title: 'Anomaly Detection',
    description:
      'The entity identifies anomalies in the operation of system components through ongoing monitoring.',
    guidance:
      'Implement automated anomaly detection with configurable thresholds and alerting rules. Analyse guard attestations for patterns and deviations.',
  },
  {
    id: 'CC7.3',
    category: 'Security',
    title: 'Security Event Evaluation',
    description:
      'The entity evaluates identified security events to determine whether they could affect the achievement of objectives.',
    guidance:
      'Establish a triage process for security events with severity classification. Document evaluation criteria and escalation thresholds.',
  },
  {
    id: 'CC7.4',
    category: 'Security',
    title: 'Incident Response',
    description:
      'The entity responds to identified security incidents by executing a defined incident response programme.',
    guidance:
      'Maintain an incident response plan with defined roles, communication procedures, containment strategies, and post-incident review process.',
  },
  {
    id: 'CC8.1',
    category: 'Security',
    title: 'Change Management',
    description:
      'The entity authorizes, designs, develops, configures, documents, tests, approves, and implements changes to infrastructure and software.',
    guidance:
      'Implement CI/CD with code review, automated testing, staging environments, and deployment approval gates. Document change management procedures.',
  },
  {
    id: 'CC9.1',
    category: 'Security',
    title: 'Risk Mitigation',
    description:
      'The entity identifies, selects, and develops risk mitigation activities for risks arising from business objectives.',
    guidance:
      'Document risk treatment plans with compensating controls. Implement PQC migration for cryptographic risk and guard rules for AI safety risks.',
  },
  {
    id: 'CC9.2',
    category: 'Security',
    title: 'Vendor Management',
    description:
      'The entity assesses and manages risks associated with vendors and business partners.',
    guidance:
      'Maintain a vendor register with risk ratings. Conduct due diligence for critical vendors covering security posture, data handling, and business continuity.',
  },

  // ─── Availability (A1) — 2 controls ──────────────────────────────────────

  {
    id: 'A1.1',
    category: 'Availability',
    title: 'System Availability',
    description:
      'The entity maintains, monitors, and evaluates current processing capacity and system availability.',
    guidance:
      'Define SLA targets (uptime, latency). Monitor availability with synthetic checks and real-user monitoring. Document capacity planning procedures.',
  },
  {
    id: 'A1.2',
    category: 'Availability',
    title: 'Recovery Objectives',
    description:
      'The entity authorizes, designs, develops, and implements recovery procedures to meet its objectives.',
    guidance:
      'Define RPO/RTO targets. Implement backup procedures, disaster recovery runbooks, and conduct regular recovery testing. Document recovery procedures.',
  },

  // ─── Processing Integrity (PI1) — 2 controls ────────────────────────────

  {
    id: 'PI1.1',
    category: 'Processing Integrity',
    title: 'Processing Accuracy',
    description:
      'The entity implements policies and procedures over system processing to result in products that meet specifications.',
    guidance:
      'Validate outputs against expected schemas and business rules. Implement guard output validation for AI-generated content. Document validation criteria.',
  },
  {
    id: 'PI1.2',
    category: 'Processing Integrity',
    title: 'Input Validation',
    description:
      'The entity implements policies and procedures to verify the completeness and accuracy of inputs.',
    guidance:
      'Implement input validation rules for all system entry points. Use guard input rules for AI prompts. Document validation schemas and rejection handling.',
  },

  // ─── Confidentiality (C1) — 2 controls ──────────────────────────────────

  {
    id: 'C1.1',
    category: 'Confidentiality',
    title: 'Confidential Information',
    description:
      'The entity identifies and maintains confidential information to meet the entity\'s objectives related to confidentiality.',
    guidance:
      'Classify data by sensitivity level. Implement PII detection and blocking in AI pipelines. Document data classification scheme and handling procedures.',
  },
  {
    id: 'C1.2',
    category: 'Confidentiality',
    title: 'Disposal',
    description:
      'The entity disposes of confidential information to meet the entity\'s objectives related to confidentiality.',
    guidance:
      'Implement data retention policies with automated disposal. Ensure cryptographic key destruction and secure media sanitisation. Document disposal procedures.',
  },

  // ─── Privacy (P1-P8) — 8 controls ───────────────────────────────────────

  {
    id: 'P1.1',
    category: 'Privacy',
    title: 'Privacy Notice',
    description:
      'The entity provides notice to data subjects about its privacy practices to meet its objectives related to privacy.',
    guidance:
      'Publish a clear privacy notice covering data collection, use, sharing, retention, and rights. Update when practices change. Ensure accessibility.',
  },
  {
    id: 'P2.1',
    category: 'Privacy',
    title: 'Choice and Consent',
    description:
      'The entity communicates choices available regarding the collection, use, and disclosure of personal information.',
    guidance:
      'Implement granular consent mechanisms with opt-in/opt-out controls. Record consent timestamps and versions. Support consent withdrawal.',
  },
  {
    id: 'P3.1',
    category: 'Privacy',
    title: 'Collection Limitation',
    description:
      'The entity limits the collection of personal information to that which is necessary for its objectives.',
    guidance:
      'Enforce data minimisation through PII guard rules that block unnecessary personal data from AI processing. Document collection justification.',
  },
  {
    id: 'P4.1',
    category: 'Privacy',
    title: 'Use and Retention',
    description:
      'The entity limits the use and retention of personal information to the purposes identified in the privacy notice.',
    guidance:
      'Define retention periods per data category. Implement automated purge schedules. Audit data usage against stated purposes.',
  },
  {
    id: 'P5.1',
    category: 'Privacy',
    title: 'Access Rights',
    description:
      'The entity grants identified and authenticated data subjects the ability to access their stored personal information.',
    guidance:
      'Implement data export functionality (JSON/CSV). Provide self-service access portal or documented request process. Respond within regulatory timelines.',
  },
  {
    id: 'P6.1',
    category: 'Privacy',
    title: 'Disclosure',
    description:
      'The entity discloses personal information to third parties only for identified purposes and with consent of the data subject.',
    guidance:
      'Maintain a register of third-party data recipients. Implement data sharing agreements. Log all disclosures with purpose and legal basis.',
  },
  {
    id: 'P7.1',
    category: 'Privacy',
    title: 'Quality',
    description:
      'The entity collects and maintains accurate, up-to-date, complete, and relevant personal information.',
    guidance:
      'Implement data quality checks at collection and periodic review. Provide self-service profile correction. Document data quality standards.',
  },
  {
    id: 'P8.1',
    category: 'Privacy',
    title: 'Monitoring',
    description:
      'The entity monitors compliance with its privacy commitments and procedures and addresses non-compliance.',
    guidance:
      'Conduct periodic privacy audits. Monitor data access patterns for anomalies. Report privacy metrics to leadership. Document audit findings and remediation.',
  },
]
