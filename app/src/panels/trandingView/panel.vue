<template>
	<div class="trading-view-chart">
    <component :key="chartType" :is="chartType" :options="mergeOptions" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import {
  Chart,
  ForexHeatMap,
  ForexCrossRates,
  CryptoMarket,
  TechnicalAnalysis,
  MarketData,
  StockMarket,
  EconomicCalendar,
  Ticker,
  TickerTape,
  SingleTicker,
  MiniChart,
  SymbolOverview,
  Screener,
  FundamentalData,
  CompanyProfile,
  Snaps
} from './widgets/entry'

export default defineComponent({
  components: {
    Chart,
    ForexHeatMap,
    ForexCrossRates,
    CryptoMarket,
    TechnicalAnalysis,
    MarketData,
    StockMarket,
    EconomicCalendar,
    Ticker,
    TickerTape,
    SingleTicker,
    MiniChart,
    SymbolOverview,
    Screener,
    FundamentalData,
    CompanyProfile,
    Snaps
  },
	props: {
		showHeader: {
			type: Boolean,
			default: false,
		},
    chartType: {
      type: String,
      default: 'Chart'
    },
		chartOptions: {
			type: Object,
			default: null
		},
    id: {
      type: String,
      default: ''
    }
	},
  computed: {
    mergeOptions() {
      if (!this.chartOptions) return {
        container_id: this.id
      }
      return {
        ...this.chartOptions,
        container_id: this.id
      }
    }
  }
});
</script>

<style scoped>
</style>

