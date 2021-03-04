import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {PurchaseState} from '../states/purchase.state';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {AddReturnSheetComponent} from './add-returns-sheet.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import * as moment from 'moment';
import {PurchaseModel} from '../models/purchase.model';
import {PurchaseDetailsModalComponent} from './purchase-details.component';

@Component({
  template: `
    <!--<mat-card-title>Purchases</mat-card-title>-->
    <div class="row justify-content-end">
      <div class="col-2" style="margin-right: 9em">
        <mat-form-field>
          <mat-label>Filter</mat-label>
          <input matInput (keyup)="applyFilter($event)" placeholder="Ex. John" #input>
        </mat-form-field>
      </div>
    </div>

    <div>
      <mat-progress-bar *ngIf="fetchingPurchases" mode="indeterminate" color="primary"></mat-progress-bar>
      <app-data-not-ready *ngIf="noData"></app-data-not-ready>
      <table mat-table *ngIf="!noData" [dataSource]="dataSource" matSort>
        <ng-container matColumnDef="Purchase Id">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Purchase Id</th>
          <td mat-cell *matCellDef="let row"> {{row.refNumber}} </td>
        </ng-container>

        <ng-container matColumnDef="Supplier">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Supplier</th>
          <td mat-cell *matCellDef="let row"> {{row.supplierName}} </td>
        </ng-container>

        <ng-container matColumnDef="Amount Due">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Amount Due</th>
          <td mat-cell *matCellDef="let row"> {{row.type === 'invoice' ? row.amountDue : 0}} </td>
        </ng-container>

        <ng-container matColumnDef="Amount Paid">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Amount Paid</th>
          <td mat-cell *matCellDef="let row"> {{row.type === 'invoice' ? row.amountPaid : row.amount}} </td>
        </ng-container>

        <ng-container matColumnDef="Due Date">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Due Date</th>
          <td mat-cell *matCellDef="let row"> {{row.type === 'invoice' ? row.dueDate : row.date}} </td>
        </ng-container>

        <ng-container matColumnDef="Date of Sale">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Date of Sale</th>
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
      <mat-paginator *ngIf="!noData" [pageSizeOptions]="[10, 25, 100]"></mat-paginator>
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
export class IncompletePurchasesTableComponent implements OnInit, AfterViewInit {
  dataSource: MatTableDataSource<PurchaseModel>;
  fetchingPurchases = false;
  noData = false;
  displayedColumns = ['Purchase Id', 'Supplier', 'Amount Due', 'Amount Paid', 'Due Date', 'Date of Sale', 'Actions'];
  keysMap = {
    'Purchase Id': 'refNumber',
    Supplier: 'supplierName',
    'Amount Due': 'amountDue',
    'Amount Paid': 'amountPaid',
    'Due Date': 'due',
    'Date of Sale': 'date',
    Actions: 'paid'
  };

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private purchaseState: PurchaseState,
              private invoiceDetails: MatBottomSheet,
              private addReturnsSheet: MatBottomSheet,
              private snack: MatSnackBar) {
  }

  ngOnInit(): void {
    this.fetchPurchases();
  }

  async fetchPurchases() {
    this.fetchingPurchases = true;
    try {
      let purchases = await this.purchaseState.fetchSync(await this.purchaseState.countAll(), 0);
      purchases = purchases.map(((value: PurchaseModel, index) => {
        return {
          ...value,
          date: moment(value.date).format('YYYY-MM-DD'),
          dueDate: moment(value.due).format('YYYY-MM-DD'),
          supplierName: value.supplier.name,
          amountDue: value.amount - this.purchaseState.calculateTotalReturns(value.returns),
          amountPaid: this.purchaseState.calculateTotalReturns(value.returns),
          paid: value.amount <= this.purchaseState.calculateTotalReturns(value.returns)
        };
      }));
      this.configureDataSource(purchases);
    } catch (e) {
      this.noData = true;
      this.snack.open('An Error occurred fetching the purchases please reload.', 'OK', {
        duration: 3000
      });
    }

    this.fetchingPurchases = false;

  }

  configureDataSource(purchases) {
    this.dataSource = new MatTableDataSource(purchases);
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (purchase: PurchaseModel, sortHeaderId: string) => {
      // console.log(sortHeaderId, this.keysMap[sortHeaderId]);
      return purchase[this.keysMap[sortHeaderId]];
    };
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngAfterViewInit(): void {

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
        // businessName: purchaseDetailsData.sellerObject.businessName,
        // sellerFirstName: purchaseDetailsData.sellerObject.firstname,
        // sellerLastName: purchaseDetailsData.sellerObject.lastname,
        // region: purchaseDetailsData.sellerObject.region,
        items: purchaseDetailsData.items,
        returns: purchaseDetailsData.returns,
        supplierName: purchaseDetailsData.supplierName,
        // customerCompany: purchaseDetailsData.customerCompany
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
        // sellerFirstName: purchase.sellerObject.firstname,
        // sellerLastName: purchase.sellerObject.lastname,
        // region: purchase.sellerObject.region,
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
}

