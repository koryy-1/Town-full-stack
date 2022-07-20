/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @angular-eslint/component-selector */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../models/user-model';
import { AuthenticationService } from '../services/authentication.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  roles = ['admin', 'moderator', 'user']
  returnUrl = '/users';
  error = '';
  isDisabled = false

  registerForm!: FormGroup

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private authenticationService: AuthenticationService
    ) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      login: [null, [Validators.required]],
      password: [null, [Validators.required]],
      checkPassword: [null, [Validators.required, this.confirmationValidator]],
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      patronymic: [null, [Validators.required]],
      role: ['user', [Validators.required]],
      isActive: [false, [Validators.required]],
    });
  }

  get f() { return this.registerForm.controls; }

  onSubmit() {
    if (this.invalidData()) {
      return;
    }

    const user: User = {
      id: 0,
      login: this.f['login'].value,
      password: this.f['password'].value,
      firstName: this.f['firstName'].value,
      lastName: this.f['lastName'].value,
      patronymic: this.f['patronymic'].value,
      role: this.f['role'].value,
      isActive: this.f['isActive'].value
    }

    // this.loading = true;
    this.isDisabled = true
    this.authenticationService.register(user)
      .pipe(first())
      .subscribe({
        next: data => {
          this.router.navigate([this.returnUrl]);
        },
        error: error => {
          this.error = error;
          this.isDisabled = false
          // this.loading = false;
        }
      });

  }

  updateConfirmValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() => this.registerForm.controls['checkPassword'].updateValueAndValidity());
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.registerForm.controls['password'].value) {
      return { confirm: true, error: true };
    }
    return {};
  };

  invalidData(): boolean {
    if (this.registerForm.valid) {
      // console.log('submit', this.validateForm.value);
      return false
    } else {
      Object.values(this.registerForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty()
          control.updateValueAndValidity({ onlySelf: true })
        }
      })
      return true
    }
  }

}
