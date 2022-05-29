import { ref, onMounted } from 'vue';

export default (options, widgetContainer, widgetScriptID, src) => {
  const container = ref(widgetContainer);
  const scriptID = ref(widgetScriptID);
  const tradingview = ref();

  const canUseDOM = () => {
    return typeof window !== 'undefined' && window.document && window.document.createElement;
  };

  const getScriptElement = () => {
    return document.getElementById(scriptID.value);
  };

  const scriptExists = () => {
    return getScriptElement() !== null;
  };

  const appendScript = () => {
    if (!canUseDOM()) return;
    if (scriptExists()) {
      return
    }

    const script = document.createElement('script');
    script.id = scriptID.value;
    script.type = 'text/javascript';
    script.async = true;
    script.src = src;
    script.textContent = JSON.stringify(options);
    if (tradingview.value) tradingview.value.appendChild(script);
  };

  onMounted(() => {
    setTimeout(() => {
      appendScript();
    }, 500);
  });
  return { container, tradingview };
};
