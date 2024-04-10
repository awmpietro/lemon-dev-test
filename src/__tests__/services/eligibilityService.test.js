const { calculateEligibility } = require('../../services/eligibilityService');

describe('eligibilityService', () => {
   it('deve retornar elegível para dados válidos', () => {
      const dados = {
         numeroDoDocumento: '14041737706',
         tipoDeConexao: 'bifasico',
         classeDeConsumo: 'comercial',
         modalidadeTarifaria: 'convencional',
         historicoDeConsumo: [3878, 9760, 5976, 2797, 2481, 5731, 7538, 4392, 7859, 4160],
      };

      const resultado = calculateEligibility(dados);
      expect(resultado.elegivel).toBeTruthy();
      expect(resultado).toHaveProperty('economiaAnualDeCO2');
   });

   it('deve retornar não elegível quando a classe de consumo não é aceita', () => {
      const dados = {
         numeroDoDocumento: '14041737706',
         tipoDeConexao: 'bifasico',
         classeDeConsumo: 'rural',
         modalidadeTarifaria: 'convencional',
         historicoDeConsumo: [3878, 9760, 5976, 2797, 2481, 5731, 7538, 4392, 7859, 4160],
      };

      const resultado = calculateEligibility(dados);
      expect(resultado.elegivel).toBeFalsy();
      expect(resultado.razoesDeInelegibilidade).toContain('Classe de consumo não aceita');
   });

   it('deve retornar não elegível quando a modalidade tarifária não é aceita', () => {
      const dados = {
         numeroDoDocumento: '14041737706',
         tipoDeConexao: 'bifasico',
         classeDeConsumo: 'comercial',
         modalidadeTarifaria: 'verde',
         historicoDeConsumo: [3878, 9760, 5976, 2797, 2481, 5731, 7538, 4392, 7859, 4160],
      };

      const resultado = calculateEligibility(dados);
      expect(resultado.elegivel).toBeFalsy();
      expect(resultado.razoesDeInelegibilidade).toContain('Modalidade tarifária não aceita');
   });

   it('deve retornar não elegível quando o consumo minimo do cliente na modalidade monofásica é menor', () => {
      const dados = {
         numeroDoDocumento: '14041737706',
         tipoDeConexao: 'monofasico',
         classeDeConsumo: 'comercial',
         modalidadeTarifaria: 'convencional',
         historicoDeConsumo: [399, 399, 399, 399, 399, 399, 399, 399, 399, 399, 399, 399],
      };

      const resultado = calculateEligibility(dados);
      expect(resultado.elegivel).toBeFalsy();
      expect(resultado.razoesDeInelegibilidade).toContain('Consumo muito baixo para tipo de conexão');
   });

   it('deve retornar não elegível  quando o consumo minimo do cliente na modalidade bifásico é menor', () => {
      const dados = {
         numeroDoDocumento: '14041737706',
         tipoDeConexao: 'bifasico',
         classeDeConsumo: 'comercial',
         modalidadeTarifaria: 'convencional',
         historicoDeConsumo: [499, 499, 499, 499, 499, 499, 499, 499, 499, 499, 499, 499],
      };

      const resultado = calculateEligibility(dados);
      expect(resultado.elegivel).toBeFalsy();
      expect(resultado.razoesDeInelegibilidade).toContain('Consumo muito baixo para tipo de conexão');
   });

   it('deve retornar não elegível quando o consumo minimo do cliente na modalidade trifásico é menor', () => {
      const dados = {
         numeroDoDocumento: '14041737706',
         tipoDeConexao: 'trifasico',
         classeDeConsumo: 'comercial',
         modalidadeTarifaria: 'convencional',
         historicoDeConsumo: [749, 749, 749, 749, 749, 749, 749, 749, 749, 749, 749, 749],
      };

      const resultado = calculateEligibility(dados);
      expect(resultado.elegivel).toBeFalsy();
      expect(resultado.razoesDeInelegibilidade).toContain('Consumo muito baixo para tipo de conexão');
   });
});
