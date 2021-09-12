import {Injectable} from '@angular/core';
import {SupplierModel} from '../models/supplier.model';
import {cache, database} from 'bfast';
import {StockModel} from '../models/stock.model';
import {IpfsService, MessageService, UserService} from '@smartstocktz/core-libs';
import {BehaviorSubject} from 'rxjs';
import {StockService} from '../services/stock.service';

@Injectable({
  providedIn: 'root',
})
export class StockState {
  stocks: BehaviorSubject<StockModel[]> = new BehaviorSubject<StockModel[]>([]);
  isFetchStocks: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private readonly userService: UserService,
    private readonly stockService: StockService,
    private readonly messageService: MessageService
  ) {
  }

  async addSupplier(supplier: SupplierModel): Promise<any> {
    const shop = await this.userService.getCurrentShop();
    return database(shop.projectId)
      .collection('suppliers')
      .save(supplier);
  }

  async deleteSupplier(id: string): Promise<any> {
    const shop = await this.userService.getCurrentShop();
    return database(shop.projectId)
      .collection('suppliers')
      .query()
      .byId(id)
      .delete();
  }

  async getAllStock(): Promise<StockModel[]> {
    const shop = await this.userService.getCurrentShop();
    const cids = await database(shop.projectId)
      .collection<StockModel>('stocks')
      .getAll<string>({
        cids: true
      });
    const stocks = await Promise.all(
      cids.map(c => {
        return IpfsService.getDataFromCid(c);
      })
    ) as any[];
    return stocks;
  }

  async getStocks(): Promise<void> {
    this.isFetchStocks.next(true);
    const shop = await this.userService.getCurrentShop();
    cache({database: 'stocks', collection: 'stocks'}, shop.projectId)
      .get('all')
      .then((localStocks) => {
        if (
          localStocks &&
          Array.isArray(Object.values(localStocks)) &&
          Object.values(localStocks).length > 0
        ) {
          this.stocks.next(Object.values(localStocks));
        } else {
          return this.stockService.getAllStock();
        }
      })
      .then((remoteStocks) => {
        if (
          remoteStocks &&
          Array.isArray(remoteStocks) &&
          remoteStocks.length > 0
        ) {
          this.stocks.next(remoteStocks);
          const hashStocks = remoteStocks.reduce((a, b) => {
            a[b.id] = b;
            return a;
          }, {});
          return cache({database: 'stocks', collection: 'stocks'}, shop.projectId)
            .set('all', hashStocks);
        }
      })
      .catch((reason) => {
        this.messageService.showMobileInfoMessage(
          reason && reason.message ? reason.message : reason,
          2000,
          'bottom'
        );
      })
      .finally(() => {
        this.isFetchStocks.next(false);
      });
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

  getStocksFromRemote(): void {
    this.isFetchStocks.next(true);
    this.stockService
      .getAllStock()
      .then(async (remoteStocks) => {
        this.stocks.next(remoteStocks);
        const hashStocks = remoteStocks.reduce((a, b) => {
          a[b.id] = b;
          return a;
        }, {});
        const shop = await this.userService.getCurrentShop();
        return cache({database: 'stocks', collection: 'stocks'}, shop.projectId)
          .set('all', hashStocks);
      })
      .catch((reason) => {
        this.messageService.showMobileInfoMessage(
          reason && reason.message ? reason.message : reason,
          2000,
          'bottom'
        );
      })
      .finally(() => {
        this.isFetchStocks.next(false);
      });
  }

  async updateSupplier(value: {
    id: string;
    field: string;
    value: string;
  }): Promise<any> {
    const shop = await this.userService.getCurrentShop();
    const supplierId = value.id;
    const data = {};
    data[value.field] = value.value;
    delete value.id;
    const response = await database(shop.projectId)
      .collection('suppliers')
      .query()
      .byId(supplierId)
      .updateBuilder()
      .set(value.field, value.value)
      .update();
    response.id = supplierId;
    return response;
  }

  filter(query: string): void {
    this.userService.getCurrentShop().then(shop => {
      return cache({database: 'stocks', collection: 'stocks'}, shop.projectId)
        .get('all');
    }).then((stocks: { [id: string]: object }) => {
      if (query) {
        const results = Object.values(stocks).filter((x) =>
          JSON.stringify(x)
            .toLowerCase()
            .includes(query.toString().toLowerCase())
        );
        // @ts-ignore
        this.stocks.next(results);
      } else {
        this.getStocks().catch(console.log);
      }
    });
  }
}
