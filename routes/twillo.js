let express = require('express');
let twilloController = require('../controllers/TwilloController');
var router = express.Router();

router.post('/phoneNumbers', twilloController.getPhoneNumbers);
router.post('/pricingNumbers', twilloController.pricingNumber);
router.post('/purchaseNumber', twilloController.purchaseNumber);
router.post('/releaseNumber', twilloController.releaseNumber);
router.post('/createSubAccount', twilloController.createSubAccounts);
router.post('/transferNumbersToSubAccount', twilloController.transferNumbersToSubAccount);
router.post('/acceptIncomingCall', twilloController.acceptIncomingClientCall);
router.post('/rejectIncomingCall', twilloController.rejectIncomingClientCall);

module.exports = router;
