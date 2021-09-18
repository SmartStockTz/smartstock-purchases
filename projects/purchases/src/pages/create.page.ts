import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable, of} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {Router} from '@angular/router';
import {DialogSupplierNewComponent} from '../components/suppliers.component';
import {StockModel} from '../models/stock.model';
import {PurchaseState} from '../states/purchase.state';
import {DeviceState, StorageService} from '@smartstocktz/core-libs';
import {StockState} from '../states/stock.state';
import {ProductSearchDialogComponent} from '../components/product-search-dialog.component';
import {MatTableDataSource} from '@angular/material/table';
import {SupplierState} from '../states/supplier.state';

@Component({
  selector: 'app-purchase-create',
  template: `
    <app-layout-sidenav
      [showSearch]="true"
      searchPlaceholder="Search product..."
      [hiddenMenu]="hOptions"
      [visibleMenu]="vOptions"
      heading="Create purchase"
      [leftDrawer]="side"
      [leftDrawerOpened]="(deviceState.enoughWidth | async)===true"
      [leftDrawerMode]="(deviceState.enoughWidth | async)===true?'side':'over'"
      [rightDrawer]="right"
      [rightDrawerMode]="(deviceState.enoughWidth |async)===true?'side':'over'"
      [rightDrawerOpened]="false"
      [body]="body">
      <ng-template #right>
        <app-purchase-cart></app-purchase-cart>
      </ng-template>
      <ng-template #vOptions>

      </ng-template>
      <ng-template #hOptions>

      </ng-template>
      <ng-template #side>
        <app-drawer></app-drawer>
      </ng-template>
      <ng-template #body>
        <app-product-tiles *ngIf="(deviceState.isSmallScreen | async) === false"></app-product-tiles>
        <app-product-list *ngIf="(deviceState.isSmallScreen | async) === true"></app-product-list>
      </ng-template>
    </app-layout-sidenav>
  `,
  styleUrls: ['../styles/create.style.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CreatePageComponent implements OnInit {
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
    private readonly stockState: StockState,
    private readonly supplierState: SupplierState,
    public readonly deviceState: DeviceState,
    private readonly dialog: MatDialog
  ) {
    document.title = 'SmartStock - Purchase Create';
  }

  ngOnInit(): void {
    this.supplierState.fetchSuppliers();
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
    this.searchProductFormControl
      .valueChanges
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
    this.stockState.getAllStock();
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
      this.invoiceForm.value.paid = true;
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
    // this.dialog
    //   .open(EditproductComponent, {data: element})
    //   .afterClosed()
    //   .subscribe((value) => {
    //     if (value) {
    //       const index = this.purchaseDatasource.data.findIndex(
    //         (val) => val.product.product === value.product.product
    //       );
    //       this.purchaseDatasource.data.splice(index, 1);
    //       this.selectedProducts.unshift({
    //         quantity: value.quantity,
    //         product: value.product,
    //         expire: value.expire,
    //         purchase: value.purchase,
    //         retailPrice: value.retailPrice,
    //         wholesalePrice: value.wholesalePrice,
    //         wholesaleQuantity: value.wholesaleQuantity,
    //         amount: value.quantity * value.purchase,
    //       });
    //
    //       this.purchaseDatasource = new MatTableDataSource<any>(
    //         this.selectedProducts
    //       );
    //
    //       this.updateTotalCost();
    //       this.snack.open('Edited product information', 'Ok', {
    //         duration: 2000,
    //       });
    //     }
    //   });
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
    // this.supplierFetching = true;
    // this.purchaseState
    //   .getAllSupplier()
    //   .then((data) => {
    //     const dataArray = JSON.parse(JSON.stringify(data));
    //     this.suppliers = of(dataArray);
    //     this.supplierFetching = false;
    //   })
    //   .catch((reason) => {
    //     this.suppliers = of([{name: 'Default Supplier'}]);
    //     this.supplierFetching = false;
    //   });
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

      this.formvisibility = false;
      this.updateTotalCost();
    }
  }
}
