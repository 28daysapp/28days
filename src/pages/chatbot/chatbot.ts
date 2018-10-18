import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { IonicPage, NavController, NavParams, Content, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-chatbot',
  templateUrl: 'chatbot.html',
})
export class ChatbotPage {
  @ViewChild('content') content: Content;

  chatMessages;
  username;
  showbtn1 = false;
  showinput1 = false;
  showbtn2 = false;
  currentMood;
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
    console.log("Start Chatbot")
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    this.content.scrollToBottom(0);
  }

  ionViewDidLoad() {
    console.log('Chatbot - ionViewDieLoad');
    this.chatMessages = [];
    this.gogomsg('반가워요! \n코코넛에 온걸 환영해요!', true).then(() => {
      this.gogomsg("저는 코코넛의 챗봇 코코에요.\n여기에서는 누구나 익명으로 자신의 고민거리를 이야기 할 수 있어요.", false).then(() => {
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
      }, {
        id: 3, label: '저녁'
      }];
  }


  skipTutorial() {
    this.navCtrl.push('TabsPage');
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
      this.chatMessages.push(msg);
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
    this.chatMessages.push(this.createmsg(false, false, '그렇구나!'));
    this.showbtn1 = false;
    this.gogomsg('앞으로 제가 어떻게 불러드려야 할까요?', true).then(() => {
      setTimeout(() => {
        this.showinput1 = true;
      }, 500);
    });
  }

  input1(ip1: NgForm) {
    this.username = ip1.value.text;
    this.storage.set('username', this.username);
    this.chatMessages.push(this.createmsg(false, false, this.username));
    this.showinput1 = false;
    this.gogomsg(`${this.username}!!! 정말 예쁜 닉네임이네요!\n그나저나,\n요즘 어떤 일로 가장 힘드신가요?`, true).then(() => {
      setTimeout(() => {
        this.showbtn2 = true;
      }, 500);
    });
  }

  button2_1() {
    this.currentMood = '불안';
    this.button2();
  }

  button2_2() {
    this.currentMood = '우울';
    this.button2();
  }

  button2() {
    this.chatMessages.push(this.createmsg(false, false, `${this.currentMood}해`));
    this.showbtn2 = false;
    this.gogomsg(`${this.currentMood}했군요...ㅠㅠ 많이 힘들었겠어요..\n${this.currentMood}한 지는 몇 주 정도 됐나요?`, true).then(() => {
      setTimeout(() => {
        this.showinput2 = true;
      }, 500);
    });
  }

  input2(ip2: NgForm) {
    this.chatMessages.push(this.createmsg(false, false, `${ip2.value.text}주 정도 됐어.`));
    this.showinput2 = false;
    this.gogomsg(`${ip2.value.text}주 동안 정말 힘들었겠군요..`, true).then(() => {
      this.gogomsg(`그럼 지금 얼마나 ${this.currentMood}한가요?\n1부터 10까지 중 하나 입력해주시겠어요?\n1은 조금 ${this.currentMood}한 거고,\n10은 많이 ${this.currentMood}한 거에요.`, false).then(() => {
        setTimeout(() => {
          this.showinput3 = true;
        }, 500);
      });
    });
  }

  input3(ip3: NgForm) {
    this.chatMessages.push(this.createmsg(false, false, `${ip3.value.text}`));
    this.showinput3 = false;
    this.gogomsg('그랬군요.. 많이 힘들겠어요..', true).then(() => {
      this.gogomsg('혹시 프로작, 졸피뎀, 자낙스와 같은\n정신 건강에 관련된 약을 복용하고 있나요?', false).then(() => {
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
    this.chatMessages.push(this.createmsg(false, false, `${this.btn3text}`));
    this.showbtn3 = false;
    this.gogomsg('그렇군요\n약을 복용하고 있으면 평소에 제가 알람을 주고 싶어서 물어봤어요!', true).then(() => {
      if (this.btn3text == '응') {
        this.gogomsg('어떤 약을 복용하고 있는지 얘기해주시겠어요??', false).then(() => {
          setTimeout(() => {
            this.showbtn4 = true;
          }, 500);
        });
      } else {
        this.gogomsg('그럼 감정 상태를 알아볼 수 있는 테스트가 하나 있는데, 한번 해보시겠어요?', false).then(() => {
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
    this.chatMessages.push(this.createmsg(false, false, `${this.btn4text}`));
    this.showbtn4 = false;
    if (this.btn4text == '응') {
      setTimeout(() => {
        this.showmodal = true;
      }, 500);
    } else {
      this.gogomsg('알겠어요! 나중에 알려주시면 약을 복용할 시간에 알람을 줘서 도움을 줄게요!', true).then(() => {
        this.gogomsg('그럼 감정 상태를 알아볼 수 있는 테스트가 하나 있는데, 한번 해보시겠어요?', false).then(() => {
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
    this.chatMessages.push(this.createmsg(false, false, `${this.btn5text}`));
    this.showbtn5 = false;
    if (this.btn5text == '응 해볼게!') {
      this.gogomsg('잘 생각했어!\n검사 페이지로 이동할게~!', true).then(() => {
        if (this.currentMood == '불안') {
          this.moveToTestanxiety();
        } else {
          this.moveToTestderpession();
        }
      });
    } else {
      this.gogomsg(`그 마음 이해해요.. 저도 그랬었어요.. 그런데 아주 간단한 테스트에요!\n${this.username}님 상태가 어떤지 저도 알고 싶어서..\n전 ${this.username}님이 이 테스트를 꼭 받아봤으면 좋겠어요!`, true).then(() => {
        setTimeout(() => {
          this.showbtn6 = true;
        }, 500);
      });
    }
  }

  button6_1() {
    this.btn6text = '알겠어';
    this.button6();
  }

  button6_2() {
    this.btn6text = '안 할래..';
    this.button6();
  }

  button6() {
    this.chatMessages.push(this.createmsg(false, false, `${this.btn6text}`));
    this.showbtn6 = false;
    if (this.btn6text == '알겠어') {
      this.gogomsg('잘 생각했어요!\n검사 페이지로 이동할게요', true).then(() => {
        if (this.currentMood == '불안') {
          this.moveToTestanxiety();
        } else {
          this.moveToTestderpession();
        }
      });
    } else {
      this.gogomsg('간단한 테스트에요!\n지금 하기 싫다면 나중에 해볼 수도 있어요!', true).then(() => {
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
    this.chatMessages.push(this.createmsg(false, false, `${this.btn7text}`));
    this.showbtn7 = false;
    if (this.btn7text == '그래, 해볼게!') {
      this.gogomsg('잘 생각했어요!\n검사 페이지로 이동할게요', true).then(() => {
        if (this.currentMood == '불안') {
          this.moveToTestanxiety();
        } else {
          this.moveToTestderpession();
        }
      });
    } else {
      this.gogomsg('알겠어요! 그럼 메인 화면으로 이동할게요', true).then(() => {
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
    this.gogomsg('얘기해줘서 고마워요! 약을 복용할 시간에 알람을 줘서 도움을 줄게요!', true).then(() => {
      this.gogomsg('그럼 감정 상태를 알아볼 수 있는 테스트가 하나 있는데, 한번 해보시겠어요?', false).then(() => {
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
      this.navCtrl.push('TabsPage');
    }, 1000);
  }

}
