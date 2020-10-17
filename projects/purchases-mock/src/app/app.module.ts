import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
// import { PurchasesModule } from 'smartstocks-purchase';
import { BFast } from 'bfastjs';
import { environment } from '../environments/environment';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    // PurchasesModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor() {
    BFast.init({
      applicationId: environment.smartstock.applicationId,
      projectId: environment.smartstock.projectId,
      appPassword: environment.smartstock.pass,
    });
    BFast.init(
      {
        applicationId: environment.fahamupay.applicationId,
        projectId: environment.fahamupay.projectId,
        appPassword: environment.fahamupay.pass,
      },
      environment.fahamupay.projectId
    );
  }
}
