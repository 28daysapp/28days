import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { PostProvider } from '../../providers/post/post'

/**
 * Generated class for the PostPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-post',
  templateUrl: 'post.html',
})
export class PostPage {
  loading;
  posts;
	// posts = [
	// 	[this.Post('assets/post1.png', '약.. 계속 먹어야 하는 걸까요?'), this.Post('assets/post2.png', 'XX 상담소에 다녀왔어요.')],
	// 	[this.Post('assets/post3.png', '의사를 만날 때의사를 만날 때의사를 만날 때의사를 만날 때'), this.Post('assets/post4.png', '부작용은 어떤 것이 있을까?')],
	// 	[this.Post('assets/post5.png', '스트레스 다루기'), this.Post('assets/post1.png', '약.. 계속 먹어야 하는 걸까요?')],
	// 	[this.Post('assets/post2.png', 'XX 상담소에 다녀왔어요.'), this.Post('assets/post3.png', '의사를 만날 때')],
	// 	[this.Post('assets/post4.png', '부작용은 어떤 것이 있을까?')]
	// ];

  constructor(public navCtrl: NavController, public navParams: NavParams, public post: PostProvider, public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad - PostPage')
    // this.generatePosts();
    // title, imgsrc, body, writerimg, writername, writermajor
    this.loading = this.loadingCtrl.create();
    this.loading.present();
    this.post.getallposts().then((posts) => {
      this.posts = this.groupTwoPosts(posts);
      // this.content.scrollToTop(0);
      setTimeout(() => {
        this.loading.dismiss();
      }, 2000);
      console.log(JSON.stringify(this.posts));
    })
  }

  groupTwoPosts(posts) {
    var twoposts = [];
    var twopost = [];
    for (var i = 0; i < posts.length; i++) {
      twopost.push(posts[i]);
      if (i % 2 == 1) {
        twoposts.push(twopost);
        twopost = [];
      }
    }
    if (twopost.length > 0) {
      twoposts.push(twopost);
    }
    return twoposts;
  }

  Post(img, title) {
  	var post = new Object();
  	post['img'] = img;
  	post['title'] = title;
  	return post;
  }

  postdetail(post) {
    this.navCtrl.push('PostdetailPage', {post: post});
  }

  generatePosts() {
    this.post.uploadpost('약.. 계속 먹어야 하는 걸까요?', 'https://firebasestorage.googleapis.com/v0/b/days-fd14f.appspot.com/o/post%2Fpost1.png?alt=media&token=b1ba7274-43bd-4d7d-8752-4aeeffba9de3', `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.

      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.

      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`, 'https://firebasestorage.googleapis.com/v0/b/days-fd14f.appspot.com/o/post%2Fpostwriter.png?alt=media&token=7079ec90-2487-4d2e-bc5b-153175503ca5', 'Siena Shundi', 'Clinical Social Work / Therapist');
    this.post.uploadpost('XX 상담소에 다녀왔어요.', 'https://firebasestorage.googleapis.com/v0/b/days-fd14f.appspot.com/o/post%2Fpost2.png?alt=media&token=f9961ddb-1e4e-4260-b385-c7cb6b08e776', `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.

      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.

      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`, 'https://firebasestorage.googleapis.com/v0/b/days-fd14f.appspot.com/o/post%2Fpostwriter.png?alt=media&token=7079ec90-2487-4d2e-bc5b-153175503ca5', 'Siena Shundi', 'Clinical Social Work / Therapist');
    this.post.uploadpost('약.. 계속 먹어야 하는 걸까요?', 'https://firebasestorage.googleapis.com/v0/b/days-fd14f.appspot.com/o/post%2Fpost1.png?alt=media&token=b1ba7274-43bd-4d7d-8752-4aeeffba9de3', `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.

      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.

      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`, 'https://firebasestorage.googleapis.com/v0/b/days-fd14f.appspot.com/o/post%2Fpostwriter.png?alt=media&token=7079ec90-2487-4d2e-bc5b-153175503ca5', 'Siena Shundi', 'Clinical Social Work / Therapist');
    this.post.uploadpost('XX 상담소에 다녀왔어요.', 'https://firebasestorage.googleapis.com/v0/b/days-fd14f.appspot.com/o/post%2Fpost2.png?alt=media&token=f9961ddb-1e4e-4260-b385-c7cb6b08e776', `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.

      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.

      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`, 'https://firebasestorage.googleapis.com/v0/b/days-fd14f.appspot.com/o/post%2Fpostwriter.png?alt=media&token=7079ec90-2487-4d2e-bc5b-153175503ca5', 'Siena Shundi', 'Clinical Social Work / Therapist');
    this.post.uploadpost('약.. 계속 먹어야 하는 걸까요?', 'https://firebasestorage.googleapis.com/v0/b/days-fd14f.appspot.com/o/post%2Fpost1.png?alt=media&token=b1ba7274-43bd-4d7d-8752-4aeeffba9de3', `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.

      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.

      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`, 'https://firebasestorage.googleapis.com/v0/b/days-fd14f.appspot.com/o/post%2Fpostwriter.png?alt=media&token=7079ec90-2487-4d2e-bc5b-153175503ca5', 'Siena Shundi', 'Clinical Social Work / Therapist');
    this.post.uploadpost('XX 상담소에 다녀왔어요.', 'https://firebasestorage.googleapis.com/v0/b/days-fd14f.appspot.com/o/post%2Fpost2.png?alt=media&token=f9961ddb-1e4e-4260-b385-c7cb6b08e776', `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.

      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.

      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`, 'https://firebasestorage.googleapis.com/v0/b/days-fd14f.appspot.com/o/post%2Fpostwriter.png?alt=media&token=7079ec90-2487-4d2e-bc5b-153175503ca5', 'Siena Shundi', 'Clinical Social Work / Therapist');
    this.post.uploadpost('약.. 계속 먹어야 하는 걸까요?', 'https://firebasestorage.googleapis.com/v0/b/days-fd14f.appspot.com/o/post%2Fpost1.png?alt=media&token=b1ba7274-43bd-4d7d-8752-4aeeffba9de3', `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.

      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.

      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`, 'https://firebasestorage.googleapis.com/v0/b/days-fd14f.appspot.com/o/post%2Fpostwriter.png?alt=media&token=7079ec90-2487-4d2e-bc5b-153175503ca5', 'Siena Shundi', 'Clinical Social Work / Therapist');
    this.post.uploadpost('XX 상담소에 다녀왔어요.', 'https://firebasestorage.googleapis.com/v0/b/days-fd14f.appspot.com/o/post%2Fpost2.png?alt=media&token=f9961ddb-1e4e-4260-b385-c7cb6b08e776', `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.

      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.

      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`, 'https://firebasestorage.googleapis.com/v0/b/days-fd14f.appspot.com/o/post%2Fpostwriter.png?alt=media&token=7079ec90-2487-4d2e-bc5b-153175503ca5', 'Siena Shundi', 'Clinical Social Work / Therapist');
    this.post.uploadpost('약.. 계속 먹어야 하는 걸까요?', 'https://firebasestorage.googleapis.com/v0/b/days-fd14f.appspot.com/o/post%2Fpost1.png?alt=media&token=b1ba7274-43bd-4d7d-8752-4aeeffba9de3', `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.

      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.

      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`, 'https://firebasestorage.googleapis.com/v0/b/days-fd14f.appspot.com/o/post%2Fpostwriter.png?alt=media&token=7079ec90-2487-4d2e-bc5b-153175503ca5', 'Siena Shundi', 'Clinical Social Work / Therapist');
  }

}
