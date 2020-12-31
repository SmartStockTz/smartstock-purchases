import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-product-details',
  template: `
    <div class="row">
      <div class="col-lg-4 col-md-4"></div>
      <div class="col-lg-4 col-md-4"></div>
      <div class="col-lg-4 col-md-4"></div>
    </div>
    <div class="row">
      <div class="col-lg-4 col-md-4"></div>
      <div class="col-lg-4 col-md-4"></div>
      <div class="col-lg-4 col-md-4"></div>
    </div>
  `,
  styleUrls: ['../styles/productdetails.style.scss'],
})
export class ProductDetailComponent {
  @Input() heroname;
}
