<template>
  <div ref="tradingview" :id="container" />
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';

export default defineComponent({
  name: 'SymbolOverview',
  props: {
    options: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const container = ref(props.options.container_id);
    const scriptID = ref('tradingview-symbol-overview-script');
    const defualtOptions = {
      symbols: [
        ['Apple', 'AAPL'],
        ['Google', 'GOOGL'],
        ['Microsoft', 'MSFT'],
      ],
      chartOnly: false,
      width: 1000,
      height: 400,
      locale: 'en',
      colorTheme: 'light',
      gridLineColor: 'rgba(240, 243, 250, 0)',
      fontColor: '#787B86',
      isTransparent: false,
      autosize: false,
      showVolume: false,
      scalePosition: 'no',
      scaleMode: 'Normal',
      fontFamily: 'Trebuchet MS, sans-serif',
      noTimeScale: false,
      valuesTracking: '1',
      chartType: 'area',
      lineColor: '#2962FF',
      bottomColor: 'rgba(41, 98, 255, 0)',
      topColor: 'rgba(41, 98, 255, 0.3)',
      container_id: container.value
    };

    const canUseDOM = () => {
      return typeof window !== 'undefined' && window.document && window.document.createElement;
    };

    const getScriptElement = () => {
      return document.getElementById(scriptID.value);
    };

    const scriptExists = () => {
      return getScriptElement() !== null;
    };

    const appendScript = (onload) => {
      if (!canUseDOM()) return;
      if (scriptExists()) {
        onload()
        return;
      }

      const script = document.createElement('script');
      script.id = scriptID.value;
      script.type = 'text/javascript';
      script.async = true;
      script.src = 'https://s3.tradingview.com/tv.js';
      script.onload = onload;
      document.getElementsByTagName('head')[0].appendChild(script);
    };

    const initWidget = () => {
      setTimeout(() => {
        if (typeof window.TradingView === 'undefined') return;
        const options = { ...defualtOptions, ...props.options };
        new window.TradingView.MediumWidget(Object.assign({ container_id: container }, options));
      }, 500);
    };

    onMounted(() => {
      appendScript(() => initWidget());
    });
    return { container };
  },
});
</script>
