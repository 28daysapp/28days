import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar, AlertController } from 'ionic-angular';

/**
 * Generated class for the TestdepressionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-testdepression',
  templateUrl: 'testdepression.html',
})
export class TestdepressionPage {
  @ViewChild(Navbar) nb: Navbar;
	toquestion = false;
	toresult = false;
	answers = ['1일 이하', '2일 ~ 6일', '7일 ~ 12일', '거의 매일'];
	useranswers = [];
	question = '기분이 가라앉거나, 우울하거나, 희망이 없다고 느꼈다.';
	qcount = 0;
	questions = [
		'기분이 가라앉거나, 우울하거나, 희망이 없다고 느꼈다.',
		'평소 하던 일에 대한 흥미가 없어지거나 즐거움을 느끼지 못 했다.',
		'잠들기가 어렵거나 자주 깼다. 혹은 너무 많이 잤다.',
		'다른 사람들이 눈치 챌 정도로 평소보다 말과 행동이 느려졌다. 혹은 너무 안절부절못해서 가만히 있을 수 없었다.',
		'피곤하고 기운이 없었다.',
		'내가 잘못했거나, 내가 실패했다는 생각이 들었다, 혹은 자신과 가족을 실망시켰다고 생각했다.',
		'신문을 읽거나 TV를 보는 것과 같은 일상적인 일에도 집중을 할 수가 없었다.',
		'평소보다 식욕이 줄었다, 혹은 평소보다 많이 먹었다.',
		'차라리 죽는 것이 더 낫겠다고 생각했다. 혹은 자해할 생각을 했다.'
	];
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
  	if (this.qcount == 8) {
  		this.useranswers.push(this.answers.indexOf(answer));
  		this.getresult();
  		this.toresult = true;
  		return;
  	}
  	this.qcount++;
  	this.question = this.questions[this.qcount];
  	this.useranswers.push(this.answers.indexOf(answer));
  }

  getresult() {
  	const add = (a, b) => a + b;
  	this.score = this.useranswers.reduce(add);
  	if (this.score <= 4) {
  		this.category = ' 우울증 아님 ';
  	} else if (this.score <= 9) {
  		this.category = ' 가벼운 우울증 ';
  	} else if (this.score <= 14) {
  		this.category = ' 중간 정도 우울증 ';
  	} else if (this.score <= 19) {
  		this.category = ' 치료가 필요한 우울증 ';
  	} else {
  		this.category = ' 적극적 치료가 필요한 우울증 ';
  	}
  }

  close() {
  	this.navCtrl.push('SignupPage');
  }

}
