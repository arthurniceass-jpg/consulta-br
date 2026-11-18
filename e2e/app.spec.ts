import { expect, test } from '@playwright/test';

// Testes de fumaça: não dependem da BrasilAPI (rodam sem internet).

test('abre a Home com a busca de CNPJ', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/inicio$/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Dados públicos do Brasil');
});

test('avisa quando o CNPJ é inválido', async ({ page }) => {
  await page.goto('/inicio');
  await page.locator('ion-input input').fill('12345678000100');
  await page.getByRole('button', { name: 'Consultar' }).click();
  await expect(page.getByRole('alert')).toContainText('CNPJ inválido');
});

test('mostra os 5 integrantes na aba Equipe', async ({ page }) => {
  await page.goto('/inicio');
  await page.locator('ion-tab-button[tab="equipe"]').click();
  await expect(page).toHaveURL(/\/equipe$/);
  await expect(page.locator('app-equipe .pessoa')).toHaveCount(5);
});
