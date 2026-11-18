import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import type { Observable } from 'rxjs';
import { map, shareReplay, timeout } from 'rxjs';

import { environment } from '../../../environments/environment';
import type { Banco } from '../models/banco.model';
import type { Cep } from '../models/cep.model';
import type { Empresa } from '../models/empresa.model';
import type { Feriado } from '../models/feriado.model';
import { somenteDigitos } from '../utils/somente-digitos';

/** Banco como a API devolve: alguns vêm sem código (code: null). */
type BancoApi = Omit<Banco, 'code'> & { code: number | null };

/** Tempo máximo de espera por uma resposta da API. */
const TEMPO_LIMITE_MS = 15_000;

/**
 * Service 1: concentra TODAS as chamadas HTTP à BrasilAPI (https://brasilapi.com.br).
 * As telas nunca usam o HttpClient direto, elas pedem os dados para este service.
 */
@Injectable({ providedIn: 'root' })
export class BrasilApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.brasilApiUrl;

  /** Cache da lista de bancos: são ~470 itens que quase nunca mudam. */
  private bancos$?: Observable<Banco[]>;

  /** GET /banks/v1: todos os bancos com código, ordenados pelo código (001, 033, 104...). */
  getBancos(): Observable<Banco[]> {
    this.bancos$ ??= this.http.get<BancoApi[]>(`${this.baseUrl}/banks/v1`).pipe(
      timeout(TEMPO_LIMITE_MS),
      map((bancos) => bancos.filter((b): b is Banco => b.code !== null).sort((a, b) => a.code - b.code)),
      // guarda a resposta; se der erro, a próxima chamada tenta de novo
      shareReplay(1),
    );
    return this.bancos$;
  }

  /** GET /banks/v1/{codigo}: um banco pelo código de compensação. */
  getBanco(codigo: number): Observable<Banco> {
    return this.http.get<Banco>(`${this.baseUrl}/banks/v1/${codigo}`).pipe(timeout(TEMPO_LIMITE_MS));
  }

  /** GET /cnpj/v1/{cnpj}: dados da empresa na Receita Federal. Aceita o CNPJ com ou sem máscara. */
  getEmpresa(cnpj: string): Observable<Empresa> {
    return this.http.get<Empresa>(`${this.baseUrl}/cnpj/v1/${somenteDigitos(cnpj)}`).pipe(timeout(TEMPO_LIMITE_MS));
  }

  /** GET /cep/v2/{cep}: endereço do CEP. Aceita o CEP com ou sem hífen. */
  getCep(cep: string): Observable<Cep> {
    return this.http.get<Cep>(`${this.baseUrl}/cep/v2/${somenteDigitos(cep)}`).pipe(timeout(TEMPO_LIMITE_MS));
  }

  /** GET /feriados/v1/{ano}: feriados nacionais do ano. */
  getFeriados(ano: number): Observable<Feriado[]> {
    return this.http.get<Feriado[]>(`${this.baseUrl}/feriados/v1/${ano}`).pipe(timeout(TEMPO_LIMITE_MS));
  }
}
