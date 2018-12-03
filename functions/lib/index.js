const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
exports.calcReviewRating = functions.database.ref('/review/{placeId}').onWrite((snapshot, context) => {
    console.info("New Review Added!");
    const placeId = snapshot.after.key;
    const reviewCount = snapshot.after.numChildren();
    let total = 0;
    snapshot.after.forEach((childSnapshot) => {
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
});
exports.createChat = functions.database.ref('/chats/{uid}/{supporterid}').onCreate((snapshot, context) => {
    if (snapshot.val().buddyUid != snapshot.key) {
        const supporterId = snapshot.val().buddyUid;
        const userName = snapshot.val().requeterUsername;
        const db = admin.database();
        const ref = db.ref('/notification/supporterId');
        const newPostRef = ref.push();
        const notificationId = newPostRef.key;
        admin.database().ref(`/notification/${supporterId}/${notificationId}`).set({
            title: "새로운 채팅",
            comment: userName + "님이 채팅을 요청했습니다."
        });
    }
    return snapshot.val();
});
exports.onMessageCreate = functions.database.ref('/chats/{userId}/{buddyId}').onWrite((snapshot) => {
    const message = snapshot.after.val();
    const targetToken = message.targetToken;
    console.info("Target Token: " + targetToken);
    const payload = {
        notification: {
            title: '새 코코넛 메세지가 도착했어요!'
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
});
//# sourceMappingURL=index.js.map