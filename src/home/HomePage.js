import { Accordion } from "react-bootstrap";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TermsCondition from "./TermsCondition";

export default function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("user"));
      const address = userInfo.publicKey;
      if (address) {
        navigate("/home");
      }
    } catch (error) {}

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: [
        { proName: "BITSTAMP:BTCUSD", title: "BTC/USD" },
        { proName: "BITSTAMP:ETHUSD", title: "ETH/USD" },
        { proName: "BINANCE:USDTUSD", title: "USDT/USD" },
      ],
      showSymbolLogo: true,
      colorTheme: "dark",
      isTransparent: false,
      displayMode: "adaptive",
      locale: "en",
    });
    document.getElementById("tradingview-widget").appendChild(script);
  });
  //  <div id="tradingview-widget" style={{ width: "100%", height: "50px" }}></div>;
  //onClick={() => navigate("/signup")}
  return (
    <>
      <div className="header fixed-top bg-surface trade-list-item p-2">
        <button className="btn-login" onClick={() => navigate("/login")}>
          Login
        </button>
        <button className="btn-signin" onClick={() => navigate("/signup")}>
          Signup
        </button>
      </div>
      <div className="pt-80 pb-20">
        <div className="tf-container">
          <div className="mt-80">
            <p className="text-center mb-20">
              <img
                className="text-center"
                src="/logo.png"
                alt="Trade Buddy Logo"
                style={{ width: 220 }}
              />
            </p>
            <p className="text-center">
              <video
                src="/globe.mp4" // put your file inside public/videos/
                width="300"
                height="300"
                autoPlay
                loop
                muted
                playsInline
                controls={false} // remove if you want controls
                className="rounded-xl shadow-lg"
              />
            </p>

            <h4 className="text-center">
              The Global Crypto Currency to Buy & Sell
            </h4>
          </div>
          <div className="auth-line text-center mt-12">
            From tracking to growth — your crypto buddy for success.
          </div>
          <div className="text-center text-small">
            “We make managing your cryptocurrency portfolio easier than ever.”
          </div>
          <div className="card mt-1">
            <p className="text-center mb-20">
              <img
                className="text-center"
                src="/images/graph.jpg"
                alt="Trade Buddy Graph"
                style={{ width: 220 }}
              />
              <h4 className="text-deep mt-3">About Trade Buddy</h4>
              <p className="text-center p-10">
                <h6 className="text-secondary">
                  “We make your cryptocurrency portfolio smarter, safer, and
                  better. With real-time tracking, smart insights, and easy
                  management, you can finally take control of your crypto
                  journey. Whether you’re a trader or a long-term investor, our
                  platform helps you track every coin, monitor profits & losses,
                  and grow your portfolio with confidence. Simplify your trades,
                  maximize your gains, and let us be your trusted buddy in the
                  world of crypto.”
                </h6>
                <p className="text-deep mt-3">
                  Every day, countless people are losing their hard-earned
                  crypto assets simply because of a lack of knowledge and proper
                  guidance. From falling for scams, making poor trading
                  decisions, or failing to manage their portfolios effectively —
                  the risk is real. Our goal is to change that by providing the
                  right tools, insights, and education so you can protect,
                  track, and grow your digital wealth with confidence.
                </p>
              </p>
            </p>
          </div>
          <div className="card mt-3">
            <p className="text-center mb-20">
              <h4 className="text-deep mt-3">Benefits of Using Our Solution</h4>

              <p className="text-center p-10">
                <h6 className="text-secondary">
                  “We guide you with tools and knowledge to help you grow and
                  protect your assets — stress-free.”
                </h6>
                <img
                  className="text-center mt-3"
                  src="/images/benefit-icon-1.png"
                  alt="Trade Buddy Graph"
                  style={{ width: 120 }}
                />
                <h5 className="text-deep mt-3">Protect Your Wealth</h5>
                <p className="text-deep mt-2">
                  Avoid common mistakes and losses by getting clear insights,
                  alerts, and secure tracking.
                </p>
                <img
                  className="text-center mt-3"
                  src="/images/benefit-icon-2.png"
                  alt="Trade Buddy Graph"
                  style={{ width: 120 }}
                />
                <h5 className="text-deep mt-3">Save Time & Effort</h5>
                <p className="text-deep mt-2">
                  No more spreadsheets — manage your entire portfolio
                  effortlessly with automation and integrations
                </p>
                <img
                  className="text-center mt-3"
                  src="/images/benefit-icon-3.png"
                  alt="Trade Buddy Graph"
                  style={{ width: 120 }}
                />
                <h5 className="text-deep mt-3">Stay Ahead of the Market</h5>
                <p className="text-deep mt-2">
                  Get instant alerts on price changes, news, and portfolio
                  movements so you never miss an opportunity.
                </p>
              </p>
            </p>
          </div>
          <div className="mt-10 mb-20">
            <div
              id="tradingview-widget"
              style={{ width: "100%", height: "50px" }}
            ></div>
          </div>
          <div className="card mt-12">
            <p className="text-center mb-20">
              <h4 className="text-deep mt-3">Frequently Asked Questions</h4>
              <Accordion defaultActiveKey="0">
                <Accordion.Item eventKey="0">
                  <Accordion.Header>
                    <h6 className="text-deep mb-0">
                      1. What is this service about?
                    </h6>
                  </Accordion.Header>
                  <Accordion.Body>
                    Our platform is a cryptocurrency portfolio management
                    solution that helps you track, manage, and analyze all your
                    digital assets in one place. Whether you’re using multiple
                    exchanges, wallets, or blockchains, we bring everything
                    together with real-time updates and insights.
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="1">
                  <Accordion.Header>
                    <h6 className="text-deep mb-0">2. Is my data safe?</h6>
                  </Accordion.Header>
                  <Accordion.Body>
                    Yes ✅. We use bank-grade encryption and follow strict
                    security practices. Your personal information and portfolio
                    data are never shared with third parties.
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="2">
                  <Accordion.Header>
                    <h6 className="text-deep mb-0">
                      3. Will I get real-time updates?
                    </h6>
                  </Accordion.Header>
                  <Accordion.Body>
                    Yes. Trading Tips are updated live from trusted market
                    sources. You can see Your portfolio value, profit/loss, and
                    asset distribution reflect real-time on your exchange
                    account.
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="3">
                  <Accordion.Header>
                    <h6 className="text-deep mb-0">4. Is this service free?</h6>
                  </Accordion.Header>
                  <Accordion.Body>
                    We offer a free basic version with essential tracking
                    features. For advanced analytics, unlimited alerts, and
                    premium tools, you can upgrade to our Pro Plan at a small
                    high fee.
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="4">
                  <Accordion.Header>
                    <h6 className="text-deep mb-0">
                      5. Who is this service for?
                    </h6>
                  </Accordion.Header>
                  <Accordion.Body>
                    Our solution is perfect for:<br></br> ✅ Beginners who want
                    a simple way to track their holdings.<br></br> ✅ Traders
                    who need real-time insights and alerts.<br></br> ✅
                    Investors looking to monitor long-term performance.
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="5">
                  <Accordion.Header>
                    <h6 className="text-deep mb-0">
                      6. How does this help me avoid losses?
                    </h6>
                  </Accordion.Header>
                  <Accordion.Body>
                    Many people lose money in crypto due to lack of knowledge,
                    poor tracking, and late decisions. Our service provides
                    clear insights, real-time alerts, and risk monitoring so you
                    can protect your assets and make smarter moves.
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </p>
          </div>
          <p className="text-center mt-20 text-white">
            We’re more than just a portfolio tracker — we’re your partner in the
            crypto journey. Our goal is to equip you with the right tools,
            education, and support so you can grow and protect your digital
            wealth with confidence. With us, you’re never alone in the
            fast-paced world of crypto.
          </p>
          <div className="bg-surface trade-list-item p-2">
            <a
              href="#termCondition"
              className="text-white"
              data-bs-toggle="modal"
            >
              Terms & Condition
            </a>
            <a href="/" className="text-white">
              Plan & pricing
            </a>
          </div>
          <p className="mt-20 text-center text-small">
            © 2025 Trade Buddy. tradebuddy.biz
          </p>
        </div>
      </div>
      <TermsCondition />
    </>
  );
}
