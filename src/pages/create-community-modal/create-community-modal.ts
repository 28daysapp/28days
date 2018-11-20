import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController,  ModalController, AlertController } from 'ionic-angular';
import { CommunityProvider } from '../../providers/community/community';
import { UserProvider } from '../../providers/user/user';
import { SelectImageModalPage } from '../select-image-modal/select-image-modal';


@IonicPage()
@Component({
  selector: 'page-create-community-modal',
  templateUrl: 'create-community-modal.html',
})
export class CreateCommunityModalPage {

  communityName: String = '';
  communityDescription: String = '';
  isComplete: boolean = false;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public viewController: ViewController, 
    public userProvider: UserProvider, 
    public communityProvider: CommunityProvider,
    private alertCtrl: AlertController,
    public modalCtrl: ModalController ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateCommunityModalPage');
  }

  addCommunity() {
    this.checkForm();
    if (this.isComplete) {
      this.communityProvider.createCommunity(this.communityName, this.communityDescription)
        .then(() => {
          this.userProvider.createCommunityMembership(this.communityName);
        }).then(() => {
          this.communityProvider.increaseCommunityMember(this.communityName);
        });

      this.dismiss();
      this.showAlert()
    }
  }

  presentImageModal(){
    let imageModal = this.modalCtrl.create('SelectImageModalPage', {  });
    imageModal.present();
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

  checkForm() {
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
    } else {
      this.isComplete = true;
    }
    return;
  }

  dismiss() {
    this.viewController.dismiss();
  }

}
