import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { CommunityProvider } from '../../providers/community/community';
import { Camera, CameraOptions } from '@ionic-native/camera';
//import { CommunityPage } from '../community/community';

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
	pick = false;
	text = '';
	tag1 = '';
	anonymity: boolean;
	tagcorrect = false;
	fileURL;
	dataURL;
	photos;
	cropService;

	communityInfo: any;

	constructor(public navCtrl: NavController, public navParams: NavParams, public community: CommunityProvider,
		private camera: Camera, public loadingCtrl: LoadingController, public alertCtrl: AlertController) {

		this.communityInfo = this.navParams.get('communityInfo');
	}

	write() { 
		if (this.text == '') {
			let alert = this.alertCtrl.create({
				title: '내용은 필수 항목입니다.',
				buttons: [
					{
						text: '확인',
						role: 'cancel'
					}
				]
			})
			alert.present();
		}
		else if (this.text.length > 500) {
			let alert = this.alertCtrl.create({
				title: '내용의 길이는 최대 500자 입니다.',
				buttons: [
					{
						text: '확인',
						role: 'cancel'
					}
				]
			})
			alert.present();
		}
		else {

			this.community.createCommunityPost(this.text, this.dataURL, this.anonymity, this.communityInfo).then((postId) => {
				this.community.createMyPost(postId, this.text, this.dataURL, this.anonymity, this.communityInfo);
			}).then(()=>{
				this.navCtrl.pop();
			});

			let loading = this.loadingCtrl.create({
				dismissOnPageChange: true,
			});
			loading.present();
		}
	}

	openGallery() { // 사진 업로드
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
			this.pick = true;
		}, (err) => {
			// Handle error
			console.log('openGallery error : ' + err.toString());
		});
	}

	takePicture() { 
		let options =
		{
			quality: 100,
			correctOrientation: true
		};
		this.camera.getPicture(options)
			.then((data) => {
				this.photos = new Array<string>();
				this.cropService
					.crop(data, { quality: 75 })
					.then((newImage) => {
						this.photos.push(newImage);
					}, error => console.error("Error cropping image", error));
			}, function (error) {
				console.log(error);
			});
	}

	addtag() { // 태그 추가 시 텍스트창 생성 하나만 가능
		this.tagcorrect = true;
	}
}
