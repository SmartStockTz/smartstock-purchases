import {Component, Input} from '@angular/core';
import {StockModel} from '../models/stock.model';
import {MatDialog} from '@angular/material/dialog';
import {AddToCartDialogComponent} from './add-to-cart-dialog.component';

@Component({
  selector: 'app-product',
  template: `
    <div class='card-container'>
      <div class='flippable-card'>
        <mat-card matRipple class='front' (click)='flip()'>
          <mat-card-content>
            <p class="text-truncate" style="color: gray;">
              {{stock.category}}
            </p>
            <p class="text-wrap"
               matTooltip="{{stock.product}}"
               style="font-weight: bold; overflow: hidden; height: 58px;">
              {{stock.product}}
            </p>
            <p class="text-truncate" style="color: gray;">
              {{stock.supplier}}
            </p>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styleUrls: ['../styles/product.style.scss']
})
export class ProductComponent {
  @Input() stock: StockModel;
  constructor(private readonly dialog: MatDialog) {
  }

  flip() {
    this.dialog.open(AddToCartDialogComponent, {
      closeOnNavigation: true,
      width: '500px',
      data: this.stock
    });
  }
}
