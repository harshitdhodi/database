const Image = require('../model/gallery');
const path = require('path');
const galleryCategory = require('../model/galleryCategory');
const fs = require('fs');

// Get all images
exports.getAllImages = async (req, res) => {
    try {
        const images = await Image.find();

        const galleryWithCategoryName = await Promise.all(images.map(async (image) => {
            const category = await galleryCategory.findOne({ '_id': image.categories })

            const categoryName = category ? category.category : "Uncategorized"
            return {
                ...image.toJSON(),
                categoryName
            };
        }));
        res.status(200).json(galleryWithCategoryName);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Add a new image
exports.addNewImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image file provided' });
        }

        // Save the image path and description to the database
        const image = req.file.filename;
        const alt = req.body.alt;
        const categories = req.body.categories;
        const newImage = new Image({ images: image, alt, categories });
        await newImage.save();

        res.status(200).json({ message: 'Image uploaded successfully', image, alt, categories });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete an image
exports.deleteImage = async (req, res) => {
    try {
        const { id } = req.query;

        const image = await Image.findById(id);

      
        const filePath = path.join(__dirname, '../uploads', image.images);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath); 
        } else {
          console.warn(`File not found: ${image.images}`);
        }
      

        // Find the document containing the image array
        const imageDoc = await Image.findByIdAndDelete(id);

        if (!imageDoc) {
            return res.status(404).json({ message: 'record not found' });

        }
        res.status(200).json({ message: 'record deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getSingleImage = async (req, res) => {
    const { id } = req.query;

    try {
        const image = await Image.findById(id);

        if (!image) {
            return res.status(404).json({ message: 'image not found' });
        }

        res.status(200).json(image);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Download an image
exports.downloadImage = (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '../uploads', filename);

    res.download(filePath, (err) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'File download failed' });
        }
    });
};

exports.updateImage = async (req, res) => {
    try {
        const { id } = req.query;
        const { alt, categories } = req.body;
        let images = req.body.images;

        // Check if a new image is uploaded
        if (req.file) {
            images = req.file.filename; // Use the new image file name
        }

        const updatedImage = await Image.findByIdAndUpdate(
            id,
            { images, alt, categories },
            { new: true }
        );

        if (!updatedImage) {
            return res.status(404).json({ message: 'Image not found' });
        }

        res.json({ message: 'Image updated successfully', updatedImage });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getGalleryById = async (req, res) => {
    const { id } = req.query;
    try {
      const gallery = await Image.findById(id);
      res.json(gallery);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
