import type { Routes } from '@angular/router';

/**
 * Rotas do app. Todas ficam dentro do layout de abas (TabsPage).
 * As rotas de detalhe recebem um parâmetro: /bancos/:codigo e /empresa/:cnpj.
 */
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./tabs/tabs.page').then((m) => m.TabsPage),
    children: [
      {
        path: 'inicio',
        loadComponent: () => import('./pages/inicio/inicio.page').then((m) => m.InicioPage),
      },
      {
        path: 'inicio/empresa/:cnpj',
        loadComponent: () => import('./pages/empresa-detalhe/empresa-detalhe.page').then((m) => m.EmpresaDetalhePage),
      },
      {
        path: 'bancos',
        loadComponent: () => import('./pages/bancos/bancos.page').then((m) => m.BancosPage),
      },
      {
        path: 'bancos/:codigo',
        loadComponent: () => import('./pages/banco-detalhe/banco-detalhe.page').then((m) => m.BancoDetalhePage),
      },
      {
        path: 'feriados',
        loadComponent: () => import('./pages/feriados/feriados.page').then((m) => m.FeriadosPage),
      },
      {
        path: 'favoritos',
        loadComponent: () => import('./pages/favoritos/favoritos.page').then((m) => m.FavoritosPage),
      },
      {
        path: 'equipe',
        loadComponent: () => import('./pages/equipe/equipe.page').then((m) => m.EquipePage),
      },
      { path: '', redirectTo: 'inicio', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: 'inicio' },
];
