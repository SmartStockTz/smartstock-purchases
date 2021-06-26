import {Component, OnInit} from '@angular/core';
import {DeviceState} from '@smartstocktz/core-libs';

@Component({
  selector: 'app-purchases-index',
  template: `
    <app-layout-sidenav
      searchPlaceholder="Filter product"
      [leftDrawerMode]="(deviceState.enoughWidth | async)==true?'side':'over'"
      [leftDrawerOpened]="(deviceState.enoughWidth | async)==true"
      [body]="body"
      [heading]="'Purchases'"
      [leftDrawer]="side">
      <ng-template #side>
        <app-drawer></app-drawer>
      </ng-template>
      <ng-template #body>
        <div class="container col-xl-10 col-lg-10 col-sm-9 col-md-9 col-sm-12 col-12"
             style="padding: 16px 0; min-height: 100vh">

          <div class="d-flex flex-wrap" *ngIf="(deviceState.isSmallScreen | async) === false">
            <app-libs-rbac [groups]="['admin','manager']"
                           [pagePath]="page.path"
                           *ngFor="let page of pages"
                           style="margin: 5px; cursor: pointer">
              <ng-template>
                <mat-card
                  routerLink="{{ page.path }}"
                  matRipple
                  style="width: 150px; height: 150px; display: flex; justify-content: center; align-items: center; flex-direction: column">
                  <mat-icon
                    color="primary"
                    style="font-size: 60px; height: 60px; width: 60px">
                    {{ page.icon }}
                  </mat-icon>
                </mat-card>
                <p>{{ page.name }}</p>
              </ng-template>
            </app-libs-rbac>
          </div>

          <div *ngIf="(deviceState.isSmallScreen | async) === true">
            <mat-nav-list>
              <div *ngFor="let item of pages">
                <app-libs-rbac
                  [groups]="['admin','manager']"
                  [pagePath]="item.path">
                  <ng-template>
                    <mat-list-item routerLink="{{item.path}}">
                      <mat-icon matListIcon color="primary">{{item.icon}}</mat-icon>
                      <h1 matLine>{{item.name}}</h1>
                      <mat-card-subtitle matLine>{{item.detail}}</mat-card-subtitle>
                    </mat-list-item>
                    <mat-divider></mat-divider>
                  </ng-template>
                </app-libs-rbac>
              </div>
            </mat-nav-list>
          </div>

        </div>
      </ng-template>
    </app-layout-sidenav>
  `,
})
export class IndexPage implements OnInit {
  pages = [
    {
      name: 'Receipts & Invoices',
      path: '/purchase/reference',
      icon: 'receipt',
      detail: 'Manage invoice and receipt'
    },
  ];

  constructor(public readonly deviceState: DeviceState) {
    document.title = 'SmartStock - Purchases';
  }

  ngOnInit(): void {
  }
}
