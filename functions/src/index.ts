const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.test = functions.https.onRequest((req, res) => {
    res.send("Test passed");
  });

exports.sendMessage = functions.https.onRequest((req, res) => {
    res.send("heyyyy");
})

