import { Injectable } from '@angular/core';
import { CommunityProvider } from '../../providers/community/community';
import firebase from 'firebase';
import { Events } from 'ionic-angular';

/*
  Generated class for the CommunitycommentProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CommunitycommentProvider {
	firecomment = firebase.database().ref('/communitycomment');
	post;
	postid;
	comments;
	subcomments;
	commentid;
  constructor(public community: CommunityProvider, public events: Events) {
  }

  initializecomment(post) {
  	this.post = post;
	this.postid = post.postid;
	this.commentid = post.commentid;
  }

  uploadcomment(txt) {
  	var promise = new Promise((resolve) => {
  		var newCommentRef = this.firecomment.child(`${ this.community.namecom }/${ this.postid }`).push();
  		var commentid = newCommentRef.key;
  		newCommentRef.set({
	  		postid: this.postid,
	  		commentid: commentid,
	  		uid: firebase.auth().currentUser.uid,
	  		username: firebase.auth().currentUser.displayName,
	  		text: txt,
	  		timestamp: firebase.database.ServerValue.TIMESTAMP,
	  		subcommentnum: 0
	  	}).then(() => {
        // add 1 to the number of comment of a post
	  		this.community.addComment(this.post).then(() => {
	  			resolve(true);
	  		});
	  	});
  	});
  	return promise;
  }

  getallcomments() {
    // on function listens for data changes at a particular location
  	this.firecomment.child(`${ this.community.namecom }/${ this.postid }`).on('value', (snapshot) => {
  		this.comments = [];
  		for (var i in snapshot.val()) {
  			this.comments.push(snapshot.val()[i]);
  		}
  		this.events.publish('community-newcomment');
  	});
  }

  stoplistencomments() {
    // off function detaches a callback previously attached with on()
    this.firecomment.child(`${ this.community.namecom }/${ this.postid }`).off();
  }

  uploadSubcomment(commentid, txt) {
  	var promise = new Promise((resolve) => {
  		var newSubcommentRef = this.firecomment.child(`${ this.community.namecom }/${ this.postid }/${ commentid }/subcomment`).push();
  		var subcommentid = newSubcommentRef.key;
  		newSubcommentRef.set({
	  		subcommentid: subcommentid,
	  		uid: firebase.auth().currentUser.uid,
	  		username: firebase.auth().currentUser.displayName,
	  		text: txt,
	  		timestamp: firebase.database.ServerValue.TIMESTAMP
	  	}).then(() => {
        // add 1 to the number of subcomments of a comment
	  		this.addSubcomment(commentid).then(() => {
	  			resolve(true);
	  		});
	  	});
  	});
  	return promise;
  }

  /* add 1 to the number of subcomments of a comment */
  addSubcomment(commentid) {
  	var promise = new Promise((resolve) => {
  		this.firecomment.child(`${ this.community.namecom }/${ this.postid }/${ commentid }`).once("value").then((snapshot) => {
  			this.firecomment.child(`${ this.community.namecom }/${ this.postid }/${ commentid }`).update({
	  			subcommentnum: snapshot.val().subcommentnum + 1
	  		}).then(() => {
	  			resolve(true);
  			});
	  	});
	  });
	  return promise;
  }
  
 remove(){
	var promise = new Promise((resolve) => {
		this.firecomment.child(`${ this.community.namecom }/${ this.postid }/${ this.commentid }`).set(null);
			this.community.deleteComment(this.post).then(() => {
	  			resolve(true);
	  		});
	});
	  return promise;
 }
}
