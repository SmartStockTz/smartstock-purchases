import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StockModel } from './../models/stock.model';

@Component({
  selector: 'app-product-details',
  template: `
    <form
      [formGroup]="productdetailsform"
      (ngSubmit)="addtolist(quantity.value, purchaseprice.value, $event)"
      *ngIf="formvisibility"
    >
      <h3>
        Name:
        <strong> {{ productdetails.product }} </strong>
      </h3>

      <div class="row">
        <div class="col-lg-3 col-md-3">
          <mat-form-field color="primary" appearance="outline">
            <mat-label>Expiry date</mat-label>
            <input
              matInput
              [matDatepicker]="picker1"
              [min]="Todaysdate"
              formControlName="expire"
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
        <div class="col-lg-3 col-md-3">
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
        <div class="col-lg-3 col-md-3">
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
        <div class="col-lg-3 col-md-3">
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
        <div class="col-lg-4 col-md-4">
          <h2>
            Product amount:
            <strong>
              {{ quantity.value * purchaseprice.value | number }}</strong
            >
          </h2>
        </div>
        <div class="col-lg-3 col-md-3">
          <button
            type="submit"
            mat-raised-button
            [disabled]="!productdetailsform.valid"
          >
            Add to list
          </button>
        </div>
      </div>
    </form>
  `,
  styleUrls: ['../styles/productdetails.style.scss'],
})
export class ProductDetailComponent implements OnInit {
  @Input() formvisibility: boolean;
  @Input() productdetails: StockModel;
  @Output() product = new EventEmitter<StockModel>();

  productdetailsform: FormGroup;
  Todaysdate: Date = new Date();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.productdetailsform = this.fb.group({
      product: [''],
      expire: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]],
      purchase: ['', [Validators.required, Validators.min(1)]],
      retailPrice: ['', [Validators.required, Validators.min(1)]],
      wholesalePrice: ['', [Validators.required, Validators.min(1)]],
      wholesaleQuantity: ['', [Validators.required, Validators.min(1)]],
      amount: [''],
    });
  }

  addtolist(quantity, purchaseprice, $event): void {
    $event.preventDefault();
    const product = this.productdetails;
    this.productdetailsform.get('product').setValue(product);
    const amount = quantity * purchaseprice;
    this.productdetailsform.get('amount').setValue(amount);
    this.product.emit(this.productdetailsform.value);
  }
}
