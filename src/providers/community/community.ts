import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { MyProvider } from '../../providers/my/my'

@Injectable()
export class CommunityProvider {

	// Firebase Real-Time Database references
	fireCommunityList = firebase.database().ref('communityList');
	fireCommunityPost = firebase.database().ref('communityPost');

	photoURL: any = "";

	fireCommunity = firebase.database().ref('/community');
	firemypost = firebase.database().ref('/my/post');
	firelike = firebase.database().ref('/like');
	firestore = firebase.storage();
	firecomment = firebase.database().ref('/communitycomment');
	firereport = firebase.database().ref('/report');
	firetag = firebase.database().ref('/tag');
	fireusers = firebase.database().ref('/users');
	fireMyPost = firebase.database().ref('/myPost');

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
	morepost: number = 0;
	moresearch: number = 0;
	constructor(public my: MyProvider) {

	}

	//--------------------------------------------------------------------------------

	createCommunity(communityName, communityDescription) {
		const promise = new Promise((resolve) => {
			const createdTime = firebase.database.ServerValue.TIMESTAMP;
			// const newMember = 1;

			firebase.database().ref(`/communityList/${communityName}`).set({
				communityName: communityName,
				communityDescription: communityDescription,
				createdTime: createdTime
				// members: newMember
			})
			resolve(true);
		});
		return promise
	}

	readCommunityList() {
		const promise = new Promise((resolve) => {
			this.fireCommunityList.once('value').then((snapshot) => {
				const communities = [];
				snapshot.forEach((childSnapshot) => {
					const community = childSnapshot.val();
					communities.push(community);
				});
				resolve(communities);
			});
		});
		return promise
	}


	createCommunityPost(text, dataURL, anonymity, communityInfo) {
		return new Promise((resolve) => {
			const uid = firebase.auth().currentUser.uid;
			let user;
			this.fireusers.child(uid).once("value").then((snapshot) => {
				user = snapshot.val();
			}).then(() => {
				const newPostRef = firebase.database().ref(`/communityPost/${communityInfo.communityName}`).push();
				const createdTime = firebase.database.ServerValue.TIMESTAMP;
				const postId = newPostRef.key;
				const imageStore = this.firestore.ref('/community/').child(postId);
				const profilePicture = user.photoURL;

				if (dataURL) {
					imageStore.putString(dataURL, 'base64', { contentType: 'image/jpeg' }).then((savedImage) => {
						this.photoURL = savedImage.downloadURL;
					});
				}

				if (!anonymity) {
					anonymity = false;
				}

				newPostRef.set({
					uid: uid,
					username: firebase.auth().currentUser.displayName,
					text: text,
					photoURL: this.photoURL,
					profilePicture: profilePicture,
					createdTime: createdTime,
					comment: 0,
					like: 0,
					report: 0,
					anonymity: anonymity,
					communityName: communityInfo.communityName
				});
				resolve(postId);
			});
		});
	}

	createMyPost(postId, text, dataURL, anonymity, communityInfo) {
		const promise = new Promise((resolve) => {
			const uid = firebase.auth().currentUser.uid;
			let user;
			this.fireusers.child(uid).once("value").then((snapshot) => {
				user = snapshot.val();
			}).then(() => {
				const newPostRef = firebase.database().ref(`/userPost/${uid}/${postId}`);
				const createdTime = firebase.database.ServerValue.TIMESTAMP;
				const imageStore = this.firestore.ref('/community/').child(postId);
				const profilePicture = user.photoURL;

				if (dataURL) {
					imageStore.putString(dataURL, 'base64', { contentType: 'image/jpeg' }).then((savedImage) => {
						this.photoURL = savedImage.downloadURL;
					});
				}

				if (!anonymity) {
					anonymity = false;
				}

				newPostRef.set({
					postId: postId,
					uid: uid,
					username: firebase.auth().currentUser.displayName,
					text: text,
					photoURL: this.photoURL,
					profilePicture: profilePicture,
					createdTime: createdTime,
					comment: 0,
					like: 0,
					report: 0,
					urlcheck: true,
					anonymity: anonymity,
					communityName: communityInfo.communityName
				});
			});
			resolve(true);
		});

		return promise
	}

	readUserPost(uid) {
		return new Promise((resolve, reject) => {
			firebase.database().ref(`/userPost/${uid}`).once('value').then((snapshot) => {
				const userPosts = [];
				snapshot.forEach((childSnapshot) => {
					const userPost = childSnapshot.val();
					userPosts.push(userPost);
					userPosts.reverse();
				});
				resolve(userPosts);
			})
			.catch(() => {
				reject("Error in Reading Post!");
			})
		})
	}

	readCommunityPosts(communityName) {
		var promise = new Promise((resolve) => {
			this.fireCommunityPost.child(communityName).orderByKey().once('value').then((snapshot) => {
				const posts = [];
				snapshot.forEach((childSnapshot) => {
					const post = childSnapshot.val();
					posts.push(post);
					posts.reverse();
				});
				resolve(posts);
			});
		});
		return promise
	}

	deleteCommunityPost(post) {
		var promise = new Promise((resolve) => {
			firebase.database().ref(`communityPost/${post.communityName}/${post.postId}`).remove();
			resolve(true);
		});
		return promise
	}

	deleteMyPost(post) {
		var promise = new Promise((resolve) => {
			const uid = firebase.auth().currentUser.uid;
			console.log("uid: " + uid)
			console.log("postid: " + post.postId)

			firebase.database().ref(`userPost/${uid}/${post.postId}`).remove();
			resolve(true);
		});
		return promise
	}

	joinCommunity(communityName: String) {
		const currentUserUid = firebase.auth().currentUser.uid;
		const currentUserUsername = firebase.auth().currentUser.displayName;
		const joinedTime = firebase.database.ServerValue.TIMESTAMP
		const promise = new Promise((resolve) => {
			firebase.database().ref(`/communityMembers/${communityName}`).push({
				uid: currentUserUid,
				username: currentUserUsername,
				joinedTime: joinedTime
			});
			resolve(true);
		});
		return promise
	}

	increaseCommunityMember(communityName: String) {
		const communityMemberCountRef = firebase.database().ref(`/communityList/${communityName}/members`)
		communityMemberCountRef.transaction((currentMemberCount) => {
			return (currentMemberCount || 0) + 1;
		})
	}





	//--------------------------------------------------------------------------------




	/* upload post to firebase */
	uploadPost(txt, dataURL, tag1, anonymity, communityInfo) { // 게시글 firebase에 업로드
		var uid = firebase.auth().currentUser.uid;
		var promise = new Promise((resolve) => {
			var newPostRef = this.fireCommunity.push();
			var time = firebase.database.ServerValue.TIMESTAMP;
			var postId = newPostRef.key;
			if (anonymity) { // 익명 체크의 경우
				console.log(anonymity);
				if (dataURL) { // 사진이 있을 경우
					var imageStore1 = this.firestore.ref('/community/').child(postId);
					imageStore1.putString(dataURL, 'base64', { contentType: 'image/jpeg' }).then((savedImage) => {
						newPostRef.set({
							postid: postId,
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
							communityName: communityInfo.communityName
						}).then(() => {
							this.my.addmypost(uid, postId, time).then(() => {
								resolve(true);
							}).then(() => {
								if (tag1 != '') {
									this.gettag(tag1).then((tags) => {
										this.tags = tags;
										if (this.tags == null) {
											this.firetag.child(`${tag1}`).set({
												tag1: tag1,
												tagcnt: 1,
											}).then(() => {
												resolve(true);
											});
										}
										else {
											this.firetag.child(`${tag1}`).set({
												tag1: tag1,
												tagcnt: this.tags.tagcnt + 1
											}).then(() => {
												resolve(true);
											});
										}
									})
								}
							})
						});
					});
				} else { // 사진이 없을 경우
					newPostRef.set({
						postid: postId,
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
						communityName: communityInfo.communityName
					}).then(() => {
						this.my.addmypost(uid, postId, time).then(() => {
							resolve(true);
						})
					}).then(() => {
						if (tag1 != '') {
							this.gettag(tag1).then((tags) => {
								this.tags = tags;
								if (this.tags == null) {
									this.firetag.child(`${tag1}`).set({
										tag1: tag1,
										tagcnt: 1,
									}).then(() => {
										resolve(true);
									});
								}
								else {
									this.firetag.child(`${tag1}`).set({
										tag1: tag1,
										tagcnt: this.tags.tagcnt + 1
									}).then(() => {
										resolve(true);
									});
								}
							})
						}
					})
				}
			} else { // 익명 체크가 아닌 경우
				console.log("else");
				if (dataURL) { // 사진이 있을 경우
					var imageStore2 = this.firestore.ref('/community/').child(postId);
					imageStore2.putString(dataURL, 'base64', { contentType: 'image/jpeg' }).then((savedImage) => {
						newPostRef.set({
							postid: postId,
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
							communityName: communityInfo.communityName
						}).then(() => {
							this.my.addmypost(uid, postId, time).then(() => {
								resolve(true);
							}).then(() => {
								if (tag1 != '') {
									this.gettag(tag1).then((tags) => {
										this.tags = tags;
										if (this.tags == null) {
											this.firetag.child(`${tag1}`).set({
												tag1: tag1,
												tagcnt: 1,
											}).then(() => {
												resolve(true);
											});
										}
										else {
											this.firetag.child(`${tag1}`).set({
												tag1: tag1,
												tagcnt: this.tags.tagcnt + 1
											}).then(() => {
												resolve(true);
											});
										}
									})
								}
							})
						});
					});
				} else { // 사진이 없을 경우
					newPostRef.set({
						postid: postId,
						uid: uid,
						username: firebase.auth().currentUser.displayName,
						text: txt,
						url: null,
						timestamp: time,
						comment: 0,
						like: 0,
						report: 0,
						tag1: tag1,
						communityName: communityInfo.communityName
					}).then(() => {
						this.my.addmypost(uid, postId, time).then(() => {
							resolve(true);
						})
					}).then(() => {
						if (tag1 != '') {
							this.gettag(tag1).then((tags) => {
								this.tags = tags;
								if (this.tags == null) {
									this.firetag.child(`${tag1}`).set({
										tag1: tag1,
										tagcnt: 1,
									}).then(() => {
										resolve(true);
									});
								}
								else {
									this.firetag.child(`${tag1}`).set({
										tag1: tag1,
										tagcnt: this.tags.tagcnt + 1
									}).then(() => {
										resolve(true);
									});
								}
							})
						}
					})
				}
			}
		});
		return promise;
	}

	mosttag() { // 가장 많은 태그 6개
		this.check = 6;
		var promise = new Promise((resolve) => {
			this.firetag.orderByChild('tagcnt').limitToLast(this.check).once("value").then((snapshot) => {
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

	tagmore() { // 가장 많은 태그 6개
		this.check += 18;
		var promise = new Promise((resolve) => {
			this.firetag.orderByChild('tagcnt').limitToLast(this.check).once("value").then((snapshot) => {
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

	tagcount(tag) { // 태그 갯수 세줌
		var promise = new Promise((resolve) => {
			this.firetag.orderByChild('tag1').equalTo(tag).once("value").then((snapshot) => {
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

	updatePost(text) { // 게시글 수정
		var promise = new Promise((resolve) => {
			this.fireCommunity.child(`${this.post.postid}`).update({
				text: text
			}).then(() => {
				resolve(true);
			});
		});
		return promise;
	}

	postdelete(post) { // 게시글 삭제
		var uid = firebase.auth().currentUser.uid;
		var promise = new Promise((resolve) => {
			this.firecomment.child(`${post.postid}`).remove();
			this.fireCommunity.child(`${post.postid}`).remove().then(() => {
				this.firereport.child(`${uid}`).remove().then(() => {
					this.firemypost.child(`${uid}/${post.postid}`).remove().then(() => {
						if (post.tag1 != '') {
							this.gettag(post.tag1).then((tags) => {
								this.tags = tags;
								this.firetag.child(`${post.tag1}`).update({
									tagcnt: this.tags.tagcnt - 1, // 태그 갯수 하나 뺌
								}).then(() => {
									resolve(true);
								});
							});
						}
					})
				});
			}).then(() => {
				resolve(true);
			});
		});
		return promise;
	}

	reportpost(post) { // 게시글 신고
		console.log("test");
		var uid = firebase.auth().currentUser.uid;
		var promise = new Promise((resolve) => {
			this.getreport(post).then((report) => {
				this.report = report;
				if (this.report == null) {
					this.firereport.child(`${post.postid}`).update({
						reportcnt: 1,
					}).then(() => {
						resolve(true);
					});
				}
				else {
					this.firereport.child(`${post.postid}`).update({
						reportcnt: this.report.reportcnt + 1,
					}).then(() => {
						resolve(true);
					});
					if (this.report.reportcnt == 20) { // 신고가 누적 20일 경우 삭제
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
	getallposts() { // 처음 10개의 게시물
		this.limit = 10;
		var uid = firebase.auth().currentUser.uid;
		var promise = new Promise((resolve) => {
			this.fireCommunity.orderByChild('timestamp').limitToLast(this.limit).once("value").then((snapshot) => {
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

	onInfiniteScroll() { // 처음 이후 10개의 게시물
		this.limit += 10; // or however many more you want to load
		var uid = firebase.auth().currentUser.uid;
		var promise = new Promise((resolve) => {
			this.fireCommunity.orderByChild('timestamp').limitToLast(this.limit).once("value").then((snapshot) => {
				this.firelike.child(`${uid}`).once("value").then((likesnapshot) => {
					var likepostid = [];
					likesnapshot.forEach((childSnapshot) => {
						likepostid.push(childSnapshot.key);
					});
					var posts = [];
					snapshot.forEach((childSnapshot) => {
						var post = childSnapshot.val();

						this.morepost++;
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
		console.log(this.morepost);
		return promise;
	}

	searchtag(tag) { // 검색 시 처음 10개의 게시물
		this.cnt = 10;
		var uid = firebase.auth().currentUser.uid;
		var promise = new Promise((resolve) => {
			this.fireCommunity.orderByChild('tag1').equalTo(tag).limitToLast(this.cnt).once("value").then((snapshot1) => {
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
						this.moresearch++;
					});
					posts.reverse();
					resolve(posts);
				});
			});
		});
		console.log(this.moresearch);
		return promise;
	}

	doInfiniteSearch(tag) { // 검색 시 다음 10개의 게시물
		this.cnt += 10; // or however many more you want to load
		var uid = firebase.auth().currentUser.uid;
		var promise = new Promise((resolve) => {
			this.fireCommunity.orderByChild('tag1').equalTo(tag).limitToLast(this.cnt).once("value").then((snapshot1) => {
				this.firelike.child(`${uid}`).once("value").then((likesnapshot) => {

					var likepostid = [];
					likesnapshot.forEach((childSnapshot) => {
						likepostid.push(childSnapshot.key);
					});
					var posts = [];
					snapshot1.forEach((childSnapshot) => {
						var post = childSnapshot.val();

						this.moresearch++;
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
		console.log(this.moresearch);
		return promise;
	}

	mypost() { // 검색 시 처음 10개의 게시물
		this.cnt = 10;
		var uid = firebase.auth().currentUser.uid;
		var promise = new Promise((resolve) => {
			this.fireCommunity.orderByChild('uid').equalTo(uid).limitToLast(this.cnt).once("value").then((snapshot1) => {
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
						this.moresearch++;
					});
					posts.reverse();
					resolve(posts);
				});
			});
		});
		console.log(this.moresearch);
		return promise;
	}

	doInfiniteMypost() { // 검색 시 다음 10개의 게시물
		this.cnt += 10; // or however many more you want to load
		var uid = firebase.auth().currentUser.uid;
		var promise = new Promise((resolve) => {
			this.fireCommunity.orderByChild('uid').equalTo(uid).limitToLast(this.cnt).once("value").then((snapshot1) => {
				this.firelike.child(`${uid}`).once("value").then((likesnapshot) => {

					var likepostid = [];
					likesnapshot.forEach((childSnapshot) => {
						likepostid.push(childSnapshot.key);
					});
					var posts = [];
					snapshot1.forEach((childSnapshot) => {
						var post = childSnapshot.val();

						this.moresearch++;
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
		console.log(this.moresearch);
		return promise;
	}

	/* when user click like of a post, save timestamp and add 1 to the number of like of a post */
	setLike(post) { // 좋아요 + 1
		var uid = firebase.auth().currentUser.uid;
		var promise = new Promise((resolve) => {
			this.firelike.child(`${uid}/${post.postid}`).set({
				timestamp: firebase.database.ServerValue.TIMESTAMP
			}).then(() => {
				this.fireCommunity.child(`${post.postid}`).update({
					like: post.like + 1
				}).then(() => {
					resolve(true);
				});
			});
		});
		return promise;
	}

	/* when user click unlike of a post, remove timestamp and subtract 1 to the number of like of a post*/
	deleteLike(post) { // 좋아요 - 1
		var uid = firebase.auth().currentUser.uid;
		var promise = new Promise((resolve) => {
			this.firelike.child(`${uid}/${post.postid}`).remove().then(() => {
				this.fireCommunity.child(`${post.postid}`).update({
					like: post.like - 1
				}).then(() => {
					resolve(true);
				});
			});
		});
		return promise;
	}

	/* when user write comment, add 1 to the number of comments of a post */
	addComment(post) { // 댓글 + 1
		var promise = new Promise((resolve) => {
			this.fireCommunity.child(`${post.postid}`).once("value").then((snapshot) => {
				this.fireCommunity.child(`${post.postid}`).update({
					comment: snapshot.val().comment + 1
				}).then(() => {
					resolve(true);
				});
			});
		});
		return promise;
	}

	deleteComment(post) { // 댓글 - 1
		var promise = new Promise((resolve) => {
			this.fireCommunity.child(`${post.postid}`).once("value").then((snapshot) => {
				this.fireCommunity.child(`${post.postid}`).update({
					comment: snapshot.val().comment - 1
				}).then(() => {
					resolve(true);
				});
			});
		});
		return promise;
	}

}