require('dotenv').config();

const express = require('express');
const expressConfig = require('./config/express');
const routesConfig = require('./config/routes');
const database = require('./config/database');
require('./bot');

database.connect();

const app = express();
expressConfig(app);
routesConfig(app);

app.listen(app.get('port'));
