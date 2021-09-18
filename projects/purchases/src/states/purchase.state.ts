import {Injectable} from '@angular/core';
import {PurchaseModel} from '../models/purchase.model';
import {BehaviorSubject, skip} from 'rxjs';
import {PurchaseService} from '../services/purchase.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class PurchaseState {
  fetchPurchasesProgress: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  addPurchasesProgress: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  purchases: BehaviorSubject<PurchaseModel[]> = new BehaviorSubject<PurchaseModel[]>([]);
  filterKeyword: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  totalPurchase: BehaviorSubject<number> = new BehaviorSubject<number>(1000);
  size = 50;

  constructor(private readonly purchaseService: PurchaseService,
              private readonly matSnackBar: MatSnackBar) {
  }

  // async recordPayment(id: string): Promise<any> {
  //   const activeShop = await this.userService.getCurrentShop();
  //   return database(activeShop.projectId)
  //     .collection('purchases')
  //     .query()
  //     .byId(id)
  //     .updateBuilder()
  //     .set('paid', true)
  //     .update();
  // }

  async addPurchase(purchaseI: PurchaseModel): Promise<any> {
    this.addPurchasesProgress.next(true);
    return this.purchaseService.addPurchase(purchaseI)
      .catch(reason => {
        this.showMessage(reason.message ? reason.message : reason.toString());
      })
      .finally(() => {
        this.addPurchasesProgress.next(false);
      });
  }

  getPurchases(page: number): void {
    this.fetchPurchasesProgress.next(true);
    this.purchaseService.countAll(this.filterKeyword.value ? this.filterKeyword.value : '')
      .then(value => {
        this.totalPurchase.next(value);
        return this.purchaseService.fetchPurchases(
          this.size,
          this.size * page,
          this.filterKeyword.value ? this.filterKeyword.value : ''
        );
      }).then(value => {
      if (Array.isArray(value)) {
        this.purchases.next(value);
      }
    }).catch(reason => {
      this.showMessage(reason.message ? reason.message : reason.toString());
    }).finally(() => {
      this.fetchPurchasesProgress.next(false);
    });
  }

  async addReturn(id: string, value: any): Promise<[PurchaseModel]> {
    // const shop = await this.userService.getCurrentShop();
    // const purchase: PurchaseModel = await database(shop.projectId)
    //   .collection('purchases')
    //   .get(id);
    // if (purchase && purchase.returns && Array.isArray(purchase.returns)) {
    //   purchase.returns.push(value);
    // } else {
    //   purchase.returns = [value];
    // }
    // delete purchase.updatedAt;
    // return await database(shop.projectId)
    //   .collection('purchases')
    //   .query()
    //   .byId(id)
    //   .updateBuilder()
    //   .doc(purchase)
    //   .update();
    return null;
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

  countAll(): void {
    this.purchaseService.countAll(this.filterKeyword.value ? this.filterKeyword.value : '')
      .then(value => {
        this.totalPurchase.next(value);
      }).catch(reason => {
      this.showMessage(reason.message ? reason.message : reason.message);
    });
  }

  private showMessage(message: string) {
    this.matSnackBar.open(message, 'Ok', {
      duration: 3000
    });
  }
}
