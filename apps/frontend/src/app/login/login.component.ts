/* eslint-disable @angular-eslint/component-selector */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../models/user-model';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  returnUrl = '';
  error = '';
  isDisabled = false

  loginForm!: FormGroup

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private authenticationService: AuthenticationService
    ) {
      if (this.authenticationService.currentUserValue) { 
        this.router.navigate(['/users']);
    }
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      login: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });

    // get return url from route parameters or default to '/users'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/users';
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onSubmit() {
    if (this.invalidData()) {
      return;
    }

    // this.loading = true;
    this.isDisabled = true
    this.authenticationService.login(this.f['login'].value, this.f['password'].value)
      .pipe(first())
      .subscribe({
        next: data => {
          // console.log(data);
          this.router.navigate([this.returnUrl]);
        },
        error: error => {
          // this.error = error.error?.message || error.statusText;
          this.error = error
          // this.loading = false;
          this.isDisabled = false
        }
      });
  }

  invalidData(): boolean {
    if (this.loginForm.valid) {
      // console.log('submit', this.validateForm.value);
      return false
    } else {
      Object.values(this.loginForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty()
          control.updateValueAndValidity({ onlySelf: true })
        }
      })
      return true
    }
  }

}
