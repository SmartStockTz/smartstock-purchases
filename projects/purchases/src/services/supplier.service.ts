import {Injectable} from '@angular/core';
import {UserService} from '@smartstocktz/core-libs';
import {database} from 'bfast';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  constructor(private userService: UserService) {
  }

  async fetchAllSuppliers() {
    const shop = await this.userService.getCurrentShop();
    const s = await database(shop.projectId).syncs('suppliers').changes().values();
    return Array.from(s);
  }

}
