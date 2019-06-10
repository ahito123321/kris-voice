// const authController = require('../controllers/auth');

module.exports = (app, sqlConnection) => {
    app.get('/', (req, res) => {
        res.render('index.ejs');
    });
};