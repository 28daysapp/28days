import { Component, AfterViewChecked, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, Content, TextInput } from 'ionic-angular';
import { ChatProvider } from '../../providers/chat/chat';
import { FcmProvider } from '../../providers/fcm/fcm';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

/**
 * Generated class for the SupporterchatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-supporterchat',
  templateUrl: 'supporterchat.html'
})
export class SupporterchatPage implements AfterViewChecked {
  @ViewChild('content') content: Content;
  @ViewChild('focusInput') myInput : TextInput;
  inputForm: FormGroup;
  buddy;
  gogomessages;
  chatmessages;
  inputMessage: any;
  showinput = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public chat: ChatProvider,
  	public events: Events, public zone: NgZone, public formBuilder: FormBuilder, public keyboard: Keyboard, public fcmProvider: FcmProvider) {
    console.log('SupporterchatPage - constructor');
    this.buddy = this.chat.buddy;
    console.log(this.buddy.username);
    this.events.subscribe('newmessage', () => {
      this.chatmessages = [];
      this.zone.run(() => {
        this.chatmessages = this.chat.chatmessages;
      });
    });
    this.inputForm = formBuilder.group({
      txt: ['', Validators.required]
    });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    this.content.scrollToBottom(0);
  }

  ionViewDidLoad() {
    console.log('SupporterchatPage - ionViewDidLoad');
    this.chat.checkstart().then((isstart) => {

      // this.fcmProvider.storeBuddyToken(this.buddy)
      // this.fcmProvider.storeBothTokens(this.buddy);

      if (isstart) {
        this.gogomessages = [];
        this.gogomsg('서포터에게 채팅을 요청했어!\n확인 후 Push 알림을 줄 거야~!', true).then(() => {
          this.gogomsg('요즘 가장 해결하고 싶은 고민이 뭐야? 어떤 것 때문에 요청을 하게 됐니?\n얘기해줄 수 있어?', false).then(() => {
            this.gogomsg('서포터에게 알려주면 좀 더 편하게 얘기를 할 수 있을 것 같아서~', false).then(() => {
              setTimeout(() => {
                this.showinput = true;
                this.chat.getallmessages();
              }, 500);
            });
          });
        });
      } else {
        this.gogomessages = [
          this.createmsg(true, '서포터에게 채팅을 요청했어!\n확인 후 Push 알림을 줄 거야~!', true),
          this.createmsg(false, '요즘 가장 해결하고 싶은 고민이 뭐야? 어떤 것 때문에 요청을 하게 됐니?\n얘기해줄 수 있어?', true),
          this.createmsg(false, '서포터에게 알려주면 좀 더 편하게 얘기를 할 수 있을 것 같아서~', true)
        ];
        this.showinput = true;
        this.chat.getallmessages();
      }
    });
    // this.chat.getallmessages();
  }

  activateFirebaseFunction() {
    // this.fcmProvider.sendNotification();

  }

  ionViewWillLeave() {
    this.events.unsubscribe('newmessage');
    this.chat.stoplistenmessages();
  }

  // subscribeToNotifications() {
  //   this.fcmProvider.firebaseMessaging.requestPermission()
  //     .then(() => this.fcmProvider.handleTokenRefresh())
  //     .catch((err) => {
  //       console.log("Error getting permission :(");
  //     });
  // }

  sendmessage() {
    if (this.inputMessage) {
      var txt = this.inputMessage;
      this.inputMessage = '';
      this.myInput.setFocus();
      
        
      
      if (txt == 'pay') {
        this.payMembership();
      } else {
        this.chat.sendmessage(txt);
      }
    }
  }

  createmsg(showimage, message, setblack) {
    return {
      showimage: showimage,
      message: message,
      setblack: setblack
    };
  }

  gogomsg(text, showimage) {
    var promise = new Promise((resolve) => {
      var msg = this.createmsg(showimage, '메시지를 입력 중입니다.', false);
      this.gogomessages.push(msg);
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

  payMembership() {
    this.navCtrl.push('PaymentPage', {
      itemName: "무제한 서포터",
      itemPrice: "9,900"
    });
  }

}
