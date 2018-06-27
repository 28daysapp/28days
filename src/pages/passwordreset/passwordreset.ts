import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth';
import { EmailValidator } from '../../validators/email';

/**
 * Generated class for the PasswordresetPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-passwordreset',
  templateUrl: 'passwordreset.html',
})
export class PasswordresetPage {
	resetPasswordForm: FormGroup;
  constructor(public navCtrl: NavController, public auth: AuthProvider, public formBuilder: FormBuilder,
    public alertCtrl: AlertController) {
	  this.resetPasswordForm = formBuilder.group({
	    email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
	  })
	}

  resetpassword(){
    if (!this.resetPasswordForm.valid){
      console.log(this.resetPasswordForm.value.email);
      let alert = this.alertCtrl.create({
        title: '이메일 주소',
        message: '이메일 주소의 형식이<br>올바르지 않습니다. 다시 확인해주세요!',
        buttons: [
          {
            text: '확인',
            role: 'cancel'
          }
        ]
      });
      alert.present();
    } else {
      this.auth.resetPassword(this.resetPasswordForm.value.email).then((user) => {
        let alert = this.alertCtrl.create({
          title: '비밀번호 재설정 링크 발송 완료!',
          message: "기입하신 이메일로 비밀번호 재설정 링크를<br>보냈어요. 이메일을 확인해주세요.",
          buttons: [
            {
              text: '확인',
              role: 'cancel',
              handler: () => {
                this.navCtrl.pop();
              }
            }
          ]
        });
        alert.present();
      }, (error) => {
        console.log(JSON.stringify(error));
        var message;
        if (error.code == 'auth/user-not-found') {
          message = '등록되지 않은 이메일 주소입니다.<br>다시 확인해주세요!';
        } else {
          message = error.message;
        }
        let errorAlert = this.alertCtrl.create({
          title: '이메일 주소',
          message: message,
          buttons: [
            {
              text: '확인',
              role: 'cancel'
            }
          ]
        });
        errorAlert.present();
      });
    }
  }

}
