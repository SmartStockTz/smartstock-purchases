import {Injectable} from '@angular/core';
import {PurchaseModel} from '../models/purchase.model';
import {HttpClient} from '@angular/common/http';
import {ReceiptModel} from '../models/receipt.model';
import {SettingsService} from '../services/settings.service';
import {BFast} from 'bfastjs';
import {SupplierModel} from '../models/supplier.model';
import {StorageService} from '@smartstocktz/core-libs';

@Injectable({
  providedIn: 'root',
})
export class PurchaseState {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly storageService: StorageService,
    private readonly settingsService: SettingsService
  ) {
  }

  async recordPayment(id: string): Promise<any> {
    const activeShop = await this.storageService.getActiveShop();
    return BFast.database(activeShop.projectId)
      .collection('purchases')
      .query()
      .byId(id)
      .updateBuilder()
      .set('paid', true)
      .update();
  }

  addAllInvoices(invoices: ReceiptModel[], callback: (value: any) => void): void {
  }

  addAllPurchase(purchases: PurchaseModel[], callback: (value: any) => void): void {
  }

  addAllReceipts(invoices: ReceiptModel[], callback: (value: any) => void): void {
  }

  addInvoice(invoice: ReceiptModel, callback: (value: any) => void): void {
    // this.addReceipt(invoice, callback);
  }

  async addPurchase(purchaseI: PurchaseModel): Promise<any> {
    const shop = await this.storageService.getActiveShop();
    return BFast.database(shop.projectId)
      .transaction()
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

  addReceipt(invoice: ReceiptModel, callback: (value: any) => void): void {
  }

  deleteInvoice(id: string, callback: (value: any) => void): void {
  }

  deleteReceipts(id: string, callback: (value: any) => void): void {
  }

  getAllInvoice(callback: (invoices: ReceiptModel[]) => void): void {
  }

  async deletePurchase(purchase: PurchaseModel): Promise<PurchaseModel> {
    const activeShop = await this.storageService.getActiveShop();
    return BFast.database(activeShop.projectId)
      .collection('purchase')
      .query()
      .byId(purchase.id)
      .delete();
  }

  async getAllPurchase(page: {
    size?: number;
    skip?: number;
  }): Promise<PurchaseModel[]> {
    const activeShop = await this.storageService.getActiveShop();
    return BFast.database(activeShop.projectId)
      .collection('purchases')
      .query()
      .orderBy('_created_at', -1)
      .size(page.size)
      .skip(page.skip)
      .find();
  }

  // must be updated and its socket method
  getAllReceipts(callback: (invoices: ReceiptModel[]) => void): void {
    // const query = new Parse.Query('purchaseRefs');
    // const subscription = query.subscribe();
    // subscription.on('open', () => {
    //   console.log('purchase refs socket connected');
    //   this.updateCachedPurchaseRefs();
    // });
    // subscription.on('update', value => {
    //   this.updateCachedPurchaseRefs();
    // });
    // subscription.on('delete', value => {
    //   this.updateCachedPurchaseRefs();
    // });
    // subscription.on('create', value => {
    //   this.updateCachedPurchaseRefs();
    // });
    callback(null);
  }

  getInvoice(id: string, callback: (invoice: ReceiptModel) => void): void {
  }

  getPurchase(id: string, callback: (purchase: PurchaseModel) => void): void {
  }

  async getAllSupplier(pagination: {
    size?: number;
    skip?: number;
  }): Promise<SupplierModel[]> {
    const shop = await this.storageService.getActiveShop();
    const suppliers: SupplierModel[] = await BFast.database(shop.projectId)
      .collection<SupplierModel>('suppliers')
      .getAll<SupplierModel>();
    suppliers.sort((a, b) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
    return suppliers;
  }

  getReceipt(id: string, callback: (invoice: ReceiptModel) => void): void {
  }

  updatePurchase(id: string, callback: (value: any) => void): void {
  }

  async addReturn(id: string, value: any): Promise<[PurchaseModel]> {
    const shop = await this.storageService.getActiveShop();
    const purchase: PurchaseModel = await BFast.database(shop.projectId)
      .collection('purchases')
      .get(id);

    if (purchase && purchase.returns && Array.isArray(purchase.returns) ) {
      purchase.returns.push(value);
    } else {
      purchase.returns = [value];
    }
    delete purchase.updatedAt;

    return await BFast.database(shop.projectId)
      .collection('purchases')
      .query()
      .byId(id)
      .updateBuilder()
      .doc(purchase)
      .update();
  }

  calculateTotalReturns(returns: [any]){
    if (returns && Array.isArray(returns)){
      return returns.map(a => a.amount).reduce((a, b, i) => {
        return a + b;
      });
    } else {
      return 0.0;
    }
  }

  async fetchSync(size= 20, skip = 0): Promise<PurchaseModel[]>{
    return await this.getPurchases({
      skip,
      size
    });
  }

  async getPurchases(pagination: { size: number, skip: number }): Promise<PurchaseModel[]> {
    const shop = await this.storageService.getActiveShop();
    return await BFast.database(shop.projectId)
      .collection('purchases')
      .query()
      .orderBy('_created_at', -1)
      .size(pagination.size)
      .skip(pagination.skip)
      .find();
  }

  async countAll(): Promise<any> {
    return this.invoicesCount();
  }

  async invoicesCount(): Promise<number> {
    const shop = await this.storageService.getActiveShop();
    return await BFast.database(shop.projectId)
      .collection('purchases')
      .query()
      .count(true)
      .find();
  }
}
