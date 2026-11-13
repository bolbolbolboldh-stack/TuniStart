import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

const pages = ['/', '/guide', '/diagnostic', '/ressources', '/glossaire', '/mentions']
const results = ['/resultats', '/resultats/orientation', '/resultats/documents', '/resultats/parcours', '/resultats/budget', '/resultats/synthese']

for (const theme of ['light', 'dark']) {
  test(`no serious/critical axe violations (${theme})`, async ({ page }) => {
    await page.goto('/mentions')
    await page.evaluate((t) => localStorage.setItem('tunistart-theme', t), theme)
    await page.goto('/resultats')
    await page.locator('main button:has-text("Karim")').first().click()
    for (const url of [...pages, ...results]) {
      await page.goto(url, { waitUntil: 'networkidle' })
      await page.waitForTimeout(700)
      const r = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()
      const bad = r.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')
      expect(bad.map((v) => `${url}: ${v.id} (${v.nodes.length}) ${v.nodes[0]?.target}`)).toEqual([])
    }
  })
}
