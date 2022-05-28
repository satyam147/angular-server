var express = require('express');
var router = express.Router();
const db = require('../dbconnection');
var jwt = require('jsonwebtoken');

/**
 * login route to check user and return JWT token
 */
router.post('/login', async (req, res) => {
    let body = req.body;
    let sql = `SELECT *
               FROM users
               WHERE email = '${body.email}'
                 AND password = '${body.password}'
               limit 1`;
    let users = await db.promise().query(sql);
    let user = users[0];
    if (user.length == 0) {
        res.status(422).send('Email or Password Invalid')
    } else {
        let token = jwt.sign({id: user[0].id}, 'hsgdjhfsdagsfdgfdas');
        user[0]['token'] = token;
        res.status(200).send(user[0]);
    }
});


module.exports = router;