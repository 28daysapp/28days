import { Component } from '@angular/core';
import { 
  IonicPage, 
  NavController, 
  NavParams, 
  AlertController,
  LoadingController,
  ActionSheetController
} from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { CommunityProvider } from '../../providers/community/community';
@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  profileUid;
  loading;
  user;
  currentUser = true;

  postCards;
  joinedCommunities;

  displayedPostCards = [];

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public navParams: NavParams,
    public userProvider: UserProvider,
    public communityProvider: CommunityProvider,
    public actionSheetCtrl: ActionSheetController
  ) {
    this.profileUid = this.navParams.get('uid')
    if (this.profileUid) {
      this.getUserData(this.profileUid);
      this.currentUser = false;
    } else {
      this.user = this.userProvider.readCurrentUser();
      this.profileUid = this.user.uid;
    }
    console.log("Constructor");
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter ProfilePage');
    this.getJoinedCommunities(this.profileUid);
    this.getUserPosts(this.profileUid);
  }

  ionViewDidLeave() {
    console.log('ionViewDidLeave ProfilePage');
    this.displayedPostCards = [];
  }

  navigateTo(component) {
    this.navCtrl.push(component);
  }

  getJoinedCommunities(uid) {
    this.userProvider.readJoinedCommunities(uid)
    .then(response => {
      this.joinedCommunities = response
    })
    .catch(error => console.log(error))
  }

  getUserPosts(uid) {
    this.communityProvider.readUserPost(uid).then(response => {
      this.displayedPostCards = [];
      this.postCards = response;
      console.log(this.postCards);
      for (let i = 0; i < this.postCards.length; i++) {
        this.displayedPostCards.push(this.postCards[i]);
      }
    })
    .catch(error => {
      console.log(error);
    })
  }

  getUserData(uid) {
    this.userProvider.readUserData(uid).then(response => {
      this.user = response;
      console.log(this.user);
    })
  }

  deletePost(arr, id) {
    const newArr = arr.filter(card => card.postId !== id);
    return newArr
  }

  presentActionSheet(post) {
    const postWriterUid = post.uid;
    let actionSheet;

    if (this.userProvider.checkUser(this.profileUid, postWriterUid)) {
      actionSheet = this.actionSheetCtrl.create({
        buttons: [
          {
            text: '글 삭제',
            role: 'destructive',
            handler: () => {
              console.log('Destructive clicked');
              this.communityProvider.deleteCommunityPost(post).then(() => {
              this.communityProvider.deleteMyPost(post);
              this.displayedPostCards = this.deletePost(this.displayedPostCards, post.postId)
              })
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
}
