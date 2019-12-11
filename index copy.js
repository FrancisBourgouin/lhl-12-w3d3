const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cookieSession = require('cookie-session')
const app = express()
const bcrypt = require('bcrypt')
const uuidv4 = require('uuid/v4')


const saltRounds = 10
const port = 3000

app.use(express.static('public'))
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieSession({
  name: 'supersession',
  keys: ['Iliketocookpotatoesinthedark', 'Lifeishardwhenthepotatoesarenotfreshandmushy']
}))


app.set('view engine', 'ejs')

const saltedPassword1 = bcrypt.hashSync("password1", saltRounds);
const saltedPockPock  = bcrypt.hashSync("pockpock", saltRounds);
const userDatabaseIsh = {
  "pi31415" : {
    id: "pi31415",
    username: "Francis",
    fullname: "Francis Bourgouin",
    password: saltedPassword1 //"password1"
  },
  "e2718294" : {
    id:"e2718294",
    username: "Chicken",
    fullname: "Pequeno Chicken de la Pampa",
    password: saltedPockPock //"pockpock"
  }
}
console.log(userDatabaseIsh)
const authenticate = (username, password) => {
  for (const userId in userDatabaseIsh) {
    const currentUser = userDatabaseIsh[userId]
    if (currentUser.username === username) {
    //   if (currentUser.password === password) { //plaintext password
      if (bcrypt.compareSync(password, currentUser.password)) {
        return {valid:true, id: currentUser.id}
      } else {
        console.log('Password for user is bad')
        return { valid: false, id: null }
      }
    }
  }
  console.log('Username is not matching')
  return {valid: false, id: null}
}

app.get('/', (req,res) => {
//   const username = req.cookies.userId ? userDatabaseIsh[req.cookies.userId].username : "Guest"
  let username = "Guest"
  let fullname = "Mister Guest"
  //   if (req.cookies.userId && userDatabaseIsh[req.cookies.userId]) {
  //     username = userDatabaseIsh[req.cookies.userId].username
  //     fullname = userDatabaseIsh[req.cookies.userId].fullname

  //     // { username, fullname } = userDatabaseIsh[req.cookies.userId]
  //   }
  if (req.session.userId && userDatabaseIsh[req.session.userId]) {
    username = userDatabaseIsh[req.session.userId].username
    fullname = userDatabaseIsh[req.session.userId].fullname

    // { username, fullname } = userDatabaseIsh[req.cookies.userId]
  }
  console.log(req.session)
  const templateVars = {username, fullname}
  res.render('home', templateVars)
})

app.post('/login', (req,res) => {
//   const userId = req.body.userId ? req.body.userId : "";
//   res.cookie('userId', userId)
  console.log(req.body)
  const authentication = authenticate(req.body.username, req.body.password)
  const valid = authentication.valid
  const userId = authentication.id
  if (valid) {
    res.cookie('userId', userId)
    req.session.userId = userId
  } else {
    res.clearCookie('userId')
    delete req.session.userId
  }
  res.redirect('/')
})

app.post('/register', (req,res) => {
  const userId = uuidv4().slice(0,8)
  const {username, fullname, password} = req.body
  const hashedPassword = bcrypt.hashSync(password, saltRounds);

  userDatabaseIsh[userId] = {
    id: userId,
    username,
    fullname,
    password: hashedPassword
  }

  console.log(userDatabaseIsh[userId])

  req.session.userId = userId

  res.redirect('/')
})

app.listen(port, () => console.log(`Express server running on port ${port}`));
