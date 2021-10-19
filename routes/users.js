var express = require('express');
var bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var router = express.Router();
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var User = require('../models/user');

router.get('/', async (req, res, next) => {

    res.send('respond with a resource');
});

router.get('/register', async (req, res, next) => {
    res.render('register', { title: 'Register' });
});

router.post('/register', async (req, res, next) => {
    var { username, password: plainTextPassword } = req.body;
    User.findOne({username}, function(err, user) {
        if (err) {
            return res.json({ status: 'error', message: err });
        } 
        if (user) {
            return res.json({ status: 'error', message: 'Username already exists.' });
        }
    });
    if (!username || typeof username !== 'string') {
        return res.json({ status: 'error', message: 'Username must be a series of letters and numbers.' });
    }
    if (!plainTextPassword || typeof plainTextPassword !== 'string') {
        return res.json({ status: 'error', message: 'Password must be a series of letters, numbers and special characters.' });
    }
    if (plainTextPassword.length <= 5) {
        return res.json({ status: 'error', message: 'Password must be at least 6 characters long.' });
    }
    var password = await bcrypt.hash(plainTextPassword, 10);

    try {
        var response = await User.create({
            username,
            password
        });
    } catch (error) {
        return res.json({ status: 'error', message: error });
    }
});

router.get('/login', async (req, res, next) => {
    res.render('login', { title: 'Login' });
})

router.post('/login', async (req, res, next) => {
    var { username, password } = req.body;
    var user = await User.findOne({ username }).lean();
    if (!user) {
        return res.json({ status: 'error', message: 'User does not exist.' });
    }
    if (await bcrypt.compare(password, user.password)) {
        var token = jwt.sign({ 
            id: user._id, 
            username: user.username 
        }, process.env.JWT_SECRET)
        res.json({ status: 'ok', data: token, message: 'You are now logged in.' });
    } else {
        res.json({ status: 'error', message: 'Incorrect password.'});
    }
})

module.exports = router;
