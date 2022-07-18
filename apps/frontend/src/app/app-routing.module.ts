import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutEditComponent } from './about-edit/about-edit.component';
import { AboutComponent } from './about/about.component';
import { AppComponent } from './app.component';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { PopulationComponent } from './population/population.component';
import { RegisterComponent } from './register/register.component';
import { UsersEditComponent } from './users-edit/users-edit.component';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
  // { path: '', component: AppComponent},
  { path: '', component: HomeComponent},
  { path: 'population', component: PopulationComponent},
  { path: 'aboutMe', component: AboutComponent},
  { path: 'aboutMe/edit', component: AboutEditComponent, canActivate: [AuthGuard]},
  { path: 'users', component: UsersComponent},
  { path: 'users/edit', component: UsersEditComponent, canActivate: [AuthGuard]},
  { path: 'users/edit/:id', component: UsersEditComponent, canActivate: [AuthGuard]},
  { path: 'users/login', component: LoginComponent},
  { path: 'users/register', component: RegisterComponent},
  // { path: '**', redirectTo: '/'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  providers: [AuthGuard],
  exports: [RouterModule]
})
export class AppRoutingModule { }
