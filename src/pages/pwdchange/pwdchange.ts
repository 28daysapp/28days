import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, Loading, AlertController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth';
import { UserProvider } from '../../providers/user/user';
import { EmailValidator } from '../../validators/email';
import { matchOtherValidator } from '../../validators/match-other-validator';
import { PasswordValidator } from '../../validators/password';
import { Storage } from '@ionic/storage';
import firebase from 'firebase';

/**
 * Generated class for the PwdchangePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pwdchange',
  templateUrl: 'pwdchange.html',
})
export class PwdchangePage {
  loginForm: FormGroup;
  loading: Loading;
  usernameAvailable: boolean;
  clickmale = false;
  clickfemale = false;
  gender = '';
  password = this.password;
  confirmation = this.confirmation;
  email = this.email;

  constructor(public navCtrl: NavController, public auth: AuthProvider, public user: UserProvider,
    public formBuilder: FormBuilder, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public storage: Storage, public navParams: NavParams) {
    this.loginForm = formBuilder.group({
      name: ['', Validators.compose([Validators.required, Validators.maxLength(8)])],
      email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
  		password: ['', Validators.compose([Validators.required, Validators.minLength(8), PasswordValidator.isValid])],
    	passwordconfirm: ['', Validators.compose([Validators.required, matchOtherValidator('password')])],
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PwdchangePage');
  }

  changepwd(password) {
    var user = firebase.auth().currentUser;
    //var newPassword = getASecureRandomPassword();
    if (this.password != this.confirmation){
      //console.log(this.loginForm.value.email + '/' + this.loginForm.value.password);
      let alert = this.alertCtrl.create({
        title: '오류',
        message: '비밀번호가 같지 않습니다. <br> 다시 확인해주세요!',
        buttons: [
          {
            text: '확인',
            role: 'cancel'
          }
        ]
      });
      alert.present();
    }
    else{
      console.log(this.password);
      user.updatePassword(password).then(function() {

      }).catch(function(error){

      });
      let alert = this.alertCtrl.create({
        title: '변경 완료',
        message: '다시 로그인해주시기 바랍니다.',
        buttons: [
          {
            text: '확인',
            handler: () => {
              // log out from firebase auth service and remove previous cache about user credential
              this.auth.logoutUser().then(() => {
                this.storage.remove('localcred').then(() => {
                  this.navCtrl.push('TabsPage');
                });
              });
            }
          },
        ]
      });
      alert.present();
    }
  }
}