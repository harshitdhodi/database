const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authmiddleware');


const {getpageHeading,updatePageHeading} = require('../controller/pageHeading') 

router.get('/heading',requireAuth,getpageHeading,);
router.put('/updateHeading',requireAuth,updatePageHeading);

module.exports = router;