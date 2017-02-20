import { Routes } from '@angular/router';
import { DataResolver } from './app.resolver';
import { WelcomeComponent } from './pages/welcome/welcome.component';
// import { HomeComponent } from './home/home.component';
// import { SignInGuard } from './sign-in/sign-in.guard';

export const ROUTES: Routes = [
  // {
  //   path: '',
  //   redirectTo: '/home',
  //   pathMatch: 'full'
  // },
  {
    path: 'welcome',
    component: WelcomeComponent
  },
  // {
  //   path: 'home',
  //   component: HomeComponent,
  //   canActivate: [SignInGuard]
  // },
  // {
  //   path: '**',
  //   redirectTo: '/home',
  //   pathMatch: 'full'
  // }
];
