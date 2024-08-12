const express = require('express');
const router = express.Router();
const {createCity, getCity, getCityBySlug , deleteCity,updateCity } = require('../../controller/admin/city');

router.get("/getCity" , getCity);
router.get("/getCityBySlug" , getCityBySlug);
router.post("/createCity" , createCity);
router.put("/updateCity" , updateCity);
router.delete("/deleteCity" , deleteCity);
module.exports = router  