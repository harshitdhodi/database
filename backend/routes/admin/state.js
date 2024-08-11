const express = require('express');
const router = express.Router();
const { getState ,createState , getStatesByCountryName,getStatebySlug , updateState ,deleteState } = require('../../controller/admin/state');

router.get("/getState" , getState);
router.get("/getStatebyCountry" , getStatesByCountryName);
router.post("/addState" , createState)
router.delete("/deleteState/:slug" , deleteState)
router.put("/updateState/:slug" , updateState)
router.get("/getStatebySlug/:slug" , getStatebySlug);
module.exports = router 
