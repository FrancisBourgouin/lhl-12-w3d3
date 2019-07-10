const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const app = express()
const port = 3000

app.use(express.static('public'));
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'ejs');

const userDatabaseIsh = {
  "pi31415" : {
    username:"Francis",
    fullname:"Francis Bourgouin"
  }
}


app.get('/', (req,res) => {
  const username = req.cookies.userId ? userDatabaseIsh[req.cookies.userId].username : "Guest"
  const templateVars = {username}
  res.render('home', templateVars)
})


app.listen(port, () => console.log(`Express server running on port ${port}`));
