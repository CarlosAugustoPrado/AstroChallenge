# Desafio Técnico - Astro

Este projeto é a solução para o desafio técnico de Front-end focado na exibição de dados consolidados de clientes e compras. A aplicação foi desenvolvida utilizando Next.js, React e TypeScript, consumindo as APIs DummyJSON.

## 🚀 1. Como executar a aplicação

Siga os passos abaixo para rodar o projeto localmente em sua máquina:

### Pré-requisitos
- Node.js (versão 18 ou superior recomendada)
- npm (gerenciador de pacotes)

### Passo a passo

1. Instale as dependências do projeto:
```bash
npm install
```

2. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

3. Acesse a aplicação no seu navegador:
Abra [http://localhost:3000](http://localhost:3000)

4. Executar a suíte de testes:
```bash
npm run test
```

## 🛠️ 2. Principais decisões técnicas adotadas

- **Next.js (Server Components) e React:** Utilizados aproveitando as melhores práticas do App Router. A camada de *data fetching* ocorre no Servidor (Server Component `page.tsx`), o que melhora significativamente a performance e o First Paint (SEO), enquanto a interatividade de tela (busca, paginação, ordenação) fica isolada em um *Client Component* (`CustomersClientView.tsx`).
- **TypeScript:** Toda a aplicação foi fortemente tipada para garantir segurança no desenvolvimento, evitar erros de tempo de execução e melhorar o autocompletar do editor.
- **Testes Automatizados (Jest + RTL):** Utilização do Jest para testar a lógica matemática de consolidação (serviços) e do React Testing Library para testar o comportamento dos componentes na visão do usuário (interações de busca, paginação e ordenações na tabela).
- **Tailwind CSS:** Escolhido para a estilização pela sua agilidade, permitindo criar uma interface limpa, responsiva e moderna de forma rápida e padronizada.
- **Zod:** Utilizado para a validação dos dados retornados pelas APIs. Como dependemos de dados externos, o Zod garante que o contrato está sendo respeitado antes de prosseguirmos com a transformação dos dados.
- **Separação de Responsabilidades (Arquitetura):**
  - `src/app`: Camada principal Server-Side.
  - `src/components`: Componentes Client-Side de interface.
  - `src/services`: Camada de integração (consumo das APIs e transformação/consolidação dos dados).
  - `src/hooks`: Regras de negócio da interface isoladas (paginação, ordenação e busca via `useCustomers`).
  - `src/types`: Definições de tipagem e schemas do Zod.
- **Diferenciais implementados:** Paginação, ordenação por valor, busca em tempo real, validação de dados (Zod), carregamento super-rápido otimizado via SSR, testes automatizados e estados vazios amigáveis.

## 🔄 3. Como os dados foram tratados

Para evitar acoplamento da interface com o formato original das APIs e garantir performance:

1. **Busca em Paralelo no Servidor:** As APIs de Usuários e Carrinhos são chamadas simultaneamente pelo Servidor Next.js utilizando `Promise.all`, reduzindo o tempo total de espera da rede e evitando processamento no navegador do usuário.
2. **Validação:** Os dados brutos passam pelo `z.parse()` do Zod para garantir que possuem os campos necessários (`id`, `firstName`, `totalQuantity`, `total`, etc).
3. **Consolidação:** No arquivo `customerService.ts`, iteramos sobre a lista de usuários. Para cada usuário:
   - Filtramos os carrinhos correspondentes ao `userId`.
   - Utilizamos o método `reduce` para somar a `totalQuantity` de todos os seus carrinhos (Quantidade Total de Produtos).
   - Utilizamos o método `reduce` para somar o `total` de todos os seus carrinhos (Valor Total das Compras).
4. **Entrega:** A camada de serviço retorna um array de objetos limpos no formato `CustomerSummary`, contendo exatamente o que a interface precisa, sem dados desnecessários. Tudo isso renderizado diretamente no SSR e passado como estado inicial para o Client.

## ⏳ 4. O que eu faria diferente caso tivesse mais tempo disponível

Se houvesse mais tempo para evolução e refinamento contínuo da aplicação, focaria nos seguintes pontos:

1. **Paginação Real no Back-end:** Atualmente estamos buscando todos os registros de uma vez (`limit=0`) da DummyJSON e paginando no Front-end (em memória). Para uma aplicação em escala gigante, a paginação, busca e ordenação deveriam ser feitas via banco de dados/API. Isso evitaria requisições pesadas, mas exigiria a criação de um serviço Back-end intermediário próprio (visto que a DummyJSON não fornece um endpoint unificado e relacional de "Usuários e seus Carrinhos" otimizado para paginação sem gerar problemas de "N+1 queries").
2. **Gerenciamento de Estado Global para Mutação:** Caso a aplicação escalasse para edição ou adição de usuários/compras, seria interessante integrar uma biblioteca robusta de mutation e data fetching client-side como o **React Query (TanStack Query)** ou **SWR**, a fim de gerenciar cacheamentos granulares, retries automáticos e optimistics updates.
