const Blog = require("../model/blog");

const insertBlog = async (req, res) => {
  try {
    const { title, details, status, icon, author } = req.body;
    const photo = req.files.map((file) => file.filename);

    const blog = new Blog({
      title,
      details,
      photo,
      icon,
      author,
      status,
    });

    await blog.save();
    res.send(blog);
  } catch (error) {
    console.error("Error inserting news:", err);
    res.status(400).send(err);
  }
};

const getBlog = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const limit = 5;

    const count = await Blog.countDocuments();
    const blog = await Blog.find()
      .skip((page - 1) * limit) // Skip records for previous pages
      .limit(limit);
    res.status(200).json({
      data: blog,
      total: count,
      currentPage: page,
      hasNextPage: count > page * limit,
    });
  } catch (error) {
  
    let errorMessage = "Error fetching news";
    if (error.name === "CastError") {
      errorMessage = "Invalid query parameter format";
    }
    res.status(500).json({ message: errorMessage });
  }
};

const updateBlog = async (req, res) => {
  try {
    const { id } = req.query;
    const { title, details, status, icon, author } = req.body;
    const photo = req.files ? req.files.map((file) => file.filename) : [];

    const updateObj = {
      $set: {},
    };

    if (title) updateObj.$set.title = title;
    if (details) updateObj.$set.details = details;
    if (status) updateObj.$set.status = status;
    if (icon) updateObj.$set.icon = icon;
    if (author) updateObj.$set.author = author;
    if (photo.length > 0) updateObj.$set.photo = photo;

    const blog = await Blog.findByIdAndUpdate(id, updateObj, { new: true });
    if (!blog) {
      return res.status(404).send({ message: "blog not found" });
    }
    res.status(200).send({ blog, message: "Update successful" });
  } catch (error) {
 
    res.status(400).send(error);
  }
};

const deleteBlog = async (req, res) => {
  try {
    const { id } = req.query;

    const blog = await Blog.findByIdAndDelete(id);

    if (!blog) {
      return res.status(404).send({ message: "Blog not found" });
    }

    res.send({ message: "Blog deleted successfully" }).status(200);
  } catch (error) {
    res.status(400).send(error);
  }
};

const getBlogById = async (req, res) => {
  try {
    const { id } = req.query;
 
    const blog = await Blog.findById(id);
    
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(200).json({ data: blog });
  } catch (error) {

    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { insertBlog, getBlog, updateBlog, deleteBlog, getBlogById };