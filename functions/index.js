// require('dotenv').config()
const functions = require('firebase-functions');
const admin = require("firebase-admin");
const app = require("express")();
const firebase = require("firebase");
const cors = require("cors");
const config = require("./utility/config");

admin.initializeApp();
app.use(cors());
firebase.initializeApp(config);

// Read
app.get("/portfolios", (req, res) => {
  admin.firestore()
    .collection("portfolios")
    .get()
    .then(data => {
      const portfolios = {};
      data.forEach(portfolio => {
        const tempKey = Object.keys(portfolio.data())[0];
        const tempValue = Object.values(portfolio.data())[0];
        portfolios[tempKey] = tempValue;
      });
      return res.json(portfolios)
    })
    .catch(err => console.error(err));
})

// Create new category
app.post("/portfolios", (req, res) => {
  const newProjetCategory = req.body;
  admin.firestore()
    .collection("portfolios")
    .add(newProjetCategory)
    .then(data => {
      return res.json({message: `Document ${data.id} created successfully!`});
    })
    .catch(err => {
      res.status(500).json({error: "New project category creation failed!"});
      console.error(err);
    });
});

app.post("/signup", (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    username: req.body.username
  };
  firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
    .then(data => {
      return res.status(201).json({
        message: `User ${data.user.uid} signed up successfully!`
      });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({error: err.code});
    });
});

exports.api = functions.region("asia-east2").https.onRequest(app);
