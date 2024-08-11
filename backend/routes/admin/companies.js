const express = require('express');
const router = express.Router();

const {addCompanies , getCompanies} = require("../../controller/admin/companies")
const {uploadPhoto} = require("../../middleware/admin/imageUpload")

router.post("/company" ,uploadPhoto, addCompanies)
router.get("/getCompanies" , getCompanies)
module.exports = router ;
