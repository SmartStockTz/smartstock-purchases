import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {PurchaseState} from '../states/purchase.state';
import {MatSort} from '@angular/material/sort';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {AddReturnSheetComponent} from './add-returns-sheet.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import * as moment from 'moment';
import {PurchaseModel} from '../models/purchase.model';
import {PurchaseDetailsModalComponent} from './purchase-details.component';
import {FormControl} from '@angular/forms';
import {Subject} from 'rxjs';
import {debounceTime, takeUntil} from 'rxjs/operators';
import {DeviceState} from "@smartstocktz/core-libs";

@Component({
  template: `
    <div class="row justify-content-end">
      <div class="col-12">
        <mat-form-field class="btn-block">
          <mat-label>Filter</mat-label>
          <input matInput [formControl]="filterControll" placeholder="Receipt/invoice id" #input>
        </mat-form-field>
      </div>
    </div>

    <div>
      <mat-progress-bar *ngIf="fetchingPurchases" mode="indeterminate" color="primary"></mat-progress-bar>
      <app-data-not-ready *ngIf="noData"></app-data-not-ready>
      <table mat-table *ngIf="!noData" [dataSource]="dataSource" matSort>
        <ng-container matColumnDef="Purchase Id">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Id</th>
          <td mat-cell *matCellDef="let row"> {{row.refNumber}} </td>
        </ng-container>

        <ng-container matColumnDef="details">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Details</th>
          <td mat-cell *matCellDef="let row">
            <p><b>{{row.refNumber}}</b></p>
            <p>Amount Due: {{(row.type === 'invoice' ? row.amountDue : 0)| currency:' '}}</p>
            <p>Amount Paid: {{(row.type === 'invoice' ? row.amountPaid : row.amount)|currency: ' '}}</p>
            <p>Due Date: {{row.dueDate}}</p>
            <p>Purchase Date: {{row.date}}</p>
          </td>
        </ng-container>

        <ng-container matColumnDef="Supplier">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Supplier</th>
          <td mat-cell *matCellDef="let row"> {{row.supplierName}} </td>
        </ng-container>

        <ng-container matColumnDef="Amount Due">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Amount Due</th>
          <td mat-cell *matCellDef="let row"> {{(row.type === 'invoice' ? row.amountDue : 0)| currency:' '}} </td>
        </ng-container>

        <ng-container matColumnDef="Amount Paid">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Amount Paid</th>
          <td mat-cell
              *matCellDef="let row"> {{(row.type === 'invoice' ? row.amountPaid : row.amount)|currency: ' '}} </td>
        </ng-container>

        <ng-container matColumnDef="Due Date">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Due Date</th>
          <td mat-cell *matCellDef="let row"> {{row.dueDate}} </td>
        </ng-container>

        <ng-container matColumnDef="Date of Sale">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Date</th>
          <td mat-cell *matCellDef="let row"> {{row.date}} </td>
        </ng-container>

        <ng-container matColumnDef="Actions">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Actions</th>
          <td mat-cell *matCellDef="let row">
            <button mat-flat-button [disabled]="row.paid || row.type !== 'invoice'" color="primary"
                    (click)="clickRow(row, 'button', $event)">Add
              Returns
            </button>
          </td>
        </ng-container>

        <tr mat-header-row
            *matHeaderRowDef="(deviceState.isSmallScreen | async)===true?displayedColumnsMobile:displayedColumns"></tr>
        <tr mat-row class="table-data-row" (click)="clickRow(row, 'purchase', $event)"
            *matRowDef="let row; columns: (deviceState.isSmallScreen | async)===true?displayedColumnsMobile:displayedColumns;"></tr>

      </table>
      <mat-paginator *ngIf="!noData" [length]="total" (page)="pagination($event)"
                     [pageSizeOptions]="[size]"></mat-paginator>
    </div>
  `,
  selector: 'app-incomplete-purchases',
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  styleUrls: ['../styles/incomplete-purchases.style.css']
})
export class IncompletePurchasesTableComponent implements OnInit, OnDestroy, AfterViewInit {
  dataSource: MatTableDataSource<PurchaseModel> = new MatTableDataSource([]);
  fetchingPurchases = false;
  noData = false;
  displayedColumns = ['Purchase Id', 'Amount Due', 'Amount Paid', 'Due Date', 'Date of Sale', 'Actions'];
  displayedColumnsMobile = ['details', 'Actions'];
  size = 10;
  skip = 0;
  total = 0;
  irid = '';

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  filterControll = new FormControl('');
  fd = new Subject();

  constructor(public readonly purchaseState: PurchaseState,
              public readonly invoiceDetails: MatBottomSheet,
              public readonly addReturnsSheet: MatBottomSheet,
              public readonly deviceState: DeviceState,
              public readonly snack: MatSnackBar) {
  }

  ngOnDestroy(): void {
    this.fd.next('done');
  }

  async ngOnInit(): Promise<void> {
    this.filterControll.valueChanges.pipe(
      takeUntil(this.fd),
      debounceTime(400)
    ).subscribe(value => {
      if (value) {
        this.irid = value;
        this.fetchPurchases(this.skip, this.size, this.irid).catch(console.log);
      } else {
        this.irid = '';
        this.fetchPurchases(this.skip, this.size, this.irid).catch(console.log);
      }
      this.purchaseState.countAll(this.irid).then(value1 => {
        this.total = value1;
      }).catch(console.log);
    });
    this.total = await this.purchaseState.countAll(this.irid);
    await this.fetchPurchases(this.skip, this.size, this.irid);
  }

  async fetchPurchases(skip: number, size: number, id: string) {
    this.fetchingPurchases = true;
    try {
      let purchases = await this.purchaseState.fetchSync(size, skip, id);
      purchases = purchases.map(((value: PurchaseModel, index) => {
        return {
          ...value,
          date: moment(value.date).format('YYYY-MM-DD'),
          dueDate: moment(value.due ? value.due : value.date).format('YYYY-MM-DD'),
          supplierName: value.supplier.name,
          amountDue: value.amount - this.purchaseState.calculateTotalReturns(value.returns),
          amountPaid: this.purchaseState.calculateTotalReturns(value.returns),
          paid: value.amount <= this.purchaseState.calculateTotalReturns(value.returns)
        };
      }));
      this.dataSource.data = purchases;
    } catch (e) {
      this.noData = true;
      this.snack.open('An Error occurred fetching the purchases please reload.', 'OK', {
        duration: 3000
      });
    }
    this.fetchingPurchases = false;
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    // this.dataSource.paginator = this.paginator;
  }

  clickRow(data, route, e) {
    if (route === 'button') {
      e.stopPropagation();
      this.recordPayment(data);
    } else if (route === 'purchase') {
      this.openPurchasesDetails(data);
    } else {
      return;
    }
  }

  openPurchasesDetails(purchaseDetailsData): any {
    this.invoiceDetails.open(PurchaseDetailsModalComponent, {
      data: {
        id: purchaseDetailsData.id,
        refNumber: purchaseDetailsData.refNumber,
        date: purchaseDetailsData.date,
        amount: purchaseDetailsData.amount,
        items: purchaseDetailsData.items,
        returns: purchaseDetailsData.returns,
        supplierName: purchaseDetailsData.supplierName,
      }
    });
  }

  recordPayment(purchase: PurchaseModel) {
    const addReturnSheetRef = this.addReturnsSheet.open(AddReturnSheetComponent, {
      data: {
        id: purchase.id,
        refNumber: purchase.refNumber,
        date: purchase.date,
        amount: purchase.amount,
        supplierName: purchase.supplier.name,
        amountDue: purchase.amount - this.purchaseState.calculateTotalReturns(purchase.returns),
        items: purchase.returns
      }
    });

    addReturnSheetRef.afterDismissed().subscribe(result => {
      if (result) {
        this.dataSource.data = this.dataSource.data.map(value => {
          if (value.id === result.id) {
            if (value.returns && Array.isArray(value.returns)) {
              value.returns.push(result.returns);
            } else {
              value.returns = [result.returns];
            }
          }
          return {
            ...value,
            date: moment(value.date).format('YYYY-MM-DD'),
            dueDate: moment(value.due).format('YYYY-MM-DD'),
            supplierName: value.supplier.name,
            amountDue: value.amount - this.purchaseState.calculateTotalReturns(value.returns),
            amountPaid: this.purchaseState.calculateTotalReturns(value.returns),
            paid: value.amount <= this.purchaseState.calculateTotalReturns(value.returns)
          };
        });
      }
    });
  }

  async pagination(pageEvent: PageEvent) {
    console.log(pageEvent);
    this.skip = pageEvent.pageIndex * pageEvent.pageSize;
    await this.fetchPurchases(this.skip, this.size, this.irid);
  }
}

