import {StockModel} from './stock.model';

export interface TransferModel {
  id?: string;
  createdAt?: any;
  updatedAt?: any;
  date?: any;
  note?: string;
  from_shop?: {
    name: string;
    projectId: string;
    applicationId: string;
  };
  to_shop?: {
    name: string;
    projectId: string;
    applicationId: string;
  };
  transferred_by?: {
    username: string;
  };
  amount?: number;
  items?: {
    quantity: number;
    product: StockModel
  }[];
}
