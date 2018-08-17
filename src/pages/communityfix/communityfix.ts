import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { CommunityProvider } from '../../providers/community/community';

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
	post = this.community.post;
	pick = false;
	text = '';
	tag1 = '';
	constructor(public navCtrl: NavController, public navParams: NavParams, public community: CommunityProvider, public loadingCtrl: LoadingController, public alertCtrl: AlertController) {
		
	}

	fix(title, text) {
		if (this.title == '' || this.text == '') { // 제목과 내용 필수 기입 항목
			let alert = this.alertCtrl.create({
				title: '알림',
				message: '제목, 내용을 모두 기입해주세요.',
				buttons: [
					{
						text: '확인',
						role: 'cancel'
					}
				]
			})
			alert.present();
		}
		else if (this.title.length > 20) { // 제목 길이 제한 - 없어도 무방
			let alert = this.alertCtrl.create({
				title: '알림',
				message: '제목의 길이는 최대 20자 입니다.',
				buttons: [
					{
						text: '확인',
						role: 'cancel'
					}
				]
			})
			alert.present();
		}
		else if (this.text.length > 500) { // 내용 길이 제한 - 없어도 무방
			let alert = this.alertCtrl.create({
				title: '알림',
				message: '내용의 길이는 최대 500자 입니다.',
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
			this.community.updatePost(title, text).then(() => { // communityProvider 의 updatepost를 수행
				this.navCtrl.pop();
			});
			let loading = this.loadingCtrl.create({
				dismissOnPageChange: true,
			});
			loading.present();
		}
	}

}