import PanelComponent from './panel.vue';
import { definePanel } from '@directus/shared/utils';

export default definePanel({
	id: 'trading-view',
	name: 'TradingView Card',
	description: 'TradingView',
	icon: 'box',
	component: PanelComponent,
	options: [
    {
      field: 'chartType',
      name: 'Chart Type',
      type: 'string',
      meta: {
        width: 'full',
        interface: 'select-dropdown',
        options: {
          choices: [
            'Chart',
            'ForexCrossRates',
            'CryptoMarket',
            'TechnicalAnalysis',
            'MarketData',
            'StockMarket',
            'EconomicCalendar',
            'Ticker',
            'TickerTape',
            'SingleTicker',
            'MiniChart',
            'SymbolOverview',
            'Screener',
            'FundamentalData',
            'CompanyProfile',
            'Snaps'
          ]
        }
      },
      schema: {
        default_value: 'Chart'
      }
    },
		{
      field: 'chartOptions',
      name: 'Chart Options',
      type: 'json',
      meta: {
        width: 'full',
        interface: 'input-code'
      },
      schema: {
        default_value: JSON.stringify({
          theme: "dark"
        }, null, 4)
      }
    }
	],
	minWidth: 12,
	minHeight: 6,
});
