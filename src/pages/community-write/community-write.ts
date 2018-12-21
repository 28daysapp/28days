import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController,
  AlertController
} from "ionic-angular";
import { CommunityProvider } from "../../providers/community/community";

@IonicPage()
@Component({
  selector: "page-community-write",
  templateUrl: "community-write.html"
})
export class CommunityWritePage {
  anonymity: boolean;
  communityInfo: any;
  text: String;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public communityProvider: CommunityProvider
  ) {
    this.communityInfo = this.navParams.get("communityInfo");
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad CommunityWritePage");
  }

  writePost() {
    if (this.text == "") {
      const alert = this.alertCtrl.create({
        title: "내용은 필수 항목입니다.",
        buttons: [
          {
            text: "확인",
            role: "cancel"
          }
        ]
      });
      alert.present();
    } else if (this.text.length > 500) {
      const alert = this.alertCtrl.create({
        title: "내용의 길이는 최대 500자 입니다.",
        buttons: [
          {
            text: "확인",
            role: "cancel"
          }
        ]
      });
      alert.present();
    } else {
      this.communityProvider
        .createCommunityPost(this.text, this.anonymity, this.communityInfo)
        .then(postId => {
          this.communityProvider.createMyPost(
            postId,
            this.text,
            this.anonymity,
            this.communityInfo
          );
        })
        .then(() => {
          this.navCtrl.pop();
        });

      const loading = this.loadingCtrl.create({
        dismissOnPageChange: true
      });
      loading.present();
    }
  }
}
