export interface ShopModel {
  businessName?: string;
  applicationId?: string;
  projectId?: string;
  projectUrlId?: string;
  category?: string;
  settings?: {
    saleWithoutPrinter: boolean;
    printerFooter: string;
    printerHeader: string;
    allowRetail: boolean;
    allowWholesale: boolean;
  };
  ecommerce?: any;
  country?: string;
  region?: string;
  street?: string;
}
