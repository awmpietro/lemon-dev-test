const app = require('./app');

const PORT = process.env.PORT || 8085;

app.startServer(PORT)
   .then((server) => {
      console.log(`server running on port ${PORT}`);
   })
   .catch((err) => {
      console.error('error starting server:', err);
   });
