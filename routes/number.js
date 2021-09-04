let express = require('express');
let numberController = require('../controllers/NumberController');
var router = express.Router();

router.get('/', numberController.get);
router.post('/getUsersByPayload', numberController.getByPayload);
router.get('/getSingedPublishers', numberController.getSignedPublisher);
router.post('/', numberController.create);
router.put('/:id', numberController.update);
router.delete('/:id', numberController.delete);
router.delete('/:id', numberController.delete);
router.post('/assign', numberController.setAssignPublisher);

module.exports = router;
