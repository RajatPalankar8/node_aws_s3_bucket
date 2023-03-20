const UserModel = require('../model/user.model');

exports.userAuthMiddleWare = async (req, res, next) => {
    try {
        const apiKey = req.query.apiKey;
        if (!apiKey) {
            return res.status(400).json({ status: false, success: 'apiKey is mandatory' });
        }

        const getUser = await UserModel.findOne({apiKey});
        if(!getUser){
            return res.status(402).json({ status: false, success: 'apiKey not found' });
        }
        req.user = getUser;
        next();
    } catch (error) {
        res.status(403).json({ status: false, success: {}, token: 'Something went wrong' })
    }
}