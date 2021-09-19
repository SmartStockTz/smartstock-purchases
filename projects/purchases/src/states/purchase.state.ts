import {Injectable} from '@angular/core';
import {PurchaseModel} from '../models/purchase.model';
import {BehaviorSubject} from 'rxjs';
import {PurchaseService} from '../services/purchase.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class PurchaseState {
  fetchPurchasesProgress = new BehaviorSubject<boolean>(false);
  loadMoreProgress = new BehaviorSubject<boolean>(false);
  addPurchasesProgress = new BehaviorSubject<boolean>(false);
  addPaymentProgress = new BehaviorSubject<boolean>(false);
  purchases = new BehaviorSubject<PurchaseModel[]>([]);
  filterKeyword = new BehaviorSubject<string>(null);
  totalPurchase = new BehaviorSubject<number>(1000);
  size = 50;

  constructor(private readonly purchaseService: PurchaseService,
              private readonly matSnackBar: MatSnackBar) {
  }

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

  async addPayment(purchase: PurchaseModel, payment: { [key: string]: number }): Promise<any> {
    this.addPaymentProgress.next(true);
    payment = Object.assign(purchase.payment ? purchase.payment : {}, payment);
    return this.purchaseService.addPayment(purchase.id, payment).then(value => {
      const tPu = this.purchases.value.map(x => {
        if (x.id === value.id) {
          return value;
        }
        return x;
      });
      this.purchases.next(tPu);
      return null;
    }).catch(reason => {
      this.showMessage(reason.message ? reason.message : reason.toString());
    }).finally(() => {
      this.addPaymentProgress.next(false);
    });
  }

  private showMessage(message: string) {
    this.matSnackBar.open(message, 'Ok', {
      duration: 3000
    });
  }

  loadMore() {
    this.loadMoreProgress.next(true);
    this.purchaseService
      .fetchPurchases(this.size, this.purchases.value.length, this.filterKeyword.value)
      .then(value => {
        this.purchases.next([...this.purchases.value, ...value]);
      }).catch(reason => {
      this.showMessage(reason.message ? reason.message : reason.toString());
    }).finally(() => {
      this.loadMoreProgress.next(false);
    });
  }
}
