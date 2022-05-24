var express = require('express');
var router = express.Router();
const db = require('../dbconnection');

router.post('/login', async (req, res) => {
    let body = req.body;
    console.log(body);
    let sql = `SELECT *
               FROM users
               WHERE email = '${body.email}'
                 AND password = '${body.password}' limit 1`;
    let users = await db.promise().query(sql);
    let user = users[0];
    console.log(user);
    if (user.length == 0) {
        res.status(422).send('Email or Password Invalid')
    } else {
        res.status(200).send(user[0]);
    }
});


module.exports = router;