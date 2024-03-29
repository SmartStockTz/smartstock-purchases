import {Injectable} from '@angular/core';
import {PurchaseItemModel} from '../models/purchase-item.model';
import {PurchaseModel} from '../models/purchase.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  // cartWorker: CartWorker;
  // cartWorkerNative;

  constructor() {
  }

  // private async initWorker(shop: ShopModel) {
  //   if (!this.cartWorker) {
  //     this.cartWorkerNative = new Worker(new URL('../workers/cart.worker', import.meta.url));
  //     const SW = wrap(this.cartWorkerNative) as unknown as any;
  //     this.cartWorker = await new SW(shop);
  //   }
  // }

  // stopWorker() {
  //   if (this.cartWorkerNative) {
  //     this.cartWorkerNative.terminate();
  //     this.cartWorker = undefined;
  //     this.cartWorkerNative = undefined;
  //   }
  // }

  async findTotal(carts: PurchaseItemModel[]): Promise<number> {
    return carts.map<number>(value => {
      return value.quantity * value.purchase;
    }).reduce((a, b) => {
      return a + b;
    }, 0);
  }

  async addToCart(carts: any[], cart: any) {
    let update = false;
    carts.map(x => {
      if (x.product.id === cart.product.id) {
        x.quantity += cart.quantity;
        update = true;
      }
      return x;
    });
    if (update === false) {
      carts.push(cart);
    }
    return carts;
  }

  async checkout(purchase: PurchaseModel): Promise<any> {
    // const shop = await this.userService.getCurrentShop();
    // return database(shop.projectId).table('purchases').save(purchase);
  }

  async printCart(carts: any[], channel: string, discount: number, customer: any, printOnly: boolean): Promise<any> {
    discount = isNaN(discount) ? 0 : discount;
    // const saleItems = await this.cartWorker.cartItemsToSaleItems(carts, discount, channel);
    // const salesItemForPrint = await this.cartWorker.cartItemsToPrinterData(saleItems, customer, channel, discount, printOnly);
    // console.log(salesItemForPrint);
    // await this.printService.print({
    //   data: salesItemForPrint,
    //   printer: 'tm20',
    //   id: SecurityUtil.generateUUID(),
    //   qr: null
    // });
  }
}
