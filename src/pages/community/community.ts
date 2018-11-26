import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Content, PopoverController, ViewController, App, Events, ModalController } from 'ionic-angular';
import { CommunityProvider } from '../../providers/community/community';
import firebase from 'firebase';
import { Storage } from '@ionic/storage';

import { MenuController } from 'ionic-angular';
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

  user;
  userprofile;
  username;
  photoURL;
  greeting;
  origGreeting;
  showmodal = false;
  token;
  count;

  constructor(
    public modalCtrl: ModalController, 
    public storage: Storage, 
    public auth: AuthProvider, 
    public events: Events, 
    public menu: MenuController, 
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public communityProvider: CommunityProvider,
    public loadingCtrl: LoadingController, 
    public userProvider: UserProvider,
    public popoverCtrl: PopoverController, 
    public viewCtrl: ViewController, 
    public appCtrl: App,
  ) {
    this.initializeCommunities()
  }

  ionViewWillLoad() {

    // check if user already logged-in
    this.user = firebase.auth().currentUser;
    if (this.user) {
      this.username = this.user.displayName;
      this.photoURL = this.user.photoURL;
      this.userProvider.getUserprofile(this.user.uid).then((userprofile) => {
        this.userprofile = userprofile;
        this.greeting = this.userprofile.greeting;
        this.createUser();
        this.menu.enable(true, 'loggedInMenu');
        this.menu.enable(false, 'loggedOutMenu');
      })
    } else {

      try {
        // check if cache info exists in local storage
        this.storage.get('localcred').then((localcred) => {
          if (localcred) {
            // cache exists
            this.auth.loginUser(localcred.email, localcred.password).then((result) => {
              this.user = result.user;
              this.username = result.user.displayName;
              this.photoURL = result.user.photoURL;
              this.userProvider.getUserprofile(result.user.uid).then((userprofile) => {
                this.userprofile = userprofile;
                this.greeting = this.userprofile.greeting;
                this.createUser();
                this.menu.enable(true, 'loggedInMenu');
                this.menu.enable(false, 'loggedOutMenu');
              });
            });
          }
        });
      } catch (error) {
        console.log(error)
      }

    }
  }

  ionViewWillEnter() {
    this.initializeCommunities()
  }

  initializeCommunities() {
    this.getCommunityList();
  }

  getCommunityList() {
    this.communityProvider.readCommunityList().then((communities) => {
      this.communities = communities;
    });
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
      this.initializeCommunities();
    });
    newCommunityModal.present();
  }

  doRefresh(refresher) {
    this.getCommunityList();

    setTimeout(() => {
      refresher.complete();
    }, 500);
  }

  createUser() {
    this.events.publish('user:created', this.user, Date.now());
  }

  navigateTo(page) {
    this.navCtrl.push(page);
  }

}
