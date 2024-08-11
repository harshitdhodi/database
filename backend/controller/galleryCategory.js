
const GalleryCategory = require('../model/galleryCategory');
const Image = require("../model/gallery")
const fs = require('fs');
const path = require('path');

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await GalleryCategory.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.query
    const category = await GalleryCategory.findById(id);
    if (category == null) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new category
exports.createCategory = async (req, res) => {
  const { category,alt } = req.body;
  const photo=req.file.filename
  const newCategory = new GalleryCategory({
    category,
    photo,
    alt
  });

  try {
    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update a category
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.query
    const category = await GalleryCategory.findById(id);
    if (category == null) {
      return res.status(404).json({ message: 'Category not found' });
    }

      category.category = req.body.category;
      category.alt=req.body.alt
   
      if(req.body.photo){
        category.photo=req.body.photo
      }
    
    if(req.file){
      category.photo=req.file.filename
    }

    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a category
exports.deleteCategory = async (req, res) => {
  try {
    const {id}=req.query
    const category = await GalleryCategory.findById(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    if (category.photo) {
      const filePath = path.join(__dirname, '..', 'logos', category.photo);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    const deletedCategory = await GalleryCategory.findByIdAndDelete(id);
    if (!deletedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    await Image.updateMany(
      { categories: id },
      { $pull: { categories: id } }
    );

    res.json({ message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
