const User = require("../models/userModel")

module.exports = async (req, res, next) => {
    const user = await User.findByPk(req.session.userPk)

    if (!user) {
        console.log(req.session.userPk)
        return res.redirect('/')
    } else {
        next()
    }
}

