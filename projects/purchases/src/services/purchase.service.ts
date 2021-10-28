import {Injectable} from '@angular/core';
import {SecurityUtil, UserService} from '@smartstocktz/core-libs';
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
      .orderBy('date', 'desc')
      .find();
  }

  async addPurchase(purchase: PurchaseModel): Promise<any> {
    const shop = await this.userService.getCurrentShop();
    const stockableItems = purchase.items.filter((x) => x.product.stockable === true);
    const r = await database(shop.projectId).bulk()
      .create('purchases', purchase)
      .update('stocks', stockableItems.map((item) => {
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
              updatedAt: new Date(),
              [`quantity.${SecurityUtil.generateUUID()}`]: {
                q: Number(item.quantity),
                s: 'purchase',
                d: new Date().toISOString()
              }
            }
          },
        };
      })).commit();
    for (const item of stockableItems) {
      const oldStock = database(shop.projectId).syncs('stocks').changes().get(item.product.id);
      if (oldStock && typeof oldStock.quantity === 'object') {
        oldStock.quantity[SecurityUtil.generateUUID()] = {
          q: Number(item.quantity),
          s: 'purchase',
          d: new Date().toISOString()
        };
      }
      if (oldStock && typeof oldStock.quantity === 'number') {
        oldStock.quantity = {
          [SecurityUtil.generateUUID()]: {
            q: Number(item.quantity),
            s: 'purchase',
            d: new Date().toISOString()
          }
        };
      }
      database(shop.projectId).syncs('stocks').changes().set(oldStock);
    }
    return r;
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
