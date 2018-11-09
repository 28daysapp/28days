import { Component } from '@angular/core';
import { 
  IonicPage, 
  NavController, 
  NavParams, 
  AlertController,
  LoadingController,
} from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { CommunityProvider } from '../../providers/community/community';
import { dateDataSortValue } from 'ionic-angular/umd/util/datetime-util';
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
    public communityProvider: CommunityProvider
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
}
