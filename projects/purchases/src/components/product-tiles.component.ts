import {Component, OnDestroy, OnInit} from '@angular/core';
import {PurchaseState} from '../states/purchase.state';
import {StockState} from '../states/stock.state';
import {UserService} from '@smartstocktz/core-libs';
import {CartState} from '../states/cart.state';
import {database} from 'bfast';

@Component({
  selector: 'app-product-tiles',
  template: `
    <app-on-fetch [isLoading]="(stockState.isFetchStocks | async)==true"
                  *ngIf="(stockState.isFetchStocks | async)==true"
                  (refreshCallback)="getProductsRemote()">
    </app-on-fetch>
    <cdk-virtual-scroll-viewport style="height: 100%"
                                 *ngIf="(stockState.isFetchStocks | async) === false"
                                 itemSize="30">
      <mat-nav-list>
        <app-product style="margin: 0 3px; display: inline-block"
                     [stock]="product"
                     *cdkVirtualFor="let product of stockState.stocks.connect() | async; let idx = index">
        </app-product>
        <div style="height: 200px"></div>
      </mat-nav-list>
    </cdk-virtual-scroll-viewport>
    <div class="bottom-actions-container">
      <button mat-button
              [disabled]="(stockState.isFetchStocks | async) === true"
              color="primary"
              style="margin: 16px"
              *ngIf="(cartState.carts  | async)?.length === 0"
              (click)="getProductsRemote()"
              matTooltip="Refresh products from server"
              class="mat-fab">
        <mat-icon>refresh</mat-icon>
      </button>
      <span [ngStyle]="showRefreshCart?{flex: '1 1 auto'}:{}"></span>
      <!--      <app-cart-preview [cartSidenav]="cartdrawer"></app-cart-preview>-->
    </div>
  `,
  styleUrls: ['../styles/product-tiles.style.scss']
})

export class ProductTilesComponent implements OnInit, OnDestroy {
  showRefreshCart = true;

  constructor(public readonly purchaseState: PurchaseState,
              public readonly cartState: CartState,
              public readonly stockState: StockState) {
  }

  getProductsRemote() {
    this.stockState.getStocksFromRemote();
  }

  async ngOnInit(): Promise<void> {
    this.stockState.getStocks();
  }

  ngOnDestroy(): void {
  }
}
