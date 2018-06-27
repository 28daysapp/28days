import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { CommunityProvider } from '../../providers/community/community';
import { Camera, CameraOptions } from '@ionic-native/camera';

/**
 * Generated class for the CommunitywritePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-communitywrite',
  templateUrl: 'communitywrite.html',
})
export class CommunitywritePage {
	title;
	pick = false;
	text = '';
	fileURL;
	dataURL;
  constructor(public navCtrl: NavController, public navParams: NavParams, public community: CommunityProvider,
  	private camera: Camera, public loadingCtrl: LoadingController) {
    this.title = this.community.title;
  }

  write() {
	  this.community.uploadPost(this.text, this.dataURL).then(() => {
	  	this.navCtrl.pop();
	  });
	  let loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
    });
    loading.present();
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
		 	console.log('CAMERA getPicture - imagePath : ' + imagePath);
		 	this.fileURL = 'data:image/jpeg;base64,' + imagePath;
		 	this.dataURL = imagePath;
		 	this.pick = true;
		}, (err) => {
		 	// Handle error
		 	console.log('openGallery error : ' + err.toString());
		});
	}

}
