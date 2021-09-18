import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {IpfsService, StorageService, UserService} from '@smartstocktz/core-libs';
import {database} from 'bfast';
import {StockModel} from '../models/stock.model';

@Injectable({
  providedIn: 'root',
})
export class StockService {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly userService: UserService,
    private readonly storageService: StorageService
  ) {
  }

  async getAllStock(): Promise<StockModel[]> {
    const shop = await this.userService.getCurrentShop();
    const cids = await database(shop.projectId)
      .collection('stocks')
      .query()
      .cids(true)
      .orderBy('createdAt', 'desc') as any[];
    const stocks = await Promise.all(
      cids.map(c => {
        return IpfsService.getDataFromCid(c);
      })
    ) as any[];
    await this.storageService.saveStocks(stocks as any);
    return stocks;
  }

}
