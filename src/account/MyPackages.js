import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";

export default function MyPackages() {
  const navigate = useNavigate();
  const api_link = "https://trade-buddy-e63f6f3dce63.herokuapp.com/api/";
  const userInfo = JSON.parse(localStorage.getItem("user"));
  const address = userInfo.publicKey;
  const [pendingData, setPendingData] = useState([]);
  const [packageData, setPackageData] = useState([]);
  const [copied, setCopied] = useState(false);
  const POLYGON_RPC = "https://polygon-rpc.com";
  const provider = useMemo(
    () => new ethers.JsonRpcProvider(POLYGON_RPC),
    [POLYGON_RPC]
  );
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      alert("Txn. Coppied");
      // setTimeout(() => setCopied(false), 2000); // reset after 2s
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };
  function onBackClick() {
    navigate("/home");
  }
  useEffect(() => {
    async function getPendingData() {
      try {
        let url = api_link + "pending_activation/" + address;
        const result = await fetch(url);
        const reData = await result.json();

        if (reData.data !== "No Data") {
          setPendingData(reData.data);
          for (const pdata of reData.data) {
            try {
              const receipt = await provider.getTransactionReceipt(pdata.txn);
              if (receipt.status === 1) {
                const buyUpurl = api_link + "booking";
                const data = {
                  publicKey: address.trim(),
                  amt: pdata.amt,
                  txn: pdata.txn,
                  mode: "user",
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
                  console.log(error);
                }
              } else if (receipt.status === 0) {
                const buyUpurl = api_link + "booking";
                const data = {
                  publicKey: address.trim(),
                  amt: pdata.amt,
                  txn: pdata.txn,
                  mode: "failed",
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
                  console.log(error);
                }
              }
            } catch (e) {
              console.log(e);
            }
          }
        }
      } catch (e) {
        console.log(e);
        return;
      }
    }
    getPendingData();
  }, [address, provider]);
  useEffect(() => {
    async function getPackages() {
      try {
        let url = api_link + "getMyPackages/" + address;
        const result = await fetch(url);
        const reData = await result.json();
        setPackageData(reData.data);
      } catch (e) {
        console.log(e);
        return;
      }
    }
    getPackages();
  }, [address]);
  return (
    <>
      <div className="header fixed-top bg-surface d-flex justify-content-center align-items-center">
        <p className="left back-btn" onClick={onBackClick}>
          <i className="icon-left-btn"></i>
        </p>
      </div>
      <div className="pt-45 pb-16">
        <div className="tf-container">
          <div className="mt-32 text-center">
            <div className="mt-8">
              <h3 className="d-inline-block">My Subscription</h3>
            </div>
          </div>
          <div className="mt-20">
            <div className="tab-content mt-16 mb-16">
              {pendingData ? (
                <>
                  {pendingData.length > 0 ? (
                    <h4>Subscription Under Process</h4>
                  ) : (
                    ""
                  )}
                  <ul>
                    {pendingData.map((data) => (
                      <li key={data.txn} className="line-bt">
                        <a href="#" className="coin-item style-2 gap-12">
                          <img
                            src="/images/coin/coin-14.jpg"
                            alt="img"
                            className="img"
                          />
                          <div className="content">
                            <div className="title">
                              <p className="mb-4 text-button">
                                USDT {data.amt}
                              </p>
                              <span className="text-secondary">
                                Txn. {String(data.txn).slice(0, 6)}…
                                {String(data.txn).slice(-4)}
                              </span>
                            </div>
                            <div className="d-flex align-items-center gap-12">
                              <span className="text-small">{data.dates}</span>
                              <span className="coin-btn pending">Wait</span>
                            </div>
                          </div>
                        </a>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                ""
              )}

              {packageData ? (
                <>
                  <ul>
                    {packageData.map((data, index) => (
                      <li key={data.Activation_sl} className="line-bt">
                        <a
                          href="choose-payment.html"
                          className="coin-item style-2 gap-12"
                        >
                          <span className="text-small">{index + 1}</span>
                          <div className="content">
                            <div className="title">
                              <p className="mb-4 text-button">
                                USDT{" "}
                                <span className="text-warning">
                                  {data.AMOUNT}
                                </span>
                              </p>
                              <span className="text-secondary">
                                Txn. {String(data.txn).slice(0, 6)}…
                                {String(data.txn).slice(-4)}{" "}
                                <span>
                                  {!copied ? (
                                    <i
                                      class="icon-copy fs-16 text-secondary"
                                      onClick={() => copyToClipboard(data.txn)}
                                    ></i>
                                  ) : (
                                    "Copied"
                                  )}
                                </span>
                              </span>
                            </div>
                            <div className="d-flex align-items-center gap-12">
                              <span className="text-small">{data.DATES}</span>
                              <span className="coin-btn increase">Success</span>
                            </div>
                          </div>
                        </a>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
