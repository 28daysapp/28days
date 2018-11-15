import { Injectable } from '@angular/core';
import firebase from 'firebase';

@Injectable()
export class CommentProvider {

  fireusers = firebase.database().ref('/users');
	firestore = firebase.storage();

  constructor() {
    console.log('Hello CommentProvider Provider');
  }

  createCommunityComment(post, comment) {

    const postId = post.postId;
    const uid = firebase.auth().currentUser.uid;
    let user;

  	const promise = new Promise((resolve, reject) => {
      this.fireusers.child(uid).once('value').then((snapshot) => {
        user = snapshot.val();
      }).then(()=>{
        const newCommentRef = firebase.database().ref(`communityComment/${postId}`).push();
        newCommentRef.set({
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

  readCommunityComment(post){
    
    const postId = post.postId

    const promise = new Promise((resolve)=>{ 

      firebase.database().ref(`communityComment/${postId}`).once('value').then((snapshot) => {
        const comments = [];
        snapshot.forEach((childSnapshot)=>{
          const comment = childSnapshot.val();
          comments.push(comment);
        })
        resolve(comments)
      })
    })

    return promise

  }

  



}
