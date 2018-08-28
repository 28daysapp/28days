const functions = require('firebase-functions');
const admin = require('firebase-admin');
const https = require('https');
const http = require('http');
admin.initializeApp(functions.config().firebase);
const cors = require('cors')({ origin: true })

exports.calcReviewRating = functions.database.ref('/review/{placeId}/{reviewId}').onWrite((snapshot) => {
    console.info("New Review Added!");

    let total = 0;
    const reviewRef = snapshot.after.ref.parent;
    const reviewCount = reviewRef.parent.child('ratingAvg')
    // snapshot.forEach(function(ratingSnapshot) {
    //     total += ratingSnapshot.val().ratingAvg;
    // })

    console.info("reviewRef: " + reviewRef);
    console.info("reviewCount: " + reviewCount);

    console.info("total: " + total);
    console.info("average: " + total / reviewCount);

    return;
})

exports.getGooglePhotos = functions.https.onRequest((req, res) => {

    // const data = "CmRbAAAA3V8LQAKXfZQQJNJHJJq84i0pxWJiOE4HVKI4xJOtuxyomH9ksTHBAc4cDnvqhB4n0XBOx2GAnKHl-JXcxwPEFuX_8f0GOXYukG_PrjMmfM28qd3Bei0UW9Oh_zCWjP4jEhBzf9o5Vhx5XTVa2qG6W54wGhShGQoFMYPPR-UkG-EYI_6xy7neRg";

    const reference = "CmRbAAAA3V8LQAKXfZQQJNJHJJq84i0pxWJiOE4HVKI4xJOtuxyomH9ksTHBAc4cDnvqhB4n0XBOx2GAnKHl-JXcxwPEFuX_8f0GOXYukG_PrjMmfM28qd3Bei0UW9Oh_zCWjP4jEhBzf9o5Vhx5XTVa2qG6W54wGhShGQoFMYPPR-UkG-EYI_6xy7neRg";
    const apiKey = 'AIzaSyDrABdIKzwnM37L1q1R_0qCMwsLhSiMjWk';
    const url = 'https://maps.googleapis.com/maps/api/place/photo?'
    

    // const headers = new HttpHeaders().set('Access-Control-Allow-Origin' , '*')


    http.get(url + `maxwidth=400&photoreference=${reference}&key=${apiKey}`)
      .subscribe(data => {
        return data
      });
});


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
