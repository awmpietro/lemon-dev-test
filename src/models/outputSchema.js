const outputSchema = {
   oneOf: [
      {
         type: 'object',
         additionalProperties: false,
         required: ['elegivel', 'economiaAnualDeCO2'],
         properties: {
            elegivel: { type: 'boolean', const: true },
            economiaAnualDeCO2: { type: 'number', minimum: 0 },
         },
      },
      {
         type: 'object',
         additionalProperties: false,
         required: ['elegivel', 'razoesDeInelegibilidade'],
         properties: {
            elegivel: { type: 'boolean', const: false },
            razoesDeInelegibilidade: {
               type: 'array',
               uniqueItems: true,
               items: {
                  type: 'string',
               },
            },
         },
      },
   ],
};

module.exports = outputSchema;
