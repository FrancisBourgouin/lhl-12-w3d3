const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
const { compareSync, hashSync } = require("bcrypt");
const app = express();

const port = 3000;

app.use(express.static("public"));
app.use(cookieParser());
app.use(
  cookieSession({
    name: "session",
    keys: ["randomkeyhahahahahahah", "clealeatoirehahahahaha"]
  })
);

app.use(bodyParser.urlencoded({ extended: false }));

app.set("view engine", "ejs");

const francisbPassword = hashSync("1234", 10);
const littlechickenPassword = hashSync("pockpock", 10);

const fakeUserDatabase = {
  francisb: {
    username: "francisb",
    fullname: "Francis Bourgouin",
    password: francisbPassword
  },
  littlechicken: {
    username: "littlechicken",
    fullname: "Pequeño Pollo de la Pampa",
    password: littlechickenPassword
  }
};

console.log(fakeUserDatabase);

const validateUser = (username, password) => {
  for (const userKey in fakeUserDatabase) {
    const user = fakeUserDatabase[userKey];

    if (user.username === username) {
      // if (user.password === password) {
      if (compareSync(password, user.password)) {
        //Properly logged in action
        return { valid: true, error: null };
      } else {
        return { valid: false, error: "Bad password" };
      }
    }
  }
  return { valid: false, error: "Bad username" };
};

app.get("/", (req, res) => {
  const templateVars = { user: fakeUserDatabase[req.session.username] };
  res.render("index", templateVars);
});

app.get("/login", (req, res) => {
  res.render("login");
});

// app.post("/login", (req, res) => {
//   for (const userKey in fakeUserDatabase) {
//     const user = fakeUserDatabase[userKey];

//     if (user.username === req.body.username) {
//       if (user.password === req.body.password) {
//         //Properly logged in action
//         res.cookie("username", req.body.username);
//         res.redirect("/");
//       } else {
//         console.log("Bad password");
//         res.status(403).redirect("/login");
//       }
//     }
//   }
//   console.log("Bad username");
//   res.status(403).redirect("/login");
// });

// app.post("/login", (req, res) => {
//   const validation = validateUser(req.body.username, req.body.password);

//   if (validation.valid) {
//     res.cookie("username", req.body.username);
//     res.redirect("/");
//   } else {
//     console.log(validation.error);
//     res.status(403).redirect("/login");
//   }
// });

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const { valid, error } = validateUser(username, password);

  if (valid) {
    // res.cookie("username", username);
    req.session.username = username;
    res.redirect("/");
  } else {
    console.log(error);
    res.status(403).redirect("/login");
  }
});

app.post("/logout", (req, res) => {
  // res.clearCookie("username");
  delete req.session.username;
  res.redirect("/");
});

app.post("/register", (req, res) => {
  const { username, fullname, password } = req.body;
  const hashedPassword = hashSync(password, 10);

  fakeUserDatabase[username] = {
    username,
    fullname,
    password: hashedPassword
  };

  req.session.username = username;
  res.redirect("/");
});

app.listen(port, () => console.log(`Express server running on port ${port}`));
