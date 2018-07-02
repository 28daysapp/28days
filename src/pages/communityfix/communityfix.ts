import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { CommunityProvider } from '../../providers/community/community';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FirebaseListObservable} from 'angularfire2'; 
//import { FirebaseListObservable } from "angularfire2/database"; 

/**
 * Generated class for the CommunityfixPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-communityfix',
  templateUrl: 'communityfix.html',
})
export class CommunityfixPage {
	title;
	pick = false;
	text = '';
	fileURL;
	dataURL;
	communitylist: FirebaseListObservable<any[]>;
  constructor(public navCtrl: NavController, public navParams: NavParams, public community: CommunityProvider,
  	private camera: Camera, public loadingCtrl: LoadingController) {
    this.title = this.community.title;
  }

	/*
  fix(item) {
	  this.community.updatePost(item);
	  let loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
    });
    loading.present();
	}
	*/

	fix(item) {
	  this.community.updatePost(item).then(() => {
			
		});
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