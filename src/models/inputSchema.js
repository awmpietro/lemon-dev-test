const { tiposDeConexao, classesDeConsumo, modalidadesTarifarias, cpf, cnpj } = require('./types/types');

const inputSchema = {
   type: 'object',
   additionalProperties: false,
   required: ['numeroDoDocumento', 'tipoDeConexao', 'classeDeConsumo', 'modalidadeTarifaria', 'historicoDeConsumo'],
   properties: {
      numeroDoDocumento: { oneOf: [cpf, cnpj] },
      tipoDeConexao: { type: 'string', enum: tiposDeConexao },
      classeDeConsumo: { type: 'string', enum: classesDeConsumo },
      modalidadeTarifaria: { type: 'string', enum: modalidadesTarifarias },
      historicoDeConsumo: {
         type: 'array',
         minItems: 3,
         maxItems: 12,
         items: { type: 'integer', minimum: 0, maximum: 9999 },
      },
   },
};

module.exports = inputSchema;
