const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const cors = require('cors')({ origin: true })




// exports.onMessageCreate = functions.database.ref('/chats/{userId}/{buddyId}').onWrite((snapshot, context) => {
//     // This registration token comes from the client FCM SDKs.
//     const messageData = snapshot.val();
//     const senderToken = messageData.senderToken;
//     const buddyToken = messageData.buddyToken;
//     // const senderUsername = messageData.username;

//     const payload = {
//         notification: {
//             title: `님의 새 메세지가 도착했어요!`,
//             body: '비슷한 아픔을 들어주세요',
//         }
//     };

//     // Send a message to the device corresponding to the provided registration token.
//     admin.messaging().sendToDevice(buddyToken, payload)
//         .then((response) => {
//             // Response is a message ID string.
//             console.log('Successfully sent message:', response);
//         })
//         .catch((error) => {
//             console.log('Error sending message:', error);
//         });

//     admin.messaging().sendToDevice(senderToken, payload)
//         .then((response) => {
//             // Response is a message ID string.
//             console.log('Successfully sent message:', response);
//         })
//         .catch((error) => {
//             console.log('Error sending message:', error);
//         });
// });
