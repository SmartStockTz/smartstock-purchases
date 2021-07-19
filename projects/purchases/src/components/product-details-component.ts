import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StockModel } from './../models/stock.model';

@Component({
  selector: 'app-product-details',
  template: `
  <mat-card>
    <form
      [formGroup]="productdetailsform"
      (ngSubmit)="addtolist(quantity.value, purchaseprice.value, $event)"
      *ngIf="formvisibility">
      <h3>
        Name:
        <strong> {{ productdetails.product }} </strong>
      </h3>

      <div class="row">
        <div class="form-f">
          <mat-form-field color="primary" *ngIf="productdetails && productdetails.canExpire" appearance="outline">
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
        <div class="form-f">
          <p>
            <mat-form-field appearance="outline">
              <mat-label>Product quantity</mat-label>
              <input
                matInput
                placeholder="quantity"
                formControlName="quantity"
                type="number"
                #quantity
              />
              <mat-error>product quantity required</mat-error>
            </mat-form-field>
          </p>
        </div>
        <div class="form-f">
          <p>
            <mat-form-field appearance="outline">
              <mat-label>Purchase price</mat-label>
              <input
                matInput
                placeholder="purchase price"
                formControlName="purchase"
                type="number"
                #purchaseprice
              />
              <mat-error>purchase price required</mat-error>
            </mat-form-field>
          </p>
        </div>
      <!-- </div>
      <div class="row"> -->
        <div class="form-f">
          <p>
            <mat-form-field appearance="outline">
              <mat-label>Retail price</mat-label>
              <input
                matInput
                placeholder="retail price"
                formControlName="retailPrice"
                type="number"
              />
              <mat-error>retail price required</mat-error>
            </mat-form-field>
          </p>
        </div>
        <div class="form-f">
          <p>
            <mat-form-field appearance="outline">
              <mat-label>Wholesale price </mat-label>
              <input
                matInput
                placeholder="wholesale price"
                formControlName="wholesalePrice"
                type="number"
              />
              <mat-error>wholesale price required</mat-error>
            </mat-form-field>
          </p>
        </div>
      </div>
      <div class="row">
        <div class="form-f">
          <h2>
            Product amount:
            <strong>
              {{ quantity.value * purchaseprice.value | number }}</strong
            >
          </h2>
        </div>
        <div class="">
          <button
            type="submit"
            mat-raised-button
            [disabled]="!productdetailsform.valid">
            Add to list
          </button>
          <!-- <button
            type="submit"
            color="warn"
            mat-raised-button
            [disabled]="!productdetailsform.valid">
            Cancel
          </button> -->
        </div>
      </div>
    </form>
  </mat-card>
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
    // console.log(this.productdetails);
    this.productdetailsform = this.fb.group({
      product: [this.productdetails?.product],
      expire: [''],
      quantity: [1, [Validators.required, Validators.min(1)]],
      purchase: [this.productdetails?.purchase, [Validators.required, Validators.min(1)]],
      retailPrice: [this.productdetails?.retailPrice, [Validators.required, Validators.min(1)]],
      wholesalePrice: [this.productdetails?.wholesalePrice, [Validators.required, Validators.min(1)]],
      wholesaleQuantity: [this.productdetails?.wholesaleQuantity, [Validators.required, Validators.min(1)]],
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
