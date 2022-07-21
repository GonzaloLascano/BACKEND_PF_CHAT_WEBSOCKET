const { faker } = require('@faker-js/faker')

/* ----- Faker Productlist ------ */

faker.locale = 'es'

function fakeListGenerator() {
    let arr = [];
    for (let i=0; i < 5; i++) {
        let producto = {
            id: i + 1,
            title:faker.commerce.product(),
            price: faker.commerce.price(100, 4000, 0),
            img: faker.image.imageUrl(100, 100),
        }
        arr.push(producto);
    }
    console.log(arr)
    return arr
}

let fakeList = fakeListGenerator();

module.exports = { fakeList }

/* --------- */