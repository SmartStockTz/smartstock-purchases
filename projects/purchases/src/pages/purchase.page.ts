import {Component, OnInit} from '@angular/core';
import {PurchaseState} from '../states/purchase.state';
import {DeviceState} from '@smartstocktz/core-libs';

@Component({
  selector: 'app-purchase',
  template: `
    <app-layout-sidenav [heading]="'Purchases'"
                        searchPlaceholder="Filter by date"
                        (searchCallback)="searchPurchase($event)"
                        [leftDrawer]="side"
                        [body]="body"
                        [showSearch]="true"
                        [leftDrawerMode]="(deviceState.enoughWidth | async)===true?'side':'over'"
                        [leftDrawerOpened]="(deviceState.enoughWidth | async)===true"
                        [visibleMenu]="vOptions"
                        [hiddenMenu]="hOptions"
                        [showProgress]="false">
      <ng-template #vOptions>
        <button routerLink="/purchase/create" mat-icon-button>
          <mat-icon>add</mat-icon>
        </button>
      </ng-template>
      <ng-template #hOptions>
        <button (click)="purchaseState.getPurchases(0)" mat-menu-item>
          <mat-icon>refresh</mat-icon>
          Reload
        </button>
      </ng-template>
      <ng-template #side>
        <app-drawer></app-drawer>
      </ng-template>
      <ng-template #body>
        <app-purchases-desktop *ngIf="(deviceState.isSmallScreen | async) === false"></app-purchases-desktop>
        <app-purchases-mobile *ngIf="(deviceState.isSmallScreen | async) === true"></app-purchases-mobile>
      </ng-template>
    </app-layout-sidenav>
  `,
  styleUrls: ['../styles/purchase.style.scss'],
  providers: [PurchaseState],
})
export class PurchasePageComponent implements OnInit {

  constructor(public readonly deviceState: DeviceState,
              public readonly purchaseState: PurchaseState) {
    document.title = 'SmartStock - Purchase';
  }

  ngOnInit(): void {
  }

  searchPurchase(q: string) {
    this.purchaseState.filterKeyword.next(q);
  }
}
