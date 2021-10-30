import {Injectable} from '@angular/core';
import {UserService} from '@smartstocktz/core-libs';
import {database} from 'bfast';
import {StockModel} from '../models/stock.model';

@Injectable({
  providedIn: 'root',
})
export class StockService {
  constructor(private readonly userService: UserService) {
  }

  async getAllStock(): Promise<StockModel[]> {
    const shop = await this.userService.getCurrentShop();
    return new Promise((resolve, reject) => {
      try {
        database(shop.projectId).syncs('stocks', syncs => {
          const s = Array.from(syncs.changes().values());
          if (s.length === 0) {
            this.getAllStockRemote().then(resolve).catch(reject);
          } else {
            resolve(s);
          }
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  async getAllStockRemote(): Promise<StockModel[]> {
    const shop = await this.userService.getCurrentShop();
    return database(shop.projectId).syncs('stocks').upload();
  }

}
