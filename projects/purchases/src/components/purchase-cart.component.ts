import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {MatSidenav} from '@angular/material/sidenav';
import {CartDrawerState, DeviceState, UserService} from '@smartstocktz/core-libs';
import {CartState} from '../states/cart.state';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {SupplierState} from '../states/supplier.state';
import {SupplierModel} from '../models/supplier.model';
import {MatTableDataSource} from '@angular/material/table';
import {SavePurchaseDialogComponent} from './save-purchase-dialog.component';
import {PurchaseState} from '../states/purchase.state';

@Component({
  selector: 'app-purchase-cart',
  template: `
    <div id="cart_view" [ngClass]="(deviceState.isSmallScreen | async)===true?'cart-mobile':'cart'">
      <mat-toolbar class="mat-elevation-z3" style="z-index: 10000">
        <span [matBadge]="cartState.cartTotalItems | async" matBadgeOverlap="false">Cart</span>
        <span style="flex-grow: 1;"></span>
        <button mat-icon-button (click)="drawer.toggle()" style="float: right;">
          <mat-icon>close</mat-icon>
        </button>
      </mat-toolbar>
      <div style="padding: 5px 0 0 0">
        <div style="width: 100%; padding: 6px" class="row">
          <div class="flex-fill">
            <input class="supplier-input"
                   [formControl]="supplierFormControl"
                   placeholder="Supplier Name"
                   type="text" [matAutocomplete]="auto">
            <mat-autocomplete #auto="matAutocomplete">
              <mat-option *ngFor="let option of suppliersDatasource.connect() | async"
                          [value]="option.name"
                          (click)="setSelectedSupplier(option)">
                {{option.name}}
              </mat-option>
            </mat-autocomplete>
          </div>
          <!--          <button color="primary" (click)="addNewSupplier()" mat-icon-button>-->
          <!--            <mat-icon>add_circle_outline</mat-icon>-->
          <!--          </button>-->
        </div>
      </div>
      <div style="padding-bottom: 500px">
        <mat-list>
          <div *ngFor="let cart of cartState.carts | async; let i=index">
            <mat-list-item matTooltip="{{cart.product.product}}">
              <button (click)="cartState.removeItemFromCart(i)" matSuffix mat-icon-button>
                <mat-icon color="warn">delete</mat-icon>
              </button>
              <h4 matLine class="text-truncate">{{cart.product.product}}</h4>
              <mat-card-subtitle matLine>
                {{cart.quantity | number}} {{cart.product.unit}} @ {{cart.purchase | number}}
                = {{cart.quantity * cart.purchase | number}}
              </mat-card-subtitle>
              <div class="d-flex flex-row" matLine>
                <button color="primary" (click)="cartState.decrementCartItemQuantity(i)" mat-icon-button>
                  <mat-icon>remove_circle</mat-icon>
                </button>
                <button color="primary" (click)="cartState.incrementCartItemQuantity(i)" mat-icon-button>
                  <mat-icon>add_circle</mat-icon>
                </button>
              </div>
            </mat-list-item>
            <mat-divider style="margin-left: 5%; margin-right: 5%; margin-top: 4px"></mat-divider>
          </div>
        </mat-list>
      </div>
      <div
        style="padding: 8px 8px 16px 8px;bottom: 0;width: 100%;position: absolute;background-color: white;z-index: 1000;">
        <mat-divider style="margin-bottom: 7px"></mat-divider>
        <div class="checkout-container">
          <button [disabled]="(purchaseState.addPurchasesProgress | async)===true"
                  (click)="checkout()"
                  style="width: 100%;text-align:left;height: 48px;font-size: 18px" color="primary"
                  mat-flat-button>
            <span style="float: left;">{{cartState.cartTotal | async | number }}</span>
            <mat-progress-spinner *ngIf="(purchaseState.addPurchasesProgress | async)===true"
                                  mode="indeterminate"
                                  diameter="25"
                                  style="display: inline-block; float: right">
            </mat-progress-spinner>
            <span style="float: right" *ngIf="(purchaseState.addPurchasesProgress | async)===false">Save</span>
          </button>
          <!--          <button *ngIf="(cartState.checkoutProgress | async)===false"-->
          <!--                  (click)="openOptions()" mat-icon-button>-->
          <!--            <mat-icon>more_vert</mat-icon>-->
          <!--          </button>-->
        </div>
      </div>
    </div>
  `,
  styleUrls: ['../styles/cart.style.scss']
})
export class PurchaseCartComponent implements OnInit, OnDestroy {
  drawer: MatSidenav;
  supplierFormControl = new FormControl(
    '',
    [Validators.nullValidator, Validators.required, Validators.minLength(1)]
  );
  destroyer = new Subject();
  currentUser: any;
  suppliersDatasource = new MatTableDataSource([]);

  constructor(public readonly userService: UserService,
              public readonly supplierState: SupplierState,
              public readonly cartState: CartState,
              public readonly deviceState: DeviceState,
              public readonly snack: MatSnackBar,
              public readonly cartDrawerState: CartDrawerState,
              public readonly purchaseState: PurchaseState,
              public readonly sheet: MatBottomSheet,
              private readonly dialog: MatDialog) {
  }

  ngOnDestroy(): void {
    this.supplierState.suppliers.next([]);
    this.destroyer.next('done');
  }

  ngOnInit(): void {
    this.handleSupplierNameControl();
    this.cartDrawerState.drawer.pipe(
      takeUntil(this.destroyer)
    ).subscribe(value => {
      if (value) {
        this.drawer = value;
      }
    });
    this.supplierState.suppliers.pipe(
      takeUntil(this.destroyer)
    ).subscribe(value => {
      if (Array.isArray(value)) {
        this.suppliersDatasource.data = value;
      }
    });
    this.cartState.carts.pipe(
      takeUntil(this.destroyer)
    ).subscribe(value => {
      if (Array.isArray(value)) {
        this.cartState.findTotal(value);
      }
    });
  }

  // addNewSupplier(): void {
  //   this.dialog.open(DialogSupplierNewComponent, {
  //     // minWidth: '80%',
  //     closeOnNavigation: true,
  //   })
  //     .afterClosed()
  //     .subscribe((value) => {
  //       if (value) {
  //         // this.getSuppliers();
  //       }
  //     });
  // }

  private getUser(): void {
    this.userService.currentUser()
      .then(value => {
        this.currentUser = value;
      })
      .catch(_ => {
        this.currentUser = undefined;
      });
  }

  private handleSupplierNameControl(): void {
    this.supplierFormControl.valueChanges
      .pipe(takeUntil(this.destroyer))
      .subscribe((enteredName: string) => {
          if (enteredName !== null) {
            this.suppliersDatasource.filter = enteredName;
          }
        }
      );
  }

  checkout(): void {
    if (!this.cartState.selectedSupplier.value && this.supplierFormControl.value && this.supplierFormControl.value !== '') {
      this.cartState.selectedSupplier.next({
        name: this.supplierFormControl.value
      });
    }
    if (!this.cartState.selectedSupplier.value) {
      this.snack.open('Please enter supplier name', 'Ok', {
        duration: 3000
      });
      return;
    }
    this.dialog.open(SavePurchaseDialogComponent, {
      closeOnNavigation: true,
      width: '500px',
    });
  }

  setSelectedSupplier(option: SupplierModel) {
    this.cartState.selectedSupplier.next(option);
  }
}
