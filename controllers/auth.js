const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretKey = 'education';

const login = sqlConnection => (req, res) => {
    let password = req.body.password;
    let email = req.body.email;
    let accessToken;
    let userId;
    let roleId;
    new sqlConnection
        .Request()
        .input('email', sqlConnection.NVarChar(200), email)
        .query('SELECT * FROM user_ WHERE email=@email')
        .then(response => {
            if (+response.recordset.length === 0) {
                res.redirect('/login');
            }
            console.log(`User ${email} try login`);
            userId = response.recordset[0].id;
            roleId = response.recordset[0].role_id;
            return bcrypt.compare(password, response.recordset[0].password);
        })
        .then(response => {
            accessToken = jwt.sign({
                userId: userId,
                roleId: roleId,
            }, secretKey);
            return new sqlConnection
                .Request()
                .input('token', sqlConnection.NVarChar(300), accessToken)
                .input('user_id', sqlConnection.BigInt, userId)
                .query('INSERT INTO user_token VALUES(@token, @user_id)');
        })
        .then(response => {
            console.log('User is login');
            res.cookie('access', accessToken);
            res.redirect('/');
        })
        .catch(err => {
            console.log(err);
            res.status(500).send('Internal server error!');
        });
};

const authentication = sqlConnection => (req, res, next) => {
    if (!req.cookies.access) {
        res.redirect('/login');
    }
    try {
        let verify = jwt.verify(req.cookies.access, secretKey);
        new sqlConnection
            .Request()
            .input('id', sqlConnection.BigInt, +verify.roleId)
            .query('SELECT role FROM role WHERE id=@id')
            .then(response => {
                let role = response.recordset[0].role;
                console.log('Аутентификация - ' + role);
                let isAdmin = role === 'ADMIN';
                if (!isAdmin && req.path === '/create/user' ||
                    !isAdmin && req.path === '/create/test' ||
                    !isAdmin && req.path === '/create/question' ||
                    !isAdmin && req.path === '/create/answer') {
                    res.clearCookie('access');
                    res.status(401).send('You don\'t have permissions! Please login like admin!');
                }
                next();
            })
            .catch(err => {
                console.log(err);
                res.status(500).send('Internal server error!');
            });
    } catch(err) {
        console.log(err);
        res.clearCookie('access');
        res.status(403).send('Invalid token! Please refresh this page!');
    }
};

const signOut = sqlConnection => (req, res) => {
    if (!req.cookies.access) {
        res.redirect('/');
    }
    try {
        let verify = jwt.verify(req.cookies.access, secretKey);
        console.log('Sign out!');
        new sqlConnection
            .Request()
            .input('id', sqlConnection.BigInt, +verify.userId)
            .query('DELETE FROM user_token WHERE user_id=@id')
            .then(response => {
                res.clearCookie('access');
                res.redirect('/login');
            })
            .catch(err => {
                console.log(err);
                res.status(500).send('Internal server error!');
            });
    } catch(err) {
        console.log(err);
        res.clearCookie('access');
        res.status(403).send('Invalid token! Please refresh this page!');
    }
};

const checkRole = (req, res) => {
    res.render('index');
};

module.exports = {
    login,
    authentication,
    signOut,
    checkRole,
};