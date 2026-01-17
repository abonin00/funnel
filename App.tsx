
import React, { useState, useMemo } from 'react';
import { FunnelState, FunnelMetrics } from './types';
import FunnelVisual from './components/FunnelVisual';
import ResultsBar from './components/ResultsBar';
import { Target, RefreshCcw } from 'lucide-react';

const INITIAL_STATE: FunnelState = {
  funnelName: 'New Campaign',
  budget: 5000,
  cpc: 2.50,
  hasLeads: true,
  optInRate: 40,
  hasSalesPage: true,
  clickThroughRate: 20,
  salesConvRate: 5,
  productPrice: 997,
  hasUpsell: true,
  upsellRate: 15,
  upsellPrice: 1997,
  fulfillmentRate: 100,
  hasMaximizer: true,
  maximizerRate: 25,
  maximizerPrice: 97,
};

const App: React.FC = () => {
  const [state, setState] = useState<FunnelState>(INITIAL_STATE);

  const metrics = useMemo<FunnelMetrics>(() => {
    const visitors = state.budget / (state.cpc || 0.01);
    const leads = state.hasLeads ? visitors * (state.optInRate / 100) : visitors;
    const linkClicks = state.hasSalesPage ? leads * (state.clickThroughRate / 100) : leads;
    const totalOrders = linkClicks * (state.salesConvRate / 100);
    const upsells = state.hasUpsell ? totalOrders * (state.upsellRate / 100) : 0;
    const completedOrders = totalOrders;
    
    const productRevenue = completedOrders * state.productPrice;
    const upsellRevenue = upsells * state.upsellPrice;
    const oneTimeRevenue = productRevenue + upsellRevenue;
    
    const subscribers = state.hasMaximizer ? (completedOrders * (state.maximizerRate / 100)) : 0;
    const mrr = subscribers * state.maximizerPrice;
    
    const totalMonthlyRevenue = oneTimeRevenue + mrr;
    const profit = totalMonthlyRevenue - state.budget;
    const roi = state.budget > 0 ? (profit / state.budget) * 100 : 0;
    const profitMargin = totalMonthlyRevenue > 0 ? (profit / totalMonthlyRevenue) * 100 : 0;
    const cpa = completedOrders > 0 ? state.budget / completedOrders : 0;
    const cpl = leads > 0 ? state.budget / leads : 0;

    return {
      visitors: Math.round(visitors),
      leads: Math.round(leads),
      linkClicks: Math.round(linkClicks),
      orders: Math.round(totalOrders),
      upsells: Math.round(upsells),
      completedOrders: Math.round(completedOrders),
      revenue: parseFloat(totalMonthlyRevenue.toFixed(2)),
      productRevenue: parseFloat(productRevenue.toFixed(2)),
      upsellRevenue: parseFloat(upsellRevenue.toFixed(2)),
      profit: parseFloat(profit.toFixed(2)),
      roi: parseFloat(roi.toFixed(2)),
      profitMargin: parseFloat(profitMargin.toFixed(2)),
      cpa: parseFloat(cpa.toFixed(2)),
      cpl: parseFloat(cpl.toFixed(2)),
      mrr: parseFloat(mrr.toFixed(2)),
      subscribers: Math.round(subscribers),
      showLeads: state.hasLeads,
      showSalesPage: state.hasSalesPage,
      showUpsell: state.hasUpsell,
      showMaximizer: state.hasMaximizer,
    };
  }, [state]);

  const updateField = (key: keyof FunnelState, value: any) => {
    setState(prev => ({ ...prev, [key]: value }));
  };

  const handleReset = () => setState(INITIAL_STATE);

  return (
    <div className="w-full flex flex-col items-center bg-transparent font-sans overflow-x-hidden min-h-screen">
      <div className="w-full max-w-4xl bg-white shadow-none sm:shadow-2xl sm:rounded-[32px] border-none sm:border sm:border-slate-100 flex flex-col overflow-hidden transition-all duration-300">
        
        {/* Widget Header */}
        <div className="px-5 py-5 sm:px-8 sm:py-6 border-b border-slate-50 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shrink-0">
              <Target size={20} />
            </div>
            <div className="flex flex-col min-w-0">
              <input
                type="text"
                value={state.funnelName}
                onChange={(e) => updateField('funnelName', e.target.value)}
                className="text-base sm:text-lg font-black text-slate-800 tracking-tight bg-transparent border-none focus:ring-0 p-0 hover:bg-slate-50 rounded transition-colors truncate w-full"
                placeholder="Campaign Name"
              />
              <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest leading-none">Campaign ROI Simulator</span>
            </div>
          </div>
          <button 
            onClick={handleReset}
            className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400 group shrink-0"
            title="Reset Simulation"
          >
            <RefreshCcw size={16} className="group-active:rotate-180 transition-transform duration-500" />
          </button>
        </div>

        {/* Calculator Body */}
        <div className="p-2 sm:p-8 md:p-10 bg-white">
          <FunnelVisual 
            state={state} 
            metrics={metrics} 
            onUpdate={updateField} 
          />
        </div>

        {/* Result Summary */}
        <ResultsBar metrics={metrics} invested={state.budget} funnelName={state.funnelName} />
      </div>

      {/* Footer Branding for GHL */}
      <div className="py-8 px-6 text-center">
         <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] opacity-60">
           Powered by Campaign ROI Simulator
         </p>
      </div>
    </div>
  );
};

export default App;
