import { Component, AfterViewChecked, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { IonicPage, NavController, NavParams, Content, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the IntroPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-intro',
  templateUrl: 'intro.html',
})
export class IntroPage implements AfterViewChecked {
	@ViewChild('content') content: Content;
	chatmessages;
	username;
	showbtn1 = false;
	showinput1 = false;
	showbtn2 = false;
	depressoranxiety;
	showinput2 = false;
	showinput3 = false;
	showbtn3 = false;
	btn3text;
	showbtn4 = false;
	btn4text;
	showbtn5 = false;
	btn5text;
	showbtn6 = false;
	btn6text;
	showbtn7 = false;
	btn7text;
	modalchoices;
	modaltime = [];
	showmodal = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController,
    public storage: Storage) {
    console.log('intro')
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

	scrollToBottom(){
		this.content.scrollToBottom(0);
	}

  ionViewDidLoad() {
  	console.log('Intro - ionViewDieLoad');
  	this.chatmessages = [];
  	this.gogomsg('반가워! 이제 왔구나!\n여기는 고민타파 28일 Challenge 28DAYS야~!', true).then(() => {
  		this.gogomsg("나는 28DAYS의 챗봇 '고고'라고해!\n여기에선 익명으로 언제나 마음 속 고민을 해결할 수 있어~", false).then(() => {
  			setTimeout(() => {
  				this.showbtn1 = true;
  			}, 500);
  		});
  	});

  	this.modalchoices = [
  		{
  			id: 1, label: '아침'
  		}, {
  			id: 2, label: '점심'
  		},{
  			id: 3, label: '저녁'
  		}];
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
  	this.chatmessages.push(this.createmsg(false, false, '와 그렇구나!'));
  	this.showbtn1 = false;
  	this.gogomsg('네 이름은 뭐야?\n내가 널 어떻게 불러야 할까?', true).then(() => {
  		setTimeout(() => {
				this.showinput1 = true;
			}, 500);
  	});
  }

  input1(ip1: NgForm) {
  	this.username = ip1.value.text;
    this.storage.set('username', this.username);
  	this.chatmessages.push(this.createmsg(false, false, this.username));
  	this.showinput1 = false;
  	this.gogomsg(`${ this.username }!!! 정말 예쁜 이름이야!\n그나저나,\n요즘 어떤 일로 가장 힘들어?`, true).then(() => {
  		setTimeout(() => {
				this.showbtn2 = true;
			}, 500);
  	});
  }

  button2_1() {
  	this.depressoranxiety = '불안';
  	this.button2();
  }

  button2_2() {
  	this.depressoranxiety = '우울';
  	this.button2();
  }

  button2() {
  	this.chatmessages.push(this.createmsg(false, false, `${ this.depressoranxiety }해`));
  	this.showbtn2 = false;
  	this.gogomsg(`${ this.depressoranxiety }했구나..ㅜㅜ 많이 힘들었겠다..\n${ this.depressoranxiety }한 지는 몇 주 정도 됐어?`, true).then(() => {
  		setTimeout(() => {
				this.showinput2 = true;
			}, 500);
  	});
  }

  input2(ip2: NgForm) {
  	this.chatmessages.push(this.createmsg(false, false, `${ ip2.value.text }주 정도 됐어.`));
  	this.showinput2 = false;
  	this.gogomsg(`${ ip2.value.text }주 동안 정말 힘들었겠구나..ㅜㅜ`, true).then(() => {
  		this.gogomsg(`그럼 지금 얼마나 ${ this.depressoranxiety }해?\n1부터 10까지 중 하나 입력해줄래?\n1은 조금 ${ this.depressoranxiety }한 거고,\n10은 많이 ${ this.depressoranxiety }한 거야.`, false).then(() => {
	  		setTimeout(() => {
					this.showinput3 = true;
				}, 500);
	  	});
  	});
  }

  input3(ip3: NgForm) {
  	this.chatmessages.push(this.createmsg(false, false, `${ ip3.value.text }`));
  	this.showinput3 = false;
  	this.gogomsg('그랬구나.. 많이 힘들었겠다..', true).then(() => {
  		this.gogomsg('프로작, 졸피뎀, 자낙스와 같은\n정신 건강에 관련된 약을 복용하고 있니?', false).then(() => {
	  		setTimeout(() => {
					this.showbtn3 = true;
				}, 500);
	  	});
  	});
  }

  button3_1() {
  	this.btn3text = '응';
  	this.button3();
  }

  button3_2() {
  	this.btn3text = '아니';
  	this.button3();
  }

  button3() {
  	this.chatmessages.push(this.createmsg(false, false, `${ this.btn3text }`));
  	this.showbtn3 = false;
  	this.gogomsg('그렇구나~\n약을 복용하면 평소에 내가 알람을 주고 싶어서 물어보게 되었어~', true).then(() => {
  		if (this.btn3text == '응') {
  			this.gogomsg('어떤 약을 복용하고 있는지 얘기해줄래?', false).then(() => {
  				setTimeout(() => {
						this.showbtn4 = true;
					}, 500);
  			});
  		} else {
  			this.gogomsg('내가 감정상태를 알아볼 수 있는 설문지가 하나 있는데 테스트 한 번 받아보는 건 어때?', false).then(() => {
  				setTimeout(() => {
						this.showbtn5 = true;
					}, 500);
  			});
  		}
  	});
  }

  button4_1() {
  	this.btn4text = '응';
  	this.button4();
  }

  button4_2() {
  	this.btn4text = '아니';
  	this.button4();
  }

  button4() {
  	this.chatmessages.push(this.createmsg(false, false, `${ this.btn4text }`));
  	this.showbtn4 = false;
  	if (this.btn4text == '응') {
  		setTimeout(() => {
				this.showmodal = true;
			}, 500);
  	} else {
  		this.gogomsg('알겠어~ 나중에 알려주면 약을 복용하는데 알람을 줘서 도움을 줄게!', true).then(() => {
	  		this.gogomsg('내가 감정상태를 알아볼 수 있는 설문지가 하나 있는데 테스트 한 번 받아보는 건 어때?', false).then(() => {
		  		setTimeout(() => {
						this.showbtn5 = true;
					}, 500);
		  	});
	  	});
  	}
  }

  button5_1() {
  	this.btn5text = '응 해볼게!';
  	this.button5();
  }

  button5_2() {
  	this.btn5text = '안 할래..';
  	this.button5();
  }

  button5() {
  	this.chatmessages.push(this.createmsg(false, false, `${ this.btn5text }`));
  	this.showbtn5 = false;
  	if (this.btn5text == '응 해볼게!') {
  		this.gogomsg('잘 생각했어!\n검사 페이지로 이동할게~!', true).then(() => {
        if (this.depressoranxiety == '불안') {
          this.moveToTestanxiety();
        } else {
          this.moveToTestderpession();
        }
  		});
  	} else {
  		this.gogomsg(`그 마음 이해해.. 나도 그랬었어.. 아주 간단한 테스트야!\n${ this.username }(이) 상태가 어떤지 나도 알고 싶어서..\n난 ${ this.username }(이)가 이 테스트를 꼭 받아봤으면 좋겠어!`, true).then(() => {
  			setTimeout(() => {
					this.showbtn6 = true;
				}, 500);
	  	});
  	}
  }

  button6_1() {
  	this.btn6text = '응 해볼게!';
  	this.button6();
  }

  button6_2() {
  	this.btn6text = '안 할래..';
  	this.button6();
  }

  button6() {
  	this.chatmessages.push(this.createmsg(false, false, `${ this.btn6text }`));
  	this.showbtn6 = false;
  	if (this.btn6text == '응 해볼게!') {
  		this.gogomsg('잘 생각했어!\n검사 페이지로 이동할게~!', true).then(() => {
				if (this.depressoranxiety == '불안') {
          this.moveToTestanxiety();
        } else {
          this.moveToTestderpession();
        }
  		});
  	} else {
  		this.gogomsg('간단한 테스트야~\n지금 하기 싫다면 나중에 다시 메뉴에서 선택할 수 있어!', true).then(() => {
  			setTimeout(() => {
					this.showbtn7 = true;
				}, 500);
	  	});
  	}
  }

  button7_1() {
  	this.btn7text = '그래, 해볼게!';
  	this.button7();
  }

  button7_2() {
  	this.btn7text = '다음에 할게.';
  	this.button7();
  }

  button7() {
  	this.chatmessages.push(this.createmsg(false, false, `${ this.btn7text }`));
  	this.showbtn7 = false;
  	if (this.btn7text == '그래, 해볼게!') {
  		this.gogomsg('잘 생각했어!\n검사 페이지로 이동할게~!', true).then(() => {
				if (this.depressoranxiety == '불안') {
          this.moveToTestanxiety();
        } else {
          this.moveToTestderpession();
        }
  		});
  	} else {
  		this.gogomsg('알겠어! 그럼 메인 화면으로 이동할게~!', true).then(() => {
				this.moveToMain();
	  	});
  	}
  }

  modalValue(choice) {
  	if (this.modaltime.indexOf(choice.id) != -1) {
  		this.modaltime = this.modaltime.filter(e => e !== choice.id);
  	} else {
  		this.modaltime.push(choice.id);
  	}
  }

  modalhandler(modal) {
  	console.log(modal.value.mediname + ' / ' + modal.value.mediamount);
  	console.log(JSON.stringify(this.modaltime));
  	this.showmodal = false;
  	this.gogomsg('얘기해줘서 고마워~ 약을 복용하는데 알람을 줘서 도움을 줄게!', true).then(() => {
  		this.gogomsg('내가 감정상태를 알아볼 수 있는 설문지가 하나 있는데 테스트 한 번 받아보는 건 어때?', false).then(() => {
	  		setTimeout(() => {
					this.showbtn5 = true;
				}, 500);
	  	});
  	});
  }

  moveToTestderpession() {
  	setTimeout(() => {
			this.navCtrl.push('TestdepressionPage');
		}, 1000);
  }

  moveToTestanxiety() {
    setTimeout(() => {
      this.navCtrl.push('TestanxietyPage');
    }, 1000);
  }

  moveToMain() {
  	setTimeout(() => {
			this.navCtrl.setRoot('HomePage');
		}, 1000);
  }

}
