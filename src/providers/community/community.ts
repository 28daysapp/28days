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
	namecom;
	firecommunity = firebase.database().ref('/community');
	firemypost = firebase.database().ref('/my/post');
	firelike = firebase.database().ref('/like');
	firestore = firebase.storage();
	firecomment = firebase.database().ref('/communitycomment');
	namecomlist = [
		'depression',
		'anxiety',
		'schizophrenia',
		'trauma',
		'school',
		'family'
	];
	title;
	titlelist = [
		'우울증 서포트 그룹',
		'불안장애 서포트 그룹',
		'조현병 서포트 그룹',
		'트라우마 서포트 그룹',
		'학교폭력 서포트 그룹',
		'가정폭력 서포트 그룹'
	];
	posts;
	post;
	value;
	report;
	constructor(public my: MyProvider) {

	}

	/* community provider initializer */
	initializecom(order) {
		this.title = this.titlelist[order];
		this.namecom = this.namecomlist[order];
		this.posts = this.posts;
	}

	/* upload post to firebase */
	uploadPost(txt, dataURL) {
		var uid = firebase.auth().currentUser.uid;
		var promise = new Promise((resolve) => {
			var newPostRef = this.firecommunity.child(this.namecom).push();
			var time = firebase.database.ServerValue.TIMESTAMP;
			var postId = newPostRef.key;
			if (dataURL) {
				var imageStore = this.firestore.ref('/community/' + this.namecom).child(postId);
				imageStore.putString(dataURL, 'base64', { contentType: 'image/jpeg' }).then((savedImage) => {
					newPostRef.set({
						postid: postId,
						uid: uid,
						username: firebase.auth().currentUser.displayName,
						text: txt,
						url: savedImage.downloadURL,
						timestamp: time,
						comment: 0,
						like: 0,
						title: this.title,
						namecom: this.namecom,
						value: true,
						report: 0
					}).then(() => {
						this.my.addmypost(uid, this.namecom, postId, time).then(() => {
							resolve(true);
						});
					});
				});
			} else {
				newPostRef.set({
					postid: postId,
					uid: uid,
					username: firebase.auth().currentUser.displayName,
					text: txt,
					url: null,
					timestamp: time,
					comment: 0,
					like: 0,
					title: this.title,
					namecom: this.namecom,
					value: true,
					report: 0
				}).then(() => {
					this.my.addmypost(uid, this.namecom, postId, time).then(() => {
						resolve(true);
					});
				});
			}
		});
		return promise;
	}

	updatePost(text, dataURL) {
		var promise = new Promise((resolve) => {
			if (dataURL) {
				var imageStore = this.firestore.ref('/community' + this.namecom).child(this.post.postid);
				imageStore.putString(dataURL, 'base64', { contentType: 'image/jpeg' }).then((savedImage) => {
					this.firecommunity.child(`${this.namecom}/${this.post.postid}`).update({
						text: text,
						url: savedImage.downloadURL
					}).then(() => {
						resolve(true);
					});
				});
			}
			else {
				this.firecommunity.child(`${this.namecom}/${this.post.postid}`).update({
					text: text
				}).then(() => {
					resolve(true);
				});
			}
		});
		return promise;
	}

	postdelete(post) {
		var uid = firebase.auth().currentUser.uid;
		var promise = new Promise((resolve) => {
			this.firecomment.child(`${this.namecom}/${post.postid}`).remove();
			this.firemypost.child(`${uid}/${post.postid}`).remove();
			this.firecommunity.child(`${this.namecom}/${post.postid}`).remove().then(() => {
			}).then(() => {
				resolve(true);
			});
		});
		return promise;
	}

	reportpost(post){
		var promise = new Promise((resolve) => {
			this.firecommunity.child(`${ this.namecom }/${ post.postid }`).update({
				report: post.report + 1,
				value: false
			}).then(() => {
				resolve(true);
			});
		});
		if(post.report = 1){
			this.firecomment.child(`${ this.namecom }/${ post.postid }`).remove();
			this.firecommunity.child(`${ this.namecom }/${ post.postid }`).remove().then(() => {
			   this.firecommunity.child(`${ this.namecom }`).update({
				   }).then(() => {
					  });
			 });
		}
		return promise;
	}

	/* get all posts in firebase */
	getallposts() {
		var uid = firebase.auth().currentUser.uid;
		var promise = new Promise((resolve) => {
			this.firecommunity.child(this.namecom).orderByChild('timestamp').once("value").then((snapshot) => {
				this.firelike.child(`${uid}/${this.namecom}`).once("value").then((likesnapshot) => {
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


	/* when user click like of a post, save timestamp and add 1 to the number of like of a post */
	setLike(post) {
		var uid = firebase.auth().currentUser.uid;
		var promise = new Promise((resolve) => {
			this.firelike.child(`${uid}/${this.namecom}/${post.postid}`).set({
				timestamp: firebase.database.ServerValue.TIMESTAMP
			}).then(() => {
				this.firecommunity.child(`${this.namecom}/${post.postid}`).update({
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
			this.firelike.child(`${uid}/${this.namecom}/${post.postid}`).remove().then(() => {
				this.firecommunity.child(`${this.namecom}/${post.postid}`).update({
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
			this.firecommunity.child(`${this.namecom}/${post.postid}`).once("value").then((snapshot) => {
				this.firecommunity.child(`${this.namecom}/${post.postid}`).update({
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
			this.firecommunity.child(`${this.namecom}/${post.postid}`).once("value").then((snapshot) => {
				this.firecommunity.child(`${this.namecom}/${post.postid}`).update({
					comment: snapshot.val().comment - 1
				}).then(() => {
					resolve(true);
				});
			});
		});
		return promise;
	}

}