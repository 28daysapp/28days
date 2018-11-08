import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Content, PopoverController, ViewController, App, Events, ModalController } from 'ionic-angular';
import { CommunityProvider } from '../../providers/community/community';
import { CommunitycommentProvider } from '../../providers/communitycomment/communitycomment';
import firebase from 'firebase';
import { Storage } from '@ionic/storage';

import { MenuController } from 'ionic-angular';
import { FcmProvider } from '../../providers/fcm/fcm';
import { UserProvider } from '../../providers/user/user';
import { AuthProvider } from '../../providers/auth/auth';

@IonicPage()
@Component({
  selector: 'page-community',
  templateUrl: 'community.html',
})
export class CommunityPage {
  @ViewChild(Content) content: Content;

  communities: any;
  searchQuery: String;

  fireusers = firebase.database().ref('/users');
  loading;
  user;
  userprofile;
  username;
  photoURL;
  greeting;
  origGreeting;
  showmodal = false;
  token;
  count;

  constructor(public modalCtrl: ModalController, public storage: Storage, public auth: AuthProvider, public events: Events, public menu: MenuController, public navCtrl: NavController, public navParams: NavParams, private communityProvider: CommunityProvider,
    public loadingCtrl: LoadingController, public cocomment: CommunitycommentProvider, public fcmProvider: FcmProvider, public userProvider: UserProvider,
    public popoverCtrl: PopoverController, public viewCtrl: ViewController, public appCtrl: App,
  ) {
    this.initializeCommunities()
  }

  ionViewWillLoad() {

    // check if user already logged-in
    this.user = firebase.auth().currentUser;
    if (this.user) {

      this.fcmProvider.setToken(this.user);
      // this.fcmProvider.handleTokenRefresh();
      this.username = this.user.displayName;
      this.photoURL = this.user.photoURL;

      this.userProvider.getUserprofile(this.user.uid).then((userprofile) => {
        console.log(JSON.stringify(userprofile));
        this.userprofile = userprofile;
        this.greeting = this.userprofile.greeting;
        this.loading.dismiss();
        this.createUser();
        this.menu.enable(true, 'loggedInMenu');
        this.menu.enable(false, 'loggedOutMenu');
      })
    } else {

      // check if cache info exists in local storage
      this.storage.get('localcred').then((localcred) => {
        if (localcred) {
          // cache exists
          this.auth.loginUser(localcred.email, localcred.password).then((user) => {
            this.user = user;
            this.username = this.user.displayName;
            this.photoURL = this.user.photoURL;

            this.fcmProvider.setToken(this.user);

            this.userProvider.getUserprofile(this.user.uid).then((userprofile) => {

              this.userprofile = userprofile;
              this.greeting = this.userprofile.greeting;
              this.loading.dismiss();
              this.createUser();
              this.menu.enable(true, 'loggedInMenu');
              this.menu.enable(false, 'loggedOutMenu');
            });
          });
        }
      });
    }
  }

  ionViewWillEnter() {
    this.loading = this.loadingCtrl.create();
    this.loading.present();
    this.loading.dismiss();
  }

  initializeCommunities() {
    this.getCommunityList();
  }

  getCommunityList() {
    this.communityProvider.readCommunityList().then((communities) => {
      this.communities = communities;
    })
  }

  toCommunityPosts(community) {
    this.navCtrl.push('CommunityPostsPage', {
      communityInfo: community
    });
  }

  searchCommunity(searchbarInput: any) {
    this.searchQuery = searchbarInput.srcElement.value;
    if (this.searchQuery && this.searchQuery.trim() != '') {
      this.communities = this.communities.filter((community) => {
        return (community.communityName.toLowerCase().indexOf(this.searchQuery.toLowerCase()) > -1);
      })
    } else {
      this.initializeCommunities()
      return
    }
    
  }

  presentCreateCommunityModal() {
    let newCommunityModal = this.modalCtrl.create('CreateCommunityModalPage');
    newCommunityModal.onDidDismiss(data => {
      console.log("Modal closed");
      this.initializeCommunities();
    });
    newCommunityModal.present();
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    this.getCommunityList();

    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 500);
  }

  createUser() {
    console.log('User created!')
    this.events.publish('user:created', this.user, Date.now());
  }

}
