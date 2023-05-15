const { validationResult } = require('express-validator')
const bcrypt = require('bcrypt')

const User = require("../models/userModel")
const Role = require("../models/roleModel")
const Etre = require("../models/etreModel")

module.exports = {
    getUser: async (req, res) => {
        const sU = true
        res.render('register', { sU })
    },

    post: async (req, res) => {
        const result = validationResult(req)
        console.log(result)
        if (!result.isEmpty()) {
            return res.status(422).render('register', {errors: result.errors})
        }



        const password = req.body.password
        const confirmPassword = req.body.confPassword
        // on test si le mot de passe n'est pas vide
        if (password === "") {
            const sU = true
            const error = "le mot de passe est vide"
            res.render('register', { error, sU })
        } else {
            // si le mot de passe est idendique a la confirmation de mot de passe
            if (password !== confirmPassword) {
                const sU = true
                const error = "le mot de passe ne correspond pas a la confirmation"
                res.render('register', { error, sU })
            } else {
                const user = await User.create({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    password: req.body.password,
                    phone: req.body.phone,
                })
                const role = await Role.findOne({ where: { name: 'user' } })
                user.addRole(role)
                res.render('form_address', { user })
            }
        }
    },
    getLog: async (req, res) => {
        res.render('login')
    },
    postLog: async (req, res) => {
        const user = await User.findOne({ where: { email: req.body.email } })

        if (!user) {
            res.redirect('back')
        } else {
            bcrypt.compare(req.body.password, user.password, (err, same) => {
                if (!same) {
                    res.redirect('back')
                } else {
                    req.session.userPk = user.id
                    req.session.firstName = user.firstName
                    res.redirect('/')
                }
            })
        }
    },
    logOut: (req, res) => {
        // on viens detruire la session que l'utilisateur utilise
        req.session.destroy()
        // on redirige vers la page d'accueil
        res.redirect('/')
    },
    userList: async (req, res) => {
        // mettre dans une constante la liste des utilisateurs dans la base de donnée
        const users = await User.findAll({
            include: Role
        })


        // envoyer dans la console la liste des utilisateurs
        console.log(users)
        // afficher la liste sur une page hbs list_user.hbs
        res.render('list_user', { users })
    },
    // update le users selectionné le role puis les détails nom prénom, findByPk = trouver un utilisateur par sa clé primaire
    update: async (req, res) => {
        const user = await User.findByPk(req.params.id, { raw: true })
        const roles = await Etre.findAll({
            where: { userID: user.id },
            raw: true
        })

        let admin = false
        let seller = false
        let buyer = false

        for (let i = 0; i < roles.length; i++) {
            const role = roles[i];
            switch (role.roleId) {
                case 1: admin = true
                    break;
                case 2: seller = true
                    break;
                case 3: buyer = true
                    break;
                default:
                    break;
            }
        }

        res.render('form_user', { user, admin, seller, buyer })
    },
    postUpdate: async (req, res) => {

        await User.update({
            lastName: req.body.lastName,
            firstName: req.body.firstName,
            email: req.body.email,
            phone: req.body.phone
        }, {
            where: {
                id: req.params.id
            }
        })
        const user = await User.findByPk(req.params.id)
        const admin = await Role.findOne({ where: { name: "admin" } })
        const seller = await Role.findOne({ where: { name: "seller" } })
        const buyer = await Role.findOne({ where: { name: "buyer" } })
        // gere les box de roles
        if (req.body.admin === 'on') {
            user.addRole(admin)
        } else {
            user.removeRole(admin)
        }
        if (req.body.seller === 'on') {
            user.addRole(seller)
        } else {
            user.removeRole(seller)
        } if (req.body.buyer === 'on') {
            user.addRole(buyer)
        } else {
            user.removeRole(buyer)
        }
        res.redirect('/user-list')
    },
    delete: async (req, res) => {
        await User.destroy({
            where: {
                id: req.params.id
            }
        }),
        res.redirect('/user-list')
    }
}