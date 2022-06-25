import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { init } from "bfast";
import { environment } from "../environments/environment";

import { AppComponent } from "./app.component";
import { RouterModule, Routes } from "@angular/router";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { LoginPageComponent } from "./pages/login.page";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatFormFieldModule } from "@angular/material/form-field";
import { ReactiveFormsModule } from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { AuthGuard } from "./guards/auth.guard";
import { WelcomePage } from "./pages/welcome.page";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { HttpClientModule } from "@angular/common/http";
import { MatDialogModule } from "@angular/material/dialog";
import { MatBottomSheetModule } from "@angular/material/bottom-sheet";
import { SyncsService } from "smartstock-core";

const routes: Routes = [
  { path: "", component: WelcomePage },
  { path: "login", component: LoginPageComponent },
  {
    path: "purchase",
    canActivate: [AuthGuard],
    loadChildren: () =>
      import("../../../purchases/src/public-api").then(
        (mod) => mod.PurchasesModule
      )
  }
];

@NgModule({
  declarations: [AppComponent, WelcomePage, LoginPageComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    HttpClientModule,
    MatDialogModule,
    MatBottomSheetModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private readonly syncService: SyncsService) {
    init({
      applicationId: environment.smartstock.applicationId,
      projectId: environment.smartstock.projectId,
      appPassword: environment.smartstock.pass
    });
    syncService.startWorker().catch(console.log);
  }
}
