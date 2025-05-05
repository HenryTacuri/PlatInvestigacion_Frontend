import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export default class AuthComponent implements OnInit {
  authService = inject(AuthService);
  afAuth = inject(AngularFireAuth);
  router = inject(Router);

  constructor() {}

  ngOnInit() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.router.navigate(['/edit-user']);
      }
    });
  }

  async signInWithGoogle() {
    try {
      const result = await this.authService.signInWithGoogle();
      console.log('Google Sign-In successful:', result);
      this.router.navigate(['/edit-user']);
    } catch (error) {
      console.error('Google Sign-In Error:', error);
    }
  }

  signOut() {
    this.authService.signOut();
  }
}
