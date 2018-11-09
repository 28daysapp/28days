import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, NavParams, ActionSheetController } from 'ionic-angular';
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
  anonymity: boolean;
  alreadyJoined: boolean = false;
  currentUserUid: String = firebase.auth().currentUser.uid;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public navParams: NavParams, public communityProvider: CommunityProvider, public userProvider: UserProvider, public actionSheetCtrl: ActionSheetController) {
    this.communityInfo = this.navParams.get('communityInfo');
  }

  ionViewWillEnter() {
    this.getCommunityPosts(this.communityInfo.communityName);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CommunityPostsPage');
  }

  ionViewWillLoad() {
    this.checkIfJoinedCommunity();
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
      }).then(()=>{
        this.communityProvider.increaseCommunityMember(communityName);
      })
      .then(() => {
        this.checkIfJoinedCommunity();
        this.getCommunityPosts(this.communityInfo.communityName);

        const alert = this.alertCtrl.create({
          title: '커뮤니티의 멤버가 된 걸 축하해!',
        });
        alert.present();
        setTimeout(() => {
          alert.dismiss();
        }, 1500);
      });
  }

  checkIfJoinedCommunity() {
    this.userProvider.readJoinedCommunities(this.currentUserUid).then((joinedCommunities) => {
      for (let i in joinedCommunities) {
        if (this.communityInfo.communityName == joinedCommunities[i].communityName) {
          this.alreadyJoined = true
        }
      }
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
                this.communityProvider.deleteMyPost(post);
                this.getCommunityPosts(this.communityInfo.communityName)
              }).then(()=>{
                
              }).then(()=>{
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

  postWriteAlert() {
    const alert = this.alertCtrl.create({
      title: '커뮤니티에 가입한 후 글을 작성할 수 있어!',
      buttons: [
        {
          text: '확인'
        }
      ]
    });
    alert.present();
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    this.getCommunityPosts(this.communityInfo.communityName)

    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 700);
  }

  navigateToPage(page, uid) {
    this.navCtrl.push(page, {uid});
  }

}
