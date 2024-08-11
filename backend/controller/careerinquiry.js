const CareerInquiry = require('../model/carrerinquiry');
const path=require('path')


exports.getAllCareerInquiries = async (req, res) => {
  try {
    const inquiries = await CareerInquiry.find();

    res.status(200).json({
      success: true,
      data: inquiries,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch career inquiries',
      error: error.message,
    });
  }
};

exports.deleteCareerInquiry = async (req, res) => {
  try {
    const deletedInquiry = await CareerInquiry.findByIdAndDelete(req.params.id);

    if (!deletedInquiry) {
      return res.status(404).json({
        success: false,
        message: 'Career inquiry not found',
      });
    }

    res.status(200).json({
      success: true,
      data: deletedInquiry,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete career inquiry',
      error: error.message,
    });
  }
};


exports.downloadResume = (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '../resumes', filename);

    res.download(filePath, (err) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'File download failed' });
        }
    });
};

exports.viewResume = (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '..', 'resumes', filename);
    res.sendFile(filePath);
  };
  