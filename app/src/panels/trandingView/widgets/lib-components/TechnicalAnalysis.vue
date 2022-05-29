<template>
  <div ref="tradingview" :id="container" />
</template>

<script>
import { defineComponent } from 'vue';
import useInitWidget from '../composable/useInitWidget';

export default defineComponent({
  name: 'TechnicalAnalysis',
  props: {
    options: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const options = {
      interval: '1m',
      width: 425,
      isTransparent: false,
      height: 450,
      symbol: 'NASDAQ:AAPL',
      showIntervalTabs: true,
      locale: 'en',
      colorTheme: 'light',
      ...props.options,
    };

    const { container, tradingview } = useInitWidget(
      options,
      options.container_id,
      `tradingview-technical-analysis-script_${options.container_id}`,
      'https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js'
    );

    return { container, tradingview };
  },
});
</script>
