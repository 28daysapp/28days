import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { CommunityProvider } from '../../providers/community/community';
import { UserProvider } from '../../providers/user/user';
import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-community-posts',
  templateUrl: 'community-posts.html',
})
export class CommunityPostsPage {

  communityInfo: any;
  posts: any;
  currentUserUid: String = firebase.auth().currentUser.uid;

  constructor(public navCtrl: NavController, public navParams: NavParams, public communityProvider: CommunityProvider, public userProvider: UserProvider, public actionSheetCtrl: ActionSheetController) {
    this.communityInfo = this.navParams.get('communityInfo');
    this.checkIfJoinedCommunity();
  }

  ionViewWillEnter() {
    this.getCommunityPosts(this.communityInfo.communityName);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CommunityPostsPage');
  }

  getCommunityPosts(communityName) {
    this.communityProvider.readCommunityPosts(communityName).then((posts) => {
      this.posts = posts;
    });
  }

  toCommunityWrite(communityInfo) {
    this.navCtrl.push("CommunitywritePage", {
      communityInfo: communityInfo
    });
  }

  joinCommunity() {
    const communityName = this.communityInfo.communityName;
    this.communityProvider.joinCommunity(communityName)
      .then(() => {
        this.userProvider.createCommunityMembership(communityName)
      });
  }

  checkIfJoinedCommunity() {
   this.userProvider.readUserCommunities().then((communities)=>{
    console.log(JSON.stringify(communities));
   })
    
  }

  presentActionSheet(post) {
    const postWriterUid = post.uid;
    let actionSheet;

    if (this.userProvider.checkUser(this.currentUserUid, postWriterUid)) {
      actionSheet = this.actionSheetCtrl.create({
        buttons: [
          {
            text: '글 삭제',
            role: 'destructive',
            handler: () => {
              console.log('Destructive clicked');
              this.communityProvider.deleteCommunityPost(post).then(() => {
                this.getCommunityPosts(this.communityInfo.communityName)
              });
            }
          },
          {
            text: '댓글 달기',
            handler: () => {
              console.log('Archive clicked');
            }
          },
          {
            text: '닫기',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          }
        ]
      });
    } else {
      actionSheet = this.actionSheetCtrl.create({
        buttons: [
          {
            text: '댓글 달기',
            handler: () => {
              console.log('Archive clicked');
            }
          },
          {
            text: '닫기',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          }
        ]
      });
    }
    actionSheet.present();
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    this.getCommunityPosts(this.communityInfo.communityName)

    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 700);
  }

}
