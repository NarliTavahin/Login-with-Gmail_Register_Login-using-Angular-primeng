import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { User } from '../interfaces/auth';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

import { SocialAuthService, SocialUser, GoogleLoginProvider } from '@abacritt/angularx-social-login';


@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnInit {

  user!: SocialUser;
  loggedIn!: boolean;

  private baseUrl = 'http://localhost:3000';
  
  constructor(
    private _http: HttpClient,
    private socialAuthService: SocialAuthService,
    private router: Router,
    private authService: SocialAuthService
  ) { }

  registerUser(userDetails: User) {
    return this._http.post(`${this.baseUrl}/users`, userDetails);
  }

  getUserByEmail(email: string): Observable<User[]> {
    return this._http.get<User[]>(`${this.baseUrl}/users?email=${email}`);
  }


  googleLogin(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  refreshToken(): void {
    this.authService.refreshAuthToken(GoogleLoginProvider.PROVIDER_ID);
  }

  ngOnInit() {
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);
    });
  }
}
