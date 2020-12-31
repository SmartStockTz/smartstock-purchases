import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-product-details',
  template: `
    <form
      [formGroup]="productdetails"
      (ngSubmit)="record()"
      *ngIf="formvisibility"
    >
      <div class="row">
        <div class="col-lg-3 col-md-3">
          <mat-form-field color="primary" appearance="outline">
            <mat-label>Expiry date</mat-label>
            <input
              matInput
              [matDatepicker]="picker1"
              [min]="startdate"
              formControlName="expiredate"
            />
            <mat-error> pick a date</mat-error>
            <mat-datepicker-toggle
              matSuffix
              [for]="picker1"
            ></mat-datepicker-toggle>
            <mat-datepicker
              [touchUi]="true"
              #picker1
              [startAt]="startdate"
            ></mat-datepicker>
          </mat-form-field>
        </div>
        <div class="col-lg-3 col-md-3">
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
              />
              <mat-error>product quantity required</mat-error>
            </mat-form-field>
          </p>
        </div>
        <div class="col-lg-3 col-md-3">
          <p>
            <mat-form-field appearance="outline">
              <mat-label>Purchase price</mat-label>
              <input
                matInput
                placeholder="purchase price"
                formControlName="purchaseprice"
                type="number"
                required
                #purchaseprice
              />
              <mat-error>purchase price required</mat-error>
            </mat-form-field>
          </p>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-3 col-md-3">
          <p>
            <mat-form-field appearance="outline">
              <mat-label>Retail price</mat-label>
              <input
                matInput
                placeholder="retail price"
                formControlName="retailprice"
                type="number"
                required
              />
              <mat-error>retail price required</mat-error>
            </mat-form-field>
          </p>
        </div>
        <div class="col-lg-3 col-md-3">
          <p>
            <mat-form-field appearance="outline">
              <mat-label>Wholesale price </mat-label>
              <input
                matInput
                placeholder="wholesale price"
                formControlName="wholesaleprice"
                type="number"
                required
              />
              <mat-error>wholesale price required</mat-error>
            </mat-form-field>
          </p>
        </div>
        <div class="col-lg-3 col-md-3">
          <p>
            <mat-form-field appearance="outline">
              <mat-label>wholesale quantity</mat-label>
              <input
                matInput
                placeholder="wholesale quantity"
                formControlName="wholesalequantity"
                type="number"
                required
              />
              <mat-error>wholesale quantity required</mat-error>
            </mat-form-field>
          </p>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-4 col-md-4">
          <h2 class="producttotal">
            Product amount: {{ quantity.value * purchaseprice.value | number }}
          </h2>
        </div>
        <div class="col-lg-3 col-md-3">
          <button
            type="submit"
            mat-raised-button
            [disabled]="!productdetails.valid"
          >
            Record
          </button>
        </div>
      </div>
      <div *ngIf="productdetails.valid">
        {{ productdetails.value | json }}
      </div>
    </form>
  `,
  styleUrls: ['../styles/productdetails.style.scss'],
})
export class ProductDetailComponent implements OnInit {
  @Input() formvisibility: boolean;
  productdetails: FormGroup;
  startdate: Date = new Date();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.productdetails = this.fb.group({
      expiredate: ['', Validators.required],
      quantity: ['', Validators.required],
      purchaseprice: ['', Validators.required],
      retailprice: ['', Validators.required],
      wholesaleprice: ['', Validators.required],
      wholesalequantity: ['', Validators.required],
    });
  }

  record(): void {
    this.formvisibility = false;
  }
}
