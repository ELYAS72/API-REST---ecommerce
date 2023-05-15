const Category = require("../models/categoryModel")

module.exports = {
    get: async (req, res) => {
        // raw: true pour afficher ce que la bdd contient 
        const categories = await Category.findAll({raw: true})
        res.render('category_list', {categories})
    },
    post: async (req, res) => {
        console.log(req.body.category)
        await Category.create({name: req.body.category});
        res.redirect('/category-list')
    },
    delete: async (req, res) => {
        await Category.destroy({
            where: {
                id: req.params.id
            }
        })
        res.redirect('/category-list')
    },
    getUpdate: async (req, res) => {
        const categorie = await Category.findByPk(req.query.id, {raw: true})
        res.render('form_category', {categorie})
    },
    update: async (req, res) => {
        await Category.update({name: req.body.categorie}, {
            where: {
            id: req.params.id
            }
        })
        res.redirect('/category-list')
    }
}