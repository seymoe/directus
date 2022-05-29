<template>
  <div :id="container" ref="tradingview" />
</template>
<script>
import { defineComponent } from 'vue';
import useInitWidget from '../composable/useInitWidget';

export default defineComponent({
  name: 'ForexHeatMap',
  props: {
    options: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const options = {
      width: 770,
      height: 400,
      currencies: ['EUR', 'USD', 'JPY', 'GBP', 'CHF', 'AUD', 'CAD', 'NZD', 'CNY'],
      isTransparent: false,
      colorTheme: 'light',
      locale: 'en',
      ...props.options,
    };

    const { container, tradingview } = useInitWidget(
      options,
      options.container_id,
      `tradingview-forex-heat-map-script_${options.container_id}`,
      'https://s3.tradingview.com/external-embedding/embed-widget-forex-heat-map.js'
    );

    return { container, tradingview };
  },
});
</script>
