const request = require('supertest');
const { startServer, stopServer } = require('../../app');

describe('Testes de integração para verificar elegibilidade', () => {
   let server;

   beforeAll(async () => {
      server = await startServer(3000);
   });

   afterAll(async () => {
      await stopServer(server);
   });

   it('deve aceitar uma requisição com dados de entrada válidos', async () => {
      const dadosValidos = {
         numeroDoDocumento: '12345678901',
         tipoDeConexao: 'bifasico',
         classeDeConsumo: 'comercial',
         modalidadeTarifaria: 'convencional',
         historicoDeConsumo: [500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600],
      };

      const response = await request(server).post('/verify-eligibility').send(dadosValidos);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('elegivel');
   });

   it('deve rejeitar uma requisição com dados de entrada inválidos', async () => {
      const dadosInvalidos = {
         numeroDoDocumento: '123',
         tipoDeConexao: 'inexistente',
         classeDeConsumo: 'invalida',
         modalidadeTarifaria: 'invalida',
         historicoDeConsumo: [200, 300],
      };

      const response = await request(server).post('/verify-eligibility').send(dadosInvalidos);

      expect(response.statusCode).toBe(400);
      expect(Array.isArray(response.body.errors)).toBe(true);
   });

   it('deve rejeitar uma requisição com dados de entrada válidos menos CPF', async () => {
      const dadosValidos = {
         numeroDoDocumento: '123',
         tipoDeConexao: 'bifasico',
         classeDeConsumo: 'comercial',
         modalidadeTarifaria: 'convencional',
         historicoDeConsumo: [500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600],
      };

      const response = await request(server).post('/verify-eligibility').send(dadosValidos);

      expect(response.statusCode).toBe(400);
      expect(Array.isArray(response.body.errors)).toBe(true);
      expect(response.body.errors[0].keyword).toBe('pattern');
   });

   it('deve rejeitar uma requisição com dados de entrada válidos menos tipo de conexão', async () => {
      const dadosValidos = {
         numeroDoDocumento: '12345678901',
         tipoDeConexao: 'quadrifasico',
         classeDeConsumo: 'comercial',
         modalidadeTarifaria: 'convencional',
         historicoDeConsumo: [500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600],
      };

      const response = await request(server).post('/verify-eligibility').send(dadosValidos);
      expect(response.statusCode).toBe(400);
      expect(Array.isArray(response.body.errors)).toBe(true);
      expect(response.body.errors[0].keyword).toBe('enum');
      expect(response.body.errors[0].message).toBe('must be equal to one of the allowed values');
   });

   it('deve rejeitar uma requisição com dados de entrada válidos menos classe de consumo', async () => {
      const dadosValidos = {
         numeroDoDocumento: '12345678901',
         tipoDeConexao: 'bifasico',
         classeDeConsumo: 'espacial',
         modalidadeTarifaria: 'convencional',
         historicoDeConsumo: [500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600],
      };

      const response = await request(server).post('/verify-eligibility').send(dadosValidos);

      expect(response.statusCode).toBe(400);
      expect(Array.isArray(response.body.errors)).toBe(true);
      expect(response.body.errors[0].keyword).toBe('enum');
      expect(response.body.errors[0].message).toBe('must be equal to one of the allowed values');
   });

   it('deve rejeitar uma requisição com dados de entrada válidos menos modalidade tarifaria', async () => {
      const dadosValidos = {
         numeroDoDocumento: '12345678901',
         tipoDeConexao: 'bifasico',
         classeDeConsumo: 'comercial',
         modalidadeTarifaria: 'roxa',
         historicoDeConsumo: [500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600],
      };

      const response = await request(server).post('/verify-eligibility').send(dadosValidos);

      expect(response.statusCode).toBe(400);
      expect(Array.isArray(response.body.errors)).toBe(true);
      expect(response.body.errors[0].keyword).toBe('enum');
      expect(response.body.errors[0].message).toBe('must be equal to one of the allowed values');
   });

   it('deve retornar inelegível devido a classe de consumo', async () => {
      const dadosValidos = {
         numeroDoDocumento: '12345678901',
         tipoDeConexao: 'bifasico',
         classeDeConsumo: 'rural',
         modalidadeTarifaria: 'convencional',
         historicoDeConsumo: [500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600],
      };

      const response = await request(server).post('/verify-eligibility').send(dadosValidos);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('elegivel');
      expect(response.body.elegivel).toBe(false);

      expect(response.body).toHaveProperty('razoesDeInelegibilidade');
      expect(Array.isArray(response.body.razoesDeInelegibilidade)).toBe(true);
      expect(response.body.razoesDeInelegibilidade).toContain('Classe de consumo não aceita');
   });

   it('deve retornar inelegível devido a modalidade tarifária', async () => {
      const dadosValidos = {
         numeroDoDocumento: '12345678901',
         tipoDeConexao: 'bifasico',
         classeDeConsumo: 'comercial',
         modalidadeTarifaria: 'azul',
         historicoDeConsumo: [500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600],
      };

      const response = await request(server).post('/verify-eligibility').send(dadosValidos);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('elegivel');
      expect(response.body.elegivel).toBe(false);

      expect(response.body).toHaveProperty('razoesDeInelegibilidade');
      expect(Array.isArray(response.body.razoesDeInelegibilidade)).toBe(true);
      expect(response.body.razoesDeInelegibilidade).toContain('Modalidade tarifária não aceita');
   });

   it('deve retornar inelegível devido ao consumo mínimo do cliente no tipo monofásico', async () => {
      const dadosValidos = {
         numeroDoDocumento: '12345678901',
         tipoDeConexao: 'monofasico',
         classeDeConsumo: 'comercial',
         modalidadeTarifaria: 'convencional',
         historicoDeConsumo: [399, 399, 399, 399, 399, 399, 399, 399, 399, 399, 399, 399],
      };

      const response = await request(server).post('/verify-eligibility').send(dadosValidos);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('elegivel');
      expect(response.body.elegivel).toBe(false);

      expect(response.body).toHaveProperty('razoesDeInelegibilidade');
      expect(Array.isArray(response.body.razoesDeInelegibilidade)).toBe(true);
      expect(response.body.razoesDeInelegibilidade).toContain('Consumo muito baixo para tipo de conexão');
   });

   it('deve retornar inelegível devido ao consumo mínimo do cliente no tipo bifásico', async () => {
      const dadosValidos = {
         numeroDoDocumento: '12345678901',
         tipoDeConexao: 'bifasico',
         classeDeConsumo: 'comercial',
         modalidadeTarifaria: 'convencional',
         historicoDeConsumo: [499, 499, 499, 499, 499, 499, 499, 499, 499, 499, 499, 499],
      };

      const response = await request(server).post('/verify-eligibility').send(dadosValidos);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('elegivel');
      expect(response.body.elegivel).toBe(false);

      expect(response.body).toHaveProperty('razoesDeInelegibilidade');
      expect(Array.isArray(response.body.razoesDeInelegibilidade)).toBe(true);
      expect(response.body.razoesDeInelegibilidade).toContain('Consumo muito baixo para tipo de conexão');
   });
   it('deve retornar inelegível devido ao consumo mínimo do cliente no tipo trifásico', async () => {
      const dadosValidos = {
         numeroDoDocumento: '12345678901',
         tipoDeConexao: 'trifasico',
         classeDeConsumo: 'comercial',
         modalidadeTarifaria: 'convencional',
         historicoDeConsumo: [749, 749, 749, 749, 749, 749, 749, 749, 749, 749, 749, 749],
      };

      const response = await request(server).post('/verify-eligibility').send(dadosValidos);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('elegivel');
      expect(response.body.elegivel).toBe(false);

      expect(response.body).toHaveProperty('razoesDeInelegibilidade');
      expect(Array.isArray(response.body.razoesDeInelegibilidade)).toBe(true);
      expect(response.body.razoesDeInelegibilidade).toContain('Consumo muito baixo para tipo de conexão');
   });

   it('deve retornar o calculo correto da economia de CO2', async () => {
      const dadosValidos = {
         numeroDoDocumento: '14041737706',
         tipoDeConexao: 'bifasico',
         classeDeConsumo: 'comercial',
         modalidadeTarifaria: 'convencional',
         historicoDeConsumo: [3878, 9760, 5976, 2797, 2481, 5731, 7538, 4392, 7859, 4160, 6941, 4597],
      };

      const response = await request(server).post('/verify-eligibility').send(dadosValidos);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('elegivel');
      expect(response.body.elegivel).toBe(true);

      expect(response.body).toHaveProperty('elegivel');
      expect(response.body).toHaveProperty('economiaAnualDeCO2');
      expect(typeof response.body.economiaAnualDeCO2).toBe('number');
      expect(response.body.economiaAnualDeCO2).toBe(5553.24);
   });
});
