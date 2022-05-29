<template>
  <div ref="tradingview" :id="container" />
</template>

<script>
import { defineComponent } from 'vue';
import useInitWidget from '../composable/useInitWidget';

export default defineComponent({
  name: 'CompanyProfile',
  props: {
    options: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const options = {
      symbol: 'NASDAQ:AAPL',
      width: 480,
      height: 650,
      colorTheme: 'light',
      isTransparent: false,
      locale: 'en',
      ...props.options,
    };

    const { container, tradingview } = useInitWidget(
      options,
      options.container_id,
      `tradingview-company-profile-script_${options.container_id}`,
      'https://s3.tradingview.com/external-embedding/embed-widget-symbol-profile.js'
    );

    return { container, tradingview };
  },
});
</script>
