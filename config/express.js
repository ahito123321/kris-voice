const bodyParser = require('body-parser');
const express = require('express');

module.exports = (app) => {
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({
        extended: true,
    }));
    app.use('/static', express.static('static'));
    app.set('view engine', 'ejs');
};