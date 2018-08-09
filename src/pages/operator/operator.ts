import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SupporterProvider } from '../../providers/supporter/supporter'
import { UserProvider } from '../../providers/user/user'
import { OperatorProvider } from '../../providers/operator/operator'
import firebase from 'firebase';

/**
 * Generated class for the OperatorPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-operator',
  templateUrl: 'operator.html',
})
export class OperatorPage {
  list;
  constructor(public navCtrl: NavController, public navParams: NavParams, public user: UserProvider,
  public operator: OperatorProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OperatorPage');
  }

  getalluser(){
    this.list = [];
    this.user.getallUserprofiles().then((users) => {
      this.list = users;
    });
  }

  changeTypeGeneral(user){
    this.operator.addgeneral(user);
  }
  changeTypeSupporter(user){
    this.operator.addsuporter(user);
  }

  changeTypeCounselor(user){
    this.operator.addcounselor(user);
  }
  changeTypeOperator(user){
    this.operator.addoperator(user);
  }
}
