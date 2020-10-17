import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
// import { PurchasesModule } from 'smartstocks-purchase';

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
export class AppModule {}
