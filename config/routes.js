// const authController = require('../controllers/auth');
const authController = require('../controllers/auth');
const userController = require('../controllers/user');

module.exports = (app, ) => {
    app.use((req, res, next) => {
        let cookies = req.cookies || {};
        if (!authController.isAuth(cookies) && req.url !== '/sign-in') {
            res.redirect('/sign-in');
        } else {
            next();
        }
    });

    app.get('/', (req, res) => {
        res.render('index.ejs');
    });

    app.get('/sign-in', (req, res) => {
        res.render('sign-in.ejs');
    });
    app.post('/sign-in', authController.signIn, (req, res) => res.redirect('/'));

    app.get('/sign-out', authController.signOut, (req, res) => res.redirect('/sign-in'));


};