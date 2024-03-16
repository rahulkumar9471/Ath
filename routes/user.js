const express = require('express');
const router = express.Router();


const {login, signup} = require('../controllers/Auth');
const {auth, isStudent, isAdmin} = require('../middlewares/Auth');

router.post('/login', login);
router.post('/signup', signup);

router.get('/test',auth, (req,res) => {
    res.json({
        success: true,
        message: "Welcome to the Test Protected routes!",
    })
});

router.get('/student',auth, isStudent, (req,res) => {
    res.json({
        success: true,
        message: "Welcome to the Student Protected routes!",
    })
});
router.get('/admin',auth, isAdmin, (req,res) => {
    res.json({
        success: true,
        message: "Welcome to the Admin Protected routes!",
    })
});

module.exports = router;