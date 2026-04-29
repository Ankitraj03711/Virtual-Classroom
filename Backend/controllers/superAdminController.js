const UserModel = require('../models/userModel')

const toggleSubscription = async (req, res) => {
    try {
        const { subscriberEmailId } = req.body;

        const subscriber = await UserModel.findOne({ email: subscriberEmailId })
        subscriber.verified = !subscriber.verified
        await subscriber.save();

        res.status(200).json({ 
            success: true, 
            message: "Operation Successful " 
        });
    } catch (err) {
        res.status(500).json({ error: "Something went wrong" });
    }
};

const allSubsciptions = async (req, res) => {
    try {
        const allSubscribers = await UserModel.find().select("name email verified createdAt");

        // remove only the first item whose email matches
        const idx = allSubscribers.findIndex(u => u.email === process.env.SUPER_ADMIN);
        if (idx !== -1) allSubscribers.splice(idx, 1);

        res.status(200).json({ success: true, allSubscribers });
    } catch (err) {
        res.status(500).json({ error: "Something went wrong" });
    }
};


module.exports = { toggleSubscription, allSubsciptions };