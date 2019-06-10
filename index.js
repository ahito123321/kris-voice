const express = require('express');
const app = express();
const config = require('./config/index');

config.express(app);
config.routes(app);

const { appPort } = config.app;

app.listen(appPort, () => {
    console.log(`Listening on port ${appPort}`);
});





