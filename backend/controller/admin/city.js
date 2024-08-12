const City = require("../../model/admin/city")

// Create a new city
const createCity = async (req, res) => {
  try {
    const newCity = new City(req.body);
    await newCity.save();
    res.status(201).json({ message: "City created successfully", data: newCity });
  } catch (error) {
    res.status(400).json({ message: "Error creating city", error });
  }
};

const getCity =async (req, res) => {
    try {
        const { page = 1 } = req.query;
        const limit = 15;
        const count = await City.countDocuments();
      const cities = await City.find()
      .skip((page - 1) * limit) // Skip records for previous pages
      .limit(limit); // Fetch all cities
      res.status(200).send(
        {
            data: cities,
            total: count,
            currentPage: page,
            hasNextPage: count > page * limit,
            message: "cities fetched successfully",
        }
      ); // Return cities as JSON response
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err });
    }
  } 


 const getCityBySlug = async (req, res) => {
    try {
      const {id} = req.query;
      const city = await City.findById(id);
      if (!city) return res.status(404).json({ message: "City not found" });
      res.status(200).json({ data: city });
    } catch (error) {
      res.status(400).json({ message: "Error fetching city", error });
    }
  };

  
 const updateCity = async (req, res) => {
    try {
      const {id} = req.query;
      const updatedCity = await City.findByIdAndUpdate(id , req.body, { new: true });
      if (!updatedCity) return res.status(404).json({ message: "City not found" });
      res.status(200).json({ message: "City updated successfully", data: updatedCity });
    } catch (error) {
      res.status(400).json({ message: "Error updating city", error });
    }
  };
    

  const deleteCity = async (req, res) => {
    try {
      const {id} = req.query
      const deletedCity = await City.findByIdAndDelete(id);
      if (!deletedCity) return res.status(404).json({ message: "City not found" });
      res.status(200).json({ message: "City deleted successfully" });
    } catch (error) {
      res.status(400).json({ message: "Error deleting city", error });
    }
  };
  module.exports = {createCity ,getCityBySlug,deleteCity,updateCity, getCity} 