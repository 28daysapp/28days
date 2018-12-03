import { Injectable } from '@angular/core';
import firebase from 'firebase';

@Injectable()
export class ReportProvider {

  firebaseCommunityPost = firebase.database().ref('/communityPost')
  firebaseCommunityComment = firebase.database().ref('/communityComment')

  constructor() {
    console.log('Hello ReportProvider Provider');
  }

  reportPost(communityName: String, postId: String){
    const communityPostReportRef = this.firebaseCommunityPost.child(`/${communityName}/${postId}/reportCount`)
    communityPostReportRef.transaction((currentReportCount) => {
      return (currentReportCount || 0) + 1;
    })
  }

  reportComment(postId: String, commentId: String){
    const communityCommentReportRef = this.firebaseCommunityComment.child(`/${postId}/${commentId}/reportCount`)
    communityCommentReportRef.transaction((currentReportCount) => {
      return (currentReportCount || 0) + 1;
    })
  }

}
