import { Injectable } from "@angular/core";
import firebase from "firebase";

/*
  Generated class for the PostProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PostProvider {
  firepost = firebase.database().ref("/post");
  firelike = firebase.database().ref("/like");
  namecom = "post";
  posts;
  constructor() {}

  uploadpost(title, imgsrc, body, writerimg, writername, writermajor) {
    return new Promise(resolve => {
      const newPostRef = this.firepost.push();
      const postId = newPostRef.key;
      newPostRef
        .set({
          postid: postId,
          title: title,
          imgsrc: imgsrc,
          body: body,
          writerimg: writerimg,
          writername: writername,
          writermajor: writermajor,
          timestamp: firebase.database.ServerValue.TIMESTAMP,
          comment: 0
        })
        .then(() => {
          resolve(true);
        });
    });
  }

  getallposts() {
    const uid = firebase.auth().currentUser.uid;
    return new Promise(resolve => {
      this.firepost
        .orderByChild("timestamp")
        .once("value")
        .then(snapshot => {
          this.firelike
            .child(`${uid}/${this.namecom}`)
            .once("value")
            .then(likesnapshot => {
              const likepostid = [];
              likesnapshot.forEach(childSnapshot => {
                likepostid.push(childSnapshot.key);
              });
              const posts = [];
              snapshot.forEach(childSnapshot => {
                const post = childSnapshot.val();
                if (likepostid.indexOf(post.postid) != -1) {
                  post.likesrc = "assets/like-full.png";
                } else {
                  post.likesrc = "assets/like.png";
                }
                posts.push(post);
              });
              posts.reverse();
              resolve(posts);
            });
        });
    });
  }

  setLike(post) {
    const uid = firebase.auth().currentUser.uid;
    return new Promise(resolve => {
      this.firelike
        .child(`${uid}/${this.namecom}/${post.postid}`)
        .set({
          timestamp: firebase.database.ServerValue.TIMESTAMP
        })
        .then(() => {
          this.firepost
            .child(`${post.postid}`)
            .update({
              like: post.like + 1
            })
            .then(() => {
              resolve(true);
            });
        });
    });
  }

  deleteLike(post) {
    const uid = firebase.auth().currentUser.uid;
    return new Promise(resolve => {
      this.firelike
        .child(`${uid}/${this.namecom}/${post.postid}`)
        .remove()
        .then(() => {
          this.firepost
            .child(`${post.postid}`)
            .update({
              like: post.like - 1
            })
            .then(() => {
              resolve(true);
            });
        });
    });
  }

  addComment(post) {
    return new Promise(resolve => {
      this.firepost
        .child(`${post.postid}`)
        .once("value")
        .then(snapshot => {
          this.firepost
            .child(`${post.postid}`)
            .update({
              comment: snapshot.val().comment + 1
            })
            .then(() => {
              resolve(true);
            });
        });
    });
  }
}
