import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { MyProvider } from '../../providers/my/my'

/*
  Generated class for the CommunityProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CommunityProvider {

	firecommunity = firebase.database().ref('/community');
	firemypost = firebase.database().ref('/my/post');
	firelike = firebase.database().ref('/like');
	firestore = firebase.storage();
	firecomment = firebase.database().ref('/communitycomment');
	firereport = firebase.database().ref('/report');
	firetag = firebase.database().ref('/tag');
	user = firebase.database().ref('/users');
	taglist = [
		'우울',
		'불안',
		'초조',
		'트라우마',
		'학교폭력',
		'가정폭력'
	];
	title;
	posts;
	post;
	report;
	uids;
	tag;
	tags;
	limit: number = 0;
	cnt: number = 0;
	check: number = 0;
	mosttag1: number = 0;
	constructor(public my: MyProvider) {

	}

	/* community provider initializer */
	initializecom(order) {
		//this.title = this.titlelist[order];
		//this.namecom = this.namecomlist[order];
		this.posts = this.posts;
		//this.number = this.numberlist[order];
	}

	/* upload post to firebase */
	uploadPost(title, txt, dataURL, tag1, anonymity, photo) {
		var uid = firebase.auth().currentUser.uid;
		var promise = new Promise((resolve) => {
			var newPostRef = this.firecommunity.push();
			var time = firebase.database.ServerValue.TIMESTAMP;
			var postId = newPostRef.key;
			if(anonymity){
				console.log(anonymity);
			if (dataURL) {
				var imageStore1 = this.firestore.ref('/community/').child(postId);
				imageStore1.putString(dataURL, 'base64', { contentType: 'image/jpeg' }).then((savedImage) => {
					newPostRef.set({
						postid: postId,
						posttitle: title,
						uid: uid,
						username: firebase.auth().currentUser.displayName,
						text: txt,
						url: savedImage.downloadURL,
						timestamp: time,
						comment: 0,
						like: 0,
						report: 0,
						tag1: tag1,
						urlcheck: true,
						anonymity: true,
						photoURL: photo
					}).then(() => {
						this.my.addmypost(uid, postId, time).then(() => {
							resolve(true);
						}).then(() => {
							this.gettag(tag1).then((tags) => {
								this.tags = tags;
								if(this.tags == null){
									this.firetag.child(`${tag1}`).set({
										tag1: tag1,
										tagcnt: 1,
									}).then(() => {
										resolve(true);
									});
								}
								else{
									this.firetag.child(`${tag1}`).set({
										tag1: tag1,
										tagcnt: this.tags.tagcnt + 1
									}).then(() => {
										resolve(true);
									});
								}
							})
						})
					});
				});
			} else {
				newPostRef.set({
					postid: postId,
					posttitle: title,
					uid: uid,
					username: firebase.auth().currentUser.displayName,
					text: txt,
					url: null,
					timestamp: time,
					comment: 0,
					like: 0,
					report: 0,
					tag1: tag1,
					anonymity: true,
					photoURL: photo
				}).then(() => {
					this.my.addmypost(uid, postId, time).then(() => {
						resolve(true);
					})
				}).then(() => {
					this.gettag(tag1).then((tags) => {
						this.tags = tags;
						if(this.tags == null){
							this.firetag.child(`${tag1}`).set({
								tag1: tag1,
								tagcnt: 1,
							}).then(() => {
								resolve(true);
							});
						}
						else{
							this.firetag.child(`${tag1}`).set({
								tag1: tag1,
								tagcnt: this.tags.tagcnt + 1
							}).then(() => {
								resolve(true);
							});
						}
					})
				})
				}
			} else{
				console.log("else");
				if (dataURL) {
					var imageStore2 = this.firestore.ref('/community/').child(postId);
					imageStore2.putString(dataURL, 'base64', { contentType: 'image/jpeg' }).then((savedImage) => {
						newPostRef.set({
							postid: postId,
							posttitle: title,
							uid: uid,
							username: firebase.auth().currentUser.displayName,
							text: txt,
							url: savedImage.downloadURL,
							timestamp: time,
							comment: 0,
							like: 0,
							report: 0,
							tag1: tag1,
							urlcheck: true,
							anonymity: false,
							photoURL: photo
						}).then(() => {
							this.my.addmypost(uid, postId, time).then(() => {
								resolve(true);
							}).then(() => {
								this.gettag(tag1).then((tags) => {
									this.tags = tags;
									if(this.tags == null){
										this.firetag.child(`${tag1}`).set({
											tag1: tag1,
											tagcnt: 1,
										}).then(() => {
											resolve(true);
										});
									}
									else{
										this.firetag.child(`${tag1}`).set({
											tag1: tag1,
											tagcnt: this.tags.tagcnt + 1
										}).then(() => {
											resolve(true);
										});
									}
								})
							})
						});
					});
				} else {
					newPostRef.set({
						postid: postId,
						posttitle: title,
						uid: uid,
						username: firebase.auth().currentUser.displayName,
						text: txt,
						url: null,
						timestamp: time,
						comment: 0,
						like: 0,
						report: 0,
						tag1: tag1,
						anonymity: false,
						photoURL: photo
					}).then(() => {
						this.my.addmypost(uid, postId, time).then(() => {
							resolve(true);
						})
					}).then(() => {
						this.gettag(tag1).then((tags) => {
							this.tags = tags;
							if(this.tags == null){
								this.firetag.child(`${tag1}`).set({
									tag1: tag1,
									tagcnt: 1,
								}).then(() => {
									resolve(true);
								});
							}
							else{
								this.firetag.child(`${tag1}`).set({
									tag1: tag1,
									tagcnt: this.tags.tagcnt + 1
								}).then(() => {
									resolve(true);
								});
							}
						})
					})
					}
			}
			});
		return promise;
	}

	photo(){
		var uid = firebase.auth().currentUser.uid;
		var promise = new Promise((resolve) => {
			this.user.child('uid').equalTo(uid).once("value").then((snapshot) => {
				var myphoto = [];
				snapshot.forEach((childSnapshot) => {
					var photo = childSnapshot.val();

					myphoto.push(photo);
				});
				myphoto.reverse();
				resolve(myphoto);
			});
		});
		return promise;
	}

	mosttag(){
		this.check = 6;
		var promise = new Promise((resolve) => {
			this.firetag.orderByChild('tagcnt').limitToLast(this.check).once("value").then((snapshot) =>{
				var mosttag1 = [];
				snapshot.forEach((childSnapshot) => {
					var mosttags = childSnapshot.val();

					mosttag1.push(mosttags);
				});
				
				mosttag1.reverse();
				resolve(mosttag1);
			});
		});
		return promise;
	}

	tagcount(tag){
		var promise = new Promise((resolve) => {
			this.firetag.orderByChild('tag1').equalTo(tag).once("value").then((snapshot) =>{
				var mosttag1 = [];
				snapshot.forEach((childSnapshot) => {
					var mosttags = childSnapshot.val();

					mosttag1.push(mosttags);
				});
				
				mosttag1.reverse();
				resolve(mosttag1);
			});
		});
		return promise;
	}

	updatePost(title, text) {
		var promise = new Promise((resolve) => {
				this.firecommunity.child(`${this.post.postid}`).update({
					posttitle: title,
					text: text,
				}).then(() => {
					resolve(true);
				});
		});
		return promise;
	}

	postdelete(post) {
		var uid = firebase.auth().currentUser.uid;
		var promise = new Promise((resolve) => {
			this.firecomment.child(`${post.postid}`).remove();
			this.firecommunity.child(`${post.postid}`).remove().then(() => {
				this.firereport.child(`${uid}`).remove().then(() => {
					this.firemypost.child(`${uid}/${post.postid}`).remove().then(() => {
						this.gettag(post.tag1).then((tags) => {
							this.tags = tags;
								this.firetag.child(`${post.tag1}`).update({
									tagcnt: this.tags.tagcnt - 1,
								}).then(() => {
									resolve(true);
								});
						});
					})
				});
			}).then(() => {
				resolve(true);
			});
		});
		return promise;
	}

	reportpost(post){
		console.log("test");
		var uid = firebase.auth().currentUser.uid;
		var promise = new Promise((resolve) => {
			this.getreport(post).then((report) => {
				this.report = report;
					if(this.report == null){
						this.firereport.child(`${post.postid}`).update({
							reportcnt: 1,
						}).then(() => {
							resolve(true);
						});
					}
					else{
						if(this.uids.uid != uid){
							this.firereport.child(`${post.postid}`).update({
								reportcnt: this.report.reportcnt + 1,
							}).then(() => {
								resolve(true);
							});
						}
						else{

						}
						if(this.report.reportcnt == 20){
							this.postdelete(post);
							this.firereport.child(`${post.postid}`).remove();
						}
					}
				})
			})
		return promise;
	}

	
	gettag(tags) {
		var promise = new Promise((resolve) => {
			var tag;
			this.firetag.child(tags).once("value").then((snapshot) => {
					tag = snapshot.val();
					resolve(tag);
				});
			});
		return promise;
  }

  	getreport(post) {
		var promise = new Promise((resolve) => {
			var report;
			this.firereport.child(`${post.postid}`).once("value").then((snapshot) => {
				report = snapshot.val();
				resolve(report);
			});
		});
		return promise;
	}

	/* get all posts in firebase */
	getallposts() {
		this.limit = 10;
		var uid = firebase.auth().currentUser.uid;
		var promise = new Promise((resolve) => {
			this.firecommunity.orderByChild('timestamp').limitToLast(this.limit).once("value").then((snapshot) => {
				this.firelike.child(`${uid}`).once("value").then((likesnapshot) => {
					var likepostid = [];
					likesnapshot.forEach((childSnapshot) => {
						likepostid.push(childSnapshot.key);
					});
					var posts = [];
					snapshot.forEach((childSnapshot) => {
						var post = childSnapshot.val();

						// if user liked this post, set like img to full heart
						// else, set like img to empty heart
						if (likepostid.indexOf(post.postid) != -1) {
							post.likesrc = "assets/like-full.png";
						} else {
							post.likesrc = "assets/like.png";
						}
						posts.push(post);
					});
					posts.reverse();
					resolve(posts);
				});
			});
		});
		return promise;
	}

	onInfiniteScroll() {
		this.limit += 10; // or however many more you want to load
        var uid = firebase.auth().currentUser.uid;
		var promise = new Promise((resolve) => {
			this.firecommunity.orderByChild('timestamp').limitToLast(this.limit).once("value").then((snapshot) => {
				this.firelike.child(`${uid}`).once("value").then((likesnapshot) => {
					var likepostid = [];
					likesnapshot.forEach((childSnapshot) => {
						likepostid.push(childSnapshot.key);
					});
					var posts = [];
					snapshot.forEach((childSnapshot) => {
						var post = childSnapshot.val();

						// if user liked this post, set like img to full heart
						// else, set like img to empty heart
						if (likepostid.indexOf(post.postid) != -1) {
							post.likesrc = "assets/like-full.png";
						} else {
							post.likesrc = "assets/like.png";
						}
						posts.push(post);
					});
					posts.reverse();
					resolve(posts);
				});
			});
		});
		return promise;
    }

	searchtag(tag){
		this.cnt = 10;
		var uid = firebase.auth().currentUser.uid;
		var promise = new Promise((resolve) => {
			this.firecommunity.orderByChild('tag1').equalTo(tag).limitToLast(this.cnt).once("value").then((snapshot1) => {
				this.firelike.child(`${uid}`).once("value").then((likesnapshot) => {
					
					var likepostid = [];
					likesnapshot.forEach((childSnapshot) => {
						likepostid.push(childSnapshot.key);
					});
					var posts = [];
					snapshot1.forEach((childSnapshot) => {
						var post = childSnapshot.val();

						// if user liked this post, set like img to full heart
						// else, set like img to empty heart
						if (likepostid.indexOf(post.postid) != -1) {
							post.likesrc = "assets/like-full.png";
						} else {
							post.likesrc = "assets/like.png";
						}
						posts.push(post);
					});
					posts.reverse();
					resolve(posts);
				});
			});
		});
		return promise;
	}

	doInfiniteSearch(tag) {
        this.cnt += 10; // or however many more you want to load
		var uid = firebase.auth().currentUser.uid;
		var promise = new Promise((resolve) => {
			this.firecommunity.orderByChild('tag1').equalTo(tag).limitToLast(this.cnt).once("value").then((snapshot1) => {
				this.firelike.child(`${uid}`).once("value").then((likesnapshot) => {
					
					var likepostid = [];
					likesnapshot.forEach((childSnapshot) => {
						likepostid.push(childSnapshot.key);
					});
					var posts = [];
					snapshot1.forEach((childSnapshot) => {
						var post = childSnapshot.val();

						// if user liked this post, set like img to full heart
						// else, set like img to empty heart
						if (likepostid.indexOf(post.postid) != -1) {
							post.likesrc = "assets/like-full.png";
						} else {
							post.likesrc = "assets/like.png";
						}
						posts.push(post);
					});
					posts.reverse();
					resolve(posts);
				});
			});
		});
		return promise;
	}

	/* when user click like of a post, save timestamp and add 1 to the number of like of a post */
	setLike(post) {
		var uid = firebase.auth().currentUser.uid;
		var promise = new Promise((resolve) => {
			this.firelike.child(`${uid}/${post.postid}`).set({
				timestamp: firebase.database.ServerValue.TIMESTAMP
			}).then(() => {
				this.firecommunity.child(`${post.postid}`).update({
					like: post.like + 1
				}).then(() => {
					resolve(true);
				});
			});
		});
		return promise;
	}

	/* when user click unlike of a post, remove timestamp and subtract 1 to the number of like of a post*/
	deleteLike(post) {
		var uid = firebase.auth().currentUser.uid;
		var promise = new Promise((resolve) => {
			this.firelike.child(`${uid}/${post.postid}`).remove().then(() => {
				this.firecommunity.child(`${post.postid}`).update({
					like: post.like - 1
				}).then(() => {
					resolve(true);
				});
			});
		});
		return promise;
	}

	/* when user write comment, add 1 to the number of comments of a post */
	addComment(post) {
		var promise = new Promise((resolve) => {
			this.firecommunity.child(`${post.postid}`).once("value").then((snapshot) => {
				this.firecommunity.child(`${post.postid}`).update({
					comment: snapshot.val().comment + 1
				}).then(() => {
					resolve(true);
				});
			});
		});
		return promise;
	}

	deleteComment(post) {
		var promise = new Promise((resolve) => {
			this.firecommunity.child(`${post.postid}`).once("value").then((snapshot) => {
				this.firecommunity.child(`${post.postid}`).update({
					comment: snapshot.val().comment - 1
				}).then(() => {
					resolve(true);
				});
			});
		});
		return promise;
	}

}