import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {CartService} from '../services/cart.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PrintService} from '@smartstocktz/core-libs';
import {SupplierModel} from '../models/supplier.model';
import {PurchaseService} from '../services/purchase.service';
import {PurchaseItemModel} from '../models/purchase-item.model';
import {Router} from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class CartState {
  carts = new BehaviorSubject<PurchaseItemModel[]>([]);
  cartTotal = new BehaviorSubject(0);
  cartTotalItems = new BehaviorSubject(0);
  selectedSupplier = new BehaviorSubject<SupplierModel>(null);

  constructor(private readonly cartService: CartService,
              private readonly printService: PrintService,
              private readonly purchaseService: PurchaseService,
              private readonly router: Router,
              private readonly snack: MatSnackBar) {
  }

  private message(reason) {
    this.snack.open(reason && reason.message ? reason.message : reason.toString(), 'Ok', {
      duration: 2000
    });
  }

  addToCart(cart: PurchaseItemModel): void {
    this.cartService.addToCart(this.carts.value, cart).then(value => {
      this.carts.next(value);
    }).catch(reason => {
      this.message(reason);
    });
  }

  findTotal(carts: PurchaseItemModel[]) {
    this.totalItems();
    this.cartService.findTotal(carts).then(value => {
      this.cartTotal.next(value);
    }).catch(reason => {
      this.message(reason);
    });
  }

  totalItems(): void {
    this.cartTotalItems.next(
      this.carts.value.map(cartItem => cartItem.quantity).reduce((a, b) => a + b, 0)
    );
  }

  incrementCartItemQuantity(indexOfProductInCart: number): void {
    this.carts.value[indexOfProductInCart].quantity = this.carts.value[indexOfProductInCart].quantity + 1;
    this.carts.next(this.carts.value);
  }

  decrementCartItemQuantity(indexOfProductInCart: number): void {
    if (this.carts.value[indexOfProductInCart].quantity > 1) {
      this.carts.value[indexOfProductInCart].quantity = this.carts.value[indexOfProductInCart].quantity - 1;
      this.carts.next(this.carts.value);
    }
  }

  removeItemFromCart(indexOfProductInCart: number): void {
    this.carts.value.splice(indexOfProductInCart, 1);
    this.carts.next(this.carts.value);
  }

  dispose() {
    this.carts.next([]);
    this.cartTotal.next(0);
    this.cartTotalItems.next(0);
    this.selectedSupplier.next(null);
  }
}
