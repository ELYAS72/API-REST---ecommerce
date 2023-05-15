const express = require('express')
const multer = require('multer')
const { check } = require('express-validator')
const router = express.Router()

const csrf = require('./middleware/csrf')
const auth = require('./middleware/auth')

// parametrage multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './assets/images') // lieu ou on stocks les images
    },
    filename: (req, file, cb) => {
        const name = file.originalname.split(' ').join('_')
        cb(null, Date.now() + name)
    }
})

const upload = multer({ storage: storage })

const homeController = require('./controllers/homeController')
const categoryController = require('./controllers/categoryController')
const productController = require('./controllers/productController')
const adminController = require('./controllers/adminController')
const userController = require('./controllers/userController')
const addressController = require('./controllers/addressController')

//page d'accueil
router.route('/')
    .get(homeController.get)

// gestion des categories
router.route('/category-list')
    .get(auth,csrf, categoryController.get)

router.route('/category-create')
    .post(auth, categoryController.post)

router.route('/category-delete/:id')
    .post(categoryController.delete)

router.route('/form-category-update')
    .get(categoryController.getUpdate)

router.route('/form-category-update/:id')
    .post(categoryController.update)

// gestion des produits
router.route('/boutique')
    .get(productController.getStore)

router.route('/product-create')
    .get(productController.getForm)
    .post(upload.single('imageUrl'), csrf, productController.post)

router.route('/product-list')
    .get(productController.get)

router.route('/product-update/:id')
    .get(productController.getForm)

// gestion du back office
router.route('/back-office')
    .get(adminController.get)

// gestion utilisateur
router.route('/sign-up')
    .get(userController.getUser)
    .post(csrf,[
        check('firstName').exists().isLength({min: 5}).escape().trim().withMessage('votre nom ne dois pas etre vide'),
        check('lastName').exists().isLength({min: 5}).escape().trim().withMessage('votre prénom ne dois pas etre vide')
    ],userController.post)

router.route('/sign-in')
    .get(userController.getLog)
    .post(userController.postLog)

router.route('/log-out')
    .get(userController.logOut)

router.route('/user-list')
    .get(userController.userList)

router.route('/user-update/:id')
    .get(userController.update)
    .post(userController.postUpdate)

router.route('/user-delete/:id')
    .post(userController.delete)

// gestion des addresses

router.route('/address-create/:id')
    .post(addressController.post)

module.exports = router