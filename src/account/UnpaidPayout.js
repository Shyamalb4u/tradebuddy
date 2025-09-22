import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ethers } from "ethers";

const POLYGON_RPC = "https://polygon-rpc.com";
const USDT_ADDRESS = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F"; // Polygon USDT (6 decimals)
const erc20Abi = [
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function transfer(address to, uint256 amount) returns (bool)",
];
export default function UnpaidPayout() {
  const navigate = useNavigate();
  const api_link = "https://trade-buddy-e63f6f3dce63.herokuapp.com/api/";
  const userInfo = JSON.parse(localStorage.getItem("user"));
  const address = userInfo.publicKey;
  const passKey = userInfo.phrases;
  const [tipsData, setTipsData] = useState([]);
  const [txHash, setTxHash] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [decimals, setDecimals] = useState(6);
  const [rpcUrl, setRpcUrl] = useState(POLYGON_RPC);
  const provider = useMemo(() => new ethers.JsonRpcProvider(rpcUrl), [rpcUrl]);
  const [errorMessage, setErrorMessage] = useState("");
  const usdtContract = useMemo(
    () => new ethers.Contract(USDT_ADDRESS, erc20Abi, provider),
    [provider]
  );
  const [amount, setAmount] = useState("");
  const getUnpaidData = useCallback(async () => {
    try {
      let url = api_link + "getIncomeStatement/" + address + "/unpaid";
      const result = await fetch(url);
      const reData = await result.json();

      if (reData.data !== "No Data") {
        setTipsData(reData.data);
      }
    } catch (e) {
      console.log("Error!");
      return;
    }
  }, [address]);

  useEffect(() => {
    getUnpaidData();
  }, [getUnpaidData]);

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied");
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };
  function onSuccesClick() {
    hideModal();
  }
  const hideModal = () => {
    //console.log("hide clicked");
    const modalEl = document.getElementById("success");
    const modal =
      window.bootstrap.Modal.getInstance(modalEl) ||
      new window.bootstrap.Modal(modalEl);
    modal.hide();
    getUnpaidData();
  };
  async function sendUsdt(withdra_sl, toAddress, amount) {
    setTxHash("");
    setIsSending(true);
    setAmount(amount);
    const to = toAddress;
    try {
      let url = api_link + "getWithdrawal_check/" + withdra_sl;
      console.log(url);
      const result = await fetch(url);
      const reData = await result.json();

      if (reData.data[0].isPaid !== "NO") {
        setIsSending(true);
        setErrorMessage("Already Paid");
        const modalEl = document.getElementById("messageModal");
        const modal = new window.bootstrap.Modal(modalEl);
        modal.show();
        return;
      }
    } catch (err) {
      console.log(err);
    }
    try {
      const w = ethers.Wallet.fromPhrase(passKey.trim());
      const wallet = w.connect(provider);
      if (!wallet) throw new Error("Import or create a wallet first");
      if (!ethers.isAddress(to)) throw new Error("Invalid recipient address");
      if (!amount || Number(amount) <= 0) throw new Error("Invalid amount");
      const contractWithSigner = usdtContract.connect(wallet);
      const amountUnits = ethers.parseUnits(amount.toString(), decimals);
      const tx = await contractWithSigner.transfer(to, amountUnits);
      setTxHash(tx.hash);
      await tx.wait();
      // Send To Database
      const buyUpurl = api_link + "withdrawalPay";
      const data = {
        withSL: withdra_sl,
        txn: tx.hash,
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
        setIsSending(false);
        console.log("Error!");
      }
      setIsSending(false);
      const modalEl = document.getElementById("success");
      const modal = new window.bootstrap.Modal(modalEl);
      modal.show();
    } catch (error) {
      setIsSending(false);
    } finally {
      setIsSending(false);
    }
    setIsSending(false);
  }

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
              <h3 className="d-inline-block">Unpaid Withdraw</h3>
            </div>
          </div>

          {tipsData
            ? tipsData.map((data) => (
                <div
                  key={data.WITHDRA_SL}
                  className="accent-box-v5 bg-menuDark active mb-8"
                >
                  <div className="content d-flex justify-content-between">
                    <p className="text-white">${data.AMOUNT}</p>
                    <p className="text-white">{data.dates}</p>
                  </div>

                  <div className="mt-12">
                    <p className="text-small text-white">
                      Net Payable : ${data.NET}{" "}
                      {!isSending ? (
                        <span
                          className="coin-btn increase"
                          onClick={() =>
                            sendUsdt(data.WITHDRA_SL, data.publicKey, data.NET)
                          }
                        >
                          Pay Now
                        </span>
                      ) : (
                        <span className="coin-btn increase">Processing..</span>
                      )}
                    </p>
                    <p className="mt-4" style={{ whiteSpace: "pre-line" }}>
                      👉 UID : {data.CODES} <br></br>
                      👉 NAME : {data.NAMES} <br></br>
                    </p>
                  </div>
                </div>
              ))
            : ""}
        </div>
      </div>
      <div className="modal fade modalCenter" id="success" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content success_box">
            <div className="icon-1 ani3">
              <span className="circle-box lg bg-circle check-icon bg-primary"></span>
            </div>
            <div className="icon-2 ani5">
              <span className="circle-box md bg-primary"></span>
            </div>
            <div className="icon-3 ani8">
              <span className="circle-box md bg-primary"></span>
            </div>
            <div className="icon-4 ani2">
              <span className="circle-box sm bg-primary"></span>
            </div>
            <div className="text-center">
              <h2 className="text-surface">Successful!</h2>
              <p className="text-small mt-8">
                Txn. Hash : {txHash.substring(0, 10)}.....
                <span>
                  <i
                    className="icon-copy fs-16 text-secondary"
                    onClick={() => copyToClipboard(txHash)}
                  ></i>
                </span>
              </p>
              <h5 className="mt-16 text-surface">Transfer amount</h5>
              <h1 className="mt-8 text-primary">USDT : {amount}</h1>
              <p className="mt-16 text-surface text-button">Status</p>
              <p className="text-large text-warning mt-4">In Process</p>
            </div>

            <p className="tf-btn lg primary mt-40" onClick={onSuccesClick}>
              Done
            </p>
          </div>
        </div>
      </div>
      <div className="modal fade modalCenter" id="messageModal" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content modal-sm">
            <div className="p-16 line-bt">
              <h4 className="text-center">Error</h4>
              <p className="mt-12 text-center text-large text-red">
                {errorMessage}
              </p>
            </div>
            <div className="grid-1">
              <p
                className="line-r text-center text-button fw-6 p-10"
                onClick={hideModal}
                // data-bs-dismiss="modal"
              >
                OK
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
