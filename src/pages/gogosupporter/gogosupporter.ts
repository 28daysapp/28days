import { Component, AfterViewChecked, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';

/**
 * Generated class for the GogosupporterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-gogosupporter',
  templateUrl: 'gogosupporter.html',
})
export class GogosupporterPage implements AfterViewChecked {
	@ViewChild('content') content: Content;
	chatmessages;
	showbtn1 = false;
	showbtn2 = false;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
  	this.chatmessages = [];
  	this.gogomsg('1:1 서포터라는 것이\n생소할까봐 설명을 준비해봤어~', true).then(() => {
  		this.gogomsg('1:1 서포터는 나와 비슷한 증상을 가진 사람들과 서로 이야기 하면서 서로의 경험을 이야기 하는거야', false).then(() => {
  			setTimeout(() => {
  				this.showbtn1 = true;
  			}, 500);
  		});
  	});
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

  button1() {
  	this.chatmessages.push(this.createmsg(false, false, '그렇구나!'));
  	this.showbtn1 = false;
  	this.gogomsg('나와 비슷한 사람이 있고, 서로 어떻게 이겨나가고 있는지 이야기 하는 걸로도 마음이 나아질 수 있거든~!', true).then(() => {
  		this.gogomsg('다만, 대화에서 개인정보나 금융정보를 이야기하는 것은 위험하니까 조심해야 해!', false).then(() => {
  			setTimeout(() => {
					this.showbtn2 = true;
				}, 500);
	  	});
  	});
  }

  button2() {
  	this.chatmessages.push(this.createmsg(false, false, '알았어!'));
  	this.showbtn2 = false;
  	this.gogomsg('대화 시작 후 30분 동안은 무료이고, 이후에는 결제가 필요해~', true).then(() => {
  		this.gogomsg('그럼 이제 서포터를 찾아보자~!', false).then(() => {
  			this.moveToSupporter();
	  	});
  	});
  }

  moveToSupporter() {
  	setTimeout(() => {
			this.navCtrl.push('SupporterPage');
		}, 1000);
  }

}
