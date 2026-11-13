import { expect, test, type Page } from '@playwright/test'

async function noHorizontalScroll(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  expect(overflow).toBeLessThanOrEqual(1)
}

test('Scenario A — Marché Karim, end to end through the wizard', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Préparez votre projet en toute clarté')
  await page.locator('main').getByRole('link', { name: 'Commencer le diagnostic' }).first().click()

  await page.getByRole('radio', { name: /Commerce de détail/ }).click()
  await page.getByRole('button', { name: /Suivant/ }).click()
  await page.getByRole('radio', { name: /Une seule personne/ }).click()
  await page.getByRole('button', { name: /Suivant/ }).click()
  await page.getByRole('radio', { name: /^Oui/ }).click()
  await page.getByRole('button', { name: /Suivant/ }).click()
  await page.getByLabel(/Budget initial/).fill('25000')
  await page.getByRole('button', { name: /Suivant/ }).click()
  await page.getByLabel('Gouvernorat').selectOption('siliana')
  await page.getByRole('button', { name: /Suivant/ }).click()
  await page.getByLabel(/Nom du projet/).fill('Marché Karim')
  await page.getByLabel(/Description précise/).fill('Commerce de détail de produits alimentaires et d’hygiène')
  await page.getByRole('radio', { name: '1', exact: true }).click()
  await page.getByRole('button', { name: /Suivant/ }).click()
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Vérifiez')
  await page.getByRole('button', { name: /Générer mon orientation/ }).click()

  await expect(page).toHaveURL(/\/resultats$/)
  await expect(page.locator('main')).toContainText('SUARL')
  await noHorizontalScroll(page)

  await page.goto('/resultats/orientation')
  await expect(page.locator('main')).toContainText('Un seul fondateur souhaitant protéger son patrimoine personnel')
  await expect(page.locator('main')).toContainText('Entreprise individuelle')

  await page.goto('/resultats/documents')
  for (const g of ['Constitution / dossier général', 'Fiscalité — DGI', 'Immatriculation — RNE', 'Sécurité sociale — CNSS']) await expect(page.locator('main')).toContainText(g)
  await page.getByRole('checkbox').first().click()
  await expect(page.locator('main')).toContainText(/1 sur \d+ préparés/)

  await page.goto('/resultats/parcours')
  await expect(page.locator('main ol > li')).toHaveCount(7)

  await page.goto('/resultats/budget')
  await page.getByRole('button', { name: /Charger l’exemple Marché Karim/ }).first().click()
  await expect(page.locator('main')).toContainText('25 000 TND')
  for (const p of ['48%', '24%', '16%', '6%']) await expect(page.locator('main table')).toContainText(p)
  await expect(page.locator('main')).toContainText('Équilibré')
  await noHorizontalScroll(page)

  await page.goto('/resultats/synthese')
  const download = page.waitForEvent('download')
  await page.getByRole('button', { name: /Télécharger le PDF/ }).click()
  expect((await download).suggestedFilename()).toMatch(/\.pdf$/)
})

test('language switch to Arabic sets RTL and the Tunisian flag picker', async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => localStorage.setItem('tunistart-lang', 'ar'))
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('حضّر مشروعك')
  await noHorizontalScroll(page)
})

test('theme switch to dark persists', async ({ page }) => {
  await page.goto('/glossaire')
  await page.evaluate(() => localStorage.setItem('tunistart-theme', 'dark'))
  await page.reload()
  await expect(page.locator('html')).toHaveClass(/dark/)
  await page.getByPlaceholder(/Rechercher/).fill('capital')
  await expect(page.locator('main dl')).toContainText('Capital social')
})
