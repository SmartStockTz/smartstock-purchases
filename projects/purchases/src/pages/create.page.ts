import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Observable, of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Router } from '@angular/router';
import { DialogSupplierNewComponent } from '../components/suppliers.component';
import { StockModel } from '../models/stock.model';
import { PurchaseState } from '../states/purchase.state';
import { DeviceInfoUtil, toSqlDate } from '@smartstocktz/core-libs';
import { StorageService } from '@smartstocktz/core-libs';
import { StockState } from '../states/stock.state';
import { ProductSearchDialogComponent } from '../components/product-search-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { EditproductComponent } from './../components/editproduct.component';

@Component({
  selector: 'smartstock-purchase-create',
  template: `
    <mat-sidenav-container class="match-parent">
      <mat-sidenav
        class="match-parent-side"
        #sidenav
        [mode]="enoughWidth() ? 'side' : 'over'"
        [opened]="enoughWidth()"
      >
        <smartstock-drawer></smartstock-drawer>
      </mat-sidenav>

      <mat-sidenav-content>
        <smartstock-toolbar
          [heading]="'Add Purchase'"
          searchPlaceholder="Search product"
          [sidenav]="sidenav"
          [showProgress]="false"
          [hasBackRoute]="true"
          [backLink]="'/purchase'"
        >
        </smartstock-toolbar>
        <div class="container">
          <form [formGroup]="invoiceForm" (ngSubmit)="saveInvoice($event)">
            <div class="row d-flex justify-content-center align-items-center">
              <div class="col-12 col-xl-12 col-lg-12">
                <h2>Receipt information</h2>
                <mat-card class="mat-elevation-z0">
                  <mat-card-content class="card-content">
                    <mat-slide-toggle
                      style="margin-bottom: 8px; margin-top: 8px"
                      color="primary"
                      labelPosition="after"
                      [formControl]="isInvoiceFormControl"
                      label="Invoice purchase"
                    >
                      Invoice purchase
                    </mat-slide-toggle>
                    <div class="row">
                      <div class="col-md-3 col-lg-3">
                        <mat-form-field appearance="outline" class="my-input">
                          <mat-label>ref #</mat-label>
                          <input matInput formControlName="refNumber" />
                          <mat-error
                            >Purchase reference number required</mat-error
                          >
                        </mat-form-field>
                      </div>
                      <div class="col-md-3 col-lg-3">
                        <mat-form-field appearance="outline" class="my-input">
                          <mat-label>Supplier</mat-label>
                          <mat-select formControlName="supplier">
                            <mat-option
                              *ngFor="let supplier of suppliers | async"
                              [value]="supplier"
                            >
                              {{ supplier.name }}
                            </mat-option>
                          </mat-select>
                          <mat-progress-spinner
                            matTooltip="Fetching suppliers"
                            *ngIf="supplierFetching"
                            matSuffix
                            color="accent"
                            mode="indeterminate"
                            [diameter]="20"
                          ></mat-progress-spinner>
                          <mat-error>Supplier required</mat-error>
                          <div matSuffix class="d-flex flex-row">
                            <button
                              (click)="refreshSuppliers($event)"
                              mat-icon-button
                              matTooltip="refresh suppliers"
                              *ngIf="!supplierFetching"
                            >
                              <mat-icon>refresh</mat-icon>
                            </button>
                            <button
                              (click)="addNewSupplier($event)"
                              mat-icon-button
                              matTooltip="add new supplier"
                              *ngIf="!supplierFetching"
                            >
                              <mat-icon>add</mat-icon>
                            </button>
                          </div>
                        </mat-form-field>
                      </div>
                      <div class="col-md-3 col-lg-3">
                        <mat-form-field appearance="outline" class="my-input">
                          <mat-label>Purchase Date</mat-label>
                          <input
                            matInput
                            [matDatepicker]="picker"
                            formControlName="date"
                            required
                          />
                          <mat-datepicker-toggle
                            matSuffix
                            [for]="picker"
                          ></mat-datepicker-toggle>
                          <mat-datepicker
                            [touchUi]="true"
                            #picker
                          ></mat-datepicker>
                        </mat-form-field>
                      </div>
                      <div class="col-md-3 col-lg-3">
                        <mat-form-field
                          *ngIf="isInvoiceFormControl.value"
                          appearance="outline"
                          class="my-input"
                        >
                          <mat-label>Due Date</mat-label>
                          <input
                            matInput
                            [matDatepicker]="pickerDue"
                            formControlName="due"
                          />
                          <mat-datepicker-toggle
                            matSuffix
                            [for]="pickerDue"
                          ></mat-datepicker-toggle>
                          <mat-datepicker
                            [touchUi]="true"
                            #pickerDue
                          ></mat-datepicker>
                        </mat-form-field>
                      </div>
                    </div>
                  </mat-card-content>
                </mat-card>

                <!-- <h2>Purchased products</h2> -->

                <div
                  style="margin-bottom: 16px; display: flex; flex-direction: row; flex-wrap: wrap"
                >
                  <button
                    (click)="addProduct($event)"
                    mat-button
                    color="primary"
                  >
                    <mat-icon matSuffix>add</mat-icon>
                    Add Product
                  </button>
                </div>

                <app-product-details
                  [formvisibility]="formvisibility"
                  [productdetails]="productdetails"
                  (product)="addProductToTable($event)"
                ></app-product-details>

                <mat-card class="mat-elevation-z3 productlistable">
                  <h2>Purchased products list</h2>
                  <table mat-table [dataSource]="purchaseDatasource">
                    <ng-container cdkColumnDef="product">
                      <th mat-header-cell *cdkHeaderCellDef>Product</th>
                      <td mat-cell *cdkCellDef="let element">
                        {{ element.product.product }}
                      </td>
                      <td mat-footer-cell *cdkFooterCellDef>
                        <h2 style="margin: 0; padding: 5px">TOTAL</h2>
                      </td>
                    </ng-container>

                    <ng-container cdkColumnDef="expiredate">
                      <th mat-header-cell *cdkHeaderCellDef>Expire Date</th>
                      <td mat-cell *cdkCellDef="let element">
                        {{ element.expire | date }}
                      </td>
                      <td mat-footer-cell *cdkFooterCellDef></td>
                    </ng-container>

                    <ng-container cdkColumnDef="quantity">
                      <th mat-header-cell *cdkHeaderCellDef>Quantity</th>
                      <td mat-cell *cdkCellDef="let element">
                        {{ element.quantity }}
                      </td>
                      <td mat-footer-cell *cdkFooterCellDef></td>
                    </ng-container>

                    <ng-container cdkColumnDef="purchaseprice">
                      <th mat-header-cell *cdkHeaderCellDef>Purchase price</th>
                      <td mat-cell *cdkCellDef="let element">
                        {{ element.purchase }}
                      </td>

                      <td mat-footer-cell *cdkFooterCellDef></td>
                    </ng-container>

                    <ng-container cdkColumnDef="retailprice">
                      <th mat-header-cell *cdkHeaderCellDef>Retail price</th>
                      <td mat-cell *cdkCellDef="let element">
                        {{ element.retailPrice }}
                      </td>
                      <td mat-footer-cell *cdkFooterCellDef></td>
                    </ng-container>

                    <ng-container cdkColumnDef="wholesaleprice">
                      <th mat-header-cell *cdkHeaderCellDef>Wholesale price</th>
                      <td mat-cell *cdkCellDef="let element">
                        {{ element.wholesalePrice }}
                      </td>
                      <td mat-footer-cell *cdkFooterCellDef></td>
                    </ng-container>

                    <ng-container cdkColumnDef="wholesalequantity">
                      <th mat-header-cell *cdkHeaderCellDef>
                        Wholesale quantity
                      </th>
                      <td mat-cell *cdkCellDef="let element">
                        {{ element.wholesaleQuantity }}
                      </td>
                      <td mat-footer-cell *cdkFooterCellDef></td>
                    </ng-container>

                    <ng-container cdkColumnDef="Amount">
                      <th mat-header-cell *cdkHeaderCellDef>Amount</th>
                      <td mat-cell *cdkCellDef="let element">
                        {{ element.amount }}
                      </td>
                      <td mat-footer-cell *cdkFooterCellDef>
                        <h1 style="margin: 0; padding: 5px">
                          {{ totalCost | number }}
                        </h1>
                      </td>
                    </ng-container>

                    <ng-container cdkColumnDef="action">
                      <th mat-header-cell *cdkHeaderCellDef>Action</th>
                      <td mat-cell *cdkCellDef="let element">
                        <button
                          (click)="editproduct($event, element)"
                          mat-icon-button
                          color="primary"
                          matTooltip="Edit product info"
                          matTooltipPosition="above"
                        >
                          <mat-icon>edit</mat-icon>
                        </button>
                        <button
                          (click)="removeItem($event, element)"
                          mat-icon-button
                          color="warn"
                          matTooltip="Remove product from list"
                          matTooltipPosition="above"
                        >
                          <mat-icon>delete</mat-icon>
                        </button>
                      </td>
                      <td mat-footer-cell *cdkFooterCellDef></td>
                    </ng-container>

                    <tr
                      mat-header-row
                      *cdkHeaderRowDef="purchaseTableColumn"
                    ></tr>
                    <tr
                      mat-row
                      *matRowDef="let row; columns: purchaseTableColumn"
                    ></tr>
                    <tr
                      mat-footer-row
                      *cdkFooterRowDef="purchaseTableColumn"
                    ></tr>
                  </table>
                </mat-card>
              </div>

              <div class="status">
                <button
                  [disabled]="saveInvoiceProgress"
                  class="btn-block ft-button"
                  mat-flat-button
                  color="primary"
                >
                  Record purchase
                  <mat-progress-spinner
                    style="display: inline-block"
                    *ngIf="saveInvoiceProgress"
                    mode="indeterminate"
                    [diameter]="15"
                    color="accent"
                  >
                  </mat-progress-spinner>
                </button>
                <div style="margin-bottom: 48px"></div>
              </div>
            </div>
          </form>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styleUrls: ['../styles/create.style.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CreatePageComponent extends DeviceInfoUtil implements OnInit {
  formvisibility: boolean;
  productdetails: StockModel;

  purchaseTableColumn = [
    'product',
    'expiredate',
    'quantity',
    'purchaseprice',
    'retailprice',
    'wholesaleprice',
    'wholesalequantity',
    'Amount',
    'action',
  ];

  purchaseDatasource = new MatTableDataSource([]);

  selectedProducts = [];
  totalCost: number;

  invoiceForm: FormGroup;
  supplierFetching = true;
  suppliers: Observable<any[]>;
  searchProductFormControl = new FormControl('', [
    Validators.nullValidator,
    Validators.required,
  ]);
  products: Observable<any[]>;
  selectedProduct: StockModel;
  saveInvoiceProgress = false;
  searchProductProgress = false;
  isInvoiceFormControl = new FormControl(false, [
    Validators.required,
    Validators.nullValidator,
  ]);

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly snack: MatSnackBar,
    private readonly router: Router,
    private readonly matDialog: MatDialog,
    private readonly indexDb: StorageService,
    private readonly purchaseState: PurchaseState,
    private stockstate: StockState,
    private readonly dialog: MatDialog
  ) {
    super();
  }

  ngOnInit(): void {
    this.invoiceForm = this.formBuilder.group({
      refNumber: ['', [Validators.nullValidator, Validators.required]],
      supplier: [null, [Validators.nullValidator, Validators.required]],
      date: ['', [Validators.nullValidator, Validators.required]],
      due: [''],
      paid: [false],
      draft: [false],
      amount: [0, Validators.required],
      items: [[], Validators.required],
    });
    this.getSuppliers();
    this.searchProductFormControl.valueChanges
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((value) => {
        if (value) {
          this.searchProduct(value);
        }
      });
  }

  get invoiceItems(): FormArray {
    return this.invoiceForm.get('items') as FormArray;
  }

  searchProduct(productName: string): void {
    if (
      !this.selectedProduct ||
      (this.selectedProduct && this.selectedProduct.product !== productName)
    ) {
      this.searchProductProgress = true;
      this.indexDb
        .getStocks()
        .then((stocks) => {
          const dataArray = stocks.filter(
            (value) =>
              value.product.toLowerCase().indexOf(productName.toLowerCase()) !==
              -1
          );
          this.products = of(dataArray);
          this.searchProductProgress = false;
        })
        .catch((reason) => {
          this.snack.open(
            reason && reason.message ? reason.message : reason.toString()
          );
          this.products = of([]);
          this.searchProductProgress = false;
        });
    }
  }

  getstocks(): void {
    this.stockstate.getAllStock();
  }

  saveInvoice(event: MouseEvent): void {
    event.preventDefault();
    this.invoiceForm.get('items').setValue(this.purchaseDatasource.data);
    this.invoiceForm.get('amount').setValue(this.totalCost);

    if (!this.invoiceForm.valid) {
      this.snack.open('Please fill all required information', 'Ok', {
        duration: 3000,
      });
      return;
    }
    const due = this.invoiceForm.get('due').value;
    if (this.isInvoiceFormControl.value && !due) {
      this.snack.open('Due date required if you choose invoice', 'Ok', {
        duration: 3000,
      });
      return;
    }
    if (this.isInvoiceFormControl.value) {
      this.invoiceForm.value.type = 'invoice';
      this.invoiceForm.value.paid = false;
    } else {
      this.invoiceForm.value.type = 'receipt';
      this.invoiceForm.value.paid = false;
    }
    this.saveInvoiceProgress = true;
    this.purchaseState
      .addPurchase(this.invoiceForm.value)
      .then((_) => {
        this.snack.open('Purchase recorded', 'Ok', {
          duration: 3000,
        });
        this.saveInvoiceProgress = false;
        this.router
          .navigateByUrl('/purchase')
          .catch((reason) => console.log(reason));
      })
      .catch((reason) => {
        this.saveInvoiceProgress = false;
        // console.log(reason);
        this.snack.open(
          reason && reason.message ? reason.message : reason.toString(),
          'Ok',
          {
            duration: 3000,
          }
        );
      });
  }

  removeItem(
    $event: MouseEvent,
    element: { quantity: number; product: StockModel }
  ): void {
    $event.preventDefault();
    this.selectedProducts = this.selectedProducts.filter(
      (x) => x.product !== element.product
    );
    this.purchaseDatasource = new MatTableDataSource<any>(
      this.selectedProducts
    );
    this.updateTotalCost();
  }

  addNewSupplier($event: MouseEvent): void {
    $event.preventDefault();
    $event.stopPropagation();
    this.matDialog
      .open(DialogSupplierNewComponent, {
        // minWidth: '80%',
        closeOnNavigation: true,
      })
      .afterClosed()
      .subscribe((value) => {
        if (value) {
          this.getSuppliers();
        }
      });
  }
  editproduct($event: MouseEvent, element): void {
    $event.preventDefault();
    this.dialog
      .open(EditproductComponent, { data: element })
      .afterClosed()
      .subscribe((value) => {
        if (value) {
          const index = this.purchaseDatasource.data.findIndex(
            (val) => val.product.product === value.product.product
          );
          this.purchaseDatasource.data.splice(index, 1);
          this.selectedProducts.unshift({
            quantity: value.quantity,
            product: value.product,
            expire: value.expire,
            purchase: value.purchase,
            retailPrice: value.retailPrice,
            wholesalePrice: value.wholesalePrice,
            wholesaleQuantity: value.wholesaleQuantity,
            amount: value.quantity * value.purchase,
          });

          this.purchaseDatasource = new MatTableDataSource<any>(
            this.selectedProducts
          );

          this.updateTotalCost();
          this.snack.open('Edited product information', 'Ok', {
            duration: 2000,
          });
        }
      });
  }

  updateTotalCost(): void {
    this.totalCost = this.purchaseDatasource.data
      .map((x) => x.amount)
      .reduce((a, b) => a + b, 0);
  }

  refreshSuppliers($event: MouseEvent): void {
    $event.preventDefault();
    $event.stopPropagation();
    this.getSuppliers();
  }

  getSuppliers(): void {
    this.supplierFetching = true;
    this.purchaseState
      .getAllSupplier({ size: 200 })
      .then((data) => {
        const dataArray = JSON.parse(JSON.stringify(data));
        this.suppliers = of(dataArray);
        this.supplierFetching = false;
      })
      .catch((reason) => {
        this.suppliers = of([{ name: 'Default Supplier' }]);
        this.supplierFetching = false;
      });
  }

  addProduct($event): void {
    this.formvisibility = false;
    $event.preventDefault();
    this.dialog
      .open(ProductSearchDialogComponent)
      .afterClosed()
      .subscribe((value) => {
        if (value && value.product) {
          this.formvisibility = true;
          this.productdetails = value;
        }
      });
  }

  addProductToTable($event: any): void {
    const product = $event;
    let repetition: boolean;
    if (this.purchaseDatasource.data.length >= 1) {
      this.purchaseDatasource.data.find((val) => {
        if (val.product.product === product.product.product) {
          repetition = true;
          this.snack.open('Product already added to list', 'cancel', {
            duration: 2000,
          });
        }
      });
    }

    if (!repetition) {
      this.selectedProducts.unshift({
        quantity: product.quantity,
        product: product.product,
        expire: product.expire,
        purchase: product.purchase,
        retailPrice: product.retailPrice,
        wholesalePrice: product.wholesalePrice,
        wholesaleQuantity: product.wholesaleQuantity,
        amount: product.amount,
      });

      this.purchaseDatasource = new MatTableDataSource<any>(
        this.selectedProducts
      );

      this.updateTotalCost();
    }
  }
}
