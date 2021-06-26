import {Component, OnInit} from '@angular/core';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatTableDataSource} from '@angular/material/table';
import {PurchaseModel} from '../models/purchase.model';
import {environment} from '../environments/environment';
import {PurchaseDetailsComponent} from '../components/details.component';
import {PurchaseState} from '../states/purchase.state';
import {DeviceState} from '@smartstocktz/core-libs';

@Component({
  selector: 'app-purchase',
  template: `
    <app-layout-sidenav [heading]="'Purchases'"
                        searchPlaceholder="Search purchase"
                        backLink="/purchase"
                        [hasBackRoute]="true"
                        [leftDrawer]="side"
                        [body]="body"
                        [leftDrawerMode]="(deviceState.enoughWidth | async)===true?'side':'over'"
                        [leftDrawerOpened]="(deviceState.enoughWidth | async)===true"
                        [showProgress]="false">
      <ng-template #side>
        <app-drawer></app-drawer>
      </ng-template>
      <ng-template #body>
        <div class="container col-12 col-xl-9 col-lg-9 col-md-10 col-sm-10 pt-3" style="min-height: 100vh">
          <mat-card-title class="d-flex flex-row flex-nowrap">
            <button
              routerLink="/purchase/create"
              mat-flat-button
              color="primary"
              class="ft-button">
              Add Purchase
            </button>
            <span class="toolbar-spacer"></span>
<!--            <button-->
<!--              [matMenuTriggerFor]="pAoptions"-->
<!--              color="primary"-->
<!--              mat-icon-button>-->
<!--              <mat-icon> more_vert</mat-icon>-->
<!--            </button>-->
<!--            <mat-menu #pAoptions>-->
<!--              <button mat-menu-item (click)="reload()">Reload</button>-->
<!--            </mat-menu>-->
          </mat-card-title>
          <mat-card class="mat-elevation-z2">
            <mat-card-content>
              <app-incomplete-purchases></app-incomplete-purchases>
            </mat-card-content>
          </mat-card>
        </div>
      </ng-template>
    </app-layout-sidenav>
  `,
  styleUrls: ['../styles/purchase.style.scss'],
  providers: [PurchaseState],
})
export class PurchasePageComponent implements OnInit {

  constructor(
    public readonly deviceState: DeviceState,
    public readonly snack: MatSnackBar) {
    document.title = 'SmartStock - Purchase';
  }

  ngOnInit(): void {
  }
}
