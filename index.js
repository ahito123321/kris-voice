const express = require('express');
const app = express();
const config = require('./config/index');

config.express(app);
config.routes(app);

app.listen(config.app.appPort, () => {
    console.log(`Listening on port ${config.app.appPort}`);
});





