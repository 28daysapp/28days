import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import { CommunityProvider } from '../../providers/community/community';


@IonicPage()
@Component({
  selector: 'page-create-community-modal',
  templateUrl: 'create-community-modal.html',
})
export class CreateCommunityModalPage {

  communityName: String = '';
  communityDescription: String = '';
  isComplete: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewController: ViewController, public community: CommunityProvider,
    private alertCtrl: AlertController,) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateCommunityModalPage');
  }

  addCommunity() {
    this.checkForm();
    if(this.isComplete) {
      this.community.createCommunity(this.communityName, this.communityDescription);
      this.dismiss();
      this.showAlert()
    }
  }

  showAlert() {
    const alert = this.alertCtrl.create({
      title: '축하해!',
      message: `
      <p>커뮤니티에 첫 글을 남겨서 이 커뮤니티가 왜 만들어졌는지 모두에게 알려줘!</p>
      `,
      buttons: ['알겠어!']
    });
    alert.present();
  }

  checkForm(){
    if (this.communityName == '') {
      const alert = this.alertCtrl.create({
        message: `
        <p>커뮤니티 이름은 필수 항목이야</p>
        `,
        buttons: ['알겠어']
      });
      alert.present();
    } else if (this.communityDescription == '') {
      const alert = this.alertCtrl.create({
        message: `
        <p>커뮤니티를 좀 더 자세히 소개해줘</p>
        `,
        buttons: ['알겠어']
      });
      alert.present();
    } else if (this.communityDescription.length > 500) {
      const alert = this.alertCtrl.create({
        message: `
        <p>내용은 500자 미만으로 해줘</p>
        `,
        buttons: ['알겠어']
      });
      alert.present();
    }else {
      this.isComplete = true;
    }
    return;
   }

  dismiss() {
    let data = { 

    };
    this.viewController.dismiss(data);
  }

}
