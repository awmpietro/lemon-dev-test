const Ajv = require('ajv');
const { calculateEligibility } = require('../services/eligibilityService');
const inputSchema = require('../models/inputSchema');
const outputSchema = require('../models/outputSchema');

const ajv = new Ajv();

/**
 * contoller que faz o handle da solicitação de verificação de elegibilidade.
 * @param {Object} req - Objeto de solicitação do Express.
 * @param {Object} res - Objeto de resposta do Express.
 * @param {function} next - Função middleware next do Express para continuar o fluxo ou capturar erros.
 */
exports.verifyEligibility = (req, res, next) => {
   const valid = ajv.validate(inputSchema, req.body);

   if (!valid) {
      return res.status(400).json({ errors: ajv.errors });
   }

   const result = calculateEligibility(req.body);

   const isValidOutput = ajv.validate(outputSchema, result);
   if (!isValidOutput) {
      // Em um cenário real, esse erro deveria ser registrado e possivelmente gerar um alerta.
      return res.status(500).json({ errors: 'Error in output validation' });
   }

   res.json(result);
};
