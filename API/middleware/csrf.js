const fs = require('fs')

module.exports = (req, res, next) => {

    if (req.session.csrfToken !== req.body.csrf) {
        if (req.file) {
            fs.unlink(`assets/images/${req.file.filename}`)
        }
        console.log('erreur csrf')
        return res.redirect('back')
    } else {
        next()
    }

}