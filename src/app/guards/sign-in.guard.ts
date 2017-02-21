import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { SignInService } from '../services/sign-in/sign-in.service';

@Injectable()
export class SignInGuard {
  constructor(
    private signInService: SignInService,
    private router: Router
  ) { }

  public canActivate(): Promise<boolean> {
    return new Promise((resolve) => {
      this.signInService.isUserSignedIn().then(() => {
        resolve(true);

      }).catch(() => {
        this.router.navigate(['/welcome']);
        resolve(false);

      });
    });
  }
}
