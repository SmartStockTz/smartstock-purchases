import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {PurchaseState} from '../states/purchase.state';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {Subject} from 'rxjs';
import {MatTableDataSource} from '@angular/material/table';
import {PurchaseModel} from '../models/purchase.model';
import {MatDialog} from '@angular/material/dialog';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {takeUntil} from 'rxjs/operators';
import {PurchaseDetailsModalComponent} from './purchase-details.component';
import {AddPurchasePaymentDialogComponent} from './add-purchase-payment-dialog.component';
import {IInfiniteScrollEvent} from 'ngx-infinite-scroll';

@Component({
  selector: 'app-purchases-mobile',
  template: `
    <mat-progress-bar mode="indeterminate" *ngIf="purchaseState.fetchPurchasesProgress | async"></mat-progress-bar>
    <app-data-not-ready *ngIf="(purchaseState.purchases | async).length === 0"></app-data-not-ready>
    <cdk-virtual-scroll-viewport [itemSize]="90" style="height: 92vh"
                                 infinite-scroll
                                 (scrolled)="loadMore($event)"
                                 [scrollWindow]="false"
                                 [infiniteScrollThrottle]="5"
                                 [infiniteScrollDistance]="3">
      <mat-nav-list>
        <mat-list-item [matMenuTriggerFor]="menu" *cdkVirtualFor="let purchase of purchaseState.purchases | async">
          <p style="width: 80vw; text-align: start" class="text-truncate"
             matLine>#{{purchase.refNumber}} ( {{purchase.amount | currency:' '}} )</p>
          <p matLine>{{purchase.type}}</p>
          <mat-card-subtitle matLine>{{purchase.date | date:'short'}}</mat-card-subtitle>
          <button mat-icon-button matSuffix>
            <mat-icon>more_horiz</mat-icon>
          </button>
          <mat-menu xPosition="before" #menu>
            <button mat-menu-item (click)="details(purchase)">Details</button>
            <button mat-menu-item *ngIf="dueAmount(purchase)!==0" (click)="return(purchase)">
              Add returns
            </button>
          </mat-menu>
        </mat-list-item>
        <div style="height: 150px; padding-top: 16px; justify-content: center; align-items: start; display: flex">
          <button (click)="loadMore($event)" mat-button color="primary" *ngIf="(purchaseState.loadMoreProgress | async) === false">
            Load more
          </button>
          <mat-progress-spinner *ngIf="(purchaseState.loadMoreProgress | async) === true"
                                mode="indeterminate" diameter="20" color="primary">
          </mat-progress-spinner>
        </div>
      </mat-nav-list>
    </cdk-virtual-scroll-viewport>
  `,
  styleUrls: []
})
export class PurchasesMobileComponent implements OnInit, OnDestroy {
  @Input() paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  destroyer: Subject<any> = new Subject<any>();

  constructor(public readonly purchaseState: PurchaseState,
              public readonly dialog: MatDialog,
              public readonly matSheet: MatBottomSheet) {
  }

  ngOnDestroy(): void {
    this.destroyer.next('done');
  }

  ngOnInit(): void {
    this.purchaseState.getPurchases(0);
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
    if (row.type === 'receipt') {
      return 0;
    }
    if (!row.payment || typeof row.payment !== 'object') {
      return row.amount;
    }
    return row.amount - Object.values(row.payment).reduce((a, b) => a + Number(b), 0);
  }

  // amountPaid(row: PurchaseModel) {
  //   if (!row.payment || typeof row.payment !== 'object') {
  //     return 0;
  //   }
  //   return Object.values(row.payment).reduce((a, b) => a + Number(b), 0);
  // }

  loadMore($event: any) {
    // console.log($event, '******fuckkkk');
    this.purchaseState.loadMore();
  }
}
