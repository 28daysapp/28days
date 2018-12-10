import { Injectable } from '@angular/core';
import firebase from 'firebase';

@Injectable()
export class AuthProvider {

  constructor() {
  }
 
  loginUser(email: string, password: string): Promise<any> {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }

  resetPassword(email: string): Promise<any> {
    return firebase.auth().sendPasswordResetEmail(email);
  }

  logoutUser(): Promise<any> {
    return firebase.auth().signOut();
  }

  signupUser(email: string, password: string): Promise<any> {
    return firebase.auth().createUserWithEmailAndPassword(email, password);
  }

}
