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
    const s = await database(shop.projectId).syncs('stocks').changes().values();
    return Array.from(s);
  }

  async getAllStockRemote(): Promise<StockModel[]> {
    const shop = await this.userService.getCurrentShop();
    return database(shop.projectId).syncs('stocks').upload();
  }

}
