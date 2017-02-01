require('dotenv').config();

const express = require('express');
const expressConfig = require('./config/express');
const routesConfig = require('./config/routes');

const app = express();
expressConfig(app);
routesConfig(app);

app.listen(app.get('port'));

console.log(`Bot listening on port ${app.get('port')} in ${app.get('env')} mode.`);
