import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar, LoadingController, Events, AlertController } from 'ionic-angular';
import { Crop } from '@ionic-native/crop';
import { UserProvider } from '../../providers/user/user';
import firebase from 'firebase';
import { Camera, CameraOptions } from '@ionic-native/camera';

@IonicPage()
@Component({
  selector: 'page-character',
  templateUrl: 'character.html',
})
export class CharacterPage {
  @ViewChild(Navbar) nb: Navbar;
  // flags which character is picked
  p = [false, false, false, false];
  // original character index
  originpick;
  emailcheck;
  user2;
  // character index which user picks
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
    // set flags which character was set
    if (this.pick != 0) {
      this.p[this.pick - 1] = true;
    }
    // set back button click listener
    this.nb.backButtonClick = () => {
      this.backhandler();
    };

    const uid = firebase.auth().currentUser.uid;
    this.user = this.userProvider.getUserprofile(uid);

  }

  backhandler() {
    // go to home page
    this.navCtrl.pop();
  }

  openGallery() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imagePath) => {
      this.fileURL = 'data:image/jpeg;base64,' + imagePath;
      this.dataURL = imagePath;

      this.updateProfilePicture();

    }, (err) => {
      // Handle error
      console.log('openGallery error : ' + err.toString());
    });

  }

  updateProfilePicture() {

    // this.crop.crop(this.dataURL, {
    //   quality: 100,
    //   targetHeight: 50,
    //   targetWidth: 50
    // }).then(
    //     newImage => this.dataURL = newImage,
    //     error => console.error('Error cropping image', error)
    //   );

    const uid = firebase.auth().currentUser.uid;
    const imageStore = this.firestore.ref('/user/').child(uid);
    try {
      if (this.dataURL) {
        imageStore.putString(this.dataURL, 'base64', { contentType: 'image/jpeg' }).then((savedImage) => {

          console.log("Image Store");

          this.photoURL = savedImage.downloadURL;

          console.log("Photo URL: " + this.photoURL);


          this.userProvider.updatePhoto(`${this.photoURL}`).then(() => {
            console.log("Photo uploaded")
            this.user = this.userProvider.getUserprofile(uid);
            this.navCtrl.push('TabsPage');
          });


        });
        const alert = this.alertCtrl.create({
          message: `
          <p>사진이 변경되었습니다</p>
          `
        });
        alert.present();
        setTimeout(()=> {
          alert.dismiss();
        }, 600)
      }
    } catch (error) {
      console.log(error)
    }

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
    this.userProvider.updatePhoto(`assets/profile${this.pick}.png`).then(() => {
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
