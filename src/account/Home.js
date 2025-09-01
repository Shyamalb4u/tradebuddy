import { useMemo, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ScratchCard from "../components/ScratchCard";
import { ethers } from "ethers";
import { getMessaging, getToken } from "firebase/messaging";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBcjdUxwJGVNf6dMIMuIQV8csRv3OsqoV8",
  authDomain: "trade-buddy-2ac42.firebaseapp.com",
  projectId: "trade-buddy-2ac42",
  storageBucket: "trade-buddy-2ac42.firebasestorage.app",
  messagingSenderId: "143538942512",
  appId: "1:143538942512:web:d96dc6e9f9f58b53beb3f5",
};
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

const POLYGON_RPC = "https://polygon-rpc.com";
const USDT_ADDRESS = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F"; // Polygon USDT (6 decimals)
const erc20Abi = [
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function transfer(address to, uint256 amount) returns (bool)",
];
export default function Home() {
  const navigate = useNavigate();

  const userInfo = JSON.parse(localStorage.getItem("user"));
  const address = userInfo.publicKey;
  const passKey = userInfo.phrases;

  const [usdtBalance, setUsdtBalance] = useState("0");
  const [nativeBalance, setNativeBalance] = useState("0");
  const [decimals, setDecimals] = useState(6);
  const [rpcUrl, setRpcUrl] = useState(POLYGON_RPC);
  const provider = useMemo(() => new ethers.JsonRpcProvider(rpcUrl), [rpcUrl]);
  const [copied, setCopied] = useState(false);
  const [token, setToken] = useState(null);
  const [status, setStatus] = useState("Click to enable notifications");

  const usdtContract = useMemo(
    () => new ethers.Contract(USDT_ADDRESS, erc20Abi, provider),
    [provider]
  );
  const latestCallId = useRef(0);
  ///////////
  const requestPermissionAndSubscribe = async () => {
    try {
      // 1️⃣ Request browser notification permission
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatus("Permission denied ❌");
        return;
      }

      // 2️⃣ Register the service worker
      if (!("serviceWorker" in navigator)) {
        setStatus("Service Worker not supported ❌");
        return;
      }

      const registration = await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js"
      );

      // 3️⃣ Get FCM token
      const currentToken = await getToken(messaging, {
        vapidKey:
          "BEwIPFYWlDx-HHVDr_K0xOZ-nSs5JRhfaq7HWYII52-G5yiAFKSMPHNkIQ59zdokSsqyGLar9DNfPGEHYt63ryA",
        serviceWorkerRegistration: registration,
      });

      if (currentToken) {
        setToken(currentToken);
        setStatus("Subscribed ✅");
        console.log("FCM Token:", currentToken);

        // ✅ Optional: send token to backend
        // await fetch("/api/save-fcm-token", {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify({ token: currentToken }),
        // });
      } else {
        setStatus("No registration token available ❌");
      }
    } catch (err) {
      console.error("FCM subscription failed:", err);
      setStatus("Subscription failed ❌");
    }
  };
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // reset after 2s
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  useEffect(() => {
    let mounted = true;
    async function fetchDecimals() {
      try {
        const d = await usdtContract.decimals();
        if (mounted) setDecimals(Number(d));
      } catch (e) {
        // ignore
      }
    }
    fetchDecimals();
    return () => {
      mounted = false;
    };
  }, [usdtContract]);
  useEffect(() => {
    if (!address || !usdtContract || !provider) return;

    let active = true;

    async function fetchBalance() {
      const callId = ++latestCallId.current; // unique id for this call

      try {
        // USDT balance
        const raw = await usdtContract.balanceOf(address);
        const formatted = ethers.formatUnits(raw, decimals);

        // update only if still active & latest call
        if (active && callId === latestCallId.current) {
          setUsdtBalance(formatted);
        }

        // Native token balance
        const bal = await provider.getBalance(address);
        const formattedNative = parseFloat(ethers.formatEther(bal)).toFixed(4);

        if (active && callId === latestCallId.current) {
          setNativeBalance(formattedNative);
        }
      } catch (e) {
        console.error("fetchBalance error:", e);
      }
    }

    fetchBalance(); // initial
    const intervalId = setInterval(fetchBalance, 15000);

    return () => {
      active = false;
      clearInterval(intervalId);
    };
  }, [address, usdtContract, provider, decimals]);
  useEffect(() => {
    async function setupNotifications() {
      try {
        await requestPermissionAndSubscribe();
      } catch (err) {
        console.error("Notification setup failed:", err);
      }
    }

    setupNotifications();
  }, []);
  function onMenuClick() {
    navigate("/menu");
  }
  function onSendToken() {
    navigate("/sendToken");
  }
  function onReceive() {
    navigate("/receiveQR");
  }
  return (
    <>
      <div className="header-style2 fixed-top bg-menuDark">
        <div className="d-flex justify-content-between align-items-center gap-14">
          <div className="box-account style-2">
            <p onClick={onMenuClick}>
              <img src="/images/avt/avt2.jpg" alt="img" className="avt" />
            </p>
            <div className="search-box box-input-field style-2">
              <img src="/logo.png" style={{ width: 180 }} alt="Logo" />
            </div>
          </div>
          <div className="d-flex align-items-right gap-8">
            <p className="text-red text-small">Logout</p>
          </div>
        </div>
      </div>
      <div className="pt-68 pb-80">
        <div className="bg-menuDark tf-container">
          <div className="pt-12 pb-12 mt-4">
            <h5>
              <span className="text-primary">My Wallet</span> -{" "}
              <a
                href="/"
                className="choose-account"
                data-bs-toggle="modal"
                data-bs-target="#accountWallet"
              >
                <span className="text-large">Get Address </span> &nbsp;
                <i className="icon-select-down"></i>
              </a>
            </h5>
            <h1 className="mt-16">
              <a href="/">${usdtBalance}</a>
              <span className="text-small">POL Balance : {nativeBalance}</span>
            </h1>
            <ul className="mt-16 grid-4 m--16">
              <li>
                <p
                  className="tf-list-item d-flex flex-column gap-8 align-items-center menu-text"
                  onClick={onSendToken}
                >
                  <span className="box-round bg-surface d-flex justify-content-center align-items-center">
                    <i className="icon icon-way"></i>
                  </span>
                  Send
                </p>
              </li>
              <li>
                <p
                  className="tf-list-item d-flex flex-column gap-8 align-items-center menu-text"
                  onClick={onReceive}
                >
                  <span className="box-round bg-surface d-flex justify-content-center align-items-center">
                    <i className="icon icon-way2"></i>
                  </span>
                  Receive
                </p>
              </li>
              <li>
                <p className="tf-list-item d-flex flex-column gap-8 align-items-center menu-text">
                  <span className="box-round bg-surface d-flex justify-content-center align-items-center">
                    <i className="icon icon-wallet"></i>
                  </span>
                  Buy
                </p>
              </li>
              <li>
                <p className="tf-list-item d-flex flex-column gap-8 align-items-center menu-text">
                  <span className="box-round bg-surface d-flex justify-content-center align-items-center">
                    <i className="icon icon-exchange"></i>
                  </span>
                  Daily Tips
                </p>
              </li>
            </ul>
          </div>
        </div>
        <div className="bg-menuDark tf-container">
          <div className="pt-12 pb-12 mt-4">
            <h5>Market</h5>
            <div
              className="swiper tf-swiper swiper-wrapper-r mt-16"
              data-space-between="16"
              data-preview="2.8"
              data-tablet="2.8"
              data-desktop="3"
            >
              <div
                className="swiper-wrapper"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div className="swiper-slide" style={{ width: 110 }}>
                  <a href="exchange-market.html" className="coin-box d-block">
                    <div className="coin-logo">
                      <img
                        src="/images/coin/market-1.jpg"
                        alt="img"
                        className="logo"
                      />
                      <div className="title">
                        <p>Bitcoin</p>
                        <span>BTC</span>
                      </div>
                    </div>
                    <div className="mt-8 mb-8 coin-chart">
                      <div id="line-chart-1"></div>
                    </div>
                    <div className="coin-price d-flex justify-content-between">
                      <span>$30780</span>
                      <span className="text-primary d-flex align-items-center gap-2">
                        <i className="icon-select-up"></i> 11,75%
                      </span>
                    </div>
                    <div className="blur bg1"></div>
                  </a>
                </div>
                <div className="swiper-slide" style={{ width: 110 }}>
                  <a href="exchange-market.html" className="coin-box d-block">
                    <div className="coin-logo">
                      <img
                        src="/images/coin/market-3.jpg"
                        alt="img"
                        className="logo"
                      />
                      <div className="title">
                        <p>Binance</p>
                        <span>BNB</span>
                      </div>
                    </div>
                    <div className="mt-8 mb-8 coin-chart">
                      <div id="line-chart-2"></div>
                    </div>
                    <div className="coin-price d-flex justify-content-between">
                      <span>$270.10</span>
                      <span className="text-primary d-flex align-items-center gap-2">
                        <i className="icon-select-up"></i> 21,59%
                      </span>
                    </div>
                    <div className="blur bg2"></div>
                  </a>
                </div>
                <div
                  className="swiper-slide"
                  style={{ width: 110, marginRight: 15 }}
                >
                  <a href="exchange-market.html" className="coin-box d-block">
                    <div className="coin-logo">
                      <img
                        src="/images/coin/coin-3.jpg"
                        alt="img"
                        className="logo"
                      />
                      <div className="title">
                        <p>Ethereum</p>
                        <span>ETH</span>
                      </div>
                    </div>
                    <div className="mt-8 mb-8 coin-chart">
                      <div id="line-chart-3"></div>
                    </div>
                    <div className="coin-price d-flex justify-content-between">
                      <span>$1478.10</span>
                      <span className="text-primary d-flex align-items-center gap-2">
                        <i className="icon-select-up"></i> 4,75%
                      </span>
                    </div>
                    <div className="blur bg3"></div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ScratchCard
          width={360}
          height={200}
          coverColor="#c5c5c5"
          // coverImage="https://picsum.photos/360/200" // optional
          radius={22}
          percentToFinish={45}
          onComplete={(pct) => console.log("Revealed!", pct + "%")}
        >
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 24, fontWeight: 700 }}>🎉 ₹500 OFF</div>
            <div style={{ marginTop: 6, opacity: 0.8 }}>Code: SAVE500</div>
          </div>
        </ScratchCard>
        <div className="bg-menuDark tf-container">
          <div className="pt-12 pb-12 mt-4">
            <div className="wrap-filter-swiper">
              <h5>
                <a href="cryptex-rating.html" className="cryptex-rating">
                  <i className="icon-star"></i>Cryptex Rating
                </a>
              </h5>

              <div className="swiper-wrapper1 menu-tab-v3 mt-12" role="tablist">
                <div
                  className="swiper-slide1 nav-link active"
                  data-bs-toggle="tab"
                  data-bs-target="#favorites"
                  role="tab"
                  aria-controls="favorites"
                  aria-selected="true"
                >
                  Favorites
                </div>
                <div
                  className="swiper-slide1 nav-link"
                  data-bs-toggle="tab"
                  data-bs-target="#top"
                  role="tab"
                  aria-controls="top"
                  aria-selected="false"
                >
                  Top
                </div>
                <div
                  className="swiper-slide1 nav-link"
                  data-bs-toggle="tab"
                  data-bs-target="#popular"
                  role="tab"
                  aria-controls="popular"
                  aria-selected="false"
                >
                  Popular
                </div>
                <div
                  className="swiper-slide1 nav-link"
                  data-bs-toggle="tab"
                  data-bs-target="#price"
                  role="tab"
                  aria-controls="price"
                  aria-selected="false"
                >
                  Token price
                </div>
                <div
                  className="swiper-slide1 nav-link"
                  data-bs-toggle="tab"
                  data-bs-target="#new"
                  role="tab"
                  aria-controls="new"
                  aria-selected="false"
                >
                  New token
                </div>
              </div>
            </div>
            <div className="tab-content mt-8">
              <div
                className="tab-pane fade show active"
                id="favorites"
                role="tabpanel"
              >
                <div className="d-flex justify-content-between">
                  Name
                  <p className="d-flex gap-8">
                    <span>Last price</span>
                    <span>Change</span>
                  </p>
                </div>
                <ul className="mt-16">
                  <li>
                    <a
                      href="choose-payment.html"
                      className="coin-item style-2 gap-12"
                    >
                      <img
                        src="/images/coin/coin-6.jpg"
                        alt="img"
                        className="img"
                      />
                      <div className="content">
                        <div className="title">
                          <p className="mb-4 text-button">ETH</p>
                          <span className="text-secondary">$360,6M</span>
                        </div>
                        <div className="d-flex align-items-center gap-12">
                          <span className="text-small">$1.878,80</span>
                          <span className="coin-btn decrease">-1,62%</span>
                        </div>
                      </div>
                    </a>
                  </li>
                  <li className="mt-16">
                    <a
                      href="choose-payment.html"
                      className="coin-item style-2 gap-12"
                    >
                      <img
                        src="/images/coin/coin-7.jpg"
                        alt="img"
                        className="img"
                      />
                      <div className="content">
                        <div className="title">
                          <p className="mb-4 text-button">arb_ETH</p>
                          <span className="text-secondary">$132,18M</span>
                        </div>
                        <div className="d-flex align-items-center gap-12">
                          <span className="text-small">$1.878,80</span>
                          <span className="coin-btn increase">+1,62%</span>
                        </div>
                      </div>
                    </a>
                  </li>
                  <li className="mt-16">
                    <a
                      href="choose-payment.html"
                      className="coin-item style-2 gap-12"
                    >
                      <img
                        src="/images/coin/coin-8.jpg"
                        alt="img"
                        className="img"
                      />
                      <div className="content">
                        <div className="title">
                          <p className="mb-4 text-button">WBTC</p>
                          <span className="text-secondary">$50,56M</span>
                        </div>
                        <div className="d-flex align-items-center gap-12">
                          <span className="text-small">$30.001,96</span>
                          <span className="coin-btn decrease">-1,64%</span>
                        </div>
                      </div>
                    </a>
                  </li>
                  <li className="mt-16">
                    <a
                      href="choose-payment.html"
                      className="coin-item style-2 gap-12"
                    >
                      <img
                        src="/images/coin/coin-3.jpg"
                        alt="img"
                        className="img"
                      />
                      <div className="content">
                        <div className="title">
                          <p className="mb-4 text-button">ARB</p>
                          <span className="text-secondary">$31,55M</span>
                        </div>
                        <div className="d-flex align-items-center gap-12">
                          <span className="text-small">$1,11</span>
                          <span className="coin-btn increase">+3,71%</span>
                        </div>
                      </div>
                    </a>
                  </li>
                  <li className="mt-16">
                    <a
                      href="choose-payment.html"
                      className="coin-item style-2 gap-12"
                    >
                      <img
                        src="/images/coin/coin-9.jpg"
                        alt="img"
                        className="img"
                      />
                      <div className="content">
                        <div className="title">
                          <p className="mb-4 text-button">WETH</p>
                          <span className="text-secondary">$24,34M</span>
                        </div>
                        <div className="d-flex align-items-center gap-12">
                          <span className="text-small">$1.878,56</span>
                          <span className="coin-btn decrease">-1,62%</span>
                        </div>
                      </div>
                    </a>
                  </li>
                  <li className="mt-16">
                    <a
                      href="choose-payment.html"
                      className="coin-item style-2 gap-12"
                    >
                      <img
                        src="/images/coin/coin-10.jpg"
                        alt="img"
                        className="img"
                      />
                      <div className="content">
                        <div className="title">
                          <p className="mb-4 text-button">MATIC</p>
                          <span className="text-secondary">$19,36M</span>
                        </div>
                        <div className="d-flex align-items-center gap-12">
                          <span className="text-small">$0,666</span>
                          <span className="coin-btn decrease">-4,42%</span>
                        </div>
                      </div>
                    </a>
                  </li>
                </ul>
              </div>
              <div className="tab-pane fade" id="top" role="tabpanel">
                <div className="d-flex justify-content-between">
                  Name
                  <p className="d-flex gap-8">
                    <span>Last price</span>
                    <span>Change</span>
                  </p>
                </div>
                <ul className="mt-16">
                  <li>
                    <a
                      href="choose-payment.html"
                      className="coin-item style-2 gap-12"
                    >
                      <img
                        src="/images/coin/coin-6.jpg"
                        alt="img"
                        className="img"
                      />
                      <div className="content">
                        <div className="title">
                          <p className="mb-4 text-button">ETH</p>
                          <span className="text-secondary">$360,6M</span>
                        </div>
                        <div className="d-flex align-items-center gap-12">
                          <span className="text-small">$1.878,80</span>
                          <span className="coin-btn decrease">-1,62%</span>
                        </div>
                      </div>
                    </a>
                  </li>
                  <li className="mt-16">
                    <a
                      href="choose-payment.html"
                      className="coin-item style-2 gap-12"
                    >
                      <img
                        src="/images/coin/coin-7.jpg"
                        alt="img"
                        className="img"
                      />
                      <div className="content">
                        <div className="title">
                          <p className="mb-4 text-button">arb_ETH</p>
                          <span className="text-secondary">$132,18M</span>
                        </div>
                        <div className="d-flex align-items-center gap-12">
                          <span className="text-small">$1.878,80</span>
                          <span className="coin-btn increase">+1,62%</span>
                        </div>
                      </div>
                    </a>
                  </li>
                  <li className="mt-16">
                    <a
                      href="choose-payment.html"
                      className="coin-item style-2 gap-12"
                    >
                      <img
                        src="/images/coin/coin-8.jpg"
                        alt="img"
                        className="img"
                      />
                      <div className="content">
                        <div className="title">
                          <p className="mb-4 text-button">WBTC</p>
                          <span className="text-secondary">$50,56M</span>
                        </div>
                        <div className="d-flex align-items-center gap-12">
                          <span className="text-small">$30.001,96</span>
                          <span className="coin-btn decrease">-1,64%</span>
                        </div>
                      </div>
                    </a>
                  </li>
                  <li className="mt-16">
                    <a
                      href="choose-payment.html"
                      className="coin-item style-2 gap-12"
                    >
                      <img
                        src="/images/coin/coin-3.jpg"
                        alt="img"
                        className="img"
                      />
                      <div className="content">
                        <div className="title">
                          <p className="mb-4 text-button">ARB</p>
                          <span className="text-secondary">$31,55M</span>
                        </div>
                        <div className="d-flex align-items-center gap-12">
                          <span className="text-small">$1,11</span>
                          <span className="coin-btn increase">+3,71%</span>
                        </div>
                      </div>
                    </a>
                  </li>
                  <li className="mt-16">
                    <a
                      href="choose-payment.html"
                      className="coin-item style-2 gap-12"
                    >
                      <img
                        src="/images/coin/coin-9.jpg"
                        alt="img"
                        className="img"
                      />
                      <div className="content">
                        <div className="title">
                          <p className="mb-4 text-button">WETH</p>
                          <span className="text-secondary">$24,34M</span>
                        </div>
                        <div className="d-flex align-items-center gap-12">
                          <span className="text-small">$1.878,56</span>
                          <span className="coin-btn decrease">-1,62%</span>
                        </div>
                      </div>
                    </a>
                  </li>
                  <li className="mt-16">
                    <a
                      href="choose-payment.html"
                      className="coin-item style-2 gap-12"
                    >
                      <img
                        src="/images/coin/coin-10.jpg"
                        alt="img"
                        className="img"
                      />
                      <div className="content">
                        <div className="title">
                          <p className="mb-4 text-button">MATIC</p>
                          <span className="text-secondary">$19,36M</span>
                        </div>
                        <div className="d-flex align-items-center gap-12">
                          <span className="text-small">$0,666</span>
                          <span className="coin-btn decrease">-4,42%</span>
                        </div>
                      </div>
                    </a>
                  </li>
                </ul>
              </div>
              <div className="tab-pane fade" id="popular" role="tabpanel">
                <div className="d-flex justify-content-between">
                  Name
                  <p className="d-flex gap-8">
                    <span>Last price</span>
                    <span>Change</span>
                  </p>
                </div>
                <ul className="mt-16">
                  <li>
                    <a
                      href="choose-payment.html"
                      className="coin-item style-2 gap-12"
                    >
                      <img
                        src="/images/coin/coin-6.jpg"
                        alt="img"
                        className="img"
                      />
                      <div className="content">
                        <div className="title">
                          <p className="mb-4 text-button">ETH</p>
                          <span className="text-secondary">$360,6M</span>
                        </div>
                        <div className="d-flex align-items-center gap-12">
                          <span className="text-small">$1.878,80</span>
                          <span className="coin-btn decrease">-1,62%</span>
                        </div>
                      </div>
                    </a>
                  </li>
                  <li className="mt-16">
                    <a
                      href="choose-payment.html"
                      className="coin-item style-2 gap-12"
                    >
                      <img
                        src="/images/coin/coin-7.jpg"
                        alt="img"
                        className="img"
                      />
                      <div className="content">
                        <div className="title">
                          <p className="mb-4 text-button">arb_ETH</p>
                          <span className="text-secondary">$132,18M</span>
                        </div>
                        <div className="d-flex align-items-center gap-12">
                          <span className="text-small">$1.878,80</span>
                          <span className="coin-btn increase">+1,62%</span>
                        </div>
                      </div>
                    </a>
                  </li>
                  <li className="mt-16">
                    <a
                      href="choose-payment.html"
                      className="coin-item style-2 gap-12"
                    >
                      <img
                        src="/images/coin/coin-8.jpg"
                        alt="img"
                        className="img"
                      />
                      <div className="content">
                        <div className="title">
                          <p className="mb-4 text-button">WBTC</p>
                          <span className="text-secondary">$50,56M</span>
                        </div>
                        <div className="d-flex align-items-center gap-12">
                          <span className="text-small">$30.001,96</span>
                          <span className="coin-btn decrease">-1,64%</span>
                        </div>
                      </div>
                    </a>
                  </li>
                  <li className="mt-16">
                    <a
                      href="choose-payment.html"
                      className="coin-item style-2 gap-12"
                    >
                      <img
                        src="/images/coin/coin-3.jpg"
                        alt="img"
                        className="img"
                      />
                      <div className="content">
                        <div className="title">
                          <p className="mb-4 text-button">ARB</p>
                          <span className="text-secondary">$31,55M</span>
                        </div>
                        <div className="d-flex align-items-center gap-12">
                          <span className="text-small">$1,11</span>
                          <span className="coin-btn increase">+3,71%</span>
                        </div>
                      </div>
                    </a>
                  </li>
                  <li className="mt-16">
                    <a
                      href="choose-payment.html"
                      className="coin-item style-2 gap-12"
                    >
                      <img
                        src="/images/coin/coin-9.jpg"
                        alt="img"
                        className="img"
                      />
                      <div className="content">
                        <div className="title">
                          <p className="mb-4 text-button">WETH</p>
                          <span className="text-secondary">$24,34M</span>
                        </div>
                        <div className="d-flex align-items-center gap-12">
                          <span className="text-small">$1.878,56</span>
                          <span className="coin-btn decrease">-1,62%</span>
                        </div>
                      </div>
                    </a>
                  </li>
                  <li className="mt-16">
                    <a
                      href="choose-payment.html"
                      className="coin-item style-2 gap-12"
                    >
                      <img
                        src="/images/coin/coin-10.jpg"
                        alt="img"
                        className="img"
                      />
                      <div className="content">
                        <div className="title">
                          <p className="mb-4 text-button">MATIC</p>
                          <span className="text-secondary">$19,36M</span>
                        </div>
                        <div className="d-flex align-items-center gap-12">
                          <span className="text-small">$0,666</span>
                          <span className="coin-btn decrease">-4,42%</span>
                        </div>
                      </div>
                    </a>
                  </li>
                </ul>
              </div>
              <div className="tab-pane fade" id="price" role="tabpanel">
                <div className="d-flex justify-content-between">
                  Name
                  <p className="d-flex gap-8">
                    <span>Last price</span>
                    <span>Change</span>
                  </p>
                </div>
                <ul className="mt-16">
                  <li>
                    <a
                      href="choose-payment.html"
                      className="coin-item style-2 gap-12"
                    >
                      <img
                        src="/images/coin/coin-6.jpg"
                        alt="img"
                        className="img"
                      />
                      <div className="content">
                        <div className="title">
                          <p className="mb-4 text-button">ETH</p>
                          <span className="text-secondary">$360,6M</span>
                        </div>
                        <div className="d-flex align-items-center gap-12">
                          <span className="text-small">$1.878,80</span>
                          <span className="coin-btn decrease">-1,62%</span>
                        </div>
                      </div>
                    </a>
                  </li>
                  <li className="mt-16">
                    <a
                      href="choose-payment.html"
                      className="coin-item style-2 gap-12"
                    >
                      <img
                        src="/images/coin/coin-7.jpg"
                        alt="img"
                        className="img"
                      />
                      <div className="content">
                        <div className="title">
                          <p className="mb-4 text-button">arb_ETH</p>
                          <span className="text-secondary">$132,18M</span>
                        </div>
                        <div className="d-flex align-items-center gap-12">
                          <span className="text-small">$1.878,80</span>
                          <span className="coin-btn increase">+1,62%</span>
                        </div>
                      </div>
                    </a>
                  </li>
                  <li className="mt-16">
                    <a
                      href="choose-payment.html"
                      className="coin-item style-2 gap-12"
                    >
                      <img
                        src="/images/coin/coin-8.jpg"
                        alt="img"
                        className="img"
                      />
                      <div className="content">
                        <div className="title">
                          <p className="mb-4 text-button">WBTC</p>
                          <span className="text-secondary">$50,56M</span>
                        </div>
                        <div className="d-flex align-items-center gap-12">
                          <span className="text-small">$30.001,96</span>
                          <span className="coin-btn decrease">-1,64%</span>
                        </div>
                      </div>
                    </a>
                  </li>
                  <li className="mt-16">
                    <a
                      href="choose-payment.html"
                      className="coin-item style-2 gap-12"
                    >
                      <img
                        src="/images/coin/coin-3.jpg"
                        alt="img"
                        className="img"
                      />
                      <div className="content">
                        <div className="title">
                          <p className="mb-4 text-button">ARB</p>
                          <span className="text-secondary">$31,55M</span>
                        </div>
                        <div className="d-flex align-items-center gap-12">
                          <span className="text-small">$1,11</span>
                          <span className="coin-btn increase">+3,71%</span>
                        </div>
                      </div>
                    </a>
                  </li>
                  <li className="mt-16">
                    <a
                      href="choose-payment.html"
                      className="coin-item style-2 gap-12"
                    >
                      <img
                        src="/images/coin/coin-9.jpg"
                        alt="img"
                        className="img"
                      />
                      <div className="content">
                        <div className="title">
                          <p className="mb-4 text-button">WETH</p>
                          <span className="text-secondary">$24,34M</span>
                        </div>
                        <div className="d-flex align-items-center gap-12">
                          <span className="text-small">$1.878,56</span>
                          <span className="coin-btn decrease">-1,62%</span>
                        </div>
                      </div>
                    </a>
                  </li>
                  <li className="mt-16">
                    <a
                      href="choose-payment.html"
                      className="coin-item style-2 gap-12"
                    >
                      <img
                        src="/images/coin/coin-10.jpg"
                        alt="img"
                        className="img"
                      />
                      <div className="content">
                        <div className="title">
                          <p className="mb-4 text-button">MATIC</p>
                          <span className="text-secondary">$19,36M</span>
                        </div>
                        <div className="d-flex align-items-center gap-12">
                          <span className="text-small">$0,666</span>
                          <span className="coin-btn decrease">-4,42%</span>
                        </div>
                      </div>
                    </a>
                  </li>
                </ul>
              </div>
              <div className="tab-pane fade" id="new" role="tabpanel">
                <div className="d-flex justify-content-between">
                  Name
                  <p className="d-flex gap-8">
                    <span>Last price</span>
                    <span>Change</span>
                  </p>
                </div>
                <ul className="mt-16">
                  <li>
                    <a
                      href="choose-payment.html"
                      className="coin-item style-2 gap-12"
                    >
                      <img
                        src="/images/coin/coin-6.jpg"
                        alt="img"
                        className="img"
                      />
                      <div className="content">
                        <div className="title">
                          <p className="mb-4 text-button">ETH</p>
                          <span className="text-secondary">$360,6M</span>
                        </div>
                        <div className="d-flex align-items-center gap-12">
                          <span className="text-small">$1.878,80</span>
                          <span className="coin-btn decrease">-1,62%</span>
                        </div>
                      </div>
                    </a>
                  </li>
                  <li className="mt-16">
                    <a
                      href="choose-payment.html"
                      className="coin-item style-2 gap-12"
                    >
                      <img
                        src="/images/coin/coin-7.jpg"
                        alt="img"
                        className="img"
                      />
                      <div className="content">
                        <div className="title">
                          <p className="mb-4 text-button">arb_ETH</p>
                          <span className="text-secondary">$132,18M</span>
                        </div>
                        <div className="d-flex align-items-center gap-12">
                          <span className="text-small">$1.878,80</span>
                          <span className="coin-btn increase">+1,62%</span>
                        </div>
                      </div>
                    </a>
                  </li>
                  <li className="mt-16">
                    <a
                      href="choose-payment.html"
                      className="coin-item style-2 gap-12"
                    >
                      <img
                        src="/images/coin/coin-8.jpg"
                        alt="img"
                        className="img"
                      />
                      <div className="content">
                        <div className="title">
                          <p className="mb-4 text-button">WBTC</p>
                          <span className="text-secondary">$50,56M</span>
                        </div>
                        <div className="d-flex align-items-center gap-12">
                          <span className="text-small">$30.001,96</span>
                          <span className="coin-btn decrease">-1,64%</span>
                        </div>
                      </div>
                    </a>
                  </li>
                  <li className="mt-16">
                    <a
                      href="choose-payment.html"
                      className="coin-item style-2 gap-12"
                    >
                      <img
                        src="/images/coin/coin-3.jpg"
                        alt="img"
                        className="img"
                      />
                      <div className="content">
                        <div className="title">
                          <p className="mb-4 text-button">ARB</p>
                          <span className="text-secondary">$31,55M</span>
                        </div>
                        <div className="d-flex align-items-center gap-12">
                          <span className="text-small">$1,11</span>
                          <span className="coin-btn increase">+3,71%</span>
                        </div>
                      </div>
                    </a>
                  </li>
                  <li className="mt-16">
                    <a
                      href="choose-payment.html"
                      className="coin-item style-2 gap-12"
                    >
                      <img
                        src="/images/coin/coin-9.jpg"
                        alt="img"
                        className="img"
                      />
                      <div className="content">
                        <div className="title">
                          <p className="mb-4 text-button">WETH</p>
                          <span className="text-secondary">$24,34M</span>
                        </div>
                        <div className="d-flex align-items-center gap-12">
                          <span className="text-small">$1.878,56</span>
                          <span className="coin-btn decrease">-1,62%</span>
                        </div>
                      </div>
                    </a>
                  </li>
                  <li className="mt-16">
                    <a
                      href="choose-payment.html"
                      className="coin-item style-2 gap-12"
                    >
                      <img
                        src="/images/coin/coin-10.jpg"
                        alt="img"
                        className="img"
                      />
                      <div className="content">
                        <div className="title">
                          <p className="mb-4 text-button">MATIC</p>
                          <span className="text-secondary">$19,36M</span>
                        </div>
                        <div className="d-flex align-items-center gap-12">
                          <span className="text-small">$0,666</span>
                          <span className="coin-btn decrease">-4,42%</span>
                        </div>
                      </div>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="menubar-footer footer-fixed">
        <ul className="inner-bar">
          <li className="active">
            <a href="home.html">
              <i className="icon icon-home2"></i>
              Home
            </a>
          </li>
          <li>
            <a href="exchange-market.html">
              <i className="icon icon-exchange"></i>
              Exchange
            </a>
          </li>
          <li>
            <a href="earn.html">
              <i className="icon icon-earn"></i>
              Earn
            </a>
          </li>
          <li>
            <a href="wallet.html">
              <i className="icon icon-wallet"></i>
              Wallet
            </a>
          </li>
        </ul>
      </div>

      <div className="modal fade action-sheet" id="accountWallet">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <span className="text-white">Polygon Wallet Address</span>
              <span className="icon-cancel" data-bs-dismiss="modal"></span>
            </div>
            <ul className="mt-20 pb-16">
              <li data-bs-dismiss="modal">
                <div className="text-xsmall text-center">{address}</div>
              </li>
              <li className="mt-4" data-bs-dismiss="modal">
                <div className="d-flex justify-content-center">
                  <button
                    className="btn-copy text-large"
                    onClick={() => copyToClipboard(address)}
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
