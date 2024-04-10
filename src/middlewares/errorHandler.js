/**
 * Middleware de tratamento de erros.
 * Captura qualquer erro não tratado no fluxo do App e envia uma resposta HTTP com status 500.
 *
 * @function
 * @param {Error} err - O erro capturado.
 * @param {Object} req - Objeto de requisição do Express.
 * @param {Object} res - Objeto de resposta do Express.
 * @param {function} next - Função next do middleware do Express.
 */

module.exports = (err, req, res, next) => {
   console.error(err.stack);
   res.status(500).send({ error: err });
};
