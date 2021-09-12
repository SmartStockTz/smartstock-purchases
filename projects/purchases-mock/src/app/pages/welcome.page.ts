import {Component} from '@angular/core';

@Component({
  selector: 'app-welcome-page',
  template: `
    <div
      style="min-height: 100vh; display: flex; justify-content: center; align-items:  center; flex-direction: column">
      <h1>Welcome to purchase mock</h1>
      <p><a routerLink="/purchase">Start Now</a></p>
      <p><a routerLink="/login">Login</a></p>
    </div>
  `,
  styleUrls: []
})

// tslint:disable-next-line:component-class-suffix
export class WelcomePage {
  constructor() {
  }
}
