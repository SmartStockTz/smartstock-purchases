import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {StockModel} from '../models/stock.model';

@Component({
  selector: 'app-save-purchase-dialog',
  template: `
    <app-save-purchase-form [product]="data" (done)="dialogRef.close($event)"></app-save-purchase-form>
  `,
  styleUrls: ['../styles/add-to-cart.style.scss']
})

export class SavePurchaseDialogComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public readonly data: StockModel,
              public readonly dialogRef: MatDialogRef<SavePurchaseDialogComponent>) {
  }
}
