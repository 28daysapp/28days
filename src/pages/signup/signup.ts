import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, Loading, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth';
import { UserProvider } from '../../providers/user/user';
import { EmailValidator } from '../../validators/email';
import { PasswordValidator } from '../../validators/password';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  signupForm: FormGroup;
  loading: Loading;
  usernameAvailable: boolean;
  clickmale = false;
  clickfemale = false;
  clickEtc = false;
  clickterms1 = false;
  clickterms2 = false;

  
  gender = '';
  constructor(public navCtrl: NavController, public auth: AuthProvider, public user: UserProvider,
    public formBuilder: FormBuilder, public loadingCtrl: LoadingController, public alertCtrl: AlertController,
    public storage: Storage) {
    this.signupForm = formBuilder.group({
    	name: ['', Validators.compose([Validators.required, Validators.maxLength(8)])],
      email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
  		password: ['', Validators.compose([Validators.required, Validators.minLength(8), PasswordValidator.isValid])]
    });

  }

  signupUser(){
    if (!this.signupForm.valid || !this.usernameAvailable) {
      let alert = this.alertCtrl.create({
        title: '회원가입 오류',
        message: '모든 항목을 모두 입력하였는지 확인하여 주시고 각 항목의 형식을 지켜주세요!',
        buttons: [
          {
            text: '확인',
            role: 'cancel'
          }
        ]
      });
      alert.present();
    } 

    else {
      this.auth.signupUser(this.signupForm.value.email, this.signupForm.value.password).then(() => {
      	this.user.updateUserprofile(this.signupForm.value.email, this.signupForm.value.name).then(() => {
          this.storage.set('localcred', {
            email: this.signupForm.value.email,
            password: this.signupForm.value.password
          });
          this.navCtrl.setRoot('TabsPage');
        });
      }, (error) => {
        var message;
        if (error.code == 'auth/email-already-in-use') {
          message = '이미 등록된 이메일 주소입니다.<br>다시 확인해주세요!';
        } else {
          message = error.message;
        }
        this.loading.dismiss().then(() => {
          let alert = this.alertCtrl.create({
            title: '회원가입 오류',
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
        dismissOnPageChange: true,
      });
      this.loading.present();
    }
  }

  signIn() {
    this.navCtrl.push('LoginPage');
  }

  isSameUsername() {
    if (this.signupForm.value.name.length > 0) {
      this.user.isSameUsername(this.signupForm.value.name).then((snapshot) => {
        this.usernameAvailable = !snapshot.exists();
      });
    }
  }

}
