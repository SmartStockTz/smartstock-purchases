import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
// import { PurchasesComponent } from 'smartstocks-purchase';
import { PurchasesModule } from 'smartstocks-purchase';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
    // PurchasesComponent
  ],
  imports: [
    BrowserModule,
    PurchasesModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
