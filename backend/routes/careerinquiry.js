const express = require('express');
const router = express.Router();
const careerInquiryController = require('../controller/careerinquiry');


router.get('/getCareerInquiries', careerInquiryController.getAllCareerInquiries);
router.delete('/deleteCareerInquiries', careerInquiryController.deleteCareerInquiry);
router.get('/download/:filename', careerInquiryController.downloadResume);
router.get('/view/:filename', careerInquiryController.viewResume);

module.exports = router;
