const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
// exports.sendNotifications = functions.database.ref('/chats').onWrite((event) => {
//     // if (event.data.previous.val() ) {
//     //     return;
//     // }
//     if (!event.data.exists()) {
//         return;
//     }
//     const NOTIFICATION_SNAPSHOT = event.data;
//     const payload = {
//         notification: {
//             title: `상담 요청이 왔어요!`,
//             body: '비슷한 아픔을 가진 분의 이야기를 들어주세요'
//         }
//     };
//     console.info(payload);
//     return admin.database().ref('/tokens').once('value').then((data) => {
//         if (!data.val() ) return;
//         const snapshot = data.val();
//         const tokens = [];
//         for (let key in snapshot) {
//             tokens.push (snapshot[key].token)
//         }
//         return admin.messaging().sendToDevice(tokens, payload);
//     })
// });
exports.chatNotification = functions.https.onRequest((req, res) => {
    // This registration token comes from the client FCM SDKs.
    const registrationToken = req.token;
    console.info("REQUESTDA!!!!: " + req);
    // registrationToken = 'cG13HBX8tns:APA91bHKBIDrhvEbb1msLri15uCLy8f3o_ohTMy0x-EQ3YhwCl_Idh2tjf8CV0qoIS5I4mqGB29p95eEuRntsj8iMQ0yLkLdGef1CWDjMU1ZMMnqUGVtJEiwmqXKhG24O6sjm2EuxsfHaQEaSKuvXLPPkhlyWNBQfg';
    const payload = {
        notification: {
            title: '상담 요청이 왔어요!',
            body: '비슷한 아픔을 가진 분의 이야기를 들어주세요',
        }
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
//# sourceMappingURL=index.js.map