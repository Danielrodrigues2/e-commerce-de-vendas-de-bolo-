import { expect, test } from '@playwright/test'

test('fluxo de compra: catálogo → produto → carrinho persistente → revisão', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Momentos especiais merecem bolos')
  await page.getByRole('link', { name: 'Ver nossos bolos' }).first().click()
  await expect(page).toHaveURL(/\/bolos$/)

  await page.getByRole('link', { name: 'Bolo de Ninho com Morango' }).click()
  await page.getByText('Grande', { exact: true }).click()
  await page.getByRole('button', { name: /Adicionar ao carrinho · R\$ 179,90/ }).click()
  await expect(page.getByText('1 × Bolo de Ninho com Morango adicionado ao carrinho.')).toBeVisible()

  await page.reload()
  await expect(page.getByRole('link', { name: 'Carrinho com 1 item' })).toBeVisible()
  await page.goto('/carrinho')
  await expect(page.getByText('Tamanho: Grande')).toBeVisible()
  await page.getByRole('link', { name: /Revisar pedido/ }).click()
  await expect(page).toHaveURL(/\/finalizar$/)
  await page.getByRole('button', { name: /Revisar pedido/ }).click()
  await expect(page.getByRole('alert').first()).toContainText('campos a corrigir')
})

test('sem rolagem horizontal nas páginas principais', async ({ page }) => {
  for (const path of ['/', '/bolos', '/bolos/bolo-red-velvet', '/carrinho', '/finalizar', '/encomendas', '/como-comprar', '/privacidade']) {
    await page.goto(path)
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
    expect(overflow, path).toBeLessThanOrEqual(0)
  }
})

test('menu mobile abre, navega e fecha', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'apenas em telas pequenas')
  await page.goto('/')
  await page.getByRole('button', { name: 'Abrir menu' }).click()
  await expect(page.locator('#menu-mobile')).toBeVisible()
  await page.locator('#menu-mobile').getByRole('link', { name: /Como comprar/ }).click()
  await expect(page).toHaveURL(/\/como-comprar$/)
  await expect(page.locator('#menu-mobile')).toBeHidden()
})
