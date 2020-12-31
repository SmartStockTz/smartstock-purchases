import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StockModel } from './../models/stock.model';

@Component({
  selector: 'app-product-details',
  template: `
    <form
      [formGroup]="productdetailsform"
      (ngSubmit)="record()"
      *ngIf="formvisibility"
    >
      <h3>
        Name:
        <strong> {{ productdetails.product }} </strong>
      </h3>
      <h3>{{ productdetails.purchase }}</h3>
      <h3>{{ productdetails.retailPrice }}</h3>
      <h3>{{ productdetails.wholesalePrice }}</h3>
      <h3>{{ productdetails.wholesaleQuantity }}</h3>

      <div class="row">
        <div class="col-lg-3 col-md-3">
          <mat-form-field color="primary" appearance="outline">
            <mat-label>Expiry date</mat-label>
            <input
              matInput
              [matDatepicker]="picker1"
              [min]="Todaysdate"
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
              [startAt]="Todaysdate"
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
                [ngModel]="productdetails.purchase"
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
                [value]="productdetails.purchase"
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
                [value]="productdetails.retailPrice"
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
                [value]="productdetails.wholesalePrice"
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
                [value]="productdetails.wholesaleQuantity"
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
            [disabled]="!productdetailsform.valid"
          >
            Record
          </button>
        </div>
      </div>
      <div *ngIf="productdetailsform.valid">
        {{ productdetailsform.value | json }}
      </div>
    </form>
  `,
  styleUrls: ['../styles/productdetails.style.scss'],
})
export class ProductDetailComponent implements OnInit {
  @Input() formvisibility: boolean;
  @Input() productdetails: StockModel;

  productdetailsform: FormGroup;
  Todaysdate: Date = new Date();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.productdetailsform = this.fb.group({
      expiredate: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]],
      purchaseprice: ['', [Validators.required, Validators.min(1)]],
      retailprice: ['', [Validators.required, Validators.min(1)]],
      wholesaleprice: ['', [Validators.required, Validators.min(1)]],
      wholesalequantity: ['', [Validators.required, Validators.min(1)]],
    });
  }

  record(): void {
    this.formvisibility = false;
  }
}
