import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {DeviceState, UserService} from '@smartstocktz/core-libs';
import {StockState} from '../states/stock.state';
import {SupplierState} from '../states/supplier.state';
import {CartState} from '../states/cart.state';
import {database} from 'bfast';

@Component({
  selector: 'app-purchase-create',
  template: `
    <app-layout-sidenav
      [showSearch]="true"
      searchPlaceholder="Search product..."
      (searchCallback)="filterProduct($event)"
      [hiddenMenu]="hOptions"
      [visibleMenu]="vOptions"
      backLink="/purchase"
      [hasBackRoute]="true"
      heading="Create purchase"
      [leftDrawer]="side"
      [leftDrawerOpened]="(deviceState.enoughWidth | async)===true"
      [leftDrawerMode]="(deviceState.enoughWidth | async)===true?'side':'over'"
      [rightDrawer]="right"
      [cartBadge]="cartState.cartTotalItems | async"
      [rightDrawerMode]="(deviceState.enoughWidth |async)===true?'side':'over'"
      [rightDrawerOpened]="(cartState.carts | async)?.length>0 && (deviceState.isSmallScreen |async)===false"
      [body]="body">
      <ng-template #right>
        <app-purchase-cart></app-purchase-cart>
      </ng-template>
      <ng-template #vOptions>

      </ng-template>
      <ng-template #hOptions>
        <button (click)="stockState.getStocksFromRemote()" mat-menu-item>
          <mat-icon>refresh</mat-icon>
          Reload
        </button>
      </ng-template>
      <ng-template #side>
        <app-drawer></app-drawer>
      </ng-template>
      <ng-template #body>
        <app-product-tiles *ngIf="(deviceState.isSmallScreen | async) === false"></app-product-tiles>
        <app-product-list *ngIf="(deviceState.isSmallScreen | async) === true"></app-product-list>
      </ng-template>
    </app-layout-sidenav>
  `,
  styleUrls: ['../styles/create.style.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CreatePageComponent implements OnInit, OnDestroy {
  private sig = false;
  private obfn;

  constructor(
    public readonly stockState: StockState,
    public readonly cartState: CartState,
    private readonly supplierState: SupplierState,
    public readonly deviceState: DeviceState,
    private readonly userService: UserService,
  ) {
    document.title = 'SmartStock - Purchase Create';
  }

  async ngOnInit(): Promise<void> {
    const shop = await this.userService.getCurrentShop();
    this.supplierState.fetchSuppliers();
    this.obfn = database(shop.projectId).syncs('suppliers').changes().observe(_ => {
      if (this.sig === false) {
        this.supplierState.fetchSuppliers();
        this.sig = true;
      } else {
        return;
      }
    });
  }

  ngOnDestroy() {
    if (this.obfn) {
      this?.obfn?.unobserve();
    }
  }

  filterProduct($event: string) {
    this.stockState.stocks.filter = $event;
  }
}
