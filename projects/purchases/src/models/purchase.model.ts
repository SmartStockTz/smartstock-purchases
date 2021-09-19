import {SupplierModel} from './supplier.model';
import {PurchaseItemModel} from './purchase-item.model';

export interface PurchaseModel {
  id?: string;
  createdAt?: any;
  updatedAt?: any;
  date: any;
  due: any;
  refNumber: string;
  amount: number;
  // amountPaid?: number;
  returns?: any[];
  draft?: boolean;
  supplier: SupplierModel;
  user: {
    username: string,
    firstname: string,
    lastname: string
  };
  type: 'invoice' | 'receipt';
  items: PurchaseItemModel[];
}
