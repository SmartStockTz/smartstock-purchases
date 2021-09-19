import {AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {PurchaseState} from '../states/purchase.state';

@Component({
  selector: 'app-purchases-table-options',
  template: `
    <div style="position: sticky!important;top: 64px; z-index: 100000; background: #f5f5f5">
      <div class="options-container">
        <button mat-button routerLink="/purchase/create" class="reload-button">Create</button>
        <button mat-button class="reload-button" (click)="hotReload()">Reload</button>
        <!--        <span class="options-table-text">Last purchased products</span>-->
        <span class="spacer"></span>
        <mat-paginator [pageSize]="purchaseState.size"
                       [length]="purchaseState.totalPurchase|async"
                       class="paginator"
                       (page)="page($event)"
                       #c_paginator>
        </mat-paginator>
      </div>
      <mat-progress-bar mode="indeterminate" *ngIf="purchaseState.fetchPurchasesProgress | async"></mat-progress-bar>
    </div>
  `,
  styleUrls: ['../styles/purchase-table-options.style.scss']
})
export class PurchasesTableOptionsComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild(MatPaginator) p: MatPaginator;
  @Output() paginator: EventEmitter<MatPaginator> = new EventEmitter<MatPaginator>();

  constructor(public readonly purchaseState: PurchaseState) {
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    Promise.resolve().then(_ => {
      this.paginator.emit(this.p);
      this.hotReload();
    });
  }

  hotReload() {
    this.purchaseState.getPurchases(0);
    // this.purchaseState.countAll();
  }

  page($event: PageEvent) {
    this.purchaseState.getPurchases($event.pageIndex);
  }
}
