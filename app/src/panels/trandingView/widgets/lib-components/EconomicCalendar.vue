<template>
  <div ref="tradingview" :id="container" />
</template>

<script>
import { defineComponent } from 'vue';
import useInitWidget from '../composable/useInitWidget';

export default defineComponent({
  name: 'EconomicCalendar',
  props: {
    options: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const options = {
      colorTheme: 'light',
      isTransparent: false,
      width: '510',
      height: '600',
      locale: 'en',
      importanceFilter: '-1,0,1',
      ...props.options,
    };

    const { container, tradingview } = useInitWidget(
      options,
      options.container_id,
      `tradingview-economic-calendar-script_${options.container_id}`,
      'https://s3.tradingview.com/external-embedding/embed-widget-events.js'
    );

    return { container, tradingview };
  },
});
</script>
