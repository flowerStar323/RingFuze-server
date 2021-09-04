let express = require('express');
let userController = require('../controllers/UserController');
var router = express.Router();

router.get('/', userController.get);
router.post('/getUsersByPayload', userController.getByPayload);
router.post('/', userController.create);
router.put('/:id', userController.update);
router.delete('/:id', userController.delete);

module.exports = router;
