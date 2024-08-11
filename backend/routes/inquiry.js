const express = require('express');
const router = express.Router();
const inquiryController = require('../controller/inquiry');
const { requireAuth } = require('../middleware/authmiddleware');


// Get all inquiries
router.get('/getInquiries', requireAuth, inquiryController.getCountsAndData);

// Delete an inquiry by ID
router.delete('/deleteInquiries', requireAuth, inquiryController.deleteInquiry);

module.exports = router;
