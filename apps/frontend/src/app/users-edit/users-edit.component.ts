/* eslint-disable no-prototype-builtins */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @angular-eslint/component-selector */
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { User } from '../models/user-model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NzFormTooltipIcon } from 'ng-zorro-antd/form';
import { UserService } from '../services/user.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-users-edit',
  templateUrl: './users-edit.component.html',
  styleUrls: ['./users-edit.component.css']
})
export class UsersEditComponent implements OnInit {
  user: User = {
    id: 0,
    login: null,
    password: null,
    firstName: null,
    lastName: null,
    patronymic: null,
    role: 'user',
    isActive: false,
  }
  roles = ['admin', 'moderator', 'user']
  error = ''
  paramId = ''
  userIsExist = false
  isDisabled = false
  loading = true

  validateForm!: FormGroup

  captchaTooltipIcon: NzFormTooltipIcon = {
    type: 'info-circle',
    theme: 'twotone'
  }


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.paramId = this.route.snapshot.paramMap.get('id')!
    
    this.checkUserExist(this.paramId)
    // if (this.paramId && this.paramId !== '' && this.checkUserExist(+this.paramId)) {
    //   this.userIsExist = true
    // }
    
    this.validateForm = this.fb.group({
      login: [this.user.login, [Validators.required]],
      password: [this.user.password, [Validators.required]],
      checkPassword: [null, [Validators.required, this.confirmationValidator]],
      firstName: [this.user.firstName, [Validators.required]],
      lastName: [this.user.lastName, [Validators.required]],
      patronymic: [this.user.patronymic, [Validators.required]],
      role: [this.user.role, [Validators.required]],
      isActive: [this.user.isActive, [Validators.required]],
    });

  }

  checkUserExist(id: string) {
    if (!id || id.length === 0) {
      this.userIsExist = false
      this.loading = false
      return
    }

    this.loading = true
    this.isDisabled = true
    this.userService.findUser(+id)
      .pipe(first())
      .subscribe({
        next: data => {
          if (!data) {
            this.userIsExist = false
            this.loading = false
            this.isDisabled = false
            return
          }
          this.userIsExist = true
          this.user = data
          // console.log(this.user);

          this.validateForm = this.fb.group({
            login: [this.user.login, [Validators.required]],
            password: [this.user.password, [Validators.required]],
            checkPassword: [null, [Validators.required, this.confirmationValidator]],
            firstName: [this.user.firstName, [Validators.required]],
            lastName: [this.user.lastName, [Validators.required]],
            patronymic: [this.user.patronymic, [Validators.required]],
            role: [this.user.role, [Validators.required]],
            isActive: [this.user.isActive, [Validators.required]],
          });
          this.isDisabled = false
          this.loading = false
        },
        error: error => {
          // this.error = error.error?.message || error.statusText;
          this.error = error
          // console.log(error);
          
          this.userIsExist = false
          this.isDisabled = false
          this.loading = false
        }
      });
    
    
  }

  updateConfirmValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() => this.validateForm.controls['checkPassword'].updateValueAndValidity());
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateForm.controls['password'].value) {
      return { confirm: true, error: true };
    }
    return {};
  };

  invalidData(): boolean {
    if (this.validateForm.valid) {
      // console.log('submit', this.validateForm.value);
      return false
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty()
          control.updateValueAndValidity({ onlySelf: true })
        }
      })
      return true
    }
  }

  get f() { return this.validateForm.controls; }

  addUser() {
    if (this.invalidData()) {
      return
    }

    //TODO fix
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
    this.userService.createUser(user)
      .pipe(first())
      .subscribe({
        next: data => {
          this.router.navigate(['/users']);
        },
        error: error => {
          // this.error = error.error?.message || error.statusText;
          this.error = error
          // console.log(error);
          
          this.isDisabled = false
          // this.loading = false;
        }
      });
  }

  changeUser() {
    if (this.invalidData()) {
      return
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
    this.userService.updateUser(this.paramId, user)
      .pipe(first())
      .subscribe({
        next: data => {
          this.router.navigate(['/users']);
        },
        error: error => {
          // this.error = error.error?.message || error.statusText;
          this.error = error
          this.isDisabled = false
          // this.loading = false;
        }
      });

  }

}
