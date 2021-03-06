import { Injectable } from "@angular/core";
import firebase from "firebase";

@Injectable()
export class CommunityProvider {
  // Firebase Real-Time Database references
  fireCommunityList = firebase.database().ref("communityList");
  fireCommunityPost = firebase.database().ref("communityPost");
  firestore = firebase.storage();
  fireUsers = firebase.database().ref("/users");

  constructor() {}

  createCommunity(communityName, communityDescription, communityImage) {
    const promise = new Promise(resolve => {
      const createdTime = firebase.database.ServerValue.TIMESTAMP;

      firebase
        .database()
        .ref(`/communityList/${communityName}`)
        .set({
          communityName: communityName,
          communityDescription: communityDescription,
          communityImage: communityImage,
          createdTime: createdTime
        });
      resolve(true);
    });
    return promise;
  }

  readCommunityList() {
    return new Promise(resolve => {
      this.fireCommunityList.once("value").then(snapshot => {
        const communities = [];
        snapshot.forEach(childSnapshot => {
          const community = childSnapshot.val();
          communities.push(community);
        });
        resolve(communities);
      });
    });
  }

  createCommunityPost(text, anonymity = false, communityInfo) {
    return new Promise(resolve => {
      const uid = firebase.auth().currentUser.uid;
      this.fireUsers
        .child(uid)
        .once("value")
        .then(snapshot => {
          const user = snapshot.val();
          const newPostRef = firebase
            .database()
            .ref(`/communityPost/${communityInfo.communityName}`)
            .push();
          const createdTime = firebase.database.ServerValue.TIMESTAMP;
          const postId = newPostRef.key;
          const profilePicture = user.photoURL;

          newPostRef.set({
            uid,
            postId,
            username: firebase.auth().currentUser.displayName,
            text,
            profilePicture,
            createdTime,
            comment: 0,
            likes: 0,
            anonymity,
            communityName: communityInfo.communityName
          });
          resolve(postId);
        });
    });
  }

  createMyPost(postId, text, anonymity = false, communityInfo) {
    const promise = new Promise(resolve => {
      const uid = firebase.auth().currentUser.uid;
      this.fireUsers
        .child(uid)
        .once("value")
        .then(snapshot => {
          const user = snapshot.val();
          const newPostRef = firebase
            .database()
            .ref(`/userPost/${uid}/${postId}`);
          const createdTime = firebase.database.ServerValue.TIMESTAMP;
          const profilePicture = user.photoURL;
          newPostRef.set({
            postId,
            uid,
            username: firebase.auth().currentUser.displayName,
            text,
            profilePicture,
            createdTime,
            comment: 0,
            likes: 0,
            urlcheck: true,
            anonymity,
            communityName: communityInfo.communityName
          });
        });
      resolve(true);
    });

    return promise;
  }

  readUserPost(uid) {
    return new Promise((resolve, reject) => {
      firebase
        .database()
        .ref(`/userPost/${uid}`)
        .once("value")
        .then(snapshot => {
          const userPosts = [];
          snapshot.forEach(childSnapshot => {
            const userPost = childSnapshot.val();
            userPosts.push(userPost);
            userPosts.reverse();
          });
          resolve(userPosts);
        })
        .catch(() => {
          reject("Error in Reading Post!");
        });
    });
  }

  readCommunityPosts(communityName) {
    const promise = new Promise(resolve => {
      this.fireCommunityPost
        .child(communityName)
        .orderByKey()
        .once("value")
        .then(snapshot => {
          const posts = [];
          snapshot.forEach(childSnapshot => {
            const refKey = childSnapshot.key;
            let post = childSnapshot.val();
            post.refKey = refKey;
            posts.push(post);
            posts.reverse();
          });
          resolve(posts);
        });
    });
    return promise;
  }

  deleteCommunityPost(post) {
    const promise = new Promise(resolve => {
      firebase
        .database()
        .ref(`communityPost/${post.communityName}/${post.postId}`)
        .remove();
      resolve(true);
    });
    return promise;
  }

  deleteMyPost(post) {
    const promise = new Promise(resolve => {
      const uid = firebase.auth().currentUser.uid;

      firebase
        .database()
        .ref(`userPost/${uid}/${post.postId}`)
        .remove();
      resolve(true);
    });
    return promise;
  }

  joinCommunity(communityName: String) {
    const currentUserUid = firebase.auth().currentUser.uid;
    const currentUserUsername = firebase.auth().currentUser.displayName;
    const joinedTime = firebase.database.ServerValue.TIMESTAMP;
    const promise = new Promise(resolve => {
      firebase
        .database()
        .ref(`/communityMembers/${communityName}/${currentUserUid}`)
        .set({
          username: currentUserUsername,
          joinedTime: joinedTime
        });
      resolve(true);
    });
    return promise;
  }

  leaveCommunity(communityName: String) {
    const currentUserUid = firebase.auth().currentUser.uid;
    const promise = new Promise(resolve => {
      firebase
        .database()
        .ref(
          `/communityMembers/${communityName.trim()}/${currentUserUid.trim()}`
        )
        .remove();
      resolve(true);
    });
    return promise;
  }

  increaseCommunityMember(communityName: String) {
    const communityMemberCountRef = firebase
      .database()
      .ref(`/communityList/${communityName}/members`);
    communityMemberCountRef.transaction(currentMemberCount => {
      return (currentMemberCount || 0) + 1;
    });
  }

  likePost(communityName, postId) {
    const communityPostLikeRef = firebase
      .database()
      .ref(`communityPost/${communityName}/${postId}/likes`);
    communityPostLikeRef.transaction(currentLikesCount => {
      return (currentLikesCount || 0) + 1;
    });
  }
}
