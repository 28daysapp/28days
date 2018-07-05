import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CommunitycommentProvider } from '../../providers/communitycomment/communitycomment';
/**
 * Generated class for the CommentpopoverPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-commentpopover',
  templateUrl: 'commentpopover.html',
})
export class CommentpopoverPage {
  item;
  constructor(public navCtrl: NavController, public navParams: NavParams,  public comment: CommunitycommentProvider) {
    
  }

  commentdelete(item){
     //this.comment.deletecomment(item);
   }
 
   commentfix(){
     //this.navCtrl.push('CommunityfixPage');
   }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CommentpopoverPage');
  }

}
