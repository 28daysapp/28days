import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, Loading, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth';
import { EmailValidator } from '../../validators/email';
import { PasswordValidator } from '../../validators/password';
import { Storage } from '@ionic/storage';

// import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  loginForm: FormGroup;
  loading: Loading;
  constructor(public navCtrl: NavController, public auth: AuthProvider, public formBuilder: FormBuilder,
    public alertCtrl: AlertController, public loadingCtrl: LoadingController, public storage: Storage/* , private fb: Facebook */) {
    this.loginForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(8), PasswordValidator.isValid])]
    });
  }

  /* ------- Facebook Login Function - Needs Check and Testing --------- */

  // signinFacebook()
  // {
  //   // Login with permissions
  //   this.fb.login(['public_profile', 'user_photos', 'email', 'user_birthday'])
  //   .then( (res: FacebookLoginResponse) => {
      
  //       console.log("Facebook Function Accessed!");

  //       // The connection was successful
  //       if(res.status == "connected") {
  //           console.log("Facebook Login Connected!");
            
  //           // Get user ID and Token
  //           var fb_id = res.authResponse.userID;
  //           var fb_token = res.authResponse.accessToken;

  //           console.log(fb_id, fb_token);

  //           // Get user infos from the API
  //           this.fb.api("/me?fields=name,gender,birthday,email", []).then((user) => {

  //               // Get the connected user details
  //               var gender    = user.gender;
  //               var birthday  = user.birthday;
  //               var name      = user.name;
  //               var email     = user.email;

  //               console.log("=== USER INFOS ===");
  //               console.log("Gender : " + gender);
  //               console.log("Birthday : " + birthday);
  //               console.log("Name : " + name);
  //               console.log("Email : " + email);

  //               // => Open user session and redirect to the next page
  //           });
  //       } 
  //       // An error occurred while loging-in
  //       else {
  //           console.log("An error occurred...");
  //       }
  //   })
  //   .catch((e) => {
  //       console.log('Error logging into Facebook', e);
  //   });
  // }

  signin() {
    if (!this.loginForm.valid){
      console.log(this.loginForm.value.email + '/' + this.loginForm.value.password);
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
    } else {
      this.auth.loginUser(this.loginForm.value.email, this.loginForm.value.password).then((authData) => {
        this.storage.set('localcred', {
          email: this.loginForm.value.email,
          password: this.loginForm.value.password
        });
        this.navCtrl.setRoot('TabsPage');
      }, (error) => {
        console.log(JSON.stringify(error));
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
      // this.loading.present();
    }
  }

  passwordreset() {
    this.navCtrl.push('PasswordresetPage');
  }
  
  signup() {
    this.navCtrl.push('SignupPage');
  }

}
