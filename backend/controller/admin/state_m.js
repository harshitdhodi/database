const State = require("../../model/admin/state");
const Country = require("../../model/admin/country");

// Create a new state
const createState = async (req, res) => {
  try {
    const newState = new State(req.body);
    await newState.save();
    res.status(201).json({ message: "State created successfully", data: newState });
  } catch (error) {
    res.status(400).json({ message: "Error creating state", error });
  }
};

// Get states with pagination
const getState = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const limit = 15;
    const count = await State.countDocuments();
    const states = await State.find()
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      data: states,
      total: count,
      currentPage: page,
      hasNextPage: count > page * limit,
      message: "States fetched successfully",
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

// Get states by country code
const getStatesByCountryCode = async (req, res) => {
  try {
    const { countryCode } = req.query;

    if (!countryCode) {
      return res.status(400).json({ message: 'countryCode query parameter is required' });
    }

    const states = await State.find({ countryCode });

    if (!states || states.length === 0) {
      return res.status(404).json({ message: 'States not found' });
    }

    res.status(200).json(states);
  } catch (error) {
    console.error("Error fetching states by country code:", error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

// Get a state by ID
const getStateById = async (req, res) => {
  try {
    const { id } = req.query; // Destructuring id from query
    const state = await State.findById(id);

    if (!state) {
      return res.status(404).json({ message: "State not found" });
    }

    res.status(200).json({ data: state });
  } catch (error) {
    console.error('Error fetching state:', error);
    res.status(400).json({ message: "Error fetching state", error });
  }
};

// Update a state by ID
const updateState = async (req, res) => {
  try {
    const { id } = req.query; // Destructuring id from query
    const updateData = req.body;

    const updatedState = await State.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedState) {
      return res.status(404).json({ message: "State not found" });
    }

    res.status(200).json({ message: "State updated successfully", data: updatedState });
  } catch (error) {
    console.error('Error updating state:', error);
    res.status(400).json({ message: "Error updating state", error });
  }
};

// Delete a state by ID
const deleteState = async (req, res) => {
  try {
    const { id } = req.query; // Destructuring id from query
    const deletedState = await State.findByIdAndDelete(id);

    if (!deletedState) {
      return res.status(404).json({ message: "State not found" });
    }

    res.status(200).json({ message: "State deleted successfully" });
  } catch (error) {
    console.error('Error deleting state:', error);
    res.status(400).json({ message: "Error deleting state", error });
  }
};

module.exports = {
  createState,
  getState,
  getStatesByCountryCode,
  getStateById,
  updateState,
  deleteState,
};
