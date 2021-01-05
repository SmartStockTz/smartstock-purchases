import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { StockModel } from './../models/stock.model';

// @dynamic
@Component({
  selector: 'app-editproduct',
  template: `
    <form [formGroup]="productdetailsform" (ngSubmit)="addtolist($event)">
      <h3>
        Name:
        <strong> {{ productdetails.product.product }} </strong>
      </h3>

      <div class="row">
        <div class="col">
          <mat-form-field color="primary" appearance="outline">
            <mat-label>Expiry date</mat-label>
            <input
              matInput
              [matDatepicker]="picker1"
              [min]="Todaysdate"
              formControlName="expire"
              [(ngModel)]="productdetails.expire"
            />
            <mat-error> pick a date</mat-error>
            <mat-datepicker-toggle
              matSuffix
              [for]="picker1"
            ></mat-datepicker-toggle>
            <mat-datepicker
              [touchUi]="true"
              #picker1
              [startAt]="Todaysdate"
            ></mat-datepicker>
          </mat-form-field>
        </div>
        <div class="col">
          <p>
            <mat-form-field appearance="outline">
              <mat-label>Product quantity</mat-label>
              <input
                matInput
                placeholder="quantity"
                formControlName="quantity"
                type="number"
                required
                #quantity
                [(ngModel)]="productdetails.quantity"
              />
              <mat-error>product quantity required</mat-error>
            </mat-form-field>
          </p>
        </div>
        <div class="col">
          <p>
            <mat-form-field appearance="outline">
              <mat-label>Purchase price</mat-label>
              <input
                matInput
                placeholder="purchase price"
                formControlName="purchase"
                type="number"
                required
                #purchaseprice
                [(ngModel)]="productdetails.purchase"
              />
              <mat-error>purchase price required</mat-error>
            </mat-form-field>
          </p>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <p>
            <mat-form-field appearance="outline">
              <mat-label>Retail price</mat-label>
              <input
                matInput
                placeholder="retail price"
                formControlName="retailPrice"
                type="number"
                required
                [(ngModel)]="productdetails.retailPrice"
              />
              <mat-error>retail price required</mat-error>
            </mat-form-field>
          </p>
        </div>
        <div class="col">
          <p>
            <mat-form-field appearance="outline">
              <mat-label>Wholesale price </mat-label>
              <input
                matInput
                placeholder="wholesale price"
                formControlName="wholesalePrice"
                type="number"
                required
                [(ngModel)]="productdetails.wholesalePrice"
              />
              <mat-error>wholesale price required</mat-error>
            </mat-form-field>
          </p>
        </div>
        <div class="col">
          <p>
            <mat-form-field appearance="outline">
              <mat-label>wholesale quantity</mat-label>
              <input
                matInput
                placeholder="wholesale quantity"
                formControlName="wholesaleQuantity"
                type="number"
                required
                [(ngModel)]="productdetails.wholesaleQuantity"
              />
              <mat-error>wholesale quantity required</mat-error>
            </mat-form-field>
          </p>
        </div>
      </div>
      <div class="row">
        <!-- <div class="col-lg-6 col-md-6"> -->
        <h2>
          Product amount:
          <strong> {{ quantity.value * purchaseprice.value | number }}</strong>
        </h2>
        <!-- </div> -->
      </div>
      <mat-dialog-actions align="end">
        <button mat-raised-button mat-dialog-close>Cancel</button>
        <button
          mat-raised-button
          [mat-dialog-close]="productdetailsform.value"
          class="addtolist"
          type="submit"
          [disabled]="!productdetailsform.valid"
        >
          Add to list
        </button>
      </mat-dialog-actions>
    </form>
  `,
  styleUrls: ['../styles/editproduct.scss'],
})
export class EditproductComponent implements OnInit {
  productdetailsform: FormGroup;
  Todaysdate: Date = new Date();

  constructor(
    private fb: FormBuilder,
    public readonly dialogRef: MatDialogRef<EditproductComponent>,
    @Inject(MAT_DIALOG_DATA)
    public productdetails: {
      product: StockModel;
      expire: Date;
      quantity: number;
      purchase: number;
      retailPrice: number;
      wholesalePrice: number;
      wholesaleQuantity: number;
      amount: number;
    }
  ) {}

  ngOnInit(): void {
    this.productdetailsform = this.fb.group({
      product: [this.productdetails.product],
      expire: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]],
      purchase: ['', [Validators.required, Validators.min(1)]],
      retailPrice: ['', [Validators.required, Validators.min(1)]],
      wholesalePrice: ['', [Validators.required, Validators.min(1)]],
      wholesaleQuantity: ['', [Validators.required, Validators.min(1)]],
      amount: [''],
    });
  }

  addtolist($event): void {
    $event.preventDefault();
  }
}
