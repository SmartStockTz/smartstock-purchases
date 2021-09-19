import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {DeviceState} from '@smartstocktz/core-libs';
import {StockState} from '../states/stock.state';
import {SupplierState} from '../states/supplier.state';
import {CartState} from "../states/cart.state";

@Component({
  selector: 'app-purchase-create',
  template: `
    <app-layout-sidenav
      [showSearch]="true"
      searchPlaceholder="Search product..."
      (searchCallback)="filterProduct($event)"
      [hiddenMenu]="hOptions"
      [visibleMenu]="vOptions"
      heading="Create purchase"
      [leftDrawer]="side"
      [leftDrawerOpened]="(deviceState.enoughWidth | async)===true"
      [leftDrawerMode]="(deviceState.enoughWidth | async)===true?'side':'over'"
      [rightDrawer]="right"
      [rightDrawerMode]="(deviceState.enoughWidth |async)===true?'side':'over'"
      [rightDrawerOpened]="(cartState.carts | async)?.length>0"
      [body]="body">
      <ng-template #right>
        <app-purchase-cart></app-purchase-cart>
      </ng-template>
      <ng-template #vOptions>

      </ng-template>
      <ng-template #hOptions>

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
export class CreatePageComponent implements OnInit {

  constructor(
    private readonly stockState: StockState,
    public readonly cartState: CartState,
    private readonly supplierState: SupplierState,
    public readonly deviceState: DeviceState
  ) {
    document.title = 'SmartStock - Purchase Create';
  }

  ngOnInit(): void {
    this.supplierState.fetchSuppliers();
  }

  filterProduct($event: string) {
    this.stockState.stocks.filter = $event;
  }
}
