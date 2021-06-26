import {Injectable} from '@angular/core';
import {ConfigsService} from '@smartstocktz/core-libs';

@Injectable({
  providedIn: 'root'
})
export class PurchaseNavigationService {
  constructor(private readonly configs: ConfigsService) {
  }

  init(): void {
    this.configs.addMenu({
      name: 'Purchase',
      icon: 'receipt',
      roles: ['admin', 'manager'],
      link: '/purchase',
      pages: [
        {
          name: 'receipts & invoices',
          link: '/purchase/reference',
          roles: ['admin', 'manager']
        }
      ]
    });
  }

  selected(): void {
    this.configs.selectedModuleName = 'Purchase';
  }
}
