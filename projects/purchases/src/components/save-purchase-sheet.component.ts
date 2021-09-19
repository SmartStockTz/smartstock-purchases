import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {StockModel} from '../models/stock.model';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from "@angular/material/bottom-sheet";

@Component({
  selector: 'app-save-purchase-dialog',
  template: `
    <app-save-purchase-form [product]="data" (done)="dialogRef.dismiss($event)"></app-save-purchase-form>
  `,
  styleUrls: ['../styles/add-to-cart.style.scss']
})

export class SavePurchaseSheetComponent {

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public readonly data: StockModel,
              public readonly dialogRef: MatBottomSheetRef<SavePurchaseSheetComponent>) {
  }
}
