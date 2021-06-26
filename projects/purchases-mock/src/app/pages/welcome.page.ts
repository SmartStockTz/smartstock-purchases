import {Component} from "@angular/core";

@Component({
  selector: 'app-welcome-page',
  template: `
    <div
      style="min-height: 100vh; display: flex; justify-content: center; align-items:  center; flex-direction: column">
      <h1>Welcome to purchase mock</h1>
      <p><a href="/purchase">Start Now</a></p>
      <p><a href="/login">Login</a></p>
    </div>
  `,
  styleUrls: []
})

export class WelcomePage {
  constructor() {
  }
}
