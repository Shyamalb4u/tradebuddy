import { useEffect, useRef } from "react";

export default function TradingViewBTC() {
  const containerRef = useRef(null);

  useEffect(() => {
    // Load TradingView script
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;

    script.onload = () => {
      /* global TradingView */
      new TradingView.widget({
        container_id: "tv_btc_widget",
        autosize: true,
        symbol: "BITSTAMP:BTCUSD",
        interval: "1",
        timezone: "Etc/UTC",
        theme: "dark",
        style: "1",
        locale: "en",
        toolbar_bg: "#f1f3f6",
        withdateranges: true,
        allow_symbol_change: true,
        save_image: false,
        studies: ["MACD@tv-basicstudies"],
      });
    };

    document.body.appendChild(script);
  }, []);

  return (
    <div
      id="tv_btc_widget"
      ref={containerRef}
      style={{ height: "300px", width: "100%" }}
    ></div>
  );
}
