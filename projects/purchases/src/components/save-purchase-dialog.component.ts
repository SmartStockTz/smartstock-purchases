import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {StockModel} from '../models/stock.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CartState} from '../states/cart.state';
import {PurchaseState} from '../states/purchase.state';
import {UserService} from '@smartstocktz/core-libs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';

@Component({
  selector: 'app-save-purchase-dialog',
  template: `
    <div class="dialog-container">
      <div class="dialog-header">
        <div class="dialog-header-line"></div>
      </div>
      <form class="inputs-container" [formGroup]="purchaseHeaderForm" (ngSubmit)="recordPurchase()">
        <div class="input-container">
          <p class="input-head">Purchase reference</p>
          <input formControlName="refNumber" class="input-body">
          <mat-error *ngIf="purchaseHeaderForm.get('refNumber').invalid">
            Purchase reference required
          </mat-error>
        </div>
        <div class="input-container">
          <p class="input-head">Purchase type</p>
          <mat-form-field appearance="outline">
            <mat-select formControlName="type" [value]="'receipt'">
              <mat-option [value]="'receipt'">Cash purchase</mat-option>
              <mat-option [value]="'invoice'">Invoice purchase</mat-option>
            </mat-select>
            <mat-error *ngIf="purchaseHeaderForm.get('type').invalid">
              Purchase type required
            </mat-error>
          </mat-form-field>
        </div>
        <mat-form-field appearance="outline">
          <mat-label class="input-head">Purchase date</mat-label>
          <input matInput formControlName="date" [matDatepicker]="picker">
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
          <mat-error>Purchase date required</mat-error>
        </mat-form-field>
        <mat-form-field appearance="outline" *ngIf="purchaseHeaderForm.get('type').value === 'invoice'">
          <mat-label class="input-head">Due date</mat-label>
          <input formControlName="due" matInput [matDatepicker]="picker2">
          <mat-datepicker-toggle matSuffix [for]="picker2"></mat-datepicker-toggle>
          <mat-datepicker #picker2></mat-datepicker>
        </mat-form-field>
        <div class="input-container">
          <button color="primary" [disabled]="purchaseHeaderForm.invalid"
                  mat-flat-button
                  class="add-button add-button-text">
            Save purchase [ {{cartState.cartTotal | async | number}} ]
          </button>
        </div>
      </form>
    </div>
  `,
  styleUrls: ['../styles/add-to-cart.style.scss']
})

export class SavePurchaseDialogComponent implements OnInit {
  purchaseHeaderForm: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public readonly data: StockModel,
              public readonly cartState: CartState,
              private readonly dialogRef: MatDialogRef<SavePurchaseDialogComponent>,
              private readonly purchaseState: PurchaseState,
              private readonly userService: UserService,
              private readonly snack: MatSnackBar,
              private readonly router: Router,
              private readonly formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.purchaseHeaderForm = this.formBuilder.group({
      refNumber: ['', [Validators.required, Validators.nullValidator]],
      type: ['receipt', [Validators.required, Validators.nullValidator]],
      date: [new Date(), [Validators.required, Validators.nullValidator]],
      due: [new Date(), [Validators.required, Validators.nullValidator]],
    });
  }

  recordPurchase() {
    this.dialogRef.close();
    this.userService.currentUser().then(user => {
      return this.purchaseState.addPurchase({
        supplier: this.cartState.selectedSupplier.value,
        due: this.purchaseHeaderForm.value.due,
        date: this.purchaseHeaderForm.value.date,
        refNumber: this.purchaseHeaderForm.value.refNumber,
        payment: {},
        items: this.cartState.carts.value,
        amount: this.cartState.cartTotal.value,
        draft: false,
        type: this.purchaseHeaderForm.value.type,
        user: {
          username: user.username,
          lastname: user.lastname,
          firstname: user.firstname
        }
      });
    }).then(_ => {
      this.cartState.dispose();
      this.router.navigateByUrl('/purchase').catch(console.log);
    }).catch(reason => {
      this.snack.open(reason && reason.message ? reason.message : reason.toString(), 'Ok', {
        duration: 3000
      });
    });
  }
}
