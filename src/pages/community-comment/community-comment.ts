import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommentProvider } from '../../providers/comment/comment';
import { UserProvider } from '../../providers/user/user';

@IonicPage()
@Component({
  selector: 'page-community-comment',
  templateUrl: 'community-comment.html',
})
export class CommunityCommentPage {

  commentForm: FormGroup;
  post;
  comments;
  currentUser;

  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder, public commentProvider: CommentProvider,
    public userProvider: UserProvider, public actionSheetCtrl: ActionSheetController) {
    this.commentForm = this.formBuilder.group({
      commentInput: ['', Validators.required]
    });
    this.currentUser = this.userProvider.getUserprofile;
    this.post = this.navParams.get('post');

  }

  ionViewWillEnter() {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CommunityCommentPage');
    this.getCommunityComments();
  }

  writeComment(){
      try {
        const comment = this.commentForm.value.commentInput;
        this.commentForm.reset();
        this.commentProvider.createCommunityComment(this.post, comment).then(()=>{
          this.getCommunityComments();
        });
      } catch(error) {
        console.log(error)
      }
  }

  getCommunityComments(){
    this.commentProvider.readCommunityComment(this.post).then((comments)=>{
      this.comments = comments;
      console.log(this.comments)
    });
  }

  presentActionSheet(post) {
    const postWriterUid = post.uid;
    let actionSheet;

    if (this.userProvider.checkUser(this.currentUser.uid, postWriterUid)) {
      actionSheet = this.actionSheetCtrl.create({
        buttons: [
          {
            text: '글 삭제',
            role: 'destructive',
            handler: () => {
              console.log('Destructive clicked');
            }
          },
          {
            text: '댓글 달기',
            handler: () => {
              console.log('댓글달기 clicked');
              this.navCtrl.push('CommunitycommentPage');
            }
          },
          {
            text: '닫기',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          }
        ]
      });
    } else {
      actionSheet = this.actionSheetCtrl.create({
        buttons: [
          {
            text: '댓글 달기',
            handler: () => {
              console.log('댓글달기 clicked');
              this.navCtrl.push('CommunityCommentPage', { post: post });
            }
          },
          {
            text: '닫기',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          }
        ]
      });
    }
    actionSheet.present();
  }

  navigateToPage(page, uid) {
    this.navCtrl.push(page, {uid})
  }

}
