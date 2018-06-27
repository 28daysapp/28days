import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommunitycommentProvider } from '../../providers/communitycomment/communitycomment';

/**
 * Generated class for the CommunitycommentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-communitycomment',
  templateUrl: 'communitycomment.html',
})
export class CommunitycommentPage {
	commentForm: FormGroup;
	subcommentForm: FormGroup;
	comments;
  list_showsubcomment = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public events: Events,
  	public zone: NgZone, public cocomment: CommunitycommentProvider, public formBuilder: FormBuilder) {
    // this event is published when any changes related to firebase comment data happen in CommunitycommentProvider
  	this.events.subscribe('community-newcomment', () => {
      this.comments = [];
      this.zone.run(() => {
        this.comments = this.cocomment.comments;
        this.setshowsubcomment(this.comments);
      });
    });

    // set validator for comment input form and subcomment input form
    // text must be required
    this.commentForm = formBuilder.group({
      txt: ['', Validators.required]
    });
    this.subcommentForm = formBuilder.group({
      txt: ['', Validators.required]
    });
  }

  ionViewDidLoad() {
    this.cocomment.getallcomments();
  }

  ionViewWillLeave(){
    console.log('ionViewWillLeave - Communitycomment');
    this.events.unsubscribe('community-newcomment');
    this.cocomment.stoplistencomments();
  }

  /* user writes comment and push enter button */
  writeComment() {
  	if (this.commentForm.valid) {
  		var txt = this.commentForm.value.txt;
  		this.commentForm.reset();
  		this.cocomment.uploadcomment(txt);
  	}
  }

  /* user clicks subcomment of a comment */
  showsubcomment(comment) {
    if (comment.showsubcomment) {
      comment.showsubcomment = false;
      // remove commentid from list of subcomments which were opened
      var index = this.list_showsubcomment.indexOf(comment.commentid);
      if (index > -1) {
        this.list_showsubcomment.splice(index, 1);
      }
    } else {
    	comment.showsubcomment = true;
      // push commentid to list of subcomments which were opened
      this.list_showsubcomment.push(comment.commentid);
    }
  }

  /* user writes subcomment and push enter button */
  writeSubcomment(comment) {
  	if (this.subcommentForm.valid) {
  		var txt = this.subcommentForm.value.txt;
  		this.subcommentForm.reset();
  		this.cocomment.uploadSubcomment(comment.commentid, txt);
  	}
  }

  // JSONtoArray(json) {
  // 	return Object.keys(json).map(function(k) { return json[k] });
  // }

  /* set previous state about whether subcomments were shown or not */
  setshowsubcomment(comments) {
    for (var i = 0; i < comments.length; i++) {
      if (this.list_showsubcomment.indexOf(comments[i].commentid) > -1) {
        comments[i].showsubcomment = true;
      }
    }
  }

}
