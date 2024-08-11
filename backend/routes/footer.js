const express = require('express');
const router = express.Router();
const footerController = require('../controller/footer');
const { requireAuth } = require('../middleware/authmiddleware');

router.get('/getFooter', requireAuth,footerController.getFooter);
router.put('/updateFooter', requireAuth,footerController.updateFooter);

module.exports = router;
