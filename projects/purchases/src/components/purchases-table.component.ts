import {AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {PurchaseState} from '../states/purchase.state';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {Subject} from 'rxjs';
import {MatTableDataSource} from '@angular/material/table';
import {takeUntil} from 'rxjs/operators';
import {PurchaseModel} from '../models/purchase.model';
import {PurchaseDetailsModalComponent} from './purchase-details.component';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {MatDialog} from '@angular/material/dialog';
import {AddPurchasePaymentDialogComponent} from './add-purchase-payment-dialog.component';

@Component({
  selector: 'app-purchases-table',
  template: `
    <div>
      <app-data-not-ready *ngIf="(purchaseState.purchases | async).length === 0"></app-data-not-ready>
      <table mat-table *ngIf="(purchaseState.purchases | async).length !== 0"
             [dataSource]="dataSource" matSort>
        <ng-container matColumnDef="Purchase Id">
          <th class="column-head-text" mat-header-cell *matHeaderCellDef mat-sort-header>Id</th>
          <td mat-cell *matCellDef="let row"> {{row.refNumber}} </td>
        </ng-container>

        <ng-container matColumnDef="Supplier">
          <th class="column-head-text" mat-header-cell *matHeaderCellDef mat-sort-header>Supplier</th>
          <td mat-cell *matCellDef="let row"> {{row.supplierName}} </td>
        </ng-container>

        <ng-container matColumnDef="Amount Due">
          <th class="column-head-text" mat-header-cell *matHeaderCellDef mat-sort-header>Amount Due</th>
          <td mat-cell *matCellDef="let row"> {{(row.type === 'invoice' ? dueAmount(row) : 0)| currency:' '}} </td>
        </ng-container>

        <ng-container matColumnDef="Amount Paid">
          <th class="column-head-text" mat-header-cell *matHeaderCellDef mat-sort-header>Amount Paid</th>
          <td mat-cell
              *matCellDef="let row"> {{(row.type === 'invoice' ? amountPaid(row) : row.amount)|currency: ' '}} </td>
        </ng-container>

        <ng-container matColumnDef="Due Date">
          <th class="column-head-text" mat-header-cell *matHeaderCellDef mat-sort-header>Due Date</th>
          <td mat-cell *matCellDef="let row"> {{(row.type === 'receipt' ? row.date : row.due) | date}} </td>
        </ng-container>

        <ng-container matColumnDef="Date of Sale">
          <th class="column-head-text" mat-header-cell *matHeaderCellDef mat-sort-header>Date</th>
          <td mat-cell *matCellDef="let row"> {{row.date | date:'short'}} </td>
        </ng-container>

        <ng-container matColumnDef="Actions">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Actions</th>
          <td mat-cell *matCellDef="let row">
            <button [matMenuTriggerFor]="matMenu" mat-icon-button>
              <mat-icon>more_horiz</mat-icon>
            </button>
            <mat-menu #matMenu>
              <button mat-menu-item (click)="details(row)">
                Details
              </button>
              <button mat-menu-item *ngIf="dueAmount(row)!==0" (click)="return(row)">
                Add returns
              </button>
            </mat-menu>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row class="table-data-row" *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
    </div>
  `,
  styleUrls: ['../styles/purchase-table.style.scss']
})
export class PurchasesTableComponent implements OnInit, OnDestroy, AfterViewInit {
  displayedColumns = ['Purchase Id', 'Amount Due', 'Amount Paid', 'Due Date', 'Date of Sale', 'Actions'];
  @Input() paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  destroyer: Subject<any> = new Subject<any>();
  dataSource: MatTableDataSource<PurchaseModel> = new MatTableDataSource<PurchaseModel>([]);

  constructor(public readonly purchaseState: PurchaseState,
              public readonly dialog: MatDialog,
              public readonly matSheet: MatBottomSheet) {
  }

  ngOnDestroy(): void {
    this.destroyer.next('done');
  }

  ngOnInit(): void {
    this.purchaseState.purchases.pipe(takeUntil(this.destroyer)).subscribe(value => {
      this.dataSource.connect().next(value);
    });
    this.purchaseState.totalPurchase.pipe(takeUntil(this.destroyer)).subscribe(value => {
      if (!this.dataSource.paginator) {
        return;
      }
      this.dataSource.paginator.length = value;
    });
    this.purchaseState.filterKeyword.pipe(takeUntil(this.destroyer)).subscribe(value => {
      if (value === null) {
        return;
      }
      this.purchaseState.getPurchases(0);
    });
  }

  openPurchasesDetails(purchaseDetailsData): any {
    this.matSheet.open(PurchaseDetailsModalComponent, {
        data: purchaseDetailsData
      }
    );
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  return(row: PurchaseModel): void {
    this.dialog.open(AddPurchasePaymentDialogComponent, {
      closeOnNavigation: true,
      data: row,
      width: '400px'
    });
  }

  details(row): void {
    this.openPurchasesDetails(row);
  }

  dueAmount(row: PurchaseModel) {
    if (row.type === 'receipt'){
      return 0;
    }
    if (!row.payment || typeof row.payment !== 'object') {
      return row.amount;
    }
    return row.amount - Object.values(row.payment).reduce((a, b) => a + Number(b), 0);
  }

  amountPaid(row: PurchaseModel) {
    if (!row.payment || typeof row.payment !== 'object') {
      return 0;
    }
    return Object.values(row.payment).reduce((a, b) => a + Number(b), 0);
  }
}
