const functions = require('firebase-functions');
const admin = require('firebase-admin');
const https = require('https');
const http = require('http');
admin.initializeApp(functions.config().firebase);
const cors = require('cors')({ origin: true });


exports.calcReviewRating = functions.database.ref('/review/{placeId}').onWrite((snapshot, context) => {
    console.info("New Review Added!");
    const placeId = snapshot.after.key;
    const reviewCount = snapshot.after.numChildren();
    let total = 0;

    snapshot.after.forEach((childSnapshot) => {
        console.info("Rating Avg: " + childSnapshot.val().ratingAvg);
        let ratingAvg = childSnapshot.val().ratingAvg;
        if (!ratingAvg) {
            ratingAvg = 0;
        }
        total = total + childSnapshot.val().ratingAvg;
    });
    const totalAvg = total / reviewCount;
    admin.database().ref(`/placeInfo/${placeId}`).update({
        ratings: Math.round(totalAvg * 10) / 10
    });
    return totalAvg;
})

exports.createChat = functions.database.ref('/chats/{uid}/{supporterid}').onCreate((snapshot,context) => {
    console.info("New Chats Added!");

    console.info("보낸사람: " + snapshot.val().requester);
    console.info("보낸사람유저네임: " + snapshot.val().requesterUsername);
    console.info("버디유저네임: " + snapshot.val().buddyUsername);
    console.info("버디유아이디: " + snapshot.val().buddyuid);
    console.info("key: "+snapshot.key);

    if(snapshot.val().buddyUid != snapshot.key){
        const supporterId = snapshot.val().buddyUid;
        const userName = snapshot.val().requeterUsername;

        var db = admin.database();    
        var ref = db.ref('/notification/supporterId');
        var newPostRef = ref.push();
        var notificationId = newPostRef.key; //여기까지가 DB에서 새로운 키 생성하는것 까지의 소스!
        
        admin.database().ref(`/notification/${supporterId}/${notificationId}`).set({
            title: "새로운 채팅",
            comment: userName +"님이 채팅을 요청했습니다."
        });
    }
    return snapshot.val();
});

//exports.createCommunity = functions.database.ref('/community/')



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


exports.onMessageCreate = functions.database.ref('/chats/{userId}/{buddyId}').onWrite((snapshot, context) => {
    // This registration token comes from the client FCM SDKs.
    const message = snapshot.after.val();
    const targetToken = message.targetToken;
    console.info("Target Token: " + targetToken);
    
    const payload = {
        notification: {
            title: '새 코코넛 메세지가 도착했어요!',
            body: '비슷한 아픔을 겪은 분의 이야기를 들어주세요.',
        }
    };
    admin.messaging().sendToDevice(targetToken, payload)
        .then((response) => {
            // Response is a message ID string.
            console.log('Successfully sent message:', response);
            console.log(response.results[0].error);
        })
        .catch((error) => {
            console.log('Error sending message:', error);
        });
    return snapshot;
});