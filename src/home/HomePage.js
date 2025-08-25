// import "./style.css";
// import "./css/fontawesome.min.css";
// import "./css/bootstrap.css";
// import "./css/animate.css";
// import "./css/owl.carousel.min.css";
// import "./css/responsive.css";
// import logo from "/images/logo.png";
// import darkLogo from "/images/dark-logo.png";
// import banner6 from "/images/banner-6.jpg";
// import graph from "/images/graph.jpg";
//import useScript from "./useScript";
//import aboutImg from "./images/about-mercury-img.png";
import "bootstrap/dist/css/bootstrap.min.css";
import { Accordion, Button } from "react-bootstrap";
import React, { useEffect } from "react";

export default function HomePage() {
  //   useScript([
  //     "./js/jquery.min.js",
  //     "./js/bootstrap.min.js",
  //     "./js/onpagescroll.js",
  //     "./js/wow.min.js",
  //     "./js/jquery.countdown.js",
  //     "./js/owl.carousel.js",
  //     "./js/script.js",
  //   ]);
  useEffect(() => {
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
  }, []);
  return (
    <div className="wrapper" id="top">
      <header>
        <div className="container">
          <div className="row">
            <div className="col-sm-6 col-md-4 logo">
              <img
                className="light"
                src={process.env.PUBLIC_URL + "/images/logo.png"}
                alt="Trade Buddy"
              />
              <img
                className="dark"
                src={process.env.PUBLIC_URL + "/images/dark-logo.png"}
                alt="Trade Buddy"
              />
            </div>
            <div className="col-sm-6 col-md-8">
              <Button variant="success" className="pad-right">
                Login
              </Button>
              {/* <button className="btn pad-right">Login</button> */}
              {/* <div className="menu-icon">
                <span className="top"></span>
                <span className="middle"></span>
                <span className="bottom"></span>
              </div>
              <nav className="onepage">
                <ul>
                  <li className="active">
                    <a href="#top">Home</a>
                  </li>
                  <li>
                    <a href="#about">About ico</a>
                  </li>
                  <li>
                    <a href="#token">token</a>
                  </li>
                  <li>
                    <a href="#roadmap">roadmap</a>
                  </li>
                  <li>
                    <a href="#team">team</a>
                  </li>
                  <li>
                    <a href="#press">press</a>
                  </li>
                  <li className="nav-btn">
                    <a href="#6">Sign In</a>
                  </li>
                </ul>
              </nav> */}
            </div>
          </div>
        </div>
      </header>
      <div className="midd-container">
        <div
          className="hero-main mercury-layout white-sec"
          style={{
            background: `url(${
              process.env.PUBLIC_URL + "/images/banner-6.jpg"
            })`,
          }}
        >
          <div className="container">
            <div className="row align-items-center flex-row-reverse">
              <div className="col-sm-12 col-md-6" data-wow-delay="0.5s">
                <div className="mercury-animation">
                  <div className="numbers">
                    <div className="number-one"></div>
                    <div className="number-two"></div>
                  </div>
                  <div id="earth-box-cover">
                    <div className="earth-icons">
                      <i className="icon-1"></i>
                      <i className="icon-2"></i>
                      <i className="icon-3"></i>
                      <i className="icon-4"></i>
                      <i className="icon-5"></i>
                      <i className="icon-6"></i>
                      <i className="icon-7"></i>
                    </div>
                    <div id="earth-box">
                      <span></span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-12 col-md-6">
                <h1>The Global Crypto Currency to Buy & Sell</h1>
                <p className="lead">
                  From tracking to growth — your crypto buddy for success.{" "}
                  <br></br>
                  “We make managing your cryptocurrency portfolio easier than
                  ever.”
                </p>
                <div className="hero-btns"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="about-section p-tb mercury-layout" id="about">
          <div className="container">
            <div className="row flex-row-reverse align-items-center">
              <div className="col-lg-6 col-md-12">
                <div className="about-mercury-img mobile-visible">
                  <img
                    src={process.env.PUBLIC_URL + "/images/graph.jpg"}
                    alt="About"
                  />
                </div>
                <div className="about-mercury-animation mobile-hidden">
                  {/* <div className="coin-animation">
                    <i className="coin coin-1"></i>
                    <i className="coin coin-2"></i>
                    <i className="coin coin-3"></i>
                    <i className="coin coin-4"></i>
                    <i className="coin coin-5"></i>
                    <i className="coin coin-6"></i>
                    <i className="coin coin-7"></i>
                    <i className="coin coin-8"></i>
                    <i className="coin coin-9"></i>
                  </div> */}
                  <img
                    className="mercury-base"
                    src={process.env.PUBLIC_URL + "/images/graph.jpg"}
                    alt="About Trade Buddy"
                  />
                </div>
              </div>
              <div className="col-lg-6 col-md-12">
                <h2 className="section-heading">About Trade Buddy</h2>
                {/* <h4>Why to choose Coinpool Mercury?</h4> */}
                <h5>
                  “We make your cryptocurrency portfolio smarter, safer, and
                  better. With real-time tracking, smart insights, and easy
                  management, you can finally take control of your crypto
                  journey. Whether you’re a trader or a long-term investor, our
                  platform helps you track every coin, monitor profits & losses,
                  and grow your portfolio with confidence. Simplify your trades,
                  maximize your gains, and let us be your trusted buddy in the
                  world of crypto.”
                </h5>
                <p>
                  Every day, countless people are losing their hard-earned
                  crypto assets simply because of a lack of knowledge and proper
                  guidance. From falling for scams, making poor trading
                  decisions, or failing to manage their portfolios effectively —
                  the risk is real. Our goal is to change that by providing the
                  right tools, insights, and education so you can protect,
                  track, and grow your digital wealth with confidence.
                </p>
                <div className="button-wrapper"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="benefits p-tb light-gray-bg mercury-layout">
          <div className="container">
            <div className="text-center">
              <h2 className="section-heading">
                Benefits of Using Our Solution
              </h2>
            </div>
            <div className="sub-txt mw-850 text-center">
              <p>
                We guide you with tools and knowledge to help you grow and
                protect your assets — stress-free.
              </p>
            </div>
            <div className="row">
              <div className="col-lg-4 col-md-6">
                <div className="benefit-box text-center">
                  <div className="benefit-icon">
                    <img
                      src={
                        process.env.PUBLIC_URL + "/images/benefit-icon-1.png"
                      }
                      alt="Safe and Secure"
                    />
                  </div>
                  <div className="text">
                    <h4>Protect Your Wealth</h4>
                    <p>
                      Avoid common mistakes and losses by getting clear
                      insights, alerts, and secure tracking.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="benefit-box text-center">
                  <div className="benefit-icon">
                    <img
                      src={
                        process.env.PUBLIC_URL + "/images/benefit-icon-2.png"
                      }
                      alt="Instant Exchange"
                    />
                  </div>
                  <div className="text">
                    <h4>Save Time & Effort</h4>
                    <p>
                      No more spreadsheets — manage your entire portfolio
                      effortlessly with automation and integrations.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="benefit-box text-center">
                  <div className="benefit-icon">
                    <img
                      src={
                        process.env.PUBLIC_URL + "/images/benefit-icon-3.png"
                      }
                      alt="World Coverage"
                    />
                  </div>
                  <div className="text">
                    <h4>Stay Ahead of the Market</h4>
                    <p>
                      Get instant alerts on price changes, news, and portfolio
                      movements so you never miss an opportunity.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          id="convertor"
          className="currency-convertor mercury-layout p-t p-tb c-l"
        >
          <div className="container">
            <div className="text-center">
              <h2 className="section-heading">Market Update</h2>
            </div>
            <div
              id="tradingview-widget"
              style={{ width: "100%", height: "50px" }}
            ></div>
          </div>
        </div>

        {/* <div id="counter" className="milestone-section p-tb c-l">
          <div className="container">
            <div className="row">
              <div className="col">
                <div className="counter">
                  <div className="counter-icon">
                    <img src="./images/transactions-icon.png" alt="" />
                  </div>
                  <div className="counter-value" data-count="1594">
                    0
                  </div>
                  <h4 className="count-text ">Transactions</h4>
                </div>
              </div>
              <div className="col">
                <div className="counter">
                  <div className="counter-icon">
                    <img src="./images/support-icon.png" alt="" />
                  </div>
                  <div className="counter-value" data-count="649">
                    0
                  </div>
                  <h4 className="count-text ">Operator</h4>
                </div>
              </div>
              <div className="col">
                <div className="counter">
                  <div className="counter-icon">
                    <img src="./images/wallets-icon.png" alt="" />
                  </div>
                  <div className="counter-value" data-count="852">
                    0
                  </div>
                  <h4 className="count-text ">Bitcoin Wallets</h4>
                </div>
              </div>
              <div className="col">
                <div className="counter">
                  <div className="counter-icon">
                    <img src="./images/countries-icon.png" alt="" />
                  </div>
                  <div className="counter-value" data-count="198">
                    0
                  </div>
                  <h4 className="count-text ">Countries</h4>
                </div>
              </div>
            </div>
          </div>
        </div> */}

        <div className="faq-section p-tb white-bg diamond-layout" id="faq">
          <div className="container">
            <div className="text-center">
              <h2 className="section-heading">Frequently Asked Questions</h2>
            </div>
            <Accordion defaultActiveKey="0">
              <Accordion.Item eventKey="0">
                <Accordion.Header>
                  <h6 className="mb-0">1. What is this service about?</h6>
                </Accordion.Header>
                <Accordion.Body>
                  Our platform is a cryptocurrency portfolio management solution
                  that helps you track, manage, and analyze all your digital
                  assets in one place. Whether you’re using multiple exchanges,
                  wallets, or blockchains, we bring everything together with
                  real-time updates and insights.
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="1">
                <Accordion.Header>
                  <h6 className="mb-0">2. Is my data safe?</h6>
                </Accordion.Header>
                <Accordion.Body>
                  Yes ✅. We use bank-grade encryption and follow strict
                  security practices. Your personal information and portfolio
                  data are never shared with third parties.
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="2">
                <Accordion.Header>
                  <h6 className="mb-0">3. Will I get real-time updates?</h6>
                </Accordion.Header>
                <Accordion.Body>
                  Yes. Trading Tips are updated live from trusted market
                  sources. You can see Your portfolio value, profit/loss, and
                  asset distribution reflect real-time on your exchange account.
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="3">
                <Accordion.Header>
                  <h6 className="mb-0">4. Is this service free?</h6>
                </Accordion.Header>
                <Accordion.Body>
                  We offer a free basic version with essential tracking
                  features. For advanced analytics, unlimited alerts, and
                  premium tools, you can upgrade to our Pro Plan at a small high
                  fee.
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="4">
                <Accordion.Header>
                  <h6 className="mb-0">5. Who is this service for?</h6>
                </Accordion.Header>
                <Accordion.Body>
                  Our solution is perfect for:<br></br> ✅ Beginners who want a
                  simple way to track their holdings.<br></br> ✅ Traders who
                  need real-time insights and alerts.<br></br> ✅ Investors
                  looking to monitor long-term performance.
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="5">
                <Accordion.Header>
                  <h6 className="mb-0">
                    6. How does this help me avoid losses?
                  </h6>
                </Accordion.Header>
                <Accordion.Body>
                  Many people lose money in crypto due to lack of knowledge,
                  poor tracking, and late decisions. Our service provides clear
                  insights, real-time alerts, and risk monitoring so you can
                  protect your assets and make smarter moves.
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>
        </div>
        {/* <div className="faq-section p-tb white-bg diamond-layout" id="faq">
          <div className="container">
            <div className="text-center">
              <h2 className="section-heading">Frequently Asked Questions</h2>
            </div>
            <div className="row">
              <div className="col-sm-12">
                <div
                  className="accordion md-accordion style-2"
                  id="accordionEx"
                  role="tablist"
                  aria-multiselectable="true"
                >
                  <div className="card">
                    <div className="card-header" role="tab" id="headingOne1">
                      <a
                        data-toggle="collapse"
                        data-parent="#accordionEx"
                        href="#collapseOne1"
                        aria-expanded="true"
                        aria-controls="collapseOne1"
                      >
                        <h5 className="mb-0">
                          1. What is this service about?{" "}
                          <i className="fas fa-caret-down rotate-icon"></i>
                        </h5>
                      </a>
                    </div>

                    <div
                      id="collapseOne1"
                      className="collapse show"
                      role="tabpanel"
                      aria-labelledby="headingOne1"
                      data-parent="#accordionEx"
                    >
                      <div className="card-body">
                        Our platform is a cryptocurrency portfolio management
                        solution that helps you track, manage, and analyze all
                        your digital assets in one place. Whether you’re using
                        multiple exchanges, wallets, or blockchains, we bring
                        everything together with real-time updates and insights.
                      </div>
                    </div>
                  </div>
                  <div className="card">
                    <div className="card-header" role="tab" id="headingTwo2">
                      <a
                        className="collapsed"
                        data-toggle="collapse"
                        data-parent="#accordionEx"
                        href="#collapseTwo2"
                        aria-expanded="false"
                        aria-controls="collapseTwo2"
                      >
                        <h5 className="mb-0">
                          Is it possible for the citizens or residents of the US
                          to participate in the Token Sale?{" "}
                          <i className="fas fa-caret-down rotate-icon"></i>
                        </h5>
                      </a>
                    </div>
                    <div
                      id="collapseTwo2"
                      className="collapse"
                      role="tabpanel"
                      aria-labelledby="headingTwo2"
                      data-parent="#accordionEx"
                    >
                      <div className="card-body">
                        Anim pariatur cliche reprehenderit, enim eiusmod high
                        life accusamus terry richardson ad squid. 3 wolf moon
                        officia aute, non cupidatat skateboard dolor brunch.
                        Food truck quinoa nesciunt laborum eiusmod. Brunch 3
                        wolf moon tempor, sunt aliqua put a bird on it squid
                        single-origin coffee nulla assumenda shoreditch et.
                        Nihil anim keffiyeh helvetica, craft beer labore wes
                        anderson cred nesciunt sapiente ea proident. Ad vegan
                        excepteur butcher vice lomo. Leggings occaecat craft
                        beer farm-to-table, raw denim aesthetic synth nesciunt
                        you probably haven't heard of them accusamus labore
                        sustainable VHS.
                      </div>
                    </div>
                  </div>
                  <div className="card">
                    <div className="card-header" role="tab" id="headingThree3">
                      <a
                        className="collapsed"
                        data-toggle="collapse"
                        data-parent="#accordionEx"
                        href="#collapseThree3"
                        aria-expanded="false"
                        aria-controls="collapseThree3"
                      >
                        <h5 className="mb-0">
                          Is there a KYC process involved?{" "}
                          <i className="fas fa-caret-down rotate-icon"></i>
                        </h5>
                      </a>
                    </div>
                    <div
                      id="collapseThree3"
                      className="collapse"
                      role="tabpanel"
                      aria-labelledby="headingThree3"
                      data-parent="#accordionEx"
                    >
                      <div className="card-body">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Aenean cursus tincidunt ultrices. Ut quis blandit dolor.
                        Ut laoreet sagittis arcu eu tristique. Ut quis blandit
                        dolor. Ut laoreet sagittis arcu eu tristique.
                      </div>
                    </div>
                  </div>
                  <div className="card">
                    <div className="card-header" role="tab" id="headingFour4">
                      <a
                        className="collapsed"
                        data-toggle="collapse"
                        data-parent="#accordionEx"
                        href="#collapseFour4"
                        aria-expanded="false"
                        aria-controls="collapseFour4"
                      >
                        <h5 className="mb-0">
                          What will happen to the unsold tokens?{" "}
                          <i className="fas fa-caret-down rotate-icon"></i>
                        </h5>
                      </a>
                    </div>
                    <div
                      id="collapseFour4"
                      className="collapse"
                      role="tabpanel"
                      aria-labelledby="headingFour4"
                      data-parent="#accordionEx"
                    >
                      <div className="card-body">
                        Aenean cursus tincidunt ultrices. Ut quis blandit dolor.
                        Ut laoreet sagittis arcu eu tristique. Ut quis blandit
                        dolor. Ut laoreet sagittis arcu eu tristique. Ut quis
                        blandit dolor. Ut laoreet sagittis arcu eu tristique. Ut
                        quis blandit dolor. Ut laoreet sagittis arcu eu
                        tristique.
                      </div>
                    </div>
                  </div>
                  <div className="card">
                    <div className="card-header" role="tab" id="headingFive5">
                      <a
                        className="collapsed"
                        data-toggle="collapse"
                        data-parent="#accordionEx"
                        href="#collapseFive5"
                        aria-expanded="false"
                        aria-controls="collapseFive5"
                      >
                        <h5 className="mb-0">
                          Which cryptocurrencies can I use to participate in the
                          Token Sale?{" "}
                          <i className="fas fa-caret-down rotate-icon"></i>
                        </h5>
                      </a>
                    </div>
                    <div
                      id="collapseFive5"
                      className="collapse"
                      role="tabpanel"
                      aria-labelledby="headingFive5"
                      data-parent="#accordionEx"
                    >
                      <div className="card-body">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Aenean cursus tincidunt ultrices. Ut quis blandit dolor.
                        Ut laoreet sagittis arcu eu tristique. Ut quis blandit
                        dolor. Ut laoreet sagittis arcu eu tristique. Ut quis
                        blandit dolor. Ut laoreet sagittis arcu eu tristique. Ut
                        quis blandit dolor. Ut laoreet sagittis arcu eu
                        tristique.
                      </div>
                    </div>
                  </div>
                  <div className="card">
                    <div className="card-header" role="tab" id="headingSix6">
                      <a
                        className="collapsed"
                        data-toggle="collapse"
                        data-parent="#accordionEx"
                        href="#collapseSix6"
                        aria-expanded="false"
                        aria-controls="collapseSix6"
                      >
                        <h5 className="mb-0">
                          Are there any restrictions that involve a minimum or a
                          maximum transaction limit?{" "}
                          <i className="fas fa-caret-down rotate-icon"></i>
                        </h5>
                      </a>
                    </div>
                    <div
                      id="collapseSix6"
                      className="collapse"
                      role="tabpanel"
                      aria-labelledby="headingSix6"
                      data-parent="#accordionEx"
                    >
                      <div className="card-body">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Aenean cursus tincidunt ultrices. Ut quis blandit dolor.
                        Ut laoreet sagittis arcu eu tristique. Ut quis blandit
                        dolor. Ut laoreet sagittis arcu eu tristique. Lorem
                        ipsum dolor sit amet, consectetur adipiscing elit.
                        Aenean cursus tincidunt ultrices.
                      </div>
                    </div>
                  </div>
                  <div className="card">
                    <div className="card-header" role="tab" id="headingSeven7">
                      <a
                        className="collapsed"
                        data-toggle="collapse"
                        data-parent="#accordionEx"
                        href="#collapseSeven7"
                        aria-expanded="false"
                        aria-controls="collapseSeven7"
                      >
                        <h5 className="mb-0">
                          Where is the company registered? Where is the Coinpool
                          office located?{" "}
                          <i className="fas fa-caret-down rotate-icon"></i>
                        </h5>
                      </a>
                    </div>
                    <div
                      id="collapseSeven7"
                      className="collapse"
                      role="tabpanel"
                      aria-labelledby="headingSeven7"
                      data-parent="#accordionEx"
                    >
                      <div className="card-body">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Aenean cursus tincidunt ultrices. Ut quis blandit dolor.
                        Ut laoreet sagittis arcu eu tristique. Ut quis blandit
                        dolor. Ut laoreet sagittis arcu eu tristique. Lorem
                        ipsum dolor sit amet, consectetur adipiscing elit.
                        Aenean cursus tincidunt ultrices.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> */}
      </div>

      <div className="clear"></div>
      <footer className="footer-3">
        <div className="container">
          <div className="row">
            <div className="col-md-4 footer-box-1">
              <div className="footer-logo"></div>
              <p>
                We’re more than just a portfolio tracker — we’re your partner in
                the crypto journey. Our goal is to equip you with the right
                tools, education, and support so you can grow and protect your
                digital wealth with confidence. With us, you’re never alone in
                the fast-paced world of crypto.
              </p>
            </div>
            <div className="col-md-3 footer-box-2">
              <ul className="footer-menu onepage">
                <li>
                  <a href="/">Terms & Condition</a>
                </li>
                <li>
                  <a href="/">Plan & pricing</a>
                </li>
              </ul>
            </div>
            <div className="footer-box-3">
              <div className="socials">
                <ul>
                  <li>
                    <a href="https://facebook.com/">
                      <i className="fab fa-facebook-f"></i>
                    </a>
                  </li>
                  <li>
                    <a href="https://twitter.com/">
                      <i className="fab fa-twitter"></i>
                    </a>
                  </li>
                  <li>
                    <a href="https://plus.google.com/">
                      <i className="fab fa-google-plus-g"></i>
                    </a>
                  </li>
                  <li>
                    <a href="https://www.youtube.com/">
                      <i className="fab fa-youtube"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-4">
              <div className="copyrights style-1">
                © 2025 Trade Buddy. tradebuddy.biz
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
