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
    return new Promise((resolve, reject) => {
      try {
        database(shop.projectId).syncs('suppliers', syncs => {
          const s = Array.from(syncs.changes().values());
          if (s.length === 0) {
            syncs.upload().then(resolve).catch(reject);
          } else {
            resolve(s);
          }
        });
      } catch (e) {
        reject(e);
      }
    });
  }

}
