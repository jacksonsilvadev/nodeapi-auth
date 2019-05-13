const express = require('express');
const app = express();
const mongoose = require('mongoose');
const requireDir = require('require-dir');
const cors = require('cors');


app.use(express.json())
app.use(cors());

mongoose.connect('mongodb://localhost:27017/noderest', {
    useCreateIndex: true,
    useNewUrlParser: true
});

requireDir('./config/models');

const routes = require('./config/router');

app.use('/auth', routes.routes);
app.use('/', routes.project);


app.listen(3000);