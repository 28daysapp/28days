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
	title = '';
	pick = false;
	text = '';
	tag1 = '';
	anonymity: boolean;
	tagcorrect = false;
	fileURL;
	dataURL;
	constructor(public navCtrl: NavController, public navParams: NavParams, public community: CommunityProvider,
		private camera: Camera, public loadingCtrl: LoadingController, public alertCtrl: AlertController) {
		
	}

	write() { // communityfix와 동일
		if (this.title == '' || this.text == '') {
			let alert = this.alertCtrl.create({
				title: '제목과 내용은 필수 항목입니다.',
				buttons: [
					{
						text: '확인',
						role: 'cancel'
					}
				]
			})
			alert.present();
		}
		else if (this.title.length > 50) {
			let alert = this.alertCtrl.create({
				title: '제목의 길이는 최대 50자 입니다.',
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
			this.community.uploadPost(this.title, this.text, this.dataURL, this.tag1, this.anonymity).then(() => {
				this.navCtrl.pop();
			});
			let loading = this.loadingCtrl.create({
				dismissOnPageChange: true,
			});
			loading.present();
		}
	}

	openGallery() { // 사진 업로드 인듯
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

	addtag() { // 태그 추가 시 텍스트창 생성 하나만 가능
		this.tagcorrect = true;
	}
}
