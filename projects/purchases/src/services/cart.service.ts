import {Injectable} from '@angular/core';
import {PrintService, SecurityUtil, UserService} from '@smartstocktz/core-libs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  // cartWorker: CartWorker;
  // cartWorkerNative;

  constructor(private userService: UserService,
              private readonly printService: PrintService) {
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

  async findTotal(carts: any[], channel: string, discount: any): Promise<number> {
    const shop = await this.userService.getCurrentShop();
    // await this.initWorker(shop);
    // return this.cartWorker.findTotal(carts, channel, discount);
    return 0;
  }

  async addToCart(carts: any[], cart: any) {
    const shop = await this.userService.getCurrentShop();
    // await this.initWorker(shop);
    // return this.cartWorker.addToCart(carts, cart);
  }

  async checkout(
    carts: any[],
    customer: any,
    channel: string,
    discount: number,
    user: any
  ): Promise<any> {
    discount = isNaN(discount) ? 0 : discount;
    const shop = await this.userService.getCurrentShop();
    // await this.initWorker(shop);
    // await this.printCart(carts, channel, discount, customer, false);
    // const salesToSave: SalesModel[] = await this.cartWorker.getSalesBatch(carts, channel, discount, customer, user);
    // return this.salesService.saveSale(salesToSave);
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
