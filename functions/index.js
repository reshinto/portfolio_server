const functions = require('firebase-functions');
const admin = require("firebase-admin");

admin.initializeApp();

const express = require("express");
const app = express();

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

exports.api = functions.region("asia-east2").https.onRequest(app);
