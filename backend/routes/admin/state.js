const express = require('express');
const router = express.Router();
const { 
  getState,
  createState,
  getStatesByCountryCode, // Updated function name
  deleteState,
  updateState,
  getStateById // Updated function name
} = require('../../controller/admin/state_m');

// Get all states with pagination
router.get("/getState", getState);

// Get states by country code
router.get("/getStatesByCountryCode", getStatesByCountryCode);

// Create a new state
router.post("/addState", createState);

// Delete a state by ID
router.delete("/deleteState", deleteState);

// Update a state by ID
router.put("/updateState", updateState);

// Get a state by ID
router.get("/getStateById", getStateById);

module.exports = router;
 