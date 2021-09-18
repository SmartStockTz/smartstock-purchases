import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';

@Component({
  selector: 'app-purchases-desktop',
  template: `
    <app-purchases-table-options (paginator)="setP($event)"></app-purchases-table-options>
    <app-purchases-table *ngIf="p" [paginator]="p"></app-purchases-table>
  `,
  styleUrls: []
})
export class PurchasesDesktopComponent implements OnInit, OnDestroy{
  p: MatPaginator;
  constructor() {
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
  }

  setP($event: MatPaginator) {
    this.p = $event;
  }
}
