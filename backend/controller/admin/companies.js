const Industry = require('../../model/admin/companies'); // Adjust path as necessary

  const addCompanies = async (req, res) => {
    try {
        // Extract fields from the request body
        const {
            industry_address,
            office_address,
            email,
            mobile,
            name,
            website,
            products,
            country,
            state,
            city
        } = req.body;
  
        // Handle case where no files are uploaded
        const photos = req.files ? req.files.map(file => file.filename) : [];
  
        // Convert products to an array if it's a string
        const productArray = Array.isArray(products) 
            ? products 
            : products 
                ? products.split(',').map(product => product.trim()) 
                : [];
  
        // Create a new Industry document
        const newIndustry = new Industry({
            industry_address,
            office_address,
            email,
            mobile,
            name,
            website,
            products: productArray, // Store the products as an array
            photo: photos, // Store the filenames of uploaded images
            country, // Add country field
            state,   // Add state field
            city     // Add city field
        });
  
        // Save the Industry document to the database
        await newIndustry.save();
  
        // Respond with success
        res.status(201).json({ message: 'Industry added successfully', data: newIndustry });
    } catch (error) {
        // Handle errors
        console.error('Error adding industry:', error);
        res.status(500).json({ message: 'Server error', error });
    }
  };
  



const getCompanies =async (req, res) => {
    try {
        const { page = 1 } = req.query;
        const limit = 15;
        const count = await Industry.countDocuments();
      const company = await Industry.find()
      .skip((page - 1) * limit) // Skip records for previous pages
      .limit(limit);; // Fetch all company
      res.status(200).send(
        {
            data: company,
            total: count,
            currentPage: page,
            hasNextPage: count > page * limit,
            message: "company fetched successfully",
        }
      ); // Return company as JSON response
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err });
    }
  }
module.exports = { addCompanies , getCompanies };
