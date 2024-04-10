/**
 * Verifica se a classe de consumo é elegível.
 * @param {string} classeDeConsumo - A classe de consumo do cliente.
 * @returns {boolean} - Verdadeiro se a classe de consumo for elegível, falso caso contrário.
 */
function checkConsumptionClass(classeDeConsumo) {
   return ['residencial', 'comercial', 'industrial'].includes(classeDeConsumo);
}

/**
 * Verifica se a modalidade tarifária é elegível.
 * @param {string} modalidadeTarifaria - A modalidade tarifária do cliente.
 * @returns {boolean} - Verdadeiro se a modalidade tarifária for elegível, falso caso contrário.
 */
function checkTariffModality(modalidadeTarifaria) {
   return ['convencional', 'branca'].includes(modalidadeTarifaria);
}

/**
 * Verifica se o consumo médio atende ao requisito mínimo para o tipo de conexão.
 * @param {string} tipoDeConexao - O tipo de conexão do cliente.
 * @param {Array<number>} historicoDeConsumo - O histórico de consumo do cliente.
 * @returns {boolean} - Verdadeiro se o consumo atender ao requisito mínimo, falso caso contrário.
 */
function checkMinimumConsumption(tipoDeConexao, historicoDeConsumo) {
   const consumoMedio = historicoDeConsumo.reduce((acc, cur) => acc + cur, 0) / historicoDeConsumo.length;
   switch (tipoDeConexao) {
      case 'monofasico':
         return consumoMedio >= 400;
      case 'bifasico':
         return consumoMedio >= 500;
      case 'trifasico':
         return consumoMedio >= 750;
      default:
         return false;
   }
}

/**
 * Calcula a economia anual de CO2 com base no histórico de consumo do cliente.
 * @param {Array<number>} historicoDeConsumo - O histórico de consumo do cliente.
 * @returns {number} - A economia anual de CO2 calculada.
 */
function calculateCO2Savings(historicoDeConsumo) {
   const consumoMedio = historicoDeConsumo.reduce((acc, cur) => acc + cur, 0) / historicoDeConsumo.length;
   return parseFloat((consumoMedio * 12 * 0.084).toFixed(2));
}

/**
 * Calcula a elegibilidade do cliente para um serviço com base em vários critérios.
 * @param {Object} dados - Os dados de entrada contendo as informações do cliente.
 * @returns {Object} - Um objeto indicando se o cliente é elegível e a economia anual de CO2 ou os motivos de inelegibilidade.
 */
function calculateEligibility(dados) {
   const razoesDeInelegibilidade = [];

   if (!checkConsumptionClass(dados.classeDeConsumo)) {
      razoesDeInelegibilidade.push('Classe de consumo não aceita');
   }

   if (!checkTariffModality(dados.modalidadeTarifaria)) {
      razoesDeInelegibilidade.push('Modalidade tarifária não aceita');
   }

   if (!checkMinimumConsumption(dados.tipoDeConexao, dados.historicoDeConsumo)) {
      razoesDeInelegibilidade.push('Consumo muito baixo para tipo de conexão');
   }

   if (razoesDeInelegibilidade.length === 0) {
      return { elegivel: true, economiaAnualDeCO2: calculateCO2Savings(dados.historicoDeConsumo) };
   } else {
      return { elegivel: false, razoesDeInelegibilidade };
   }
}

module.exports = { calculateEligibility };
