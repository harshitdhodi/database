

const GoogleSettings = require('../model/googlesettings');

// Function to fetch Google settings
exports.getGoogleSettings = async (req, res) => {
    try {
        const googleSettings = await GoogleSettings.findOne();
        res.json(googleSettings);
    } catch (error) {
        res.status(500).send('Failed to fetch Google settings.');
    }
};

// Function to update Google settings
exports.updateGoogleSettings = async (req, res) => {
    const { headerscript, bodyscript } = req.body;

    try {
        let googleSettings = await GoogleSettings.findOne();
        if (!googleSettings) {
            googleSettings = new GoogleSettings({
                headerscript,
                bodyscript,
            });
        } else {
            googleSettings.headerscript = headerscript;
            googleSettings.bodyscript = bodyscript;
        }

        await googleSettings.save();
        res.send('Google settings updated successfully!');
    } catch (error) {
        res.status(500).send('Failed to update Google settings.');
    }
};
