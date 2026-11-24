import { Injectable, computed, signal } from '@angular/core';

import type { Favorito } from '../models/favorito.model';

/** Chave usada no localStorage do aparelho. */
const CHAVE = 'consulta-br:favoritos';

/**
 * Service 2: guarda os favoritos do usuário no localStorage (não usa a BrasilAPI).
 * O estado fica em um signal privado; as telas leem apenas a versão "readonly".
 */
@Injectable({ providedIn: 'root' })
export class FavoritosService {
  /** Lista de favoritos em memória, já carregada do localStorage ao criar o service. */
  private readonly lista = signal<Favorito[]>(this.carregar());

  /** Versão somente leitura para as telas (ninguém altera a lista por fora). */
  readonly favoritos = this.lista.asReadonly();

  /** Quantidade total de favoritos, recalculada sozinha quando a lista muda. */
  readonly total = computed(() => this.lista().length);

  /** Diz se um banco/empresa já está salvo. */
  ehFavorito(tipo: Favorito['tipo'], id: string): boolean {
    return this.lista().some((item) => item.tipo === tipo && item.id === id);
  }

  /**
   * Adiciona se ainda não existe (no começo da lista) ou remove se já existe.
   * Devolve true quando o item ficou favoritado.
   */
  alternar(item: Omit<Favorito, 'salvoEm'>): boolean {
    if (this.ehFavorito(item.tipo, item.id)) {
      this.remover(item.tipo, item.id);
      return false;
    }

    const novo: Favorito = { ...item, salvoEm: new Date().toISOString() };
    this.lista.update((lista) => [novo, ...lista]);
    this.salvar();
    return true;
  }

  /** Remove um favorito pelo tipo + id (código do banco ou CNPJ). */
  remover(tipo: Favorito['tipo'], id: string): void {
    this.lista.update((lista) => lista.filter((item) => !(item.tipo === tipo && item.id === id)));
    this.salvar();
  }

  /** Apaga todos os favoritos do aparelho. */
  limpar(): void {
    this.lista.set([]);
    this.salvar();
  }

  /** Grava a lista atual no localStorage. Se o navegador bloquear, o app segue funcionando. */
  private salvar(): void {
    try {
      localStorage.setItem(CHAVE, JSON.stringify(this.lista()));
    } catch {
      // Sem localStorage (modo privado, cota cheia...): mantém só em memória.
    }
  }

  /** Lê o localStorage com segurança: JSON inválido ou dado estranho vira lista vazia. */
  private carregar(): Favorito[] {
    try {
      const bruto = localStorage.getItem(CHAVE);
      if (!bruto) return [];

      const dados: unknown = JSON.parse(bruto);
      if (!Array.isArray(dados)) return [];

      // Confere o formato de cada item antes de confiar no que está salvo.
      return dados.filter((item): item is Favorito => {
        const f = item as Partial<Favorito> | null;
        return (
          !!f &&
          (f.tipo === 'banco' || f.tipo === 'empresa') &&
          typeof f.id === 'string' &&
          typeof f.titulo === 'string' &&
          typeof f.salvoEm === 'string'
        );
      });
    } catch {
      return [];
    }
  }
}
