var express = require('express');
var router = express.Router();
const db = require('../dbconnection');

router.post('/create', (req, res) => {
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

router.post('/list', async (req, res) => {
    let users = await db.promise().query('SELECT * FROM users');
    res.status(200).send(users[0]);
});

router.post('/view', async (req, res) => {
    let body = req.body;
    let user = await db.promise().query(`SELECT *
                                         FROM users
                                         WHERE id = '${body.id}'`);
    res.status(200).send(user[0]);
})

router.post('/update', (req, res) => {
    let body = req.body;
    let update = db.promise().query(`UPDATE users SET name  = '${body.name}',email = '${body.email}' WHERE id = '${body.id}'`);
    res.status(200).send(['Updated']);
});

router.post('/delete',(req,res)=>{
    let body = req.body;
    let remove = db.promise().query(`DELETE FROM users WHERE id = '${body.id}'`);
    res.status(200).send(['deleted']);
})

module.exports = router;