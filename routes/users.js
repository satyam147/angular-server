var express = require('express');
var router = express.Router();
const db = require('../dbconnection');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: 'public/images/users',
    filename: (req,file,cb) => {
        cb(null,Date.now() + '_' + file.originalname);
    }
});
const upload = multer({
    storage: storage,
})
/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.get('/view', async function (req, res) {
    var users = await db.promise().query('SELECT * FROM users');
    console.log(users[0]);
    res.status(200).send(users[0]);
});

router.post('/create',upload.single('image'), (req, res) => {
    let body = req.body;
    console.log(req.file);
    let sql = `INSERT INTO tasks (first_name, last_name, email, mobile, gender)
               values ('${body.first_name}', '${body.last_name}', '${body.email}', '${body.mobile}', '${body.gender}')`;
    try {
        db.promise().query(sql);
    } catch (e) {
        console.log(e);
    }
    res.status(200).send('User Created');
});





module.exports = router;
