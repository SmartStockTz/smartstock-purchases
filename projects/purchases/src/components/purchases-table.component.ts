import {AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {PurchaseState} from '../states/purchase.state';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {Subject, take} from 'rxjs';
import {MatTableDataSource} from '@angular/material/table';
import {takeUntil} from 'rxjs/operators';
import {PurchaseModel} from '../models/purchase.model';

@Component({
  selector: 'app-purchases-table',
  template: `
    <div>
      <app-data-not-ready *ngIf="(purchaseState.purchases | async).length === 0"></app-data-not-ready>
      <table mat-table *ngIf="(purchaseState.purchases | async).length !== 0"
             [dataSource]="dataSource" matSort>
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

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row class="table-data-row" (click)="clickRow(row, 'purchase', $event)"
            *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
    </div>
  `,
  styleUrls: []
})
export class PurchasesTableComponent implements OnInit, OnDestroy, AfterViewInit {
  displayedColumns = ['Purchase Id', 'Amount Due', 'Amount Paid', 'Due Date', 'Date of Sale', 'Actions'];
  @Input() paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  destroyer: Subject<any> = new Subject<any>();
  dataSource: MatTableDataSource<PurchaseModel> = new MatTableDataSource<PurchaseModel>([]);

  constructor(public readonly purchaseState: PurchaseState) {
  }

  ngOnDestroy(): void {
    this.destroyer.next('done');
  }

  ngOnInit(): void {
    this.purchaseState.purchases.pipe(takeUntil(this.destroyer)).subscribe(value => {
      this.dataSource.connect().next(value);
    });
    this.purchaseState.totalPurchase.pipe(takeUntil(this.destroyer)).subscribe(value => {
      if (!this.dataSource.paginator){
        return;
      }
      // console.log(value);
      this.dataSource.paginator.length = value;
      // this.dataSource.paginator.pageSize = value;
    });
    this.purchaseState.filterKeyword.pipe(takeUntil(this.destroyer)).subscribe(value => {
      if (value === null) {
        return;
      }
      this.purchaseState.getPurchases(0);
    });
  }

  clickRow(row, button: string, $event: MouseEvent) {

  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    // this.purchaseState.countAll();
  }

}
