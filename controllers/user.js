const connPool = require('../config/connection-pool');
const authController = require('../controllers/auth');

const getUserInfo = (req, res, next) => {
    let conn = connPool.getConnectionByUserId(req.cookies.uid);
    conn.sobject(req.cookies.uid, (err, user) => {
        if (err) {
            console.error(err);
            next({
                success: false,
                message: 'Error!',
                main: err
            });
        }
        next({
            success: true,
            data: user
        });
    });
};

module.exports = {
    getUserInfo
};