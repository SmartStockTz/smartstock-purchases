import {StockModel} from './stock.model';
import {SupplierModel} from './supplier.model';

export interface PurchaseModel {
  objectId?: string;
  id?: string;
  createdAt?: any;
  updatedAt?: any;
  date: any;
  due: any;
  refNumber: string;
  amount: number;
  // amountPaid?: number;
  returns?: [any];
  paid: boolean;
  draft?: boolean;
  supplier: SupplierModel;
  type: 'invoice' | 'receipt';
  items: {
    wholesaleQuantity: number;
    wholesalePrice: number;
    retailPrice: number;
    product: StockModel,
    amount: number,
    purchase: number,
    quantity: number,
    expire: any
  }[];
}
