const express = require('express');
const router = express.Router();
const {createCity, getCity } = require('../../controller/admin/city');

router.get("/getCity" , getCity);
router.post("/createCity" , createCity);
module.exports = router 