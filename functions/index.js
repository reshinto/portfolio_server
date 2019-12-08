const functions = require('firebase-functions');
const admin = require("firebase-admin");

admin.initializeApp();

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

// Read
exports.getPortfolios = functions.https.onRequest((req, res) => {
  if (req.method !== "GET") {
    return res.status(400).json({error: "Invalid request method!"});
  }
  admin.firestore().collection("portfolios").get()
    .then(data => {
      let portfolios;
      data.forEach(portfolio => {
        portfolios = portfolio.data();
      });
      return res.json(portfolios)
    })
    .catch(err => console.error(err));
});
