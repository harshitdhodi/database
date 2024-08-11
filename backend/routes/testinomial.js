const express = require('express');
const router = express.Router();

const {insertTestimonial, getTestimonials, updateTestimonial,deleteTestimonial, getTestimonialById,countTestimonial,deletePhotoAndAltText} = require('../controller/testimonial');
const { uploadPhoto } = require('../middleware/fileUpload');
const { requireAuth } = require('../middleware/authmiddleware');


router.post('/insertTestinomial',requireAuth,uploadPhoto , insertTestimonial);
router.get('/getTestimonial' , requireAuth,getTestimonials);
router.put('/updateTestimonial',requireAuth,uploadPhoto, updateTestimonial)
router.delete('/deleteTestimonial' ,requireAuth, deleteTestimonial)
router.get('/getTestimonialById', requireAuth,getTestimonialById)
router.get('/countTestimonial',requireAuth, countTestimonial)
router.delete('/:id/image/:imageFilename/:index',requireAuth, deletePhotoAndAltText)
module.exports = router;