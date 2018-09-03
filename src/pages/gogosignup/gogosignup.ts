import { Component, AfterViewChecked, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, Navbar } from 'ionic-angular';
import firebase from 'firebase';

/**
 * Generated class for the GogosignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-gogosignup',
  templateUrl: 'gogosignup.html',
})
export class GogosignupPage implements AfterViewChecked {
	@ViewChild(Navbar) nb: Navbar;
	@ViewChild('content') content: Content;
	chatmessages;
	username;
	showbtn = false;
	btntext;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
  	this.nb.backButtonClick = () => {
      this.backhandler();
    };
    this.username = firebase.auth().currentUser.displayName;
  	this.chatmessages = [];
  	this.gogomsg('28DAYS에 가입한 걸 환영해!!!', true).then(() => {
  		this.gogomsg(`28DAYS를 통해 ${ this.username }의 마음이 편해질 수 있을 거야~! ${ this.username }의 캐릭터를 설정할 수가 있는데 한 번 보러 가볼래?`, false).then(() => {
  			setTimeout(() => {
  				this.showbtn = true;
  			}, 500);
  		});
  	});
  }

  backhandler() {
  	this.navCtrl.push('TabsPage');
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

	scrollToBottom(){
		this.content.scrollToBottom(0);
	}

  createmsg(showimage, gogo, message) {
  	return {
  		showimage: showimage,
  		gogo: gogo,
  		message: message,
  		setblack: !gogo
  	};
  }

  gogomsg(text, showimage) {
  	var promise = new Promise((resolve) => {
  		var msg = this.createmsg(showimage, true, '메시지를 입력 중입니다.');
	  	this.chatmessages.push(msg);
	  	var count = 0;
	  	var intv = setInterval(() => {
	  		if (count % 3 == 0) {
	  			msg.message = '메시지를 입력 중입니다.';
	  		} else if (count % 3 == 1) {
	  			msg.message = '메시지를 입력 중입니다..';
	  		} else {
	  			msg.message = '메시지를 입력 중입니다...';
	  		}
	  		count++;
	  	}, 400);
	  	setTimeout(() => {
	      clearInterval(intv);
	      msg.setblack = true;
	      msg.message = text;
	      resolve(true);
	    }, 2000);
  	});
  	return promise;
  }

  button_1() {
  	this.btntext = '응 그래!';
  	this.button();
  }

  button_2() {
  	this.btntext = '다음에 할래.';
  	this.button();
  }

  button() {
  	this.chatmessages.push(this.createmsg(false, false, `${ this.btntext }`));
  	this.showbtn = false;
  	if (this.btntext == '응 그래!') {
			this.moveToCharacter();
		} else {
			this.gogomsg('그래~ 메인 메뉴에서 다시 선택할 수 있어~!', true).then(() => {
				this.moveToMain();
			});
		}
  }

  moveToCharacter() {
  	setTimeout(() => {
			this.navCtrl.push('CharacterPage');
		}, 1000);
  }

  moveToMain() {
  	setTimeout(() => {
			this.navCtrl.push('TabsPage');
		}, 1000);
  }

}
