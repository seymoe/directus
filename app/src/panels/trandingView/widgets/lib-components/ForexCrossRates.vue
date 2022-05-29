<template>
  <div ref="tradingview" :id="container" />
</template>

<script>
import { defineComponent } from 'vue';
import useInitWidget from '../composable/useInitWidget';

export default defineComponent({
  name: 'ForexCrossRates',
  props: {
    options: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const options = {
      symbol: 'NASDAQ:AAPL',
      color: 'blak',
      isTransparent: false,
      largeChartUrl: '',
      displayMode: 'regular',
      width: '100%',
      height: '100%',
      locale: 'br',
      ...props.options,
    };

    const { container, tradingview } = useInitWidget(
      options,
      options.container_id,
      `tradingview-forex-cross-rates-script_${options.container_id}`,
      'https://s3.tradingview.com/external-embedding/embed-widget-forex-cross-rates.js'
    );

    return { container, tradingview };
  },
});
</script>
