const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

exports.test = functions.https.onRequest((req, res) => {
    res.send("Test passed");
});

exports.sendMessage = functions.https.onRequest((req, res) => {
    // This registration token comes from the client FCM SDKs.
    const registrationToken = ['cYlfOL54Y6M:APA91bE3HanryF5jEbyp9iW2kmw6oBksETvYClC5Uae3NgmsG-p32Cbo_N2srswaw0rlHPeZhiRlfAg7e39zi1G2jaTRDhYMu3k1n0AxzW7_aYEKtvENFWYjH5wNPSAKyvTB76PJaruKoI5f44pO-LUDiiEDSiTtaQ'];

    // See documentation on defining a message payload.
    const payload = {
        // android: {
        //     ttl: 3600 * 1000, // 1 hour in milliseconds
        //     priority: 'normal',
        //     notification: {
        //       title: '$GOOG up 1.43% on the day',
        //       body: '$GOOG gained 11.80 points to close at 835.67, up 1.43% on the day.',
        //       icon: 'stock_ticker_update',
        //       color: '#f45342'
        //     }
        //   },
        notification: {
            title: 'You have a new follower!',
            body: `I am following you.`,
          }
        // token: registrationToken
    };

    // Send a message to the device corresponding to the provided
    // registration token.
    admin.messaging().sendToDevice(registrationToken, payload)
        .then((response) => {
            // Response is a message ID string.
            console.log('Successfully sent message:', response);
        })
        .catch((error) => {
            console.log('Error sending message:', error);
        });
});

exports.countUsers = functions.https.onRequest((req, res) => {
    const db = admin.database();
    const ref = db.ref("/users");
  
    ref.once("value", function(snapshot) {
        const count = snapshot.numChildren();
        res.status(200).json({ count: count });
    });
  });

