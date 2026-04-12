'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Server, ClipboardCheck, FileText, ChevronRight, ShieldCheck, BadgeCheck, ScrollText } from 'lucide-react'

interface DashboardStats {
  systemCount: number
  assessmentCount: number
  reportCount: number
}

interface FeatureStats {
  coveragePercent: string
  soc2Score: string
  policyLabel: string
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    systemCount: 0,
    assessmentCount: 0,
    reportCount: 0,
  })
  const [featureStats, setFeatureStats] = useState<FeatureStats>({
    coveragePercent: '\u2014',
    soc2Score: '\u2014',
    policyLabel: '\u2014',
  })

  useEffect(() => {
    fetch('/api/systems')
      .then((res) => {
        if (!res.ok) return
        return res.json() as Promise<{ systems: unknown[] }>
      })
      .then((data) => {
        if (data) {
          setStats((prev) => ({ ...prev, systemCount: data.systems.length }))
        }
      })
      .catch(() => {
        // silently fail — stats stay at 0
      })

    Promise.all([
      fetch('/api/compliance-matrix?view=coverage').then((r) => (r.ok ? r.json() as Promise<{ coveragePercent: number }> : null)).catch(() => null),
      fetch('/api/soc2?view=score').then((r) => (r.ok ? r.json() as Promise<{ overall: number }> : null)).catch(() => null),
      fetch('/api/policies').then((r) => (r.ok ? r.json() as Promise<{ types?: unknown[] }> : null)).catch(() => null),
    ]).then(([coverage, soc2, policies]) => {
      setFeatureStats({
        coveragePercent: coverage ? `${coverage.coveragePercent}%` : '\u2014',
        soc2Score: soc2 ? `${soc2.overall}%` : '\u2014',
        policyLabel: policies?.types ? `${policies.types.length} policy types` : '\u2014',
      })
    })
  }, [])

  const STAT_CARDS = [
    {
      label: 'AI Systems',
      value: stats.systemCount,
      icon: Server,
      description: 'Registered AI systems',
      href: '/dashboard/systems',
    },
    {
      label: 'Assessments',
      value: stats.assessmentCount,
      icon: ClipboardCheck,
      description: 'Conformity assessments',
      href: '/dashboard/assessments',
    },
    {
      label: 'Reports',
      value: stats.reportCount,
      icon: FileText,
      description: 'Generated reports',
      href: '/dashboard/reports',
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-graphite mb-1">
          Dashboard
        </h1>
        <p className="text-sm text-graphite-med">
          EU AI Act compliance overview
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {STAT_CARDS.map((card) => {
          const Icon = card.icon
          return (
            <Link
              key={card.label}
              href={card.href}
              className="bg-white rounded-brand p-5 border border-graphite-ghost shadow-sm hover:shadow-md transition-shadow block"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-graphite-light uppercase tracking-wide">
                  {card.label}
                </span>
                <div className="w-8 h-8 rounded-lg bg-accent-light flex items-center justify-center">
                  <Icon className="h-4 w-4 text-accent" />
                </div>
              </div>
              <p className="font-heading text-3xl font-bold text-graphite">
                {card.value}
              </p>
              <p className="text-xs text-graphite-light mt-1">{card.description}</p>
            </Link>
          )
        })}
      </div>

      {/* Get started card */}
      <div className="bg-white rounded-brand border border-graphite-ghost shadow-sm p-8 max-w-[600px]">
        <div className="w-12 h-12 rounded-lg bg-accent-light flex items-center justify-center mb-5">
          <Server className="h-6 w-6 text-accent" />
        </div>
        <h2 className="font-semibold text-lg text-graphite mb-2">
          Get Started
        </h2>
        <p className="text-sm text-graphite-med mb-6 leading-relaxed">
          Register your first AI system to begin EU AI Act compliance assessment. We'll
          guide you through risk classification, technical documentation, and conformity
          declaration.
        </p>
        <Link
          href="/dashboard/systems/new"
          className="inline-flex items-center gap-2 h-10 px-5 text-sm font-semibold text-white bg-accent rounded-brand hover:bg-accent-dark transition-colors"
        >
          Register AI System
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Compliance Tools section header */}
      <div className="mt-8 mb-4">
        <h2 className="text-sm font-semibold text-graphite-med uppercase tracking-wide">
          Compliance Tools
        </h2>
        <div className="mt-2 border-t border-graphite-ghost" />
      </div>

      {/* Feature summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/dashboard/compliance-matrix"
          className="bg-white rounded-brand p-5 border border-graphite-ghost shadow-sm hover:shadow-md transition-shadow block"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-graphite-light uppercase tracking-wide">
              Compliance Coverage
            </span>
            <div className="w-8 h-8 rounded-lg bg-accent-light flex items-center justify-center">
              <ShieldCheck className="h-4 w-4 text-accent" />
            </div>
          </div>
          <p className="font-heading text-3xl font-bold text-graphite">
            {featureStats.coveragePercent}
          </p>
          <p className="text-xs text-graphite-light mt-1">Audit matrix coverage</p>
        </Link>

        <Link
          href="/dashboard/soc2"
          className="bg-white rounded-brand p-5 border border-graphite-ghost shadow-sm hover:shadow-md transition-shadow block"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-graphite-light uppercase tracking-wide">
              SOC 2 Readiness
            </span>
            <div className="w-8 h-8 rounded-lg bg-accent-light flex items-center justify-center">
              <BadgeCheck className="h-4 w-4 text-accent" />
            </div>
          </div>
          <p className="font-heading text-3xl font-bold text-graphite">
            {featureStats.soc2Score}
          </p>
          <p className="text-xs text-graphite-light mt-1">Overall readiness score</p>
        </Link>

        <Link
          href="/dashboard/policies"
          className="bg-white rounded-brand p-5 border border-graphite-ghost shadow-sm hover:shadow-md transition-shadow block"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-graphite-light uppercase tracking-wide">
              Policies
            </span>
            <div className="w-8 h-8 rounded-lg bg-accent-light flex items-center justify-center">
              <ScrollText className="h-4 w-4 text-accent" />
            </div>
          </div>
          <p className="font-heading text-3xl font-bold text-graphite">
            {featureStats.policyLabel}
          </p>
          <p className="text-xs text-graphite-light mt-1">Generate compliance policies</p>
        </Link>
      </div>
    </div>
  )
}
