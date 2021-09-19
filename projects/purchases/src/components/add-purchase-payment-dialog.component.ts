import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {PurchaseModel} from '../models/purchase.model';

@Component({
  selector: 'app-save-purchase-dialog',
  template: `
    <app-add-purchase-payment-form [purchase]="data" (done)="dialogRef.close($event)"></app-add-purchase-payment-form>
  `,
  styleUrls: ['../styles/add-to-cart.style.scss']
})

export class AddPurchasePaymentDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public readonly data: PurchaseModel,
              public readonly dialogRef: MatDialogRef<AddPurchasePaymentDialogComponent>,) {
  }

  ngOnInit(): void {
  }
}
