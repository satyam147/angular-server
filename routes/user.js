var express = require('express');
var router = express.Router();
const db = require('../dbconnection');
const jwt = require('jsonwebtoken');

var user_id = '';
/**
 * Create User
 */
router.post('/create',checkUser,restrictedUser, (req, res) => {
    let body = req.body;
    let sql = `INSERT INTO users (name, email)
               values ('${body.name}', '${body.email}')`;
    try {
        db.promise().query(sql)
    } catch (e) {
        res.status(e.status).send(e.message);
    }
    res.status(200).send(['user created']);
});

/**
 * List User
 */
router.post('/list', checkUser, restrictedUser, async (req, res) => {
    let users = await db.promise().query('SELECT * FROM users');
    res.status(200).send(users[0]);
});

/**
 * View Single User
 */
router.post('/view', async (req, res) => {
    let body = req.body;
    let user = await db.promise().query(`SELECT *
                                         FROM users
                                         WHERE id = '${body.id}'`);
    res.status(200).send(user[0]);
})

/**
 * Update User
 */
router.post('/update', (req, res) => {
    let body = req.body;
    let update = db.promise().query(`UPDATE users
                                     SET name  = '${body.name}',
                                         email = '${body.email}'
                                     WHERE id = '${body.id}'`);
    res.status(200).send(['Updated']);
});

/**
 * Delete User
 */
router.post('/delete', (req, res) => {
    let body = req.body;
    let remove = db.promise().query(`DELETE
                                     FROM users
                                     WHERE id = '${body.id}'`);
    res.status(200).send(['deleted']);
})

/**
 * Middleware to check and validate JWT Token
 * @param req
 * @param res
 * @param next
 */
function checkUser(req, res, next) {
    let query = req.query;
    let token = query.token;
    if (!token) {
        res.status(401).send(['Unauthorized'])
    }
    let data = jwt.verify(token, 'hsgdjhfsdagsfdgfdas');
    if (!data.id) {
        res.status(422).send('Invalid Token');
    }
    user_id = data.id;
    next();
}

/**
 * Middleware to check if the user is restricted to access
 * @param req
 * @param res
 * @param next
 */
function restrictedUser(req, res, next) {
    let restricted_ids = [1, 2, 5];
    if (restricted_ids.includes(user_id)) {
        res.status(401).send('User Restricted');
    }
    next();
}


module.exports = router;