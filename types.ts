
export interface FunnelState {
  funnelName: string;
  budget: number;
  cpc: number;
  hasLeads: boolean;
  optInRate: number;
  hasSalesPage: boolean;
  clickThroughRate: number;
  salesConvRate: number;
  productPrice: number;
  hasUpsell: boolean;
  upsellRate: number;
  upsellPrice: number;
  fulfillmentRate: number;
  // Profit Maximizer
  hasMaximizer: boolean;
  maximizerRate: number;
  maximizerPrice: number;
}

export interface FunnelMetrics {
  visitors: number;
  leads: number;
  linkClicks: number;
  orders: number;
  upsells: number;
  completedOrders: number;
  revenue: number;
  productRevenue: number;
  upsellRevenue: number;
  profit: number;
  roi: number;
  profitMargin: number;
  cpa: number;
  cpl: number;
  // Recurring metrics
  mrr: number;
  subscribers: number;
  // Step Visibility
  showLeads: boolean;
  showSalesPage: boolean;
  showUpsell: boolean;
  showMaximizer: boolean;
}