import { Component, OnInit } from '@angular/core';
import { Router, RouterStateSnapshot } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { User } from '../models/user-model';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  users: User[] = JSON.parse(localStorage.getItem('Users') as string)
  
  constructor(
    private modal: NzModalService,
    private router: Router,
    private authenticationService: AuthenticationService
    ) { }

  ngOnInit(): void {
    // this.deleteDB()
    this.ensureCreatedDB()
    
  }

  isLoggedIn() {
    const currentUser = this.authenticationService.currentUserValue;
    if (currentUser) {
        // logged in so return true
        return true;
    }

    // not logged in so redirect to login page with the return url
    this.router.navigate(['/users/login'], );
    return false;
  }

  deleteUser(id: number) {
    if (!this.isLoggedIn()) {
      return
    }
    const index = this.users.findIndex(n => n.id === id);
    if (index !== -1) {
      this.users.splice(index, 1);
    }

    localStorage.setItem('Users', JSON.stringify(this.users))
  }

  showModal(id: number, firstName: string | null, lastName: string | null) {
    if (!this.isLoggedIn()) {
      return
    }
    this.modal.confirm({
      nzTitle: `Вы уверены, что хотите удалить пользователя ${firstName} ${lastName}?`,
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.deleteUser(id),
    });

  }

  deleteDB() {
    localStorage.setItem('Users', '[]')
  }

  ensureCreatedDB() {
    if (!this.users) {
      localStorage.setItem('Users', `[]`)
    }
  }
}
