import { Component, OnInit  } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../services/auth.service';
import { SocialAuthService, GoogleLoginProvider, SocialUser } from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent  implements OnInit{


  loginForm = this._fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  })

  user!: SocialUser;
  loggedIn!: boolean;

  constructor(
    private _fb: FormBuilder,
    private _authService: AuthService,
    private router: Router,
    private msgService: MessageService,
    private authService: SocialAuthService
  ) {}
  ngOnInit() {
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);
      console.log(this.user)
    });
  }

  get email() {
    return this.loginForm.controls['email'];
  }
  get password() { return this.loginForm.controls['password']; }


  loginUser() {
    const { email, password } = this.loginForm.value;
    this._authService.getUserByEmail(email as string).subscribe(
      response => {
        if (response.length > 0 && response[0].password === password) {
          sessionStorage.setItem('email', email as string);
          this.msgService.add({ severity: 'success', summary: 'success', detail: 'You are login successfully' });
          this.router.navigate(['/home']);
        } else {
          this.msgService.add({ severity: 'error', summary: 'Error', detail: 'email or password is wrong' });
        }
      },
      error => {
        this.msgService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong' });
      }

    )
  }

  // Google
  loginWithGoogle() {
    this._authService.googleLogin();
  }


  clickGoogleBtn() {
      const event = new MouseEvent('click', {
      view: window,
      bubbles: false,
      cancelable: true
    })
    
  }
}