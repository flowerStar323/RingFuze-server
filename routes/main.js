let express = require('express');
let authController = require('../controllers/AuthController');
var router = express.Router();

router.post('/login', authController.login);

module.exports = router;
