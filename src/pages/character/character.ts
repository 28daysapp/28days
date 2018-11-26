import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar, LoadingController, Events, AlertController } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import firebase from 'firebase';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Crop } from '@ionic-native/crop';

@IonicPage()
@Component({
  selector: 'page-character',
  templateUrl: 'character.html',
})
export class CharacterPage {
  @ViewChild(Navbar) nb: Navbar;
  p = [false, false, false, false];
  originpick;
  emailcheck;
  user2;
  pick;

  firestore = firebase.storage();

  user;
  fileURL;
  dataURL;
  photoURL;

  constructor(public navCtrl: NavController, public navParams: NavParams, public userProvider: UserProvider,
    public loadingCtrl: LoadingController, public events: Events, private camera: Camera, private crop: Crop, private alertCtrl: AlertController) {
    this.user2 = firebase.auth().currentUser;
    events.subscribe('user:created', (user, time) => {
      // user and time are the same arguments passed in `events.publish(user, time)`
      this.emailcheck = user.email;
    });
  }

  ionViewDidLoad() {
    this.createUser();
    this.originpick = parseInt(firebase.auth().currentUser.photoURL.charAt(14));
    this.pick = this.originpick;
    if (this.pick != 0) {
      this.p[this.pick - 1] = true;
    }
    this.nb.backButtonClick = () => {
      this.backhandler();
    };

    const uid = firebase.auth().currentUser.uid;
    this.user = this.userProvider.getUserprofile(uid);

  }

  backhandler() {
    this.navCtrl.pop();
  }

  openGallery() {
    const options: CameraOptions = {
      quality: 20,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imagePath) => {
      this.fileURL = 'data:image/jpeg;base64,' + imagePath;
      const dataURL = imagePath;

      this.updateProfilePicture(dataURL);

    }, (err) => {
      // Handle error
      console.log('openGallery error : ' + err.toString());
    })
  }

  updateProfilePicture(dataURL) {

    this.crop.crop(this.dataURL, {
      quality: 50,
      targetHeight: 50,
      targetWidth: 50
    }).then(
        newImage => this.dataURL = newImage,
        error => console.error('Error cropping image', error)
    ).then(()=>{
      const uid = firebase.auth().currentUser.uid;
      const imageStore = this.firestore.ref('/user/').child(uid);
      try {
        if (dataURL) {
          imageStore.putString(dataURL, 'base64', { contentType: 'image/jpeg' }).then((uploadTask) => {
            uploadTask.ref.getDownloadURL().then((downloadURL)=> {
              this.photoURL = downloadURL;
            }).then(()=>{
              if(this.photoURL) {
                this.userProvider.updateProfilePicture(`${this.photoURL}`).then(() => {
                  this.user = this.userProvider.getUserprofile(uid);
                  this.navCtrl.push('TabsPage');
                }).then(()=> {
                  const alert = this.alertCtrl.create({
                    title: '완료',
                    message: '사진이 변경되었습니다'
                  });
                  alert.present();
                  setTimeout(()=> {
                    alert.dismiss();
                  }, 2000)
                });
              } else {
                console.log("Could not upload profile picture.")
              }
            })
          });
        }
      } catch (error) {
        console.log(error)
      }
    });

  }

  changecharacter(num) {
    // user pick a specific character (index : num)
    this.p = [false, false, false, false];
    this.p[num] = true;
    this.pick = num + 1;
  }

  setcharacter() {
    if (this.pick == this.originpick) {
      // not change character image
      this.navCtrl.push('TabsPage');
      return;
    }
    // change character image
    this.userProvider.updateProfilePicture(`assets/profile${this.pick}.png`).then(() => {
      this.navCtrl.push('TabsPage');
    });
  }

  createUser() {
    this.events.publish('user:created', this.user2, Date.now());
  }

  pickpicture() {
    this.navCtrl.push('CharacterchoicePage');
  }
}
