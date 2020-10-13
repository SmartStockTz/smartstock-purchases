import { Component } from '@angular/core';
// import { PurchasesComponent } from 'smartstocks-purchase';

@Component({
  selector: 'app-root',
  template: `<lib-purchases></lib-purchases>`,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'purchases-mock';

  lib() {
  }
}
