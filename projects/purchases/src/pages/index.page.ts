import { Component, OnInit } from '@angular/core';
import { DeviceInfoUtil } from '@smartstocktz/core-libs';

@Component({
  selector: 'app-purchases-index',
  template: `
    <mat-sidenav-container>
      <mat-sidenav
        class="match-parent-side"
        #sidenav
        [mode]="enoughWidth() ? 'side' : 'over'"
        [opened]="enoughWidth()"
      >
        <app-drawer></app-drawer>
      </mat-sidenav>
      <mat-sidenav-content style="min-height: 100vh">
        <app-toolbar
          searchPlaceholder="Filter product"
          [heading]="'Purchases'"
          [sidenav]="sidenav"
        ></app-toolbar>
        <div
          class="container col-xl-10 col-lg-10 col-sm-9 col-md-9 col-sm-12 col-10"
          style="padding: 16px 0"
        >
          <h1>Go To</h1>
          <div class="row">
            <div
              *ngFor="let page of pages"
              routerLink="{{ page.path }}"
              style="margin: 5px; cursor: pointer"
            >
              <mat-card
                matRipple
                style="width: 150px; height: 150px; display: flex; justify-content: center; align-items: center; flex-direction: column"
              >
                <mat-icon
                  color="primary"
                  style="font-size: 60px; height: 60px; width: 60px"
                >
                  {{ page.icon }}
                </mat-icon>
              </mat-card>
              <p>{{ page.name }}</p>
            </div>
          </div>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
})
export class IndexPage extends DeviceInfoUtil implements OnInit {
  pages = [
    {
      name: 'Receipts & Invoices',
      path: '/purchase/reference',
      icon: 'receipt',
    },
  ];

  constructor() {
    super();
    document.title = 'SmartStock - Purchases';
  }

  ngOnInit(): void {}
}
