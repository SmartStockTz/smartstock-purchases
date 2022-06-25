import { Injectable } from "@angular/core";
import { UserService } from "smartstock-core";
import { cache, database } from "bfast";

@Injectable({
  providedIn: "root"
})
export class SupplierService {
  constructor(private userService: UserService) {}

  async fetchAllSuppliers() {
    const shop = await this.userService.getCurrentShop();
    return cache({ database: shop.projectId, collection: "suppliers" })
      .getAll()
      .then((suppliers) => {
        if (Array.isArray(suppliers) && suppliers.length > 0) {
          return suppliers;
        }
        return database(shop.projectId)
          .table("suppliers")
          .getAll()
          .then((rS: any[]) => {
            cache({ database: shop.projectId, collection: "suppliers" })
              .setBulk(
                rS.map((x) => x.id),
                rS
              )
              .catch(console.log);
            return rS;
          });
      });
  }
}
