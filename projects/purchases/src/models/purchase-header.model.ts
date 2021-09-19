export interface PurchaseHeaderModel {
  date: any;
  due: any;
  refNumber: string;
  user: {
    username: string,
    firstname: string,
    lastname: string
  };
  type: 'invoice' | 'receipt';
}
