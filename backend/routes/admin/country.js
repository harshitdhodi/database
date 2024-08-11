const express = require('express');
const router = express.Router();
const countryController = require('../../controller/admin/country');

// Create a new country
router.post('/countries', countryController.createCountry);

// Get all countries
router.get('/countries', countryController.getAllCountries);

// Get a country by slug
router.get('/countries/:slug', countryController.getCountryBySlug);

// Update a country by slug
router.put('/countries/:slug', countryController.updateCountry);

// Delete a country by slug
router.delete('/countries/:slug', countryController.deleteCountry);

module.exports = router;
