import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  LoadingController,
  Loading,
  AlertController
} from "ionic-angular";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthProvider } from "../../providers/auth/auth";
import { EmailValidator } from "../../validators/email";
import { PasswordValidator } from "../../validators/password";
import { Storage } from "@ionic/storage";

@IonicPage()
@Component({
  selector: "page-login",
  templateUrl: "login.html"
})
export class LoginPage {
  loginForm: FormGroup;
  loading: Loading;
  constructor(
    public navCtrl: NavController,
    public auth: AuthProvider,
    public formBuilder: FormBuilder,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public storage: Storage
  ) {
    this.loginForm = formBuilder.group({
      email: [
        "",
        Validators.compose([Validators.required, EmailValidator.isValid])
      ],
      password: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(8),
          PasswordValidator.isValid
        ])
      ]
    });
  }

  signin() {
    if (!this.loginForm.valid) {
      console.log(
        this.loginForm.value.email + "/" + this.loginForm.value.password
      );
      let alert = this.alertCtrl.create({
        title: "로그인 오류",
        message:
          "이메일 주소와 비밀번호의 형식이<br>올바르지 않습니다. 다시 확인해주세요!",
        buttons: [
          {
            text: "확인",
            role: "cancel"
          }
        ]
      });
      alert.present();
    } else {
      this.auth
        .loginUser(this.loginForm.value.email, this.loginForm.value.password)
        .then(
          authData => {
            this.storage.set("localcred", {
              email: this.loginForm.value.email,
              password: this.loginForm.value.password
            });
            this.navCtrl.setRoot("TabsPage");
          },
          error => {
            console.log(JSON.stringify(error));
            var message;
            if (error.code == "auth/wrong-password") {
              message = "비밀번호가 맞지 않습니다.<br>다시 확인해주세요!";
            } else if (error.code == "auth/user-not-found") {
              message =
                "등록되지 않은 이메일 주소입니다.<br>다시 확인해주세요!";
            } else {
              message = error.message;
              console.log("error msg" + message);
            }
            this.loading.dismiss().then(() => {
              let alert = this.alertCtrl.create({
                title: "로그인 오류",
                message: message,
                buttons: [
                  {
                    text: "확인",
                    role: "cancel"
                  }
                ]
              });
              alert.present();
            });
          }
        );
      this.loading = this.loadingCtrl.create({
        dismissOnPageChange: true
      });
      // this.loading.present();
    }
  }

  passwordreset() {
    this.navCtrl.push("PasswordresetPage");
  }

  signup() {
    this.navCtrl.push("SignupPage");
  }
}
