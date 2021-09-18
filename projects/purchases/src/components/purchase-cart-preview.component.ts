import {Component} from '@angular/core';
import {PurchaseState} from '../states/purchase.state';

@Component({
  selector: 'app-purchase-cart-preview',
  template: `

  `,
  styleUrls: []
})

export class PurchaseCartPreviewComponent {
  constructor(public readonly purchaseState: PurchaseState) {
  }
}
