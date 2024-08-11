// routes/location.js
const express = require('express');
const router = express.Router();
const { addStatesAndCities } = require('../../controller/admin/state_city');

// POST route to add states and cities
router.post('/', addStatesAndCities);

module.exports = router;
