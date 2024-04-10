# Teste - Backend Lemon - Elegibilidade

## Descrição

Nem todos os clientes que desejam fazer parte da Lemon podem ser aceitos no momento. Seja por razões regulatórias ou porque não vale a pena para o cliente ou para a Lemon ter essa empresa como cliente. No processo de aquisição de clientes, fazemos a checagem de elegibilidade da mesma, através dos dados contidos na conta de luz do cliente. Caso a empresa não seja elegível, precisamos explicitar os motivos para tal. Caso ela seja elegível, precisamos calcular também a projeção da quantidade de CO2 que ela deixaria de emitir caso usasse energia limpa.

## Instruções

-  Sugerimos implementar a solução descrita em `Node.js`, porém não é um requisito. Você tem a liberdade de implementar na linguagem que desejar.
-  É desejável que o sistema seja uma webapi
-  Lembre-se de escrever testes
-  Enviar o código fonte da solução para a pessoa da Lemon que te enviou esse teste, da forma desejada:
   -  Zip com o código fonte
   -  Link para o repositório git

## Requisitos

-  Node.js versão 20.9.0
-  yarn
-  Docker (opcional)

## Instalação usando Docker em máquinas Mac ou Linux:

1. Clonar o repositório: [Lemon Dev Test](https://github.com/awmpietro/lemon-dev-test)
2. Na raíz do repositório rodar o comando: `yarn install`
3. Na raíz, rodar o código: `make init`
   -  Este comando rodará todos os testes unitários e inicializará a API no docker na porta 8085 do seu localhost.

## Instalação sem Docker (necessários node v20.9.0 e yarn instalados)

1. Clonar o repositório: [Lemon Dev Test](https://github.com/awmpietro/lemon-dev-test)
2. Na raíz do repositório rodar o comando: `yarn install`
3. Para rodar a API, use o comando: `yarn dev` ou `yarn start`. A API ficará exposta na porta 8085.
   -  O comando `yarn dev` roda todos os testes unitários e inicia a API em modo de live reloading.
4. Para rodar somente os testes: `yarn test`

## Como Usar

### API

A API possui 1 endpoint:

-  [POST Verificar Eligibilidade](http://localhost:8085/verify-eligibility)

**verifyEligibility:** Irá fazer a validação da eligibilidade do cliente.

Exemplo de body elegível:

Entrada:

```json
{
   "numeroDoDocumento": "14041737706",
   "tipoDeConexao": "bifasico",
   "classeDeConsumo": "rural",
   "modalidadeTarifaria": "verde",
   "historicoDeConsumo": [
      3878, // mes atual
      9760, // mes anterior
      5976, // 2 meses atras
      2797, // 3 meses atras
      2481, // 4 meses atras
      5731, // 5 meses atras
      7538, // 6 meses atras
      4392, // 7 meses atras
      7859, // 8 meses atras
      4160 // 9 meses atras
   ]
}
```

Saída:

```json
{
   "elegivel": true,
   "economiaAnualDeCO2": 5553.24
}
```

Exemplo de body inelegível:

Entrada:

```json
{
   "numeroDoDocumento": "14041737706",
   "tipoDeConexao": "bifasico",
   "classeDeConsumo": "rural",
   "modalidadeTarifaria": "verde",
   "historicoDeConsumo": [
      3878, // mes atual
      9760, // mes anterior
      5976, // 2 meses atras
      2797, // 3 meses atras
      2481, // 4 meses atras
      5731, // 5 meses atras
      7538, // 6 meses atras
      4392, // 7 meses atras
      7859, // 8 meses atras
      4160 // 9 meses atras
   ]
}
```

Saída:

```json
{
   "elegivel": false,
   "razoesDeInelegibilidade": ["Classe de consumo não aceita", "Modalidade tarifária não aceita"]
}
```
