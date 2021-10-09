import {Component, OnDestroy, OnInit} from '@angular/core';
import {StockState} from '../states/stock.state';
import {database} from 'bfast';
import {UserService} from '@smartstocktz/core-libs';

@Component({
  selector: 'app-product-list',
  template: `
    <app-on-fetch [isLoading]="(stockState.isFetchStocks | async)==true"
                  *ngIf="(stockState.isFetchStocks | async)==true">
    </app-on-fetch>
    <cdk-virtual-scroll-viewport style="height: 90vh"
                                 *ngIf="(stockState.isFetchStocks | async) === false"
                                 itemSize="'80'">
      <mat-nav-list>
        <app-product-list-item [stock]="product"
                               *cdkVirtualFor="let product of stockState.stocks.connect() | async;">
        </app-product-list-item>
      </mat-nav-list>
    </cdk-virtual-scroll-viewport>
  `,
  styleUrls: []
})

export class ProductListComponent implements OnInit, OnDestroy {
  private sig = false;
  private obfn;

  constructor(public readonly stockState: StockState,
              private readonly userService: UserService) {
  }

  async ngOnInit(): Promise<void> {
    const shop = await this.userService.getCurrentShop();
    this.stockState.getStocks();
    this.obfn = database(shop.projectId).syncs('stocks').changes().observe(_ => {
      if (this?.sig === false) {
        this.stockState.getStocks();
        this.sig = true;
      } else {
        return;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.obfn) {
      this?.obfn?.unobserve();
    }
  }
}
