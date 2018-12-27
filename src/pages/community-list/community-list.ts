import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  LoadingController,
  ModalController
} from "ionic-angular";
import { Storage } from "@ionic/storage";

import { CommunityProvider } from "../../providers/community/community";
import { UserProvider } from "../../providers/user/user";

@IonicPage()
@Component({
  selector: "page-community-list",
  templateUrl: "community-list.html"
})
export class CommunityListPage {
  communities: any = [];

  constructor(
    public storage: Storage,
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public communityProvider: CommunityProvider,
    public userProvider: UserProvider
  ) {}

  ionViewWillEnter() {
    if (!this.userProvider.readCurrentUser()) {
      this.toLogin();
    }
    this.getCommunityList();
  }

  async getCommunityList() {
    this.communities = await this.communityProvider.readCommunityList();
  }

  toCommunityPosts(community) {
    this.navCtrl.push("CommunityPostsPage", {
      communityInfo: community
    });
  }

  toLogin() {
    this.navCtrl.push("LoginPage");
  }

  searchCommunity(searchbarInput: any) {
    const searchQuery = searchbarInput.srcElement.value;

    if (searchQuery && searchQuery.trim() != "") {
      this.communities = this.communities.filter(community => {
        return (
          community.communityName
            .toLowerCase()
            .indexOf(searchQuery.toLowerCase()) > -1
        );
      });
    } else {
      return this.getCommunityList();
    }
  }

  async presentCreateCommunityModal() {
    const newCommunityModal = await this.modalCtrl.create(
      "CreateCommunityModalPage"
    );

    await newCommunityModal.onDidDismiss(() => {
      this.getCommunityList();
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
    if (payload) {
      this.navCtrl.push(page, { payload });
    } else {
      this.navCtrl.push(page);
    }
  }
}
