import { Injectable } from '@angular/core';
import firebase from 'firebase';

@Injectable()
export class CommunityProvider {

	// Firebase Real-Time Database references
	fireCommunityList = firebase.database().ref('communityList');
	fireCommunityPost = firebase.database().ref('communityPost');
	firestore = firebase.storage();
	fireUsers = firebase.database().ref('/users');

	photoURL: String = "";
	constructor() {
	}

	createCommunity(communityName, communityDescription, communityImage) {
		const promise = new Promise((resolve) => {
			const createdTime = firebase.database.ServerValue.TIMESTAMP;

			firebase.database().ref(`/communityList/${communityName}`).set({
				communityName: communityName,
				communityDescription: communityDescription,
				communityImage: communityImage,
				createdTime: createdTime
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
			this.fireUsers.child(uid).once("value").then((snapshot) => {
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
					postId: postId,
					username: firebase.auth().currentUser.displayName,
					text: text,
					photoURL: this.photoURL,
					profilePicture: profilePicture,
					createdTime: createdTime,
					comment: 0,
					likes: 0,
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
			this.fireUsers.child(uid).once("value").then((snapshot) => {
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
					likes: 0,
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
		const promise = new Promise((resolve) => {
			firebase.database().ref(`communityPost/${post.communityName}/${post.postId}`).remove();
			resolve(true);
		});
		return promise
	}

	deleteMyPost(post) {
		var promise = new Promise((resolve) => {
			const uid = firebase.auth().currentUser.uid;

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

	likePost(communityName, postId) {
		const communityPostLikeRef = firebase.database().ref(`communityPost/${communityName}/${postId}/likes`);
		communityPostLikeRef.transaction((currentLikesCount) => {
			return (currentLikesCount || 0) + 1;
		})
	}

}