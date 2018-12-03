import { Injectable } from '@angular/core';
import firebase from 'firebase';

@Injectable()
export class ReportProvider {

  firebaseCommunityPost = firebase.database().ref('/communityPost')

  constructor() {
    console.log('Hello ReportProvider Provider');
  }

  reportPost(communityName, postId){
    const communityPostReportRef = this.firebaseCommunityPost.child(`/${communityName}/${postId}/reportCount`)
    communityPostReportRef.transaction((currentReportCount) => {
      return (currentReportCount || 0) + 1;
    })
  }

}
