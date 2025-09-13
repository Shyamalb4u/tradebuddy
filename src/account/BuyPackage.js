import { useMemo, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";

const POLYGON_RPC = "https://polygon-rpc.com";
const USDT_ADDRESS = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F"; // Polygon USDT (6 decimals)
const erc20Abi = [
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function transfer(address to, uint256 amount) returns (bool)",
];
export default function BuyPackage() {
  const api_link = "https://trade-buddy-e63f6f3dce63.herokuapp.com/api/";
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("user"));
  const address = userInfo.publicKey;
  const passKey = userInfo.phrases;
  const [balance, setBalance] = useState("0");
  const [token, setToken] = useState("USDT");
  const toAddress = "0x4AB0334BB35348B921b4B7cc6b22928A7166d5EA";
  const [amount, setAmount] = useState("");
  const [txHash, setTxHash] = useState("");
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isError, setIsError] = useState(false);
  const [decimals, setDecimals] = useState(6);
  const [rpcUrl, setRpcUrl] = useState(POLYGON_RPC);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const provider = useMemo(() => new ethers.JsonRpcProvider(rpcUrl), [rpcUrl]);
  const usdtContract = useMemo(
    () => new ethers.Contract(USDT_ADDRESS, erc20Abi, provider),
    [provider]
  );

  //////////////////
  useEffect(() => {
    setToken("USDT");
    if (!address || !usdtContract || !provider) return;
    async function fetchBalance() {
      try {
        const raw = await usdtContract.balanceOf(address);
        const formatted = ethers.formatUnits(raw, decimals);
        setBalance(Number(formatted).toFixed(4));
      } catch (e) {
        console.error("fetchBalance error:");
      }
    }
    fetchBalance();
  }, [address, usdtContract, provider, decimals]);

  async function sendUsdt() {
    setError("");
    setTxHash("");
    setIsSending(true);
    setIsError(false);
    const to = toAddress;
    try {
      const w = ethers.Wallet.fromPhrase(passKey.trim());
      const wallet = w.connect(provider);
      if (!wallet) {
        setIsSending(false);
        setErrorMessage("Your Wallet Is NValid");
        const modalEl = document.getElementById("messageModal");
        const modal = new window.bootstrap.Modal(modalEl);
        modal.show();
        return;
      }
      if (!ethers.isAddress(to)) {
        setIsSending(false);
        setErrorMessage("In Valid Receipient Address");
        const modalEl = document.getElementById("messageModal");
        const modal = new window.bootstrap.Modal(modalEl);
        modal.show();
        return;
      }
      if (!amount || Number(amount) < 1) {
        setIsSending(false);
        setErrorMessage("Minimum Subscription USDT 50");
        const modalEl = document.getElementById("messageModal");
        const modal = new window.bootstrap.Modal(modalEl);
        modal.show();
        return;
      }
      // if (Number(amount) % 50 > 0) {
      //   setIsSending(false);
      //   setErrorMessage("Subscription Multiple Of 50");
      //   const modalEl = document.getElementById("messageModal");
      //   const modal = new window.bootstrap.Modal(modalEl);
      //   modal.show();
      //   return;
      // }
      const contractWithSigner = usdtContract.connect(wallet);
      const amountUnits = ethers.parseUnits(amount.toString(), decimals);
      const tx = await contractWithSigner.transfer(to, amountUnits);
      setTxHash(tx.hash);
      await tx.wait();
      // Send To Database
      const buyUpurl = api_link + "booking";
      const data = {
        publicKey: address.trim(),
        amt: amount,
        txn: tx.hash,
        mode: "Pending",
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
      // fetchUSDTBalance();
      setIsSending(false);
      const modalEl = document.getElementById("success");
      const modal = new window.bootstrap.Modal(modalEl);
      modal.show();
    } catch (error) {
      setError(error.message || String(error));
      //console.log(error);
      setIsSending(false);
      setIsError(true);
    } finally {
      setIsSending(false);
    }
    setIsSending(false);
  }

  function onBackClick() {
    navigate("/packages");
  }
  function onSuccesClick() {
    hideModal();
    navigate("/my-packages");
  }
  const hideModal = () => {
    const modalEl = document.getElementById("success");
    const modal =
      window.bootstrap.Modal.getInstance(modalEl) ||
      new window.bootstrap.Modal(modalEl);
    modal.hide();
  };
  const hideErrorModal = () => {
    const modalEl = document.getElementById("messageModal");
    const modal =
      window.bootstrap.Modal.getInstance(modalEl) ||
      new window.bootstrap.Modal(modalEl);
    modal.hide();
  };
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // reset after 2s
    } catch (err) {
      console.error("Failed to copy: ");
    }
  };
  return (
    <>
      <div className="header fixed-top bg-surface d-flex justify-content-center align-items-center">
        <p className="left back-btn" onClick={onBackClick}>
          <i className="icon-left-btn"></i>
        </p>
        <h3>Subscription</h3>
      </div>
      <div className="pt-45 pb-90">
        <div className="tf-container">
          <div className="mt-32 accent-box-v2 bg-menuDark">
            <div className="d-flex justify-content-between align-items-center">
              <span>Your {token} Balance:</span>
              <h5>{balance}</h5>
            </div>
            <div className="mt-12">
              <input
                id="amount"
                type="number"
                placeholder="Subscription Amount"
                className="bg-surface"
                maxLength={4}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>
          <h6 className="mt-20">Note : </h6>
          <p>
            1. Minimum Subscription USDT 50. <br></br>
            2. Subscription only multiple of 50.<br></br>
            3. POL is required for transaction fee.
          </p>
        </div>
        {isError ? (
          <div
            style={{
              marginTop: 25,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              src="/images/error.png"
              alt="img"
              className="img"
              style={{ width: 80 }}
            />
            <p className="text-red">Low Balance</p>
          </div>
        ) : (
          ""
        )}
      </div>

      <div className="menubar-footer footer-fixed bg-surface">
        <div className="inner-bar d-flex justify-content-center">
          {isSending ? (
            <img src="/images/wait.gif" alt="Loading.." className="img_wait" />
          ) : (
            <p className="tf-btn lg primary" onClick={sendUsdt}>
              Confirm
            </p>
          )}
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
                  {!copied ? (
                    <i
                      class="icon-copy fs-16 text-secondary"
                      onClick={() => copyToClipboard(txHash)}
                    ></i>
                  ) : (
                    "Copied"
                  )}
                </span>
              </p>
              <h5 className="mt-16 text-surface">Transfer amount</h5>
              <h1 className="mt-8 text-primary">
                {token} {amount}
              </h1>
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
                onClick={hideErrorModal}
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
