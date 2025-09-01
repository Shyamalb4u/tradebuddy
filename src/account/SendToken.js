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

export default function SendToken() {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("user"));
  const address = userInfo.publicKey;
  const passKey = userInfo.phrases;
  const [balance, setBalance] = useState("0");
  const [token, setToken] = useState("USDT");
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [txHash, setTxHash] = useState("");
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [decimals, setDecimals] = useState(6);
  const [rpcUrl, setRpcUrl] = useState(POLYGON_RPC);
  const [copied, setCopied] = useState(false);
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
        setBalance(formatted);
      } catch (e) {
        console.error("fetchBalance error:", e);
      }
    }
    fetchBalance();
  }, [address, usdtContract, provider, decimals]);

  async function fetchUSDTBalance() {
    setToken("USDT");
    const raw = await usdtContract.balanceOf(address);
    const formatted = ethers.formatUnits(raw, decimals);
    setBalance(formatted);
  }
  async function fetchPOLBalance() {
    setToken("POL");
    const bal = await provider.getBalance(address);
    const formattedNative = parseFloat(ethers.formatEther(bal)).toFixed(4);
    setBalance(formattedNative);
  }
  async function sendUsdt() {
    setError("");
    setTxHash("");
    setIsSending(true);
    const to = toAddress;
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
      // refresh balance
      // fetchUSDTBalance();
      setIsSending(false);
      const modalEl = document.getElementById("success");
      const modal = new window.bootstrap.Modal(modalEl);
      modal.show();
    } catch (error) {
      setError(error.message || String(error));
      setIsSending(false);
    } finally {
      setIsSending(false);
    }
    setIsSending(false);
  }
  async function sendNative() {
    setError("");
    setTxHash("");
    setIsSending(true);
    try {
      const w = ethers.Wallet.fromPhrase(passKey.trim());
      const wallet = w.connect(provider);
      if (!wallet) throw new Error("Import or create a wallet first");
      if (!ethers.isAddress(toAddress))
        throw new Error("Invalid recipient address");
      if (!amount || Number(amount) <= 0) throw new Error("Invalid amount");

      const tx = await wallet.sendTransaction({
        toAddress,
        value: ethers.parseEther(amount.toString()),
      });
      setTxHash(tx.hash);
      await tx.wait();
      //await fetchPOLBalance();
      setIsSending(false);
      const modalEl = document.getElementById("success");
      const modal = new window.bootstrap.Modal(modalEl);
      modal.show();
    } catch (e) {
      setError(e.message || String(e));
      setIsSending(false);
    } finally {
      setIsSending(false);
    }
  }
  function onBackClick() {
    navigate("/home");
  }
  function onSuccesClick() {
    hideModal();
    navigate("/home");
  }
  const hideModal = () => {
    console.log("hide clicked");
    const modalEl = document.getElementById("success");
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
      console.error("Failed to copy: ", err);
    }
  };
  return (
    <>
      <div className="header fixed-top bg-surface d-flex justify-content-center align-items-center">
        <p className="left back-btn" onClick={onBackClick}>
          <i className="icon-left-btn"></i>
        </p>
        <h3>Send Token</h3>
      </div>
      <div className="pt-45 pb-90">
        <div className="tf-container">
          <div className="mt-4 accent-box-v2 bg-menuDark">
            <div className="tab-slide mt-16 mb-16">
              <ul className="nav nav-tabs wallet-tabs" role="tablist">
                <li className="item-slide-effect"></li>
                <li className="nav-item active" role="presentation">
                  <button
                    className="nav-link active"
                    data-bs-toggle="tab"
                    onClick={fetchUSDTBalance}
                  >
                    USDT
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    data-bs-toggle="tab"
                    onClick={fetchPOLBalance}
                  >
                    POL
                  </button>
                </li>
              </ul>
            </div>

            <div className="d-flex justify-content-between align-items-center">
              <span>Your {token} Balance:</span>
              <h5>{balance}</h5>
            </div>
            <div className="mt-12">
              <input
                type="number"
                placeholder="Please enter quantity"
                className="bg-surface"
                maxLength={4}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="mt-12">
              <input
                type="text"
                placeholder="To Address"
                className="bg-surface"
                value={toAddress}
                onChange={(e) => setToAddress(e.target.value)}
              />
            </div>
          </div>
          <h6 className="mt-20">cautionary statement : </h6>
          <p>
            ⚠️ Please confirm: The recipient address must be on the Polygon
            (POL) network. Sending to another network may result in permanent
            loss of your USDT.
          </p>
        </div>
      </div>

      <div className="menubar-footer footer-fixed bg-surface">
        <div className="inner-bar d-flex justify-content-center">
          {isSending ? (
            <img src="/images/wait.gif" alt="Loading.." className="img_wait" />
          ) : (
            <p
              className="tf-btn lg primary"
              onClick={token === "USDT" ? sendUsdt : sendNative}
            >
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
                    // <img
                    //   src="/images/copy.png"
                    //   alt="Copy"
                    //   onClick={() => copyToClipboard(txHash)}
                    //   className="img_copy"
                    // />
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
    </>
  );
}
