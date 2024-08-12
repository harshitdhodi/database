const State = require("../../model/admin/state")
const Country = require("../../model/admin/country")

const createState = async (req, res) => {
  try {
    const newState = new State(req.body);
    await newState.save();
    res.status(201).json({ message: "State created successfully", data: newState });
  } catch (error) {
    res.status(400).json({ message: "Error creating state", error });
  }
};

const getState =async (req, res) => {
    try {
        const { page = 1 } = req.query;
        const limit = 15;
        const count = await State.countDocuments();
      const state = await State.find()
      .skip((page - 1) * limit) // Skip records for previous pages
      .limit(limit);; // Fetch all state
      res.status(200).send(
        {
            data: state,
            total: count,
            currentPage: page,
            hasNextPage: count > page * limit,
            message: "state fetched successfully",
        } 
      ); // Return state as JSON response
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err });
    }
  }


  const getStatesByCountryName = async (req, res) => {
    try {
        const { countryCode } = req.query;

        if (!countryCode) {
            return res.status(400).json({ message: 'countryName query parameter is required' });
        }

        // Find the country by name to get the country code
        const country = await Country.findOne({ name: countryCode });

        if (!country) {
            return res.status(404).json({ message: 'Country not found' });
        }

        // Find states by country code
        const states = await State.find({ countryName: countryCode });

        if (!states || states.length === 0) {
            return res.status(404).json({ message: 'States not found' });
        }
  
        res.status(200).json(states);
    } catch (error) {
        console.error("Error fetching states by country name:", error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};

const updateState = async (req, res) => {
  try {
    const {id} 
    const updatedState = await State.findOneAndUpdate({ slug: req.params.slug }, req.body, { new: true });
    if (!updatedState) return res.status(404).json({ message: "State not found" });
    res.status(200).json({ message: "State updated successfully", data: updatedState });
  } catch (error) {
    res.status(400).json({ message: "Error updating state", error });
  }
};

const getStatebySlug  = async (req, res) => {
  try {
    const {id} = req.query;
    const state = await State.findById(id);
    if (!state) return res.status(404).json({ message: "State not found" });
    res.status(200).json({ data: state });
  } catch (error) {
    res.status(400).json({ message: "Error fetching state", error });
  }
};
const deleteState = async (req, res) => {
  try {
    const deletedState = await State.findOneAndDelete({ slug: req.params.slug });
    if (!deletedState) return res.status(404).json({ message: "State not found" });
    res.status(200).json({ message: "State deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Error deleting state", error });
  }
};

  module.exports = {getState,createState , getStatesByCountryName ,updateState, getStatebySlug , deleteState}