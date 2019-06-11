const config = require('../config/index.js');
const jsforce = require('jsforce');
const CryptoJS = require("crypto-js");

let passwordAES = 'qwer123ASDFzzz';

const signIn = (req, res, next) => {
    let username = req.body.username;
    let password = req.body.password;

    conn = new jsforce.Connection({
        loginUrl: 'https://login.salesforce.com'
    });

    conn.login(username, password, (err, userInfo) => {
        if (err) { 
            console.error(err); 
            res
                .status(403)
                .send('Invalid username or password!');
            return;
        }

        console.info('=========================================');
        console.info(`User ${userInfo.id} successfully logged!`);
        console.info(`Instance url ${conn.instanceUrl}.`);
        console.info('=========================================');
        res
            .cookie('accessToken', conn.accessToken)
            .cookie('uid', userInfo.id);
        next();
    });
};

const signOut = (req, res, next) => {
    res
        .clearCookie('accessToken')
        .clearCookie('uid')
        .status(200);
    next();
};

const isAuth = cookies => {
    return cookies.accessToken && cookies.uid;
};

module.exports = {
    signIn,
    signOut,
    isAuth
};