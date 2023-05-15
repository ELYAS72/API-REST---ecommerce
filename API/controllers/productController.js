const { Sequelize } = require("sequelize")
const Category = require("../models/categoryModel")
const Product = require("../models/productModel")

module.exports = {
    get: async (req, res) => {
        const products = await Product.findAll({
            include: Category,
            raw: true,
            nest: true
        })
        res.render('products', { products })
    },
    getForm: async (req, res) => {


        // .findAll({raw: true}) pour afficher ce que la bdd contient 
        const categories = await Category.findAll({ raw: true })
        const product = await Product.findByPk(req.params.id, { include: Category, raw: true, nest: true })
        res.render('form_product', { categories, product })
        // res.send(categories)
        // res.status(200).json(categories)
    },
    post: async (req, res) => {
        await Product.create({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            quantity: req.body.quantity,
            categoryId: req.body.categoriesId,
            weight: req.body.weight,
            imageUrl: '/public/images/' + req.file.filename,
        })
        res.redirect('/product-create')
    },
    getStore: async (req, res) => {
        const Pl = true
        const products = await Category.findAll({
            include: Product,
            raw: true,
            nest: true
        })
        const categories = await Category.findAll({ raw: true })
        res.render('boutique', { products, Pl, categories })
    }
}