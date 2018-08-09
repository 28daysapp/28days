/*
  2018.07.06 SUZY addmypost()
  2018.07.10 SUZY deletemypost() allgetmypost()
*/
import { Injectable } from '@angular/core';
import firebase from 'firebase';

/*
  Generated class for the MyProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MyProvider {
  firemypost = firebase.database().ref('/my/post');
  firecommunity = firebase.database().ref('/community');

  constructor() {
  }

  addmypost(uid, postid, time) {
    var promise = new Promise((resolve) => {
      this.firemypost.child(`${uid}/${postid}`).set({//firemypost에 값 넣기
        postid: postid,
        timestamp: time
      }).then(() => {
        resolve(true);
      });
    });
    return promise;
  }

  deletemypost(post) {
    var uid = firebase.auth().currentUser.uid;
    var promise = new Promise((resolve) => {
      this.firemypost.child(`${uid}/${post.postid}`).remove();//firemypost에서 지워주기
      this.firecommunity.child(`${post.namecom}/${post.postid}`).remove().then(() => {//firecommunity에서 지워주기
        resolve(true);
      });
    });
    return promise;
  }

  getallmypost() {
    var uid = firebase.auth().currentUser.uid; //내 고유 uid
    var promise = new Promise((resolve) => {
    var posts = [];//post라는 배열 만들기
      this.firemypost.child(uid).orderByChild('timestamp').once("value").then((snapshot) => { // firemypost에서 시간 순으로 가져오고 snapshot에 하나씩 가져옴
        snapshot.forEach((childSnapshot) => {//스냅샷의 child개수만큼 for
          var post = childSnapshot.val();//childsnapshot의 값(구조체형태)를 post에 저장
          this.firecommunity.child(`${post.namecom}/${post.postid}`).once("value").then((snapshot) => { //post에는 firemypost의 uid/postid 의 값을 가져옴 ex)postid, namecom, timestamp
            posts.push(snapshot.val());//snapshot에 가져오기 때문에 snapshot의 값들을 posts에 넣는다 그러면 json형태로? posts에 들어간다
          });
          posts.reverse();
          resolve(posts); //여기서 post를 보내주는 것 같다
        });
      });
    });
    return promise;
  }
}
