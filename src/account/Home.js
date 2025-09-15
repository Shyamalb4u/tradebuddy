import { useMemo, useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

import { ethers } from "ethers";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { initializeApp } from "firebase/app";
import DailyReward from "./DailyReward";

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
  const uid = userInfo.id;
  const referLink = "https://tradebuddy.biz/#/signup?s=" + uid;
  const api_link = "https://trade-buddy-e63f6f3dce63.herokuapp.com/api/";

  const [usdtBalance, setUsdtBalance] = useState("0");
  const [nativeBalance, setNativeBalance] = useState("0");
  const [decimals, setDecimals] = useState(6);
  const [rpcUrl, setRpcUrl] = useState(POLYGON_RPC);
  const provider = useMemo(() => new ethers.JsonRpcProvider(rpcUrl), [rpcUrl]);
  const [copied, setCopied] = useState(false);
  const [token, setToken] = useState(null);
  const [status, setStatus] = useState("Click to enable notifications");
  const [balanceData, setBalanceData] = useState([]);

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
      await navigator.serviceWorker.ready;

      // 3️⃣ Get FCM token
      const currentToken = await getToken(messaging, {
        vapidKey:
          "BEwIPFYWlDx-HHVDr_K0xOZ-nSs5JRhfaq7HWYII52-G5yiAFKSMPHNkIQ59zdokSsqyGLar9DNfPGEHYt63ryA",
        serviceWorkerRegistration: registration,
      });

      if (currentToken) {
        setToken(currentToken);
        setStatus("Subscribed ✅");
        // console.log("FCM Token:", currentToken);

        const buyUpurl = api_link + "fcmToken";
        const data = {
          publicKey: address.trim(),
          token: currentToken,
        };
        const customHeaders = {
          "Content-Type": "application/json",
        };
        try {
          const result = await fetch(buyUpurl, {
            method: "POST",
            headers: customHeaders,
            body: JSON.stringify(data),
          });
          if (!result.ok) {
            throw new Error(`HTTP error! status: ${result.status}`);
          }
        } catch (error) {
          console.log("error");
        }
      } else {
        setStatus("No registration token available ❌");
      }
    } catch (err) {
      console.error("FCM subscription failed:");
      setStatus("Subscription failed ❌");
    }
  };
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      // setTimeout(() => {
      //   setCopied(false);
      alert("Coppied");
      // }, 2000); // reset after 2s
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };
  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "This a invitation to join Trade Buddy, your crypto assistant",
          text: `This a invitation to join Trade Buddy, your crypto assistant. Click The link : ${referLink}`,
          //url: window.location.href, // optional: share page link too
        });
        console.log("Shared successfully!");
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      alert("Sharing not supported on this browser");
    }
  }
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
        console.error("fetchBalance error:");
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
        // if (Notification.permission === "default") {
        await requestPermissionAndSubscribe();
        // }
        onMessage(messaging, (payload) => {
          console.log("Message received in foreground: ", payload);
          new Notification(payload.notification.title, {
            body: payload.notification.body,
            icon: payload.notification.icon,
          });
        });
      } catch (err) {
        console.error("Notification setup failed:", err);
      }
    }

    setupNotifications();
  }, []);
  useEffect(() => {
    async function getBalance() {
      try {
        let url = api_link + "getDashboardBalance/" + address;
        const result = await fetch(url);
        const reData = await result.json();
        setBalanceData(reData.data);
        //console.log(reData.data[0].currentRank);
      } catch (e) {
        console.log("Error!");
        return;
      }
    }
    getBalance();
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
  function onBuyPackage() {
    navigate("/packages");
  }
  function onDRtips() {
    navigate("/dr-tips");
  }
  function logout() {
    const modalEl = document.getElementById("logout");
    const modal =
      window.bootstrap.Modal.getInstance(modalEl) ||
      new window.bootstrap.Modal(modalEl);
    modal.hide();
    localStorage.clear();
    navigate("/");
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
            <p className="text-red text-small">
              <span data-bs-toggle="modal" data-bs-target="#logout">
                Logout
              </span>
            </p>
          </div>
        </div>
      </div>
      <div className="pt-68 pb-10">
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

            <div
              className="content d-flex justify-content-between"
              style={{ marginTop: 16 }}
            >
              <h1>${usdtBalance}</h1>
              <h3>POL {nativeBalance}</h3>
            </div>
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
                <p
                  className="tf-list-item d-flex flex-column gap-8 align-items-center menu-text"
                  onClick={onBuyPackage}
                >
                  <span className="box-round bg-surface d-flex justify-content-center align-items-center">
                    <i className="icon icon-wallet"></i>
                  </span>
                  Buy
                </p>
              </li>
              <li>
                <p
                  className="tf-list-item d-flex flex-column gap-8 align-items-center menu-text"
                  onClick={onDRtips}
                >
                  <span className="box-round bg-surface d-flex justify-content-center align-items-center">
                    <i className="icon icon-exchange"></i>
                  </span>
                  DR Tips
                </p>
              </li>
            </ul>
          </div>
        </div>
        <div className="bg-menuDark tf-container">
          <div className="pt-12 pb-12 mt-4">
            <div className="mt-12 d-flex gap-4 align-items-center">
              {" "}
              <h5>Statistics</h5>
              {balanceData.length > 0 ? (
                <>
                  {balanceData[0].uplineBonus === "YES" ? (
                    <>
                      <input
                        type="checkbox"
                        className="tf-checkbox style-2"
                        id="cb5"
                        defaultChecked
                      />
                      <label className="text-xsmall text-warning" htmlFor="cb5">
                        Upline Bonus
                      </label>
                    </>
                  ) : (
                    ""
                  )}

                  {balanceData[0].currentRank !== "NO" ? (
                    <>
                      <input
                        type="checkbox"
                        className="tf-checkbox style-2"
                        id="cb5"
                        defaultChecked
                      />
                      <label className="text-xsmall text-warning" htmlFor="cb5">
                        {balanceData[0].currentRank} Rank
                      </label>
                    </>
                  ) : (
                    ""
                  )}
                </>
              ) : (
                ""
              )}
            </div>

            {/* <p onClick={sendMessage}>Send Msg</p> */}
            <div
              className="swiper tf-swiper swiper-wrapper-r mt-16"
              data-space-between="16"
              data-preview="2.8"
              data-tablet="2.8"
              data-desktop="3"
            >
              {balanceData.length > 0 ? (
                <div
                  className="swiper-wrapper"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <div className="swiper-slide" style={{ width: 105 }}>
                    <a href="#" className="coin-box d-block">
                      <div className="coin-logo">
                        <img
                          src="/images/reward.png"
                          alt="img"
                          className="logo"
                        />
                        <div className="title">
                          <p>Reward</p>
                          <span>Total</span>
                        </div>
                      </div>
                      <div className="mt-8 mb-8 coin-chart">
                        <div id="line-chart-1"></div>
                      </div>
                      <div className="coin-price d-flex justify-content-between">
                        <span>${balanceData[0].totInc}</span>
                        <span className="text-primary d-flex align-items-center gap-2">
                          <i className="icon-select-up"></i>{" "}
                          {balanceData[0].incPer}%
                        </span>
                      </div>
                      <div className="blur bg1"></div>
                    </a>
                  </div>
                  <div className="swiper-slide" style={{ width: 105 }}>
                    <a href="#" className="coin-box d-block">
                      <div className="coin-logo">
                        <img
                          src="/images/withdraw.png"
                          alt="img"
                          className="logo"
                        />
                        <div className="title">
                          <p>Withdraw</p>
                          <span>Total</span>
                        </div>
                      </div>
                      <div className="mt-8 mb-8 coin-chart">
                        <div id="line-chart-2"></div>
                      </div>
                      <div className="coin-price d-flex justify-content-between">
                        <span>${balanceData[0].totWith}</span>
                        <span className="text-primary d-flex align-items-center gap-2">
                          <i className="icon-select-up"></i>{" "}
                          {balanceData[0].withPer}%
                        </span>
                      </div>
                      <div className="blur bg2"></div>
                    </a>
                  </div>
                  <div
                    className="swiper-slide"
                    style={{ width: 105, marginRight: 15 }}
                  >
                    <a href="#" className="coin-box d-block">
                      <div className="coin-logo">
                        <img
                          src="/images/balance.png"
                          alt="img"
                          className="logo"
                        />
                        <div className="title">
                          <p>Balance</p>
                          <span>Net</span>
                        </div>
                      </div>
                      <div className="mt-8 mb-8 coin-chart">
                        <div id="line-chart-3"></div>
                      </div>
                      <div className="coin-price d-flex justify-content-between">
                        <span>${balanceData[0].balance}</span>
                        <span className="text-primary d-flex align-items-center gap-2">
                          <i className="icon-select-up"></i>{" "}
                          {balanceData[0].balancePer}%
                        </span>
                      </div>
                      <div className="blur bg3"></div>
                    </a>
                  </div>
                </div>
              ) : (
                "Loading..."
              )}
            </div>
          </div>
        </div>
      </div>
      <DailyReward />
      <div className="menubar-footer footer-fixed">
        <ul className="inner-bar">
          <li className="active">
            <a href="#">
              <i className="icon icon-home2"></i>
              Home
            </a>
          </li>
          <li>
            <a href="#referPage" data-bs-toggle="modal">
              <i className="icon icon-share"></i>
              Refer
            </a>
          </li>
          <li>
            <Link to="/tips">
              <i className="icon icon-earn text-white"></i>
              Tips
            </Link>
          </li>
          <li>
            <Link to="/withdraw">
              <i className="icon icon-wallet text-white"></i>
              Withdraw
            </Link>
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
      <div className="modal fade modalCenter" id="logout">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content modal-sm">
            <div className="p-16 line-bt">
              <h4 className="text-center">Log Out</h4>
              <p className="mt-12 text-center text-large">
                Are you sure you want to sign out?
              </p>
            </div>
            <div className="grid-2">
              <p
                className="line-r text-center text-button fw-6 p-10"
                data-bs-dismiss="modal"
              >
                Cancel
              </p>
              <p
                className="text-center text-button fw-6 p-10 text-red"
                onClick={logout}
              >
                Log Out
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade action-sheet" id="referPage">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5>Refer Your Friends</h5>
              <span className="icon-cancel" data-bs-dismiss="modal"></span>
            </div>
            <div
              className="accent-box  bg-white"
              style={{ margin: 20, padding: 20 }}
            >
              <h6 className="text-deep text-center">{referLink}</h6>
              <div
                className="content d-flex justify-content-between"
                style={{ marginTop: 30 }}
              >
                <button
                  className="btn-share"
                  data-bs-dismiss="modal"
                  onClick={() => copyToClipboard(referLink)}
                >
                  Copy &nbsp;
                  <span>
                    <i className="icon icon-copy"></i>{" "}
                  </span>
                </button>
                <button className="btn-share" onClick={() => handleShare()}>
                  Share &nbsp;
                  <span>
                    <i className="icon icon-share"></i>{" "}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
