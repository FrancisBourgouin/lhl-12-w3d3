const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const app = express()
const port = 3000
const saltRounds = 10;
app.use(express.static('public'));
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'ejs');

app.use(cookieSession({
  name: 'session',
  keys: ['Petit poulet danse dans la prairie', 'les ninjas dansent dans la cheminée']
}))

const password1 = bcrypt.hashSync('1234', saltRounds)
const password2 = bcrypt.hashSync('4441919', saltRounds)

const userDatabaseIsh = {
  "pi31415" : {
    username:"Francis",
    fullname:"Francis Bourgouin",
    password:password1
  },
  "pockpock" : {
    username:"little_chicken",
    fullname:"Pequeño Pollo de la Pampa",
    password:password2
  }
}

const authenticateUser = (userDB, username, password) => {
  for (const userId in userDB) {
    const currentUser = userDB[userId]
    if (currentUser.username === username) {
      // if (currentUser.password === password) {
        if (bcrypt.compareSync(password, currentUser.password)){
        //username & password are good
        return { userId, usernameError:false, passwordError:false }

      }
      else {
        //password not matching
        return { userId:null, usernameError: false, passwordError: true }

      }
    }
  }
  
  //username not matching
  return { userId: null, usernameError: true, passwordError: null }


}
// userDatabaseIsh['pi31415'].username
// userDatabaseIsh['pockpock'].username


app.get('/', (req,res) => {
  const userId = req.session.userId
  let user = userDatabaseIsh[userId]
  console.log(userDatabaseIsh)
  if(!user){
    user = {
      username: "Guest",
      fullname: "Guesto Guest",
      password: ""
    }
  }
  templateVars = { user }
  res.render('home', templateVars)
})
app.post('/register', (req, res) => {
  const { username, fullname, password } = req.body
  const id = "a" + Math.floor(Math.random() * 1000)
  userDatabaseIsh[id] = {username, fullname, password:bcrypt.hashSync(password, saltRounds)}

  res.redirect('/')
})
app.post('/login', (req, res) => {
  const { username, password } = req.body
  console.log(username, password)

  const authenticationResult = authenticateUser(userDatabaseIsh, username, password)

  if(authenticationResult.userId){
    //Cookie & stuff
    req.session.userId = authenticationResult.userId

    res
      .cookie('userId', authenticationResult.userId)
      .redirect('/')
  }
  else if(authenticationResult.usernameError){
    //Username is bad
    console.log('USERNAME BAD')
    res
    .status(403)
    .redirect('/')
  }
  else if(authenticationResult.passwordError){
    //Password bad
    console.log('PASSWORD BAD')
    res
      .status(403)
      .redirect('/')
  }
  else{
    //Man I dunno
  }
})

app.listen(port, () => console.log(`Express server running on port ${port}`));
