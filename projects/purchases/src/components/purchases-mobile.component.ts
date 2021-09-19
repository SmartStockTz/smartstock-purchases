import {Component, OnDestroy, OnInit} from '@angular/core';
import {PurchaseState} from '../states/purchase.state';

@Component({
  selector: 'app-purchases-mobile',
  template: `
    <mat-progress-bar mode="indeterminate" *ngIf="purchaseState.fetchPurchasesProgress | async"></mat-progress-bar>
    <app-data-not-ready *ngIf="(purchaseState.purchases | async).length === 0"></app-data-not-ready>
  `,
  styleUrls: []
})
export class PurchasesMobileComponent implements OnInit, OnDestroy{
  constructor(public readonly purchaseState: PurchaseState) {
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
  }

}
