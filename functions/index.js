require("dotenv").config()
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const app = require("express")();
const firebase = require("firebase");
const cors = require("cors");
const nodemailer = require("nodemailer");
const config = require("./utility/config");

// const gmailEmail = functions.config().config.user;
// const gmailPassword = functions.config().config.pass;

admin.initializeApp();
app.use(cors());
firebase.initializeApp(config);

const db = admin.firestore();

// Read
app.get("/portfolios", (req, res) => {
  db.collection("portfolios")
    .get()
    .then(data => {
      let portfolios;
      data.forEach(portfolio => {
        portfolios = portfolio.data();
      });
      return res.json(portfolios);
    })
    .catch(err => console.error(err));
});

// Update portfolio
app.post("/portfolios/update", (req, res) => {
  const newProjet = req.body;
  db.collection("portfolios")
    .doc("ohbGgHGECOQOhv06dEKV")
    .update(newProjet)
    .then(data => {
      return res.json({message: `Document updated successfully!`});
    })
    .catch(err => {
      res.status(500).json({error: "Project update failed!"});
      console.error(err);
    });
});

// let transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: gmailEmail,
//     pass: gmailPassword,
//   },
// });

// app.post("/sendemail", (req, res) => {
//   // getting dest email by query string
//   const {email, subject, message} = req.body;
//   const mailOptions = {
//     from: email,
//     to: gmailEmail,
//     subject: `From ${email}, ${subject}`, // email subject
//     html: `<p style="font-size: 16px;">${message}</p>
//     `, // email content in HTML
//   };

//   // returning result
//   return transporter.sendMail(mailOptions, (erro, info) => {
//     if (erro) {
//       return res.send(erro.toString());
//     }
//     return res.send("Sended");
//   });
// });

// Create new category
// app.post("/portfolios", (req, res) => {
//   const newProjetCategory = req.body;
//   admin.firestore()
//     .collection("portfolios")
//     .add(newProjetCategory)
//     .then(data => {
//       return res.json({message: `Document ${data.id} created successfully!`});
//     })
//     .catch(err => {
//       res.status(500).json({error: "New project category creation failed!"});
//       console.error(err);
//     });
// });

app.post("/signup", (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    username: req.body.username,
  };
  // validation
  let token;
  let userId;
  db.doc(`/users/${newUser.username}`)
    .get()
    .then(doc => {
      if (doc.exists) {
        return res
          .status(400)
          .json({username: "This username is already taken!"});
      } else {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(newUser.email, newUser.password);
      }
    })
    .then(data => {
      userId = data.user.uid;
      return data.user.getIdToken();
    })
    .then(_token => {
      token = _token;
      const userCredentials = {
        username: newUser.username,
        email: newUser.email,
        userId,
      };
      return db.doc(`/users/${newUser.username}`).set(userCredentials);
    })
    .then(() => {
      return res.status(201).json({token});
    })
    .catch(err => {
      console.error(err);
      if (err.code === "auth/email-alaready-in-use") {
        return res.status(400).json({email: "Email is already in use"});
      }
      return res.status(500).json({error: err.code});
    });
});

app.post("/login", (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password
  };
  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then(data => {
      return data.user.getIdToken();
    })
    .then(_token => {
      return res.json({ _token });
    })
    .catch(err => {
      console.error(err);
      return res
        .status(403)
        .json({ general: 'Wrong credetials, please try again' });
    });
});

exports.api = functions.region("asia-east2").https.onRequest(app);
