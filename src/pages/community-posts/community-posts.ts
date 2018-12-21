import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  AlertController,
  NavParams,
  ActionSheetController
} from "ionic-angular";

import { CommunityProvider } from "../../providers/community/community";
import { NotificationProvider } from "../../providers/notification/notification";
import { ReportProvider } from "../../providers/report/report";
import { UserProvider } from "../../providers/user/user";

@IonicPage()
@Component({
  selector: "page-community-posts",
  templateUrl: "community-posts.html"
})
export class CommunityPostsPage {
  communityInfo: any;
  posts: any;
  anonymity: boolean;
  alreadyJoined: boolean = false;
  currentUserUid: String = this.userProvider.readCurrentUser().uid;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public actionSheetCtrl: ActionSheetController,
    public communityProvider: CommunityProvider,
    public notificationProvider: NotificationProvider,
    public reportProvider: ReportProvider,
    public userProvider: UserProvider
  ) {
    this.communityInfo = this.navParams.get("payload");
  }

  ionViewWillEnter() {
    this.getCommunityPosts(this.communityInfo.communityName);
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad CommunityPostsPage");
  }

  ionViewWillLoad() {
    this.checkIfJoinedCommunity();
  }

  getCommunityPosts(communityName) {
    this.communityProvider.readCommunityPosts(communityName).then(posts => {
      this.posts = posts;
    });
  }

  toCommunityWrite(communityInfo) {
    this.navCtrl.push("CommunityWritePage", {
      communityInfo: communityInfo
    });
  }

  async pressedLikeButton(post) {
    const postId = post.postId;
    const writerUid = post.uid;
    const communityName = post.communityName;

    const notificationParameter = {
      readerType: {
        type: "게시물",
        uid: postId
      },
      creatorType: "좋아요",
      readerUid: writerUid
    };

    await this.communityProvider.likePost(communityName, postId);
    await this.getCommunityPosts(this.communityInfo.communityName);
    await this.notificationProvider.createNotification(notificationParameter);
  }

  toComments(post) {
    this.navCtrl.push("CommunityCommentPage", {
      community: this.communityInfo,
      post: post
    });
  }

  async joinCommunity() {
    const communityName = this.communityInfo.communityName;

    await this.communityProvider.joinCommunity(communityName);
    await this.userProvider.createCommunityMembership(communityName);
    await this.checkIfJoinedCommunity();
    await this.getCommunityPosts(this.communityInfo.communityName);

    const alert = this.alertCtrl.create({
      title: "멤버가 된 걸 축하해요!",
      message: "좋은 사람들과 만났으면 좋겠어요!"
    });

    alert.present();
    setTimeout(() => {
      alert.dismiss();
    }, 1500);
  }

  async leaveCommunity() {
    const communityName = this.communityInfo.communityName.trim();

    await this.communityProvider.leaveCommunity(communityName);
    await this.userProvider.deleteCommunityMembership(communityName);
    await this.checkIfJoinedCommunity();
    await this.getCommunityPosts(this.communityInfo.communityName);
  }

  checkIfJoinedCommunity() {
    this.userProvider
      .readJoinedCommunities(this.currentUserUid)
      .then(joinedCommunities => {
        for (let i in joinedCommunities) {
          if (
            this.communityInfo.communityName.includes(
              joinedCommunities[i].communityName
            )
          ) {
            this.alreadyJoined = true;
            return;
          } else {
            this.alreadyJoined = false;
          }
        }
      });
  }

  presentConfirm() {
    const alert = this.alertCtrl.create({
      title: "커뮤니티 탈퇴",
      message: "정말 나갈거에요??",
      buttons: [
        {
          text: "응 이제 안녕이야",
          role: "cancel",
          handler: () => {
            this.leaveCommunity();
          }
        },
        {
          text: "아냐 남을래!",
          handler: () => {}
        }
      ]
    });
    alert.present();
  }

  presentActionSheet(post) {
    const postWriterUid = post.uid;
    let actionSheet;

    if (this.userProvider.isSameUser(this.currentUserUid, postWriterUid)) {
      actionSheet = this.actionSheetCtrl.create({
        buttons: [
          {
            text: "댓글 달기",
            handler: () => {
              this.navCtrl.push("CommunityCommentPage", {
                community: this.communityInfo,
                post: post
              });
            }
          },
          {
            text: "글 삭제",
            role: "destructive",
            handler: () => {
              this.communityProvider.deleteCommunityPost(post).then(() => {
                this.communityProvider.deleteMyPost(post);
                this.getCommunityPosts(this.communityInfo.communityName);
              });
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
      actionSheet = this.actionSheetCtrl.create({
        buttons: [
          {
            text: "댓글 달기",
            handler: () => {
              this.navCtrl.push("CommunityCommentPage", { post: post });
            }
          },
          {
            text: "신고",
            role: "destructive",
            handler: () => {
              this.reportProvider.reportPost(
                this.communityInfo.communityName,
                post.postId
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
    actionSheet.present();
  }

  postWriteAlert() {
    const alert = this.alertCtrl.create({
      title: "커뮤니티에 가입한 후 글을 작성할 수 있어요!",
      buttons: [
        {
          text: "확인"
        }
      ]
    });
    alert.present();
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

  doRefresh(refresher) {
    this.getCommunityPosts(this.communityInfo.communityName);

    setTimeout(() => {
      refresher.complete();
    }, 700);
  }

  navigateToPage(page, uid) {
    this.navCtrl.push(page, { uid });
  }
}
