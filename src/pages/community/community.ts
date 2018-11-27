import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, ModalController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { AuthProvider } from '../../providers/auth/auth';
import { CommunityProvider } from '../../providers/community/community';

@IonicPage()
@Component({
  selector: 'page-community',
  templateUrl: 'community.html',
})
export class CommunityPage {

  communities: any = [];

  constructor(
    public storage: Storage,
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public authProvider: AuthProvider,
    public communityProvider: CommunityProvider,
  ) { }

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
    let searchQuery = searchbarInput.srcElement.value;

    if (searchQuery && searchQuery.trim() != '') {
      this.communities = this.communities.filter((community) => {
        return (community.communityName.toLowerCase().indexOf(searchQuery.toLowerCase()) > -1);
      })
    } else {
      return this.initializeCommunities()
    }
  }

  async presentCreateCommunityModal() {
    let newCommunityModal = this.modalCtrl.create('CreateCommunityModalPage');

    await newCommunityModal.onDidDismiss(() => {
      this.initializeCommunities();
    });
    await newCommunityModal.present();
  }

  async doRefresh(refresher) {
    await this.getCommunityList();
    await setTimeout(() => {
      refresher.complete();
    }, 500);
  }

  navigateTo(page, payload = null) {
    if (payload){
      this.navCtrl.push(page, {payload: payload});
    }
    else {
      this.navCtrl.push(page);
    }
  }

}
