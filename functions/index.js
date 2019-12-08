require('dotenv').config()
const functions = require('firebase-functions');
const admin = require("firebase-admin");
const app = require("express")();
const firebase = require("firebase");
const cors = require("cors");

admin.initializeApp();
app.use(cors());
const config = {
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    databaseURL: process.env.databaseURL,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId,
    measurementId: process.env.measurementId
}
firebase.initializeApp(config);

// Read
app.get("/portfolios", (req, res) => {
  admin.firestore()
    .collection("portfolios")
    .get()
    .then(data => {
      let portfolios;
      data.forEach(portfolio => {
        portfolios = portfolio.data();
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

exports.api = functions.region("asia-east2").https.onRequest(app);
