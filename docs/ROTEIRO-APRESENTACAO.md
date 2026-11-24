
# Consulta BR — Roteiro de Apresentação

## 1. Objetivo da apresentação

Apresentar o aplicativo Consulta BR, desenvolvido com Angular e Ionic, demonstrando suas funcionalidades e os requisitos técnicos implementados pela equipe.

Durante a apresentação, cada integrante deverá explicar:

1. O que sua funcionalidade faz.
2. Onde ela está implementada no código.
3. Onde pode ser visualizada no aplicativo.

## 2. Ordem sugerida de apresentação

A ordem abaixo é uma sugestão e deverá ser confirmada com a equipe.

| Ordem | Integrante | Assunto |
|---|---|---|
| 1 | Arthur Niceas | Introdução e visão geral do projeto |
| 2 | Guilherme Juarez | Serviço e tela de favoritos |
| 3 | Gabriel Fernando | Pipes personalizadas e nativas |
| 4 | Guilherme Aguiar | Tela de feriados, @if e @for |
| 5 | Lucas Cardoso | Diretivas Angular |
| 6 | Equipe | Considerações finais |

## 3. Demonstração das funcionalidades

### Arthur Niceas — Introdução

Apresentar o objetivo do Consulta BR, as tecnologias utilizadas e a integração com a BrasilAPI.

Mostrar a navegação principal do aplicativo e explicar como as consultas são realizadas.

### Guilherme Juarez — Favoritos

**O que faz:** permite adicionar e remover bancos e empresas da lista de favoritos.

**Onde está no código:**
- `src/app/core/services/favoritos.service.ts`
- `src/app/pages/favoritos/`

**Onde aparece:** tela Favoritos e detalhes de bancos e empresas.

**Demonstração:**
1. Abrir os detalhes de um banco.
2. Adicionar o banco aos favoritos.
3. Acessar a tela Favoritos.
4. Mostrar o banco salvo.
5. Remover o favorito.

### Gabriel Fernando — Pipes

**O que fazem:** formatam os dados exibidos ao usuário.

**Onde estão no código:**
- `src/app/shared/pipes/cnpj.pipe.ts`
- `src/app/shared/pipes/cep.pipe.ts`
- `src/app/shared/pipes/telefone.pipe.ts`

**Pipes nativas:** DatePipe, CurrencyPipe e TitleCasePipe.

**Onde aparecem:** consultas e detalhes de empresas e bancos.

**Demonstração:**
1. Consultar uma empresa pelo CNPJ.
2. Mostrar a formatação do CNPJ, CEP e telefone.
3. Mostrar datas, valores monetários e nomes formatados.

### Guilherme Aguiar — Feriados

**O que faz:** apresenta feriados nacionais organizados por período.

**Onde está no código:**
- `src/app/pages/feriados/feriados.page.ts`
- `src/app/pages/feriados/feriados.page.html`

**Requisitos:** estruturas `@if` e `@for` do Angular.

**Onde aparece:** tela Feriados.

**Demonstração:**
1. Abrir a aba Feriados.
2. Mostrar os feriados apresentados.
3. Alterar o ano.
4. Explicar que `@if` controla a exibição condicional e `@for` percorre a lista.

### Lucas Cardoso — Diretivas Angular

**O que fazem:** adicionam comportamentos reutilizáveis aos elementos das páginas.

**Onde estão no código:**
- `src/app/shared/directives/situacao.directive.ts`
- `src/app/shared/directives/copiar.directive.ts`

**Onde aparecem:** detalhes de empresas e bancos.

**Demonstração da SituacaoDirective:**
1. Abrir a tela Início.
2. Consultar o CNPJ `33000167000101`.
3. Abrir os detalhes da Petrobras.
4. Mostrar o indicador verde ATIVA.
5. Explicar que a diretiva altera a cor conforme a situação cadastral.

**Demonstração da CopiarDirective:**
1. Na mesma tela, clicar no CNPJ.
2. Mostrar a mensagem de confirmação da cópia.
3. Abrir a tela Bancos.
4. Selecionar o Banco do Brasil, código 001.
5. Clicar no código de compensação.
6. Mostrar a mensagem "Copiado: 001".

## 4. Explicação técnica das diretivas — Lucas

### Diretiva de atributo

Uma diretiva de atributo modifica o comportamento ou a aparência de um elemento existente, sem criar ou remover esse elemento da página.

### SituacaoDirective

A diretiva recebe a situação cadastral da empresa e utiliza `@HostBinding` para alterar propriedades do elemento, como a cor do indicador.

### CopiarDirective

A diretiva utiliza `@HostListener` para identificar o clique do usuário.

O texto é copiado com `navigator.clipboard.writeText()`, e o `ToastController` apresenta uma mensagem de confirmação.

### Diferença entre diretivas de atributo e estruturais

As diretivas de atributo modificam características ou comportamentos de elementos existentes.

As diretivas estruturais modificam a estrutura da interface, controlando quais elementos são criados ou removidos. No projeto, `@if` e `@for` são blocos de controle de fluxo do Angular utilizados para essa finalidade.

## 5. Plano B — Falha durante a apresentação

Se a BrasilAPI estiver indisponível:

1. Mostrar as capturas salvas em `docs/prints/`.
2. Explicar as funcionalidades utilizando os arquivos do código.
3. Demonstrar a estrutura das diretivas e dos componentes.
4. Utilizar as imagens como evidência dos testes realizados anteriormente.

Exemplos preparados:
- Petrobras: CNPJ `33000167000101`.
- Banco do Brasil: código `001`.
- CEP: `20031170`.

Antes da apresentação, manter o VS Code e o navegador abertos nas telas necessárias.

## 6. Checklist antes da apresentação

- [ ] Confirmar a ordem dos integrantes.
- [ ] Verificar se todos os Pull Requests foram integrados.
- [ ] Executar `npm run lint`.
- [ ] Executar `npm run build`.
- [ ] Abrir o aplicativo com `npm start`.
- [ ] Testar as funcionalidades.
- [ ] Conferir os prints em `docs/prints/`.
- [ ] Ensaiar as explicações de cada integrante.

## 7. Encerramento

O Consulta BR demonstra a utilização do Angular e Ionic na construção de um aplicativo de consultas públicas, integrando serviços, pipes, diretivas e recursos de navegação para melhorar a experiência do usuário.
