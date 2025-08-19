document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".chart");

  const widgetDiv = document.createElement("div");
  widgetDiv.id = "tradingview_12345";
  container.appendChild(widgetDiv);

  const script = document.createElement("script");
  script.src = "https://s3.tradingview.com/tv.js";
  document.head.appendChild(script);

  let tvWidget;

  script.onload = () => {
    createWidget("BTCUSDT");
    initClickListeners();
  };

  function createWidget(symbol) {
    if (tvWidget) {
      tvWidget.remove();
    }
    tvWidget = new TradingView.widget({
      width: "100%",
      height: "100%",
      symbol: `MEXC:${symbol}`,
      interval: "D",
      timezone: "Etc/UTC",
      theme: "dark",
      style: "1",
      locale: "en",
      enable_publishing: false,
      allow_symbol_change: true,
      container_id: "tradingview_12345",
    });
  }

  function initClickListeners() {
    document.querySelectorAll(".coin-name").forEach((cName) => {
      cName.addEventListener("click", () => {
        const coinName = cName.textContent.trim();
        createWidget(`${coinName}USDT`);
      });
    });
  }

  window.addEventListener('coinSelected', e => {
    createWidget(`${e.detail}USDT`);
  });
});