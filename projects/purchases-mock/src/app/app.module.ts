import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {BFast} from 'bfastjs';
import {environment} from '../environments/environment';

import {AppComponent} from './app.component';
import {PurchasesModule} from '../../../purchases/src/public-api';
import {RouterModule, Routes} from '@angular/router';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LoginPageComponent} from './pages/login.page';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatFormFieldModule} from '@angular/material/form-field';
import {ReactiveFormsModule} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {AuthGuard} from './guards/auth.guard';

const routes: Routes = [
  {path: 'login', component: LoginPageComponent},
  {
    path: 'purchase',
    canActivate: [AuthGuard],
    loadChildren: () => import('../../../purchases/src/public-api').then(mod => mod.PurchasesModule)
  }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    PurchasesModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule
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
  }
}
