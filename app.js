const express = require('express');
const app = express();

const routes = require('./routes/routes');

app.use(express.json());

require('dotenv').config();

app.use(express.static('./public'));
app.use('/', routes);
const db = require('./db/index')();


const PORT = process.env.PORT || 3001;

app.listen(PORT);