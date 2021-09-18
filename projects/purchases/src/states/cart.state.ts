import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {CartService} from '../services/cart.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PrintService} from '@smartstocktz/core-libs';
import {SupplierModel} from '../models/supplier.model';
import {PurchaseModel} from '../models/purchase.model';
import {PurchaseService} from '../services/purchase.service';
import {PurchaseItemModel} from '../models/purchase-item.model';


@Injectable({
  providedIn: 'root'
})
export class CartState {
  carts = new BehaviorSubject<PurchaseItemModel[]>([]);
  cartTotal = new BehaviorSubject(0);
  cartTotalItems = new BehaviorSubject(0);
  checkoutProgress = new BehaviorSubject(false);
  selectedSupplier = new BehaviorSubject<SupplierModel>(null);
  cartOrder = new BehaviorSubject<PurchaseModel>(null);

  constructor(private readonly cartService: CartService,
              private readonly printService: PrintService,
              private readonly purchaseService: PurchaseService,
              private readonly snack: MatSnackBar) {
  }

  private message(reason) {
    this.snack.open(reason && reason.message ? reason.message : reason.toString(), 'Ok', {
      duration: 2000
    });
  }

  addToCart(cart: PurchaseModel): void {
    // this.cartService.addToCart(this.carts.value, cart).then(value => {
    //   this.carts.next(value);
    // }).catch(reason => {
    //   this.message(reason);
    // });
  }

  findTotal(channel: string, discount: any = 0) {
    this.cartService.findTotal(this.carts.value, channel, discount).then(value => {
      this.cartTotal.next(value);
    }).catch(reason => {
      this.message(reason);
    });
  }

  totalItems(): void {
    // this.cartTotalItems.next(
    //   this.carts.value.map(cartItem => cartItem.quantity).reduce((a, b) => a + b, 0)
    // );
  }

  incrementCartItemQuantity(indexOfProductInCart: number): void {
    // this.carts.value[indexOfProductInCart].quantity = this.carts.value[indexOfProductInCart].quantity + 1;
    // this.carts.next(this.carts.value);
  }

  decrementCartItemQuantity(indexOfProductInCart: number): void {
    // if (this.carts.value[indexOfProductInCart].quantity > 1) {
    //   this.carts.value[indexOfProductInCart].quantity = this.carts.value[indexOfProductInCart].quantity - 1;
    //   this.carts.next(this.carts.value);
    // }
  }

  removeItemFromCart(indexOfProductInCart: number): void {
    this.carts.value.splice(indexOfProductInCart, 1);
    this.carts.next(this.carts.value);
  }

  clearCart(): void {
    this.carts.next([]);
  }

  async checkout(channel: string, discount: number, user: any): Promise<any> {
    // this.checkoutProgress.next(true);
    // this.cartService.checkout(
    //   this.carts.value,
    //   this.selectedSupplier.value,
    //   channel,
    //   discount,
    //   user
    // ).then(_12 => {
    //   if (this.cartOrder.value?.id) {
    //     return this.orderService.deleteOrder(this.cartOrder.value);
    //   } else {
    //     return _12;
    //   }
    // }).then(_ => {
    //   this.cartOrder.next(null);
    //   this.message('Done save sales');
    // }).catch(reason => {
    //   this.message(reason);
    //   throw reason;
    // }).finally(() => {
    //   this.selectedSupplier.next(null);
    //   this.checkoutProgress.next(false);
    // });
  }

  dispose() {
    // this.cartService.stopWorker();
    // if (this.cartOrder.value?.id) {
    //   this.carts.next([]);
    //   this.cartOrder.next(null);
    // }
  }

  saveOrder(channel: string, user: any): Promise<any> {
    // this.checkoutProgress.next(true);
    // return this.orderService.saveOrder(
    //   this.cartOrder.value?.id,
    //   this.carts.value,
    //   channel,
    //   this.selectedSupplier.value,
    //   user
    // ).then(_ => {
    //   this.cartOrder.next(null);
    //   this.message('Done save order');
    // }).catch(reason => {
    //   console.log(reason);
      // this.message(reason);
      // throw reason;
    // }).finally(() => {
    //   this.checkoutProgress.next(false);
    // });
    return undefined;
  }

  async printOnly(channel: string, discount: number): Promise<any> {
    this.checkoutProgress.next(true);
    return this.cartService.printCart(
      this.carts.value,
      channel,
      discount,
      this.selectedSupplier.value,
      true
    ).then(_ => {
      this.message('Done print cart');
    }).catch(reason => {
      this.message(reason);
      throw reason;
    }).finally(() => {
      // this.selectedCustomer.next(null);
      this.checkoutProgress.next(false);
    });
  }
}
