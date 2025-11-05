import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { ethers } from "ethers";

export default function WithdrawalStatus() {
  const navigate = useNavigate();
  const api_link = "https://trade-buddy-e63f6f3dce63.herokuapp.com/api/";
  const userInfo = JSON.parse(localStorage.getItem("user"));
  const address = userInfo.publicKey;
  const [tipsData, setTipsData] = useState([]);

  const POLYGON_RPC = "https://polygon-rpc.com";
  const provider = useMemo(
    () => new ethers.JsonRpcProvider(POLYGON_RPC),
    [POLYGON_RPC]
  );

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      // alert("Txn. Coppied");
      // setTimeout(() => setCopied(false), 2000); // reset after 2s
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  useEffect(() => {
    async function getPendingWithdrawal() {
      try {
        let url = api_link + "pending_withdraw/" + address;
        const result = await fetch(url);
        const reData = await result.json();

        if (reData.data !== "No Data") {
          for (const pdata of reData.data) {
            try {
              const receipt = await provider.getTransactionReceipt(pdata.TXN);

              if (receipt.status === 1) {
                //set activation status success and calculate income abd achievement
                const buyUpurl = api_link + "withdrawalCheck";
                const data = {
                  txn: pdata.TXN,
                  type: "success",
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
                  console.log("Error!");
                }
              } else if (receipt.status === 0) {
                const buyUpurl = api_link + "withdrawalCheck";
                const data = {
                  txn: pdata.TXN,
                  type: "fail",
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
                  console.log("Error!");
                }
              }
            } catch (e) {
              console.log("Error!");
            }
          }
        }
      } catch (e) {
        console.log("Error!");
        return;
      }
    }
    getPendingWithdrawal();
  }, [address, api_link, provider]);

  useEffect(() => {
    async function getTipsData() {
      try {
        let url = api_link + "getIncomeStatement/" + address + "/Withdrawal";
        const result = await fetch(url);
        const reData = await result.json();

        if (reData.data !== "No Data") {
          setTipsData(reData.data);
        }
      } catch (e) {
        console.log("Error!");
        return;
      }
    }
    getTipsData();
  }, [address]);

  function onBackClick() {
    navigate("/home");
  }
  return (
    <>
      <div className="header fixed-top bg-surface d-flex justify-content-center align-items-center">
        <p className="left back-btn" onClick={onBackClick}>
          <i className="icon-left-btn"></i>
        </p>
      </div>
      <div className="pt-45 pb-16">
        <div className="tf-container">
          <div className="mt-32 text-center mb-12">
            <div className="mt-8">
              <h3 className="d-inline-block">Withdraw Status</h3>
            </div>
          </div>

          {tipsData
            ? tipsData.map((data) => (
                <div
                  key={data.WITHDRA_SL}
                  className="accent-box-v5 bg-menuDark active mb-8"
                >
                  <div className="content d-flex justify-content-between">
                    <p className="text-large text-white">${data.AMOUNT}</p>
                    <p className="text-white">{data.dates}</p>
                  </div>

                  <div className="mt-10">
                    <p className="text-small text-white">
                      Net Payable : ${data.NET}
                    </p>
                    <p className="mt-4" style={{ whiteSpace: "pre-line" }}>
                      👉 Platform Fee (10%) : {data.ADMIN_CH} <br></br>
                      📌Status : {data.STATUS}
                      <br></br>
                      {data.STATUS !== "Pending" ? (
                        <>
                          📅 Pay Date : {data.a_dates}
                          <br></br> #️⃣ Txn. :{String(data.TXN).slice(0, 16)}…
                          {String(data.TXN).slice(-8)}{" "}
                          <span>
                            <i
                              class="icon-copy fs-16 text-secondary"
                              onClick={() => copyToClipboard(data.TXN)}
                            ></i>
                          </span>
                        </>
                      ) : (
                        ""
                      )}
                    </p>
                  </div>
                </div>
              ))
            : ""}
        </div>
      </div>
    </>
  );
}
