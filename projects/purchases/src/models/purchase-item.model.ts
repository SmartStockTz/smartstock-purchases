import {StockModel} from './stock.model';

export interface PurchaseItemModel {
    wholesaleQuantity: number;
    wholesalePrice: number;
    retailPrice: number;
    product: StockModel;
    amount: number;
    purchase: number;
    quantity: number;
    expire: any;
}
