/**
 * Risk Scoring Comparison tests — 7 tests covering:
 *   Customer risk (KYC/AML), Transaction risk (AML), Framework comparison (QRS vs RegTech)
 */

import { describe, it, expect } from 'vitest'
import {
  scoreCustomerRisk,
  scoreTransactionRisk,
  compareRiskFrameworks,
  type CustomerRiskInput,
  type TransactionRiskInput,
} from './risk-scoring-comparison'

describe('scoreCustomerRisk', () => {
  it('scores a customer with all factors producing 0-100 range and valid level', () => {
    const input: CustomerRiskInput = {
      jurisdictionRisk: 'medium',
      pepStatus: false,
      industryRisk: 'low',
      adverseMedia: false,
      transactionPattern: 'normal',
      accountAgeDays: 400,
    }
    const result = scoreCustomerRisk(input)
    expect(result.overall).toBeGreaterThanOrEqual(0)
    expect(result.overall).toBeLessThanOrEqual(100)
    expect(['low', 'medium', 'high', 'critical']).toContain(result.level)
    expect(result.factors).toHaveLength(6)
    expect(result.action).toBeTruthy()
  })

  it('flags PEP status as high risk with score >= 50', () => {
    const input: CustomerRiskInput = {
      jurisdictionRisk: 'high',
      pepStatus: true,
      industryRisk: 'high',
      adverseMedia: true,
      transactionPattern: 'suspicious',
      accountAgeDays: 10,
    }
    const result = scoreCustomerRisk(input)
    expect(result.overall).toBeGreaterThanOrEqual(50)
  })
})

describe('scoreTransactionRisk', () => {
  it('scores a transaction producing 0-100 range and valid level', () => {
    const input: TransactionRiskInput = {
      amountUsd: 500,
      averageAmountUsd: 400,
      txCountLast24h: 3,
      averageTxCountDaily: 2,
      originCountry: 'US',
      destinationCountry: 'US',
      counterpartyRisk: 'low',
      isOffHours: false,
    }
    const result = scoreTransactionRisk(input)
    expect(result.overall).toBeGreaterThanOrEqual(0)
    expect(result.overall).toBeLessThanOrEqual(100)
    expect(['low', 'medium', 'high', 'critical']).toContain(result.level)
    expect(result.factors).toHaveLength(5)
    expect(result.action).toBeTruthy()
  })

  it('flags extreme velocity anomaly (50x daily average) with score >= 50', () => {
    const input: TransactionRiskInput = {
      amountUsd: 60000,
      averageAmountUsd: 1000,
      txCountLast24h: 500,
      averageTxCountDaily: 10,
      originCountry: 'US',
      destinationCountry: 'NG',
      counterpartyRisk: 'medium',
      isOffHours: true,
    }
    const result = scoreTransactionRisk(input)
    expect(result.overall).toBeGreaterThanOrEqual(50)
  })
})

describe('compareRiskFrameworks', () => {
  it('returns comparison with qrs, regtech, gaps, and recommendations', () => {
    const comparison = compareRiskFrameworks()
    expect(comparison.qrs).toBeDefined()
    expect(comparison.qrs.name).toBeTruthy()
    expect(comparison.qrs.categories.length).toBeGreaterThan(0)
    expect(comparison.regtech).toBeDefined()
    expect(comparison.regtech.name).toBeTruthy()
    expect(comparison.regtech.categories.length).toBeGreaterThan(0)
    expect(comparison.gaps.length).toBeGreaterThan(0)
    expect(comparison.recommendations.length).toBeGreaterThan(0)
    expect(comparison.unifiedModel).toBeTruthy()
  })

  it('identifies QRS gaps that include customer risk', () => {
    const comparison = compareRiskFrameworks()
    const gapsText = comparison.gaps.join(' ').toLowerCase()
    expect(gapsText).toContain('customer')
  })

  it('identifies RegTech gaps related to PQC or algorithm analysis', () => {
    const comparison = compareRiskFrameworks()
    const gapsText = comparison.gaps.join(' ')
    const hasPqcOrAlgo = gapsText.includes('PQC') || gapsText.includes('algorithm')
    expect(hasPqcOrAlgo).toBe(true)
  })
})
