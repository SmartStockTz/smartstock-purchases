import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { auth, init } from "bfast";
import { getDaasAddress, getFaasAddress, UserService } from "smartstock-core";

@Component({
  selector: "app-login",
  template: `
    <div
      style="height: 100vh; display: flex; justify-content: center; align-items: center; flex-direction: column"
    >
      <mat-card>
        <mat-card-content>
          <form
            [formGroup]="loginForm"
            (submit)="login()"
            style="display: flex; flex-direction: column"
          >
            <mat-form-field style="width: 300px">
              <mat-label>Username</mat-label>
              <input matInput formControlName="username" />
              <mat-error>Field required</mat-error>
            </mat-form-field>
            <mat-form-field style="width: 300px">
              <mat-label>Password</mat-label>
              <input matInput formControlName="password" />
              <mat-error>Field required</mat-error>
            </mat-form-field>
            <button *ngIf="!isLogin" mat-flat-button color="primary">
              Login
            </button>
            <mat-progress-spinner
              color="primary"
              mode="indeterminate"
              diameter="30"
              *ngIf="isLogin"
            ></mat-progress-spinner>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `
})
export class LoginPageComponent implements OnInit {
  loginForm: UntypedFormGroup;
  isLogin = false;

  constructor(
    private readonly formBuilder: UntypedFormBuilder,
    private readonly router: Router,
    private readonly userService: UserService,
    private readonly snack: MatSnackBar
  ) {}

  login(): void {
    if (!this.loginForm.valid) {
      this.snack.open("Please fill all required fields", "Ok", {
        duration: 3000
      });
    } else {
      this.isLogin = true;
      auth()
        .logIn(this.loginForm.value.username, this.loginForm.value.password)
        .then(async (user) => {
          this.router.navigateByUrl("/purchase").catch(console.log);
          const shops = await this.userService.getShops(user);
          init(
            {
              applicationId: shops[0].applicationId,
              projectId: shops[0].projectId,
              databaseURL: getDaasAddress(shops[0]),
              functionsURL: getFaasAddress(shops[0])
            },
            shops[0].projectId
          );
          await this.userService.saveCurrentShop(shops[0]);
        })
        .catch((reason) => {
          this.snack.open(
            reason && reason.message ? reason.message : reason,
            "Ok"
          );
        })
        .finally(() => {
          this.isLogin = false;
        });
    }
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ["", [Validators.nullValidator, Validators.required]],
      password: ["", [Validators.nullValidator, Validators.required]]
    });
  }
}
