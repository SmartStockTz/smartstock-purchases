import {Component, OnInit} from '@angular/core';
import {PurchaseState} from '../states/purchase.state';
import {StockState} from '../states/stock.state';
import {DeviceState} from '@smartstocktz/core-libs';

@Component({
  selector: 'app-product-tiles',
  template: `
    <app-on-fetch [isLoading]="(stockState.isFetchStocks | async)==true"
                  *ngIf="(stockState.isFetchStocks | async)==true"
                  (refreshCallback)="getProductsRemote()">
    </app-on-fetch>
    <cdk-virtual-scroll-viewport style="flex-grow: 1"
                                 *ngIf="(purchaseState.fetchPurchasesProgress | async)===false"
                                 itemSize="{{(deviceState.isSmallScreen | async) ===true?'80': '30'}}">
      <mat-nav-list>
        <app-product style="margin: 0 3px; display: inline-block"
                          [stock]="product"
                          *cdkVirtualFor="let product of stockState.stocks | async; let idx = index">
        </app-product>
        <div style="height: 200px"></div>
      </mat-nav-list>
    </cdk-virtual-scroll-viewport>
    <div class="bottom-actions-container">
      <button mat-button
              color="primary"
              style="margin: 16px"
              *ngIf="(purchaseState.fetchPurchasesProgress | async) === false && showRefreshCart === true"
              (click)="getProductsRemote()"
              matTooltip="Refresh products from server"
              class="mat-fab">
        <mat-icon>refresh</mat-icon>
      </button>
      <span [ngStyle]="showRefreshCart?{flex: '1 1 auto'}:{}"></span>
      <!--      <app-cart-preview [cartSidenav]="cartdrawer"></app-cart-preview>-->
    </div>
  `,
  styleUrls: []
})

export class ProductTilesComponent implements OnInit{
  showRefreshCart = true;

  constructor(public readonly purchaseState: PurchaseState,
              public readonly deviceState: DeviceState,
              public readonly stockState: StockState) {
  }

  getProductsRemote() {

  }

  ngOnInit(): void {
    this.stockState.getStocks();
  }
}
