import { Injectable } from '@angular/core';
import firebase from 'firebase';

@Injectable()
export class ReportProvider {

  firebaseCommunityPost = firebase.database().ref('/communityPost')

  constructor() {
    console.log('Hello ReportProvider Provider');
  }

  reportPost(communityName, postId){
    console.log(communityName, postId)
    this.firebaseCommunityPost.child(`/${communityName}/${postId}`).update({
      reportCount: 1
    })
  }

}
