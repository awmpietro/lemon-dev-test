require('dotenv').config({
   path: process.env.NODE_ENV === 'development' ? '.env.development' : '.env',
});

const express = require('express');
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const app = express();
const accessLogStream = fs.createWriteStream(path.join(__dirname, './access.log'), { flags: 'a' });

app.use(morgan('dev', { stream: accessLogStream }));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());

const errorHandler = require('./middlewares/errorHandler');
const port = process.env.PORT || 8085;
const routes = require('./routes');

Object.keys(routes).forEach((key) => {
   // app.use(`/${key}`, routes[key]);
   app.use(`/`, routes[key]);
});

app.use(errorHandler);

module.exports = {
   startServer(port) {
      return new Promise((resolve, reject) => {
         const server = app.listen(port, (err) => {
            if (err) {
               reject(err);
            } else {
               resolve(server);
            }
         });
      });
   },
   stopServer(server) {
      return new Promise((resolve, reject) => {
         server.close((err) => {
            if (err) {
               reject(err);
            } else {
               resolve();
            }
         });
      });
   },
};
