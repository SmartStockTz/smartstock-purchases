import {Injectable} from '@angular/core';
import {IpfsService, UserService} from '@smartstocktz/core-libs';
import {PurchaseModel} from '../models/purchase.model';
import {database} from 'bfast';

@Injectable({
  providedIn: 'root'
})

export class PurchaseService {
  constructor(private readonly userService: UserService) {
  }

  async fetchPurchases(size: number, skip: number, searchKeyword: string): Promise<PurchaseModel[]> {
    const activeShop = await this.userService.getCurrentShop();
    return await database(activeShop.projectId)
      .collection('purchases')
      .query()
      .cids(false)
      .size(size)
      .skip(skip)
      .searchByRegex('date', searchKeyword === null ? '' : searchKeyword)
      .orderBy('date', 'desc') as any[];
    // return await Promise.all(
    //   cids.map(c => {
    //     return IpfsService.getDataFromCid(c);
    //   })
    // ) as any[];
  }

  async addPurchase(purchase: PurchaseModel): Promise<any> {
    const shop = await this.userService.getCurrentShop();
    return database(shop.projectId)
      .bulk()
      .create('purchases', purchase)
      .update(
        'stocks',
        purchase.items
          .filter((x) => x.product.stockable === true)
          .map((item) => {
            return {
              query: {
                id: item.product.id,
              },
              update: {
                $set: {
                  expire: item.expire,
                  purchase: Number(item.purchase),
                  retailPrice: Number(item.retailPrice),
                  wholesalePrice: Number(item.wholesalePrice),
                  updatedAt: new Date()
                },
                $inc: {
                  quantity: Number(item.quantity),
                },
              },
            };
          })
      )
      .commit();
  }

  async countAll(date: string): Promise<any> {
    const shop = await this.userService.getCurrentShop();
    return await database(shop.projectId)
      .collection('purchases')
      .query()
      .searchByRegex('date', date)
      .count(true)
      .find();
  }

  async addPayment(id: string, payment: { [key: string]: number }): Promise<PurchaseModel> {
    const shop = await this.userService.getCurrentShop();
    return await database(shop.projectId)
      .collection('purchases')
      .query()
      .byId(id)
      .updateBuilder()
      .set('payment', payment)
      .update();
  }
}
