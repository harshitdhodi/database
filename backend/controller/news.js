const News = require("../model/news");
const newsCategory = require("../model/newsCategory")
const path = require('path')
const fs = require('fs')


const insertNews = async (req, res) => {
  try {

    const { title, details, status, alt, slug, metatitle, metadescription, metakeywords, metacanonical, metalanguage, metaschema, otherMeta, postedBy, date, categories, subcategories, subSubcategories, url, priority, changeFreq } = req.body;
    const photo = req.files['photo'] ? req.files['photo'].map(file => file.filename) : [];

    const news = new News({
      title,
      details,
      photo,
      status,
      postedBy,
      metatitle,
      metadescription,
      metakeywords,
      metacanonical,
      metalanguage,
      metaschema,
      otherMeta,
      slug,
      url,
      changeFreq,
      priority,
      status,
      alt,
      date,
      categories,
      subcategories,
      subSubcategories
    });

    await news.save();
    res.send(news);
  } catch (err) {
    console.error("Error inserting news:", err);
    res.status(400).send(err);
  }
}

const getNews = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const limit = 5;
    const count = await News.countDocuments();
    const news = await News.find()
      .skip((page - 1) * limit)
      .limit(limit);

    const newsWithCategoryName = await Promise.all(news.map(async (news) => {
      const category = await newsCategory.findOne({ '_id': news.categories });
      const categoryName = category ? category.category : 'Uncategorized';
      return {
        ...news.toJSON(),
        categoryName
      };
    }));
    res.status(200).json({
      data: newsWithCategoryName,
      total: count,
      currentPage: page,
      hasNextPage: count > page * limit
    });
  } catch (error) {
    console.error("Error retrieving products:", error);
    let errorMessage = 'Server error';
    if (error.name === 'CastError') {
      errorMessage = 'Invalid query parameter format';
    }
    res.status(500).json({ message: errorMessage, error });
  }
};

const updateNews = async (req, res) => {
  const { slugs } = req.query;
  const updateFields = req.body;

  try {
    // Fetch the existing news item to get its current photos
    const existingNews = await News.findOne({slug:slugs});

    if (!existingNews) {
      return res.status(404).json({ message: 'News item not found' });
    }

    // Process new uploaded photos
    if (req.files && req.files['photo'] && req.files['photo'].length > 0) {
      const newPhotoPaths = req.files['photo'].map(file => file.filename); // Using filename to get the stored file names
      updateFields.photo = [...existingNews.photo, ...newPhotoPaths];
    } else {
      updateFields.photo = existingNews.photo; // Keep existing photos if no new photos are uploaded
    }

    const updatedNews = await News.findOneAndUpdate(
      { slug: slugs },
      updateFields,
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedNews);
  } catch (error) {
    console.error("Error updating news:", error);
    res.status(500).json({ message: 'Server error', error });
  }
};


const deleteNews = async (req, res) => {
  try {
    const { slugs } = req.query;

    const news = await News.findOne({slug:slugs});

    news.photo.forEach(filename => {
      const filePath = path.join(__dirname, '../images', filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      } else {
        console.warn(`File not found: ${filename}`);
      }
    });

    const deletedNews = await News.findOneAndDelete({slug:slugs});

    if (!deletedNews) {
      return res.status(404).send({ message: 'News not found' });
    }

    res.send({ message: "News deleted successfully" }).status(200);
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
}


const getNewsById = async (req, res) => {
  try {
    const { slugs} = req.query;

    const news = await News.findOne({slug:slugs});
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }
    res.status(200).json({ data: news });
  } catch (error) {

    res.status(500).json({ message: "Server error" });
  }
}

const countNews = async (req, res) => {
  try {
    const count = await News.countDocuments();
    res.status(200).json({ total: count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error counting services' });
  }
};

const deletePhotoAndAltText = async (req, res) => {

  const { slugs, imageFilename, index } = req.params;


  try {

    const news = await News.findOne({slug:slugs});

    if (!news) {
      return res.status(404).json({ message: 'news not found' });
    }

    // Remove the photo and its alt text
    news.photo = news.photo.filter(photo => photo !== imageFilename);
    news.alt.splice(index, 1);

    await news.save();
    
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

const getCategoryNews = async (req, res) => {
  const { categoryId } = req.query;

  try {
    const news = await News.find({ categories: categoryId });

    if (news.length === 0) {
      return res.status(404).json({ message: 'No news found for this category' });
    }

    res.status(200).json(news);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const getSubcategoryNews = async (req, res) => {
  const { subcategoryId } = req.query;

  try {
    const news = await News.find({ subcategories: subcategoryId });

    if (news.length === 0) {
      return res.status(404).json({ message: 'No news found for this subcategory' });
    }

    res.status(200).json(news);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const getSubSubcategoryNews = async (req, res) => {
  const { subSubcategoryId } = req.query;

  try {
    const news = await News.find({ subSubcategories: subSubcategoryId });

    if (news.length === 0) {
      return res.status(404).json({ message: 'No news found for this sub-subcategory' });
    }

    res.status(200).json(news);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const fetchUrlPriorityFreq = async (req, res) => {
  try {
    // Get  newsId from request parameters
    const news = await News.find({}).select('_id url priority changeFreq lastmod');
    if (!news) {
      return res.status(404).json({ error: "news not found" });
    }
    res.status(200).json(news);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};


const fetchUrlmeta = async (req, res) => {
  try {
    // Get newsId from request parameters
    const news = await News.find({}).select('_id url metatitle metadescription metakeywords metacanonical metalanguage metaschema otherMeta');
    if (!news) {
      return res.status(404).json({ error: "news not found" });
    }
    res.status(200).json(news);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
}


const editUrlPriorityFreq = async (req, res) => {
  try {
    const { id } = req.query; // Get productId from request parameters
    const { url, priority, changeFreq } = req.body;

    const updatedNews = await News.findByIdAndUpdate(
      id,
      { url, priority, changeFreq, lastmod: Date.now() },
      { new: true }
    );

    if (!updatedNews) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(updatedNews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const editUrlmeta = async (req, res) => {
  try {
    const { id } = req.query; // Get newsId from request parameters
    const { url, metatitle, metadescription, metakeywords, metacanonical, metalanguage, metaschema, otherMeta } = req.body;

    const updatedNews = await News.findByIdAndUpdate(
      id,
      { url, metatitle, metadescription, metakeywords, metacanonical, metalanguage, metaschema, otherMeta },
      { new: true }
    );

    if (!updatedNews) {
      return res.status(404).json({ error: "news not found" });
    }

    res.status(200).json(updatedNews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// const deleteUrlPriorityFreq = async (req, res) => {
//   try {
//     const { id } = req.query; // Get productId from request parameters

//     const updatedNews = await News.findByIdAndUpdate(
//       id,
//       { $unset: { url: "", priority: "", changeFreq: "" } },
//       { new: true }
//     );

//     if (!updatedNews) {
//       return res.status(404).json({ error: "Product not found" });
//     }

//     res.status(200).json({ message: "Url, priority, and freq deleted successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Server error" });
//   }
// };

const fetchUrlPriorityFreqById = async (req, res) => {
  try {
    const { id } = req.query; // Extract id from query parameters

    if (!id) {
      return res.status(400).json({ error: "ID is required" });
    }

    // Find the news by ID and select specific fields
    const news = await News.findById(id).select('url priority changeFreq');

    if (!news) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(news);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const fetchUrlmetaById = async (req, res) => {
  try {
    const { id } = req.query; // Extract id from query parameters

    if (!id) {
      return res.status(400).json({ error: "ID is required" });
    }

    // Find the news by ID and select specific fields
    const news = await News.findById(id).select('url metatitle metadescription metakeywords metacanonical metalanguage metaschema otherMeta');

    if (!news) {
      return res.status(404).json({ error: "News not found" });
    }

    res.status(200).json(news);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};



module.exports = { insertNews, getNews, updateNews, deleteNews, getNewsById, countNews, deletePhotoAndAltText, getCategoryNews, getSubcategoryNews, getSubSubcategoryNews, fetchUrlPriorityFreq, editUrlPriorityFreq, fetchUrlPriorityFreqById, fetchUrlmeta, editUrlmeta, fetchUrlmetaById };
