const Address = require("../models/addressModel")
const User = require("../models/userModel")

module.exports = {
    post: async (req, res) => {
        // on recupere les elements qui sont stocké dans addressModel + le userId de userModel
        const address = await Address.create({
            userId:req.params.id,
            addressName: req.body.addressName,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            number: req.body.number,
            street: req.body.street,
            postCode: req.body.postCode,
            city: req.body.city,
            country: req.body.country
        })
        res.redirect('/')
    }

}