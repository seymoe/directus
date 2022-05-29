<template>
  <div ref="tradingview" :id="container" />
</template>

<script>
import { defineComponent } from 'vue';
import useInitWidget from '../composable/useInitWidget';

export default defineComponent({
  name: 'MiniChart',
  props: {
    options: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const options = {
      symbol: 'FX:EURUSD',
      width: 350,
      height: 220,
      locale: 'en',
      dateRange: '12M',
      colorTheme: 'light',
      trendLineColor: 'rgba(41, 98, 255, 1)',
      underLineColor: 'rgba(41, 98, 255, 0.3)',
      underLineBottomColor: 'rgba(41, 98, 255, 0)',
      isTransparent: false,
      autosize: false,
      largeChartUrl: '',
      ...props.options,
    };

    const { container, tradingview } = useInitWidget(
      options,
      options.container_id,
      `tradingview-mini-chart-script_${options.container_id}`,
      'https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js'
    );

    return { container, tradingview };
  },
});
</script>
