const bcrypt = require('bcrypt');
const saltRounds = 10;


const cleartextPassword = process.argv[2]
const hashedPassword = bcrypt.hashSync(cleartextPassword, saltRounds)

console.log('--------------')
console.log(`Your password ${cleartextPassword}`)
console.log(`Hashed password : ${hashedPassword}`)
console.log('--------------')