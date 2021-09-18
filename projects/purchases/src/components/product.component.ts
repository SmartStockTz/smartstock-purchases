import {Component, Input} from '@angular/core';
import {StockModel} from '../models/stock.model';

@Component({
  selector: 'app-product',
  template: `
    <div>
      <div class='card-container'>
        <div class='flippable-card'>
          <mat-card class='front' style="text-align: center; width: 150px; height: 160px;" (click)='flip()'>
            <mat-card-content>
              <p class="text-truncate" style="color: gray;">
                {{stock.category}}
              </p>
              <p class="text-wrap"
                 matTooltip="{{stock.product}}"
                 style="font-weight: bold; overflow: hidden; height: 58px;">
                {{stock.product}}
              </p>
<!--              <p class="text-wrap" style="font-weight: 500;">-->
<!--                {{(isViewedInWholesale ? stock.wholesalePrice : stock.retailPrice)  | fedha | async}}-->
<!--              </p>-->
            </mat-card-content>
          </mat-card>
        </div>
      </div>

<!--      <div style="width: 95vw" *ngIf="(deviceState.isSmallScreen | async) === true">-->
<!--        <mat-list-item style="width: 100%;" (click)='openSheet(productIndex)'>-->
<!--          &lt;!&ndash;          <mat-icon [ngClass]="instock ? 'text-success' : 'text-danger'" matListIcon>&ndash;&gt;-->
<!--          &lt;!&ndash;            {{instock ? 'widgets' : 'widgets'}}&ndash;&gt;-->
<!--          &lt;!&ndash;          </mat-icon>&ndash;&gt;-->
<!--          <span matLine class="text-wrap"-->
<!--                matTooltip="{{stock.product}}"-->
<!--                style="font-weight: bold;">-->
<!--            {{stock.product}}-->
<!--          </span>-->
<!--          &lt;!&ndash;          <p matLine class="text-truncate" style="color: gray;">&ndash;&gt;-->
<!--          &lt;!&ndash;            {{stock.category}}&ndash;&gt;-->
<!--          &lt;!&ndash;            | <span [ngClass]="instock ? 'text-success' : 'text-danger'">{{instock ? 'IN' : 'OUT'}}</span>&ndash;&gt;-->
<!--          &lt;!&ndash;          </p>&ndash;&gt;-->
<!--          <mat-card-subtitle matLine class="text-wrap" style="font-weight: 500;">-->
<!--            Price : {{(isViewedInWholesale ? stock.wholesalePrice : stock.retailPrice)  | fedha | async}}-->
<!--          </mat-card-subtitle>-->
<!--        </mat-list-item>-->
<!--      </div>-->
    </div>
  `
})
export class ProductComponent {
  @Input() stock: StockModel;
  constructor() {
  }

  flip() {

  }
}
