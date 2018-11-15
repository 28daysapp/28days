import { Injectable } from '@angular/core';
import firebase from 'firebase';

@Injectable()
export class CommentProvider {

  fireusers = firebase.database().ref('/users');
  firestore = firebase.storage();

  post;
  postId: String;

  constructor() {
    console.log('Hello CommentProvider Provider');
  }

  initializePost(post){
    this.post = post;
    this.postId = post.postId
  }

  createCommunityComment(comment) {
    const uid = firebase.auth().currentUser.uid;
    let user;
    const promise = new Promise((resolve, reject) => {
      this.fireusers.child(uid).once('value').then((snapshot) => {
        user = snapshot.val();
      }).then(() => {
        const newCommentRef = firebase.database().ref(`communityComment/${this.postId}`).push();
        const commentId = newCommentRef.key;
        newCommentRef.set({
          commentId: commentId,
          uid: firebase.auth().currentUser.uid,
          username: firebase.auth().currentUser.displayName,
          text: comment,
          timestamp: firebase.database.ServerValue.TIMESTAMP,
          profilePicture: user.photoURL
        })
      })
      resolve(true);
    })
    return promise;
  }

  readCommunityComment(post) {
    const postId = post.postId
    const promise = new Promise((resolve) => {
      firebase.database().ref(`communityComment/${postId}`).once('value').then((snapshot) => {
        const comments = [];
        snapshot.forEach((childSnapshot) => {
          const comment = childSnapshot.val();
          comments.push(comment);
        })
        resolve(comments)
      })
    })
    return promise
  }

  deleteCommunityComment(postId: String, commentId: String) {
    const promise = new Promise((resolve) => {
      firebase.database().ref(`communityComment/${postId}/${commentId}`).remove();
      resolve(true);
    });
    return promise
  }

  countComments(post){
    const postId = post.postId
    const promise = new Promise((resolve) => {
      firebase.database().ref(`communityComment/${postId}`).once('value').then((snapshot) => {
        const commentCount = snapshot.numChildren();
        resolve(commentCount);
      });
    });
    return promise
  }

  updateCommentCount(communityName, commentCount) {
    const postId = this.post.postId
    const promise = new Promise((resolve) => {
      firebase.database().ref(`communityPost/${communityName}/${postId}`).update({
        comment: commentCount
      });
      resolve(true)
    });
    return promise;
  }

}
