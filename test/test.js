// appelle la base de donnée
const db = require('../config')
const assert = require('assert')
const Product = require('../API/models/productModel')

try {
    db.authenticate()
    console.log('Connection has been established successfully')
} catch (error) {
    console.log('Unable to connect to the database:', error)
}

describe('crud produit', () => {
    it('creer un produit et le trouvé', async () => {
        const test = await Product.create({
            name: 'testproduit',
            description: 'testdescription',
            price: '25',
            isBest: true,
            quantity: 5,
            weight: 50,
            categoryId: 1
        })

        const prod = await Product.findOne({ where: { name: 'testproduit' } }).then((result) => {
            assert(test.dataValues.name === result.dataValues.name)
        })
    })
})