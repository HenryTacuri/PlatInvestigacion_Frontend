import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from './user.model';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  router = inject(Router);

  signInWithGoogle() {
    return this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then(result => {
        if (result.additionalUserInfo?.isNewUser) {
          const user: User = {
            uid: result.user?.uid,
            email: result.user?.email,
            name: result.user?.displayName
          };
          return this.firestore.collection('users').doc(user.uid).set(user)
            .then(() => {
              return result;
            });
        } else {
          return result;
        }
      });
  }

  signOut() {
    this.auth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigateByUrl('/auth');
    });
  }

  isLoggedIn(): Observable<boolean> {
    return this.auth.authState.pipe(
      map(user => !!user)
    );
  }

  getUserData(uid: string): Observable<any> {
    return this.firestore.collection('users').doc(uid).valueChanges();
  }

  updateUser(data: Partial<User>): Promise<void> {
    const currentUser = this.auth.currentUser;
    if (currentUser) {
      return currentUser.then(user => {
        if (user) {
          return user.updateProfile({ displayName: data.name }).then(() => {
            // Update user data in Firestore
            return this.firestore.collection('users').doc(user.uid).set(data, { merge: true });
          });
        }
        throw new Error('No user is currently logged in.');
      });
    } else {
      throw new Error('No user is currently logged in.');
    }
  }
}
