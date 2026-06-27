import { describe, it, expect, beforeAll } from 'vitest'
import { execSync } from 'node:child_process'
import * as fs from 'node:fs'
import * as path from 'node:path'

const siteDir = path.resolve(__dirname, '../../dist')
const indexPath = path.join(siteDir, 'index.html')

describe('built landing page', () => {
  beforeAll(() => {
    execSync('npx astro build', {
      cwd: path.resolve(__dirname, '../../'),
      stdio: 'pipe',
    })
  })

  it('build produces _site/index.html', () => {
    expect(fs.existsSync(indexPath)).toBe(true)
  })

  it('index.html is not empty', () => {
    const html = fs.readFileSync(indexPath, 'utf-8')
    expect(html.length).toBeGreaterThan(5000)
  })

  it('contains the main heading', () => {
    const html = fs.readFileSync(indexPath, 'utf-8')
    expect(html).toContain('Make Roommate Life')
  })

  it('contains CTA section', () => {
    const html = fs.readFileSync(indexPath, 'utf-8')
    expect(html).toContain('Get Early Access')
  })

  it('contains features section', () => {
    const html = fs.readFileSync(indexPath, 'utf-8')
    expect(html).toContain('Smart Rent Splitting')
    expect(html).toContain('Expense Tracking')
    expect(html).toContain('Chore Management')
  })

  it('contains signup form', () => {
    const html = fs.readFileSync(indexPath, 'utf-8')
    expect(html).toContain('Join Waitlist')
    expect(html).toContain('type="email"')
  })

  it('contains FAQ section', () => {
    const html = fs.readFileSync(indexPath, 'utf-8')
    expect(html).toContain('Is Roomies really free?')
    expect(html).toContain('Is my financial data secure?')
  })

  it('contains meta description', () => {
    const html = fs.readFileSync(indexPath, 'utf-8')
    expect(html).toContain('Roomies makes sharing a home effortless')
  })

  it('has valid HTML structure', () => {
    const html = fs.readFileSync(indexPath, 'utf-8')
    expect(html.toUpperCase()).toContain('<!DOCTYPE HTML>')
    expect(html).toContain('<html')
    expect(html).toContain('</html>')
  })
})
