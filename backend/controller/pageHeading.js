const PageHeadings = require('../model/pageHeading');

const getpageHeading = async (req, res) => {
  const pageType = req.query.pageType;

  try {
    const pageHeading = await PageHeadings.findOne({ pageType: pageType });
    if (pageHeading) {
      res.status(200).json({ heading: pageHeading.heading, subheading: pageHeading.subheading });
    }
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving page heading' });
  }
}

const updatePageHeading = async (req, res) => {
  const pageType = req.query.pageType;
  const { heading, subheading } = req.body;

  try {
    let pageHeading = await PageHeadings.findOne({ pageType: pageType });

    if (!pageHeading) {
      // Create a new record with provided values
      pageHeading = new PageHeadings({
        pageType: pageType,
        heading: heading || 'Default Heading',
        subheading: subheading || 'Default Subheading'
      });
      await pageHeading.save();
      return res.status(201).json({
        message: `Page heading created for ${pageType}`,
        heading: pageHeading.heading,
        subheading: pageHeading.subheading
      });
    }

    // Update existing record
    if (heading) pageHeading.heading = heading;
    if (subheading) pageHeading.subheading = subheading;

    await pageHeading.save();

    res.status(200).json({ heading: pageHeading.heading, subheading: pageHeading.subheading });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating page heading' });
  }
};



module.exports = { getpageHeading ,updatePageHeading};