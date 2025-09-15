import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Withdraw() {
  const api_link = "https://trade-buddy-e63f6f3dce63.herokuapp.com/api/";
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("user"));
  const address = userInfo.publicKey;

  const [balance, setBalance] = useState("0");
  const [isSending, setIsSending] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [amount, setAmount] = useState("");

  //////////////////
  useEffect(() => {
    async function fetchBalance() {
      try {
        let url = api_link + "getDashboardBalance/" + address;
        const result = await fetch(url);
        const reData = await result.json();
        setBalance(reData.data[0].balance);
      } catch (e) {
        console.log("Error!");
        return;
      }
    }
    fetchBalance();
  }, [address]);

  async function sendUsdt() {
    setIsSending(true);

    try {
      if (!amount || Number(amount) < 20) {
        setIsSending(false);
        setErrorMessage("Minimum Withdrawal USDT 20");
        const modalEl = document.getElementById("messageModal");
        const modal = new window.bootstrap.Modal(modalEl);
        modal.show();
        return;
      }
      if (Number(amount) > Number(balance)) {
        setIsSending(false);
        setErrorMessage("Withdrawal Amount Exceed Balance");
        const modalEl = document.getElementById("messageModal");
        const modal = new window.bootstrap.Modal(modalEl);
        modal.show();
        return;
      }

      // Send To Database
      const buyUpurl = api_link + "withdrawal";
      const data = {
        publicKey: address.trim(),
        amount: amount,
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
      setIsError(true);
      //console.log(error);
      setIsSending(false);
    } finally {
      setIsSending(false);
    }
    setIsSending(false);
  }

  function onBackClick() {
    navigate("/home");
  }
  function onSuccesClick() {
    hideModal();
    navigate("/home"); // send to withdrawal status later
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

  return (
    <>
      <div className="header fixed-top bg-surface d-flex justify-content-center align-items-center">
        <p className="left back-btn" onClick={onBackClick}>
          <i className="icon-left-btn"></i>
        </p>
        <h3>Reward Withdrawal</h3>
      </div>
      <div className="pt-45 pb-90">
        <div className="tf-container">
          <div className="mt-32 accent-box-v2 bg-menuDark">
            <div className="d-flex justify-content-between align-items-center">
              <span>Your Withdrawable Balance:</span>
              <h5>{balance}</h5>
            </div>
            <div className="mt-12">
              <input
                id="amount"
                type="number"
                placeholder="Amount To Withdraw"
                className="bg-surface"
                maxLength={4}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>
          <h6 className="mt-20">Note : </h6>
          <p>
            1. Minimum Withdrawal USDT 20. <br></br>
            2. Platform Fee 10%.
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
            <p className="text-red">
              Withdrawal Failed!<br></br>Possible Error:<br></br> 1. You have
              withdraw today.<br></br>2. Low balance
            </p>
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
              <h5 className="mt-16 text-surface">Withdrawal amount</h5>
              <h1 className="mt-8 text-primary">USDT {amount}</h1>
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
