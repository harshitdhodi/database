const Testimonial = require('../model/testimonial');
const path=require('path')
const fs=require('fs')

const insertTestimonial = async (req, res) => {
  try {
    const { name,designation,testimony,alt,status } = req.body;
    const photo = req.files['photo'] ? req.files['photo'].map(file => file.filename) : [];

    const testimonial = new Testimonial({
      name,
      designation,
      testimony,
      alt,
      photo,
      status
    });

    await testimonial.save();
    return res.status(201).send({ message: 'data send successfully', testimonial: testimonial });

  } catch (error) {
    console.error("Error inserting news:", error);
    res.status(400).send(error);
  }
}

const getTestimonials = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const limit = 5; // Number of records per page

    const count = await Testimonial.countDocuments(); // Get total count first
    const testimonials = await Testimonial.find()
      .skip((page - 1) * limit) // Skip records for previous pages
      .limit(limit);

    res.status(200).json({
      data: testimonials,
      total: count,
      currentPage: page,
      hasNextPage: count > page * limit
    });
  } catch (error) {
    console.error("Error retrieving testimonials:", error);
    let errorMessage = 'Error fetching testimonials';
    if (error.name === 'CastError') {
      errorMessage = 'Invalid query parameter format';
    }
    res.status(500).json({ message: errorMessage });
  }
};


const updateTestimonial = async (req, res) => {
  const { id } = req.query;
  const updateFields = req.body;

  try {
    // Fetch the existing testimonial to get its current photos
    const existingTestimonial = await Testimonial.findById(id);

    if (!existingTestimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    // Process new uploaded photos
    if (req.files && req.files['photo'] && req.files['photo'].length > 0) {
      const newPhotoPaths = req.files['photo'].map(file => file.filename); // Using filename to get the stored file names
      updateFields.photo = [...existingTestimonial.photo, ...newPhotoPaths];
    } else {
      updateFields.photo = existingTestimonial.photo; // Keep existing photos if no new photos are uploaded
    }

    const updatedTestimonial = await Testimonial.findByIdAndUpdate(
      id,
      updateFields,
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedTestimonial);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.query;

    const testimonial = await Testimonial.findById(id); 
    
    testimonial.photo.forEach(filename => {
      const filePath = path.join(__dirname, '../images', filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); // Delete file synchronously if it exists
      } else {
        console.warn(`File not found: ${filename}`);
      }
    });
    const deletedTestimonial = await Testimonial.findByIdAndDelete(id);

    if (!deletedTestimonial) {
      return res.status(404).send({ message: 'testimonials not found' });
    }
    res.send({ message: "testmonial deleted successfully" }).status(200);
  } catch (error) {
    console.error(err);
    res.status(400).send(err);
  }
}

const getTestimonialById = async (req, res) => {
  try {
    const { id } = req.query;

    const testimonial = await Testimonial.findById(id);
  
    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }
    res.status(200).json({ data: testimonial });
  } catch (error) {
   
    res.status(500).json({ message: "Server error" });
  }
}

const countTestimonial = async (req, res) => {
  try {
    const count = await Testimonial.countDocuments();
    res.status(200).json({ total: count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error counting services' });
  }
};

const deletePhotoAndAltText = async (req, res) => {

  const { id, imageFilename, index } = req.params;
  

  try {
 
    const testimonial = await Testimonial.findById(id);

    if (!testimonial) {
      return res.status(404).json({ message: 'testimonial not found' });
    }

    // Remove the photo and its alt text
    testimonial.photo = testimonial.photo.filter(photo => photo !== imageFilename);
    testimonial.alt.splice(index, 1);

    await testimonial.save();

    const filePath = path.join(__dirname, '..', 'images', imageFilename);

        // Check if the file exists and delete it
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }

    res.json({ message: 'Photo and alt text deleted successfully' });
  } catch (error) {
    console.error('Error deleting photo and alt text:', error);
    res.status(500).json({ message: error.message });
  }
};




module.exports = { insertTestimonial, getTestimonials, updateTestimonial, deleteTestimonial, getTestimonialById, countTestimonial, deletePhotoAndAltText };