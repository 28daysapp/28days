import { Component, AfterViewChecked, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';

/**
 * Generated class for the GogohomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-gogohome',
  templateUrl: 'gogohome.html',
})
export class GogohomePage implements AfterViewChecked {
	@ViewChild('content') content: Content;
	chatmessages;
	showbtn1 = false;
	showbtn2 = false;
	answer = '';
	answers1 = [
		'얘기해봐~',
		'그렇구나~',
		'그래!!'
	];
	answers2 = [
		'그렇긴 해',
		'그래, 알았어~',
		'그렇구나',
		'응 그렇지',
		'그렇구나!'
	];
	scenario = 0;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
  	this.scenario = Math.floor(Math.random() * 2);
  	this.chatmessages = [];
  	if (this.scenario) {
  		this.gogomsg('안녕?\n내 이름은 고고야~\n내가 누군지 궁금하지 않니? +_+', true).then(() => {
				setTimeout(() => {
					this.answer = this.answers1[0];
					this.showbtn1 = true;
				}, 500);
	  	});
  	} else {
	  	this.gogomsg('이 앱 이름이 28DAYS 이자너?\n트웨니에잇데이즈 라고 읽어야 할지.. 그냥 이십..', true).then(() => {
	  		this.gogomsg('왠지 이상한 말을 할 뻔했어 ㅎㅎ\n여하튼 어떻게 읽어야 할지 감이 잘 안오지?', false).then(() => {
	  			setTimeout(() => {
	  				this.answer = this.answers2[0];
						this.showbtn2 = true;
					}, 500);
		  	});
	  	});
  	}
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

  button1(answer) {
  	if (answer == this.answers1[0]) {
	  	this.chatmessages.push(this.createmsg(false, false, answer));
	  	this.showbtn1 = false;
	  	this.gogomsg('설명할 기회를 줘서 고마웡~ㅎㅎ\n고민을 고민하는 피플, 고고플!\n앞 글자를 따서 내 이름은 고고라고 정해졌대~', true).then(() => {
	  		this.gogomsg('게임을 시작하면 처음에 옆에서 쫑알쫑알하는 캐릭터들이 있지?\n그것처럼 28DAYS를 사용하는 데 도움을 주려고 만들어졌어~', false).then(() => {
	  			setTimeout(() => {
	  				this.answer = this.answers1[1];
						this.showbtn1 = true;
					}, 500);
		  	});
	  	});
	  } else if (answer == this.answers1[1]) {
	  	this.chatmessages.push(this.createmsg(false, false, answer));
	  	this.showbtn1 = false;
	  	this.gogomsg('매일 네 상태를 확인할 수 있도록\n옆에서 쫑알쫑알 될 거 같아~\n귀찮을 수도 있지만 예쁘게 봐줭~', true).then(() => {
  			setTimeout(() => {
  				this.answer = this.answers1[2];
					this.showbtn1 = true;
				}, 500);
	  	});
	  } else if (answer == this.answers1[2]) {
	  	this.chatmessages.push(this.createmsg(false, false, answer));
	  	this.showbtn1 = false;
	  	this.gogomsg('날 찾아와줘서 정말 고마워~!', true).then(() => {
	  		this.gogomsg('메뉴에 도움이 될 수 있는 정보도 많으니까 찬찬히 둘러봐봐~\n난 이만 갈껭~~~', false).then(() => {
	  			this.moveToHome();
		  	});
	  	});
	  }
  }

  button2(answer) {
  	if (answer == this.answers2[0]) {
	  	this.chatmessages.push(this.createmsg(false, false, answer));
	  	this.showbtn2 = false;
	  	this.gogomsg('사실 어떻게 읽을 지는 우리가 정할 수 있는 건 아닌 거 같지만 ㅎㅎ', true).then(() => {
	  		this.gogomsg('28DAYS의 뜻을 설명해줄게~\n왜 이름이 이렇게 된 건지 얘기해주고 싶어서~', false).then(() => {
	  			setTimeout(() => {
	  				this.answer = this.answers2[1];
						this.showbtn2 = true;
					}, 500);
		  	});
	  	});
	  } else if (answer == this.answers2[1]) {
	  	this.chatmessages.push(this.createmsg(false, false, answer));
	  	this.showbtn2 = false;
	  	this.gogomsg('정신과 의원, 병원에 가는 사람들이 보통 28일의 주기로 찾아 간데~', true).then(() => {
  			this.gogomsg('근데 병원에 가고 나서 다음에 다시 가기까지 혼자 견디다 보니 증상이 안 좋아질 수도 있다고 하더라구..', false).then(() => {
	  			setTimeout(() => {
	  				this.answer = this.answers2[2];
						this.showbtn2 = true;
					}, 500);
		  	});
	  	});
	  } else if (answer == this.answers2[2]) {
	  	this.chatmessages.push(this.createmsg(false, false, answer));
	  	this.showbtn2 = false;
	  	this.gogomsg('감기 같은 병은 콧물이나 기침이 나는 걸 보고 어떤 약을 먹어야 하고, 어떤 병원에 가야 하는지 알 수 있자너?', true).then(() => {
  			setTimeout(() => {
  				this.answer = this.answers2[3];
					this.showbtn2 = true;
				}, 500);
	  	});
	  } else if (answer == this.answers2[3]) {
	  	this.chatmessages.push(this.createmsg(false, false, answer));
	  	this.showbtn1 = false;
	  	this.gogomsg('근데, 마음이 아플 때는 어떤 증상이 있는지.. 어떤 약을 먹어야 할지.. 어디로 가야 할지 알기가 어렵다고 하더라구..', true).then(() => {
  			this.gogomsg('그래서 서로의 경험을 공유하고 얘기를 할 수 있으면 28일을 견디기에도 좋을 것 같아서 이 앱을 만들고 이름을 그렇게 지었대~', false).then(() => {
	  			setTimeout(() => {
	  				this.answer = this.answers2[4];
						this.showbtn2 = true;
					}, 500);
		  	});
	  	});
	  } else if (answer == this.answers2[4]) {
	  	this.chatmessages.push(this.createmsg(false, false, answer));
	  	this.showbtn2 = false;
	  	this.gogomsg('재미없을 수 있는 얘기를 끝까지 들어줘서 고마워~', true).then(() => {
	  		this.gogomsg('메뉴에 도움이 될 수 있는 정보도 많으니까 찬찬히 둘러봐봐~\n난 이만 갈껭~~~', false).then(() => {
	  			this.moveToHome();
		  	});
	  	});
	  }
  }

  moveToHome() {
  	setTimeout(() => {
			this.navCtrl.push('TabsPage');
		}, 1000);
  }

}
