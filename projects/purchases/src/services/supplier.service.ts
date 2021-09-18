import {Injectable} from '@angular/core';
import {IpfsService, UserService} from '@smartstocktz/core-libs';
import {database} from 'bfast';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  constructor(private userService: UserService) {
  }

  async fetchAllSuppliers() {
    const shop = await this.userService.getCurrentShop();
    const cids = await database(shop.projectId)
      .table('suppliers')
      .query()
      .cids(true)
      .orderBy('name', 'asc') as any[];
    return await Promise.all(
      cids.map(x => {
        return IpfsService.getDataFromCid(x);
      })
    );
  }

}
