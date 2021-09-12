import {Injectable} from '@angular/core';
import {PurchaseModel} from '../models/purchase.model';
import {HttpClient} from '@angular/common/http';
import {database} from 'bfast';
import {SupplierModel} from '../models/supplier.model';
import {IpfsService, UserService} from '@smartstocktz/core-libs';

@Injectable({
  providedIn: 'root',
})
export class PurchaseState {
  constructor(private readonly httpClient: HttpClient,
              private readonly userService: UserService) {
  }

  async recordPayment(id: string): Promise<any> {
    const activeShop = await this.userService.getCurrentShop();
    return database(activeShop.projectId)
      .collection('purchases')
      .query()
      .byId(id)
      .updateBuilder()
      .set('paid', true)
      .update();
  }

  async addPurchase(purchaseI: PurchaseModel): Promise<any> {
    const shop = await this.userService.getCurrentShop();
    return database(shop.projectId)
      .bulk()
      .create('purchases', purchaseI)
      .update(
        'stocks',
        purchaseI.items
          .filter((x) => x.product.purchasable === true)
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
                  wholesaleQuantity: Number(item.wholesaleQuantity),
                },
                $currentDate: {
                  _updated_at: true,
                },
                $inc: {
                  quantity:
                    item.product.stockable === true ? Number(item.quantity) : 0,
                },
              },
            };
          })
      )
      .commit();
  }

  async getAllPurchase(page: {
    size?: number;
    skip?: number;
  }): Promise<PurchaseModel[]> {
    const activeShop = await this.userService.getCurrentShop();
    const cids: string[] = await database(activeShop.projectId)
      .collection('purchases')
      .query()
      .cids(true)
      .size(page.size)
      .skip(page.skip)
      .find();
    return await Promise.all(
      cids.map(c => {
        return IpfsService.getDataFromCid(c);
      })
    ) as any[];
  }

  async getAllSupplier(): Promise<SupplierModel[]> {
    const shop = await this.userService.getCurrentShop();
    const cids = await database(shop.projectId)
      .collection<SupplierModel>('suppliers')
      .getAll<string>({
        cids: true
      });
    return await Promise.all(
      cids.map(c => {
        return IpfsService.getDataFromCid(c);
      })
    ) as any[];
  }

  async addReturn(id: string, value: any): Promise<[PurchaseModel]> {
    const shop = await this.userService.getCurrentShop();
    const purchase: PurchaseModel = await database(shop.projectId)
      .collection('purchases')
      .get(id);
    if (purchase && purchase.returns && Array.isArray(purchase.returns)) {
      purchase.returns.push(value);
    } else {
      purchase.returns = [value];
    }
    delete purchase.updatedAt;
    return await database(shop.projectId)
      .collection('purchases')
      .query()
      .byId(id)
      .updateBuilder()
      .doc(purchase)
      .update();
  }

  calculateTotalReturns(returns: [any]) {
    if (returns && Array.isArray(returns)) {
      return returns.map(a => a.amount).reduce((a, b, i) => {
        return a + b;
      });
    } else {
      return 0.0;
    }
  }

  async fetchSync(size: number, skip: number, id: string): Promise<PurchaseModel[]> {
    return await this.getPurchases({
      skip,
      size,
      id
    });
  }

  async getPurchases(pagination: { size: number, skip: number, id: string }): Promise<PurchaseModel[]> {
    const shop = await this.userService.getCurrentShop();
    const cids: string[] = await database(shop.projectId)
      .collection('purchases')
      .query()
      .cids(true)
      .size(pagination.size)
      .skip(pagination.skip)
      .searchByRegex('refNumber', pagination.id)
      .find();
    return await Promise.all(
      cids.map(c => {
        return IpfsService.getDataFromCid(c);
      })
    ) as any[];
  }

  async countAll(ref: string): Promise<any> {
    return this.invoicesCount(ref);
  }

  async invoicesCount(ref: string): Promise<number> {
    const shop = await this.userService.getCurrentShop();
    return await database(shop.projectId)
      .collection('purchases')
      .query()
      .searchByRegex('refNumber', ref)
      .count(true)
      .find();
  }
}
