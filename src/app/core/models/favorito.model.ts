/** Item salvo pelo usuário na tela Favoritos (guardado no localStorage). */
export interface Favorito {
  tipo: 'banco' | 'empresa';
  /** Código do banco ou CNPJ só com números. */
  id: string;
  titulo: string;
  subtitulo?: string;
  /** Data em que foi salvo (ISO 8601). */
  salvoEm: string;
}
