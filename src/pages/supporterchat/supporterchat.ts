import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, Content, TextInput } from 'ionic-angular';
import { ChatProvider } from '../../providers/chat/chat';
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
export class SupporterchatPage {

  @ViewChild('content') content: Content;
  @ViewChild('focusInput') myInput : TextInput;

  inputForm: FormGroup;
  buddy;
  gogomessages;
  chatmessages;
  inputMessage: any;
  showinput = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public chat: ChatProvider,
  	public events: Events, public zone: NgZone, public formBuilder: FormBuilder) {
    console.log('SupporterchatPage - constructor');
    this.buddy = this.chat.buddy;

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

  ionViewDidEnter() {
    this.scrollToBottom();
    this.chat.clearCount(this.buddy);
  }

  scrollToBottom() {
    this.content.scrollToBottom(0);
  }

  ionViewDidLoad() {
    console.log('SupporterchatPage - ionViewDidLoad');
    this.scrollToBottom();
    this.chat.checkZeroCount();

    this.chat.checkstart().then((isstart) => {

      if (isstart) {
        this.showinput = true;
        this.chat.getAllMessages();
      } else {

        this.showinput = true;
        this.chat.getAllMessages();
      }
    });
  }

  ionViewWillLeave() {
    this.events.unsubscribe('newmessage');
    this.chat.stoplistenmessages();
    this.chat.clearCount(this.buddy);
  }

  sendMessage() {
    if (this.inputMessage) {
      var txt = this.inputMessage;
      this.inputMessage = '';
      this.myInput.setFocus();
      if (txt == 'pay') {
        this.payMembership();
      } else {
        this.chat.sendMessage(txt);
      }
    }
    this.scrollToBottom();

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
