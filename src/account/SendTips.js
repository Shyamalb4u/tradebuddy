import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SendTips() {
  const api_link = "https://trade-buddy-e63f6f3dce63.herokuapp.com/api/";
  const navigate = useNavigate();
  const [heading, setHeading] = useState("");
  const [details, setDetails] = useState("");
  const [isSending, setIsSending] = useState(false);

  function onBackClick() {
    navigate("/home");
  }
  const hideModal = () => {
    const modalEl = document.getElementById("success");
    const modal =
      window.bootstrap.Modal.getInstance(modalEl) ||
      new window.bootstrap.Modal(modalEl);
    modal.hide();
  };
  async function onSendTips() {
    setIsSending(true);
    if (heading === "") {
      setIsSending(false);
      return;
    }
    if (details === "") {
      setIsSending(false);
      return;
    }
    const buyUpurl = api_link + "sendTips";
    const data = {
      heading: heading,
      details: details,
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
      await sendMessage();
      setHeading("");
      setDetails("");
    } catch (error) {
      setIsSending(false);
      console.log(error);
    }
    setIsSending(false);
    const modalEl = document.getElementById("success");
    const modal = new window.bootstrap.Modal(modalEl);
    modal.show();
  }
  const sendMessage = async () => {
    const buyUpurl = api_link + "sendfcmMsg";
    const data = {};
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
  };
  return (
    <>
      <div className="header fixed-top bg-surface d-flex justify-content-center align-items-center">
        <p className="left back-btn" onClick={onBackClick}>
          <i className="icon-left-btn"></i>
        </p>
        <h3>Trading Tips</h3>
      </div>
      <div className="pt-45 pb-90">
        <div className="tf-container">
          <div className="mt-32 accent-box-v2 bg-menuDark">
            <div className="mt-12">
              <input
                id="heading"
                type="text"
                placeholder="Heading"
                className="bg-surface"
                value={heading}
                onChange={(e) => setHeading(e.target.value)}
              />
            </div>
            <div className="mt-12">
              <textarea
                id="details"
                rows={10}
                placeholder="Tips Details"
                className="bg-surface"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                style={{ height: 350 }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="menubar-footer footer-fixed bg-surface">
        <div className="inner-bar d-flex justify-content-center">
          {isSending ? (
            <img src="/images/wait.gif" alt="Loading.." className="img_wait" />
          ) : (
            <p className="tf-btn lg primary" onClick={onSendTips}>
              Post Tips
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

              <h5 className="mt-16 text-surface">Tips Posted</h5>
            </div>

            <p className="tf-btn lg primary mt-40" onClick={hideModal}>
              Done
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
