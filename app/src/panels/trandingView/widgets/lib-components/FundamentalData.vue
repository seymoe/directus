<template>
  <div ref="tradingview" :id="container" />
</template>

<script>
import { defineComponent } from 'vue';
import useInitWidget from '../composable/useInitWidget';

export default defineComponent({
  name: 'FundamentalData',
  props: {
    options: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const options = {
      symbol: 'NASDAQ:AAPL',
      colorTheme: 'light',
      isTransparent: false,
      largeChartUrl: '',
      displayMode: 'regular',
      width: 480,
      height: 830,
      locale: 'en',
      ...props.options,
    };

    const { container, tradingview } = useInitWidget(
      options,
      options.container_id,
      `tradingview-fundamental-data-script_${options.container_id}`,
      'https://s3.tradingview.com/external-embedding/embed-widget-financials.js'
    );

    return { container, tradingview };
  },
});
</script>
