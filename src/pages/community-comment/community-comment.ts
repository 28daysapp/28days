import { Component } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

import {
  IonicPage,
  NavController,
  NavParams,
  ActionSheetController,
  AlertController
} from "ionic-angular";

import { CommentProvider } from "../../providers/comment/comment";
import { ReportProvider } from "../../providers/report/report";
import { UserProvider } from "../../providers/user/user";

@IonicPage()
@Component({
  selector: "page-community-comment",
  templateUrl: "community-comment.html"
})
export class CommunityCommentPage {
  commentForm: FormGroup;
  community: any;
  post: any;
  comments: any = [];
  currentUser: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public formBuilder: FormBuilder,
    public actionSheetCtrl: ActionSheetController,
    public commentProvider: CommentProvider,
    public reportProvider: ReportProvider,
    public userProvider: UserProvider
  ) {
    this.commentForm = this.formBuilder.group({
      commentInput: ["", Validators.required]
    });
    this.currentUser = this.userProvider.readCurrentUser();
    this.community = this.navParams.get("community");
    this.post = this.navParams.get("post");
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad CommunityCommentPage");
    this.initializeComments();
  }

  async initializeComments() {
    await this.commentProvider.initializePost(this.post);
    await this.getCommunityComments();
  }

  async writeComment() {
    try {
      const comment = await this.commentForm.value.commentInput;
      await this.commentForm.reset();
      await this.commentProvider.createCommunityComment(comment);
      await this.updateCommentCount();
      await this.getCommunityComments();
    } catch (error) {
      console.log(error);
    }
  }

  getCommunityComments() {
    try {
      this.commentProvider.readCommunityComment(this.post).then(comments => {
        this.comments = comments;
      });
    } catch (error) {
      console.log(error);
    }
  }

  async updateCommentCount() {
    const commentCount = await this.commentProvider.countComments(this.post);
    await this.commentProvider.updateCommentCount(
      this.community.communityName,
      commentCount
    );
  }

  async presentActionSheet(comment) {
    const commentWriterUid = comment.uid;
    let actionSheet;

    if (
      await this.userProvider.isSameUser(this.currentUser.uid, commentWriterUid)
    ) {
      actionSheet = await this.actionSheetCtrl.create({
        buttons: [
          {
            text: "글 삭제",
            role: "destructive",
            handler: async () => {
              await this.commentProvider.deleteCommunityComment(
                this.post.postId,
                comment.commentId
              );
              await this.updateCommentCount();
              await this.getCommunityComments();
            }
          },
          {
            text: "닫기",
            role: "cancel",
            handler: () => {}
          }
        ]
      });
    } else {
      actionSheet = await this.actionSheetCtrl.create({
        buttons: [
          {
            text: "신고",
            role: "destructive",
            handler: () => {
              this.reportProvider.reportComment(
                this.post.postId,
                comment.commentId
              );
              this.reportCompletionAlert();
            }
          },
          {
            text: "닫기",
            role: "cancel",
            handler: () => {}
          }
        ]
      });
    }
    await actionSheet.present();
  }

  reportCompletionAlert() {
    const alert = this.alertCtrl.create({
      title: "신고가 완료되었습니다",
      buttons: [
        {
          text: "확인"
        }
      ]
    });
    alert.present();
  }

  navigateToPage(page, uid) {
    this.navCtrl.push(page, { uid });
  }
}
