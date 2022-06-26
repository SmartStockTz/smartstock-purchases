import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {StockModel} from '../models/stock.model';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {CartState} from '../states/cart.state';
import {PurchaseItemModel} from '../models/purchase-item.model';
import {StockState} from '../states/stock.state';

@Component({
  selector: 'app-add-to-cart-form',
  template: `
    <div class="dialog-container">
      <div class="dialog-header">
        <div class="dialog-header-line"></div>
      </div>
      <form class="inputs-container" [formGroup]="addToCartForm" (ngSubmit)="addToCart()">
        <div class="input-container">
          <p class="input-head">Purchased quantities</p>
          <input formControlName="quantity" type="number" class="input-body">
          <mat-error *ngIf="addToCartForm.get('quantity').invalid">
            Quantity required and must be greater that zero
          </mat-error>
        </div>
        <div class="input-container">
          <p class="input-head">Purchase price</p>
          <input formControlName="purchase" type="number" class="input-body">
          <mat-error *ngIf="addToCartForm.get('purchase').invalid">
            Purchase required and must be positive number
          </mat-error>
        </div>
        <div class="input-container">
          <p class="input-head">New retail price</p>
          <input formControlName="retailPrice" type="number" class="input-body">
          <mat-error *ngIf="addToCartForm.get('retailPrice').invalid">
            Retail price required and must be positive number
          </mat-error>
        </div>
        <div class="input-container">
          <p class="input-head">New wholesale price</p>
          <input formControlName="wholesalePrice" type="number" class="input-body">
          <mat-error *ngIf="addToCartForm.get('wholesalePrice').invalid">
            Wholesale price required and must be positive number
          </mat-error>
        </div>

        <!--        <div *ngIf="product.canExpire" class="input-container">-->
        <!--          <p class="input-head">Expire date</p>-->
        <!--          <input formControlName="expire" type="number" class="input-body">-->
        <!--        </div>-->

        <mat-form-field *ngIf="product.canExpire" appearance="outline">
          <mat-label class="input-head">Expire date</mat-label>
          <input matInput formControlName="expire" [matDatepicker]="picker">
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
<!--          <mat-error>Payment date required</mat-error>-->
        </mat-form-field>

        <div class="input-container">
          <button color="primary" [disabled]="addToCartForm.invalid"
                  mat-flat-button
                  class="add-button add-button-text">
            Add to cart [ {{addToCartForm.value.quantity * addToCartForm.value.purchase | number}} ]
          </button>
        </div>
      </form>
    </div>
  `,
  styleUrls: ['../styles/add-to-cart.style.scss']
})

export class AddToCartFormComponent implements OnInit {
  addToCartForm: UntypedFormGroup;
  @Input() product: StockModel;
  @Output() done = new EventEmitter();

  constructor(private readonly cartState: CartState,
              private readonly stockState: StockState,
              private readonly formBuilder: UntypedFormBuilder) {
  }

  ngOnInit(): void {
    this.addToCartForm = this.formBuilder.group({
      quantity: ['', [Validators.required, Validators.nullValidator, Validators.min(1)]],
      purchase: [this.product.purchase, [Validators.required, Validators.nullValidator, Validators.min(0)]],
      retailPrice: [this.product.retailPrice, [Validators.required, Validators.nullValidator, Validators.min(0)]],
      wholesalePrice: [this.product.wholesalePrice, [Validators.required, Validators.nullValidator, Validators.min(0)]],
      expire: [null, []],
    });
  }

  addToCart() {
    const purchaseItem: PurchaseItemModel = Object.assign({}, this.addToCartForm.value);
    purchaseItem.product = this.product;
    purchaseItem.amount = purchaseItem.quantity * purchaseItem.purchase;
    this.cartState.addToCart(purchaseItem);
    this.done.emit('done');
  }
}
