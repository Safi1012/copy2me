import { Component, NgModule } from '@angular/core';
import { SignInService, SignInProvider } from '../../services/sign-in/sign-in.service';

@Component({
  selector: 'c2m-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent {

  public SignInProvider: typeof SignInProvider = SignInProvider;

  constructor(
    private signInService: SignInService
  ) { }

  public signIn(service: SignInProvider) {
    if (service === SignInProvider.Demo) {
      this.signInService.signAnonymously();
    } else {
      this.signInService.signInWithService(service);
    }
  }
}
