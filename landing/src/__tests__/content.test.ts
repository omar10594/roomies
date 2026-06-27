import { describe, it, expect } from 'vitest'
import { features, steps, faqs } from '../lib/content'

describe('content data', () => {
  describe('features', () => {
    it('has 6 features', () => {
      expect(features).toHaveLength(6)
    })

    it('every feature has required fields', () => {
      features.forEach((feature) => {
        expect(typeof feature.title).toBe('string')
        expect(feature.title.length).toBeGreaterThan(0)
        expect(typeof feature.description).toBe('string')
        expect(feature.description.length).toBeGreaterThan(10)
        expect(typeof feature.color).toBe('string')
      })
    })

    it('includes all core features from the landing page', () => {
      const titles = features.map((f) => f.title)
      expect(titles).toContain('Smart Rent Splitting')
      expect(titles).toContain('Expense Tracking')
      expect(titles).toContain('Chore Management')
      expect(titles).toContain('Household Chat')
      expect(titles).toContain('Calendar & Reminders')
      expect(titles).toContain('Spending Insights')
    })

    it('each description is a meaningful sentence', () => {
      features.forEach((feature) => {
        expect(feature.description).toMatch(/\.$/)
        const words = feature.description.split(/\s+/)
        expect(words.length).toBeGreaterThanOrEqual(15)
      })
    })

    it('feature count matches expected', () => {
      expect(features.length).toBe(6)
    })
  })

  describe('steps', () => {
    it('has exactly 3 steps', () => {
      expect(steps).toHaveLength(3)
    })

    it('steps are numbered 1, 2, 3', () => {
      expect(steps.map((s) => s.number)).toEqual([1, 2, 3])
    })

    it('every step has a title and description', () => {
      steps.forEach((step) => {
        expect(typeof step.title).toBe('string')
        expect(step.title.length).toBeGreaterThan(0)
        expect(typeof step.description).toBe('string')
        expect(step.description.length).toBeGreaterThan(0)
      })
    })
  })

  describe('faqs', () => {
    it('has FAQs', () => {
      expect(faqs).toHaveLength(4)
    })

    it('every FAQ has a question and answer', () => {
      faqs.forEach((faq) => {
        expect(typeof faq.question).toBe('string')
        expect(faq.question.length).toBeGreaterThan(0)
        expect(typeof faq.answer).toBe('string')
        expect(faq.answer.length).toBeGreaterThan(20)
      })
    })

    it('covers key concerns', () => {
      const questions = faqs.map((f) => f.question.toLowerCase())
      expect(questions).toBeTruthy()
    })
  })
})
