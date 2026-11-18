import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { BrasilApiService } from './brasil-api.service';

const URL = 'https://brasilapi.com.br/api';

describe('BrasilApiService', () => {
  let service: BrasilApiService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(BrasilApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('lista os bancos sem os que não têm código, ordenados pelo código', () => {
    let codigos: number[] = [];
    service.getBancos().subscribe((bancos) => (codigos = bancos.map((b) => b.code)));

    http.expectOne(`${URL}/banks/v1`).flush([
      { ispb: '1', name: 'B', code: 341, fullName: 'B' },
      { ispb: '2', name: 'Sem código', code: null, fullName: 'X' },
      { ispb: '3', name: 'A', code: 1, fullName: 'A' },
    ]);

    expect(codigos).toEqual([1, 341]);
  });

  it('reaproveita a lista de bancos sem pedir de novo', () => {
    service.getBancos().subscribe();
    http.expectOne(`${URL}/banks/v1`).flush([]);

    service.getBancos().subscribe();
    http.expectNone(`${URL}/banks/v1`);
  });

  it('busca empresa removendo a máscara do CNPJ', () => {
    service.getEmpresa('00.000.000/0001-91').subscribe();
    http.expectOne(`${URL}/cnpj/v1/00000000000191`).flush({});
  });

  it('busca CEP removendo o hífen', () => {
    service.getCep('36010-000').subscribe();
    http.expectOne(`${URL}/cep/v2/36010000`).flush({});
  });

  it('busca banco pelo código e feriados pelo ano', () => {
    service.getBanco(1).subscribe();
    service.getFeriados(2026).subscribe();
    http.expectOne(`${URL}/banks/v1/1`).flush({});
    http.expectOne(`${URL}/feriados/v1/2026`).flush([]);
  });
});
