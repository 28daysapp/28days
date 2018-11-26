import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, Loading, AlertController, Events } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth';
import { EmailValidator } from '../../validators/email';
import { PasswordValidator } from '../../validators/password';
import { Storage } from '@ionic/storage';
import firebase from 'firebase';


/**
 * Generated class for the PwdcheckPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pwdcheck',
  templateUrl: 'pwdcheck.html',
})
export class PwdcheckPage {
  loginForm: FormGroup;
  loading: Loading;
  emailcheck;
  email = '';
  user;
  constructor(public navCtrl: NavController, public auth: AuthProvider, public formBuilder: FormBuilder,
    public alertCtrl: AlertController, public loadingCtrl: LoadingController, public storage: Storage,   public events: Events) {
    this.loginForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(8), PasswordValidator.isValid])]
    });
    this.user = firebase.auth().currentUser;
    events.subscribe('user:created', (user, time) => {
      // user and time are the same arguments passed in `events.publish(user, time)`
      this.emailcheck = user.email;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PwdcheckPage');
    this.createUser();
  }

  checkpwd() {
    if (!this.loginForm.valid){
      let alert = this.alertCtrl.create({
        title: '로그인 오류',
        message: '이메일 주소와 비밀번호의 형식이<br>올바르지 않습니다. 다시 확인해주세요!',
        buttons: [
          {
            text: '확인',
            role: 'cancel'
          }
        ]
      });
      alert.present();
    } else if(this.email != this.emailcheck){
      let alert = this.alertCtrl.create({
        title: '로그인 오류',
        message: '이메일 주소 또는 비밀번호가 올바르지 않습니다. 다시 확인해주세요!',
        buttons: [
          {
            text: '확인',
            role: 'cancel'
          }
        ]
      });
      alert.present();
    } else {
      this.auth.loginUser(this.loginForm.value.email, this.loginForm.value.password).then((authData) => {
        this.storage.set('localcred', {
          email: this.loginForm.value.email,
          password: this.loginForm.value.password
        });
        this.navCtrl.push('PwdchangePage', {email : this.loginForm.value.email});
      }, (error) => { 
        var message;
        if (error.code == 'auth/wrong-password') {
          message = '비밀번호가 맞지 않습니다.<br>다시 확인해주세요!';
        } else if (error.code == 'auth/user-not-found') {
          message = '등록되지 않은 이메일 주소입니다.<br>다시 확인해주세요!';
        } else {
          message = error.message;
          console.log('error msg' + message);
        }
        this.loading.dismiss().then(() => {
          let alert = this.alertCtrl.create({
            title: '로그인 오류',
            message: message,
            buttons: [
              {
                text: '확인',
                role: 'cancel'
              }
            ]
          });
          alert.present();
        });
      });
      this.loading = this.loadingCtrl.create({
        dismissOnPageChange: true
      });
      this.loading.present();
    }
  }

  createUser() {
    this.events.publish('user:created', this.user, Date.now());
  }
}
