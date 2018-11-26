import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar, AlertController } from 'ionic-angular';

/**
 * Generated class for the TestanxietyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-testanxiety',
  templateUrl: 'testanxiety.html',
})
export class TestanxietyPage {
  @ViewChild(Navbar) nb: Navbar;
	toquestion = false;
	toresult = false;
	toresult2 = false;
	answers = ['전혀 그렇지 않다', '조금 그렇다', '보통으로 그렇다', '대단히 그렇다'];
	useranswers = [];
	question = '나는 마음이 차분하다.';
	qcount = 0;
	questions = [
		'나는 마음이 차분하다.',
		'나는 마음이 든든하다.',
		'나는 긴장되어 있다.',
		'나는 후회스럽고 서운하다.',
		'나는 마음이 편하다.',
		'나는 당황해서 어찌할 바를 모르겠다.',
		'나는 앞으로 불행이 있을까 걱정하고 있다.',
		'나는 마음이 놓인다.',
		'나는 불안하다.',
		'나는 편안하게 느낀다.',
		'나는 자신감이 있다.',
		'나는 짜증스럽다.',
		'나는 마음이 조마조마하다.',
		'나는 극도로 긴장되어 있다.',
		'내 마음은 긴장이 풀려 푸근하다.',
		'나는 만족스럽다.',
		'나는 걱정하고 있다.',
		'나는 흥분되어 어쩔 줄 모른다.',
		'나는 즐겁다.',
		'나는 기분이 좋다.'
	];
	reversequestions = [1, 2, 5, 8, 10, 11, 15, 16, 19, 20];
	score;
	category;
  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    this.nb.backButtonClick = () => {
      this.backhandler();
    };
  }

  backhandler() {
    let alert = this.alertCtrl.create({
      title: '테스트 취소',
      message: '아직 테스트가 완료되지 않았어요!<br>정말로 테스트를 취소하시겠어요?',
      buttons: [
        {
          text: '계속할래요',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: '취소할래요',
          cssClass: 'alertbtn',
          handler: () => {
            this.navCtrl.push('TabsPage');
          }
        }
      ]
    });
    alert.present();
  }

  gotoquestions() {
  	this.toquestion = true;
  }

  nextquestion(answer) {
  	this.useranswers.push(this.getscore(this.answers.indexOf(answer)));
  	if (this.qcount == 19) {
  		this.getresult();
  		if (this.score <= 51) {
  			this.toresult2 = true;
  		} else {
  			this.toresult = true;
  		}
  		return;
  	}
  	this.qcount++;
  	this.question = this.questions[this.qcount];
  }

  getscore(answerindex) {
  	var score;
  	if (this.reversequestions.indexOf(this.qcount + 1) == -1) {
  		score = answerindex + 1;
  	} else {
  		score = 4 - answerindex;
  	}
  	return score;
  }

  getresult() {
  	const add = (a, b) => a + b;
  	this.score = this.useranswers.reduce(add);
  	if (this.score <= 51) {
  		this.category = ' 불안감이 없음 ';
  	} else if (this.score <= 56) {
  		this.category = ' 불안감이 약간 높음 ';
  	} else if (this.score <= 61) {
  		this.category = ' 불안감이 상당히 높음 ';
  	} else {
  		this.category = ' 불안감이 매우 높음 ';
  	}
  }

  close() {
  	this.navCtrl.push('SignupPage');
  }

  testdepression() {
    this.navCtrl.push('TestdepressionPage');
  }

}
