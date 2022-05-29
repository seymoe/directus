<template>
  <div ref="tradingview" :id="container" />
</template>

<script>
import { defineComponent } from 'vue';
import useInitWidget from '../composable/useInitWidget';

export default defineComponent({
  name: 'SingleTicker',
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
      colorTheme: 'light',
      isTransparent: false,
      locale: 'en',
      ...props.options,
    };

    const { container, tradingview } = useInitWidget(
      options,
      options.container_id,
      `tradingview-single-ticker-script_${options.container_id}`,
      'https://s3.tradingview.com/external-embedding/embed-widget-single-quote.js'
    );

    return { container, tradingview };
  },
});
</script>
