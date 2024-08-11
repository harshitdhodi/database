const Country = require('../../model/admin/country'); // Adjust the path to your Country model
const slugify = require('slugify');
exports.createCountry = async (req, res) => {
    try {
      const { name, countryCode} = req.body;
      
      // Create a slug from the name
      const slug = slugify(name, { lower: true });
  
      const country = new Country({
        name,
        countryCode,
      
        slug
      });
  
      await country.save();
      res.status(201).json({ message: 'Country created successfully', data: country });
    } catch (error) {
        console.log(error)
      res.status(500).json({ message: 'Server error', error });
    }
  };
  
  // Get all countries
  exports.getAllCountries = async (req, res) => {
    try {
      const { page = 1 } = req.query;
      const limit = 15;
      const count = await Country.countDocuments();
      const countries = await Country.find()   
      .skip((page - 1) * limit) // Skip records for previous pages
      .limit(limit); // Fetch all cities;
      res.status(200).json({ message: 'Countries retrieved successfully', data: countries, total: count,
        currentPage: page,
        hasNextPage: count > page * limit, });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };
  
  // Get a country by slug
  exports.getCountryBySlug = async (req, res) => {
    try {
      const country = await Country.findOne({ slug: req.params.slug });
      if (!country) {
        return res.status(404).json({ message: 'Country not found' });
      }
      res.status(200).json({ message: 'Country retrieved successfully', data: country });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };
  
  // Update a country by slug
  exports.updateCountry = async (req, res) => {
    try {
      const country = await Country.findOneAndUpdate({ slug: req.params.slug }, req.body, { new: true });
      if (!country) {
        return res.status(404).json({ message: 'Country not found' });
      }
      res.status(200).json({ message: 'Country updated successfully', data: country });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };
  
  // Delete a country by slug
  exports.deleteCountry = async (req, res) => {
    try {
      const country = await Country.findOneAndDelete({ slug: req.params.slug });
      if (!country) {
        return res.status(404).json({ message: 'Country not found' });
      }
      res.status(200).json({ message: 'Country deleted successfully', data: country });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };