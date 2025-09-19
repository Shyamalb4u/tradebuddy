import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

export default function PasswordRecover() {
  try {
    const userInfo = JSON.parse(localStorage.getItem("user"));
    const address = userInfo.publicKey;
    if (address) {
      navigate("/home");
    }
  } catch (error) {}

  const navigate = useNavigate();
  const api_link = "https://trade-buddy-e63f6f3dce63.herokuapp.com/api/";
  const [mail, setMail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isBusi, setIsBusi] = useState(false);
  const validateEmail = (email) => {
    // simple regex for email check
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };
  const hideModal = (modalID) => {
    // console.log("hide clicked");
    const modalEl = document.getElementById(modalID);
    const modal =
      window.bootstrap.Modal.getInstance(modalEl) ||
      new window.bootstrap.Modal(modalEl);
    modal.hide();
    if (modalID === "successModal") {
      navigate("/login");
    }
  };
  async function onReset() {
    setIsBusi(true);
    if (!validateEmail(mail)) {
      setIsBusi(false);
      setErrorMessage("Invalid Email");
      const modalEl = document.getElementById("messageModal");
      const modal = new window.bootstrap.Modal(modalEl);
      modal.show();
      return;
    }
    try {
      let url = api_link + "getMail/" + mail.trim();
      const result = await fetch(url);
      const reData = await result.json();
      //console.log(reData.data);
      if (reData.data === "No Data Found") {
        setIsBusi(false);
        setErrorMessage(`Mail ID ${mail} not exist. Try with correct mail`);
        new window.bootstrap.Modal(
          document.getElementById("messageModal")
        ).show();
        return;
      }
    } catch (e) {
      setIsBusi(false);
      console.log("Error!");
      return;
    }
    const signUpurl = api_link + "passRecover";
    const data = {
      mail: mail.trim(),
    };
    const customHeaders = {
      "Content-Type": "application/json",
    };
    try {
      const result = await fetch(signUpurl, {
        method: "POST",
        headers: customHeaders,
        body: JSON.stringify(data),
      });

      if (!result.ok) {
        throw new Error(`HTTP error! status: ${result.status}`);
      }
      const reData = await result.json();
    } catch (error) {
      setIsBusi(false);
      console.log("Others Error!");
    }
    setIsBusi(false);
    new window.bootstrap.Modal(document.getElementById("successModal")).show();
  }

  return (
    <>
      <div className="header fixed-top bg-surface trade-list-item p-2">
        <a href="#" class="left back-btn" onClick={() => navigate("/")}>
          <i className="icon-left-btn"></i>
        </a>
      </div>
      <div className="pt-80 pb-20">
        <div className="tf-container">
          <div className="mt-80">
            <p className="text-center mb-20">
              <img
                className="text-center"
                src="/logo.png"
                alt="Trade Buddy Logo"
                style={{ width: 220 }}
              />
              <h3 className="mt-20">Password Recovery</h3>
            </p>
            <div className="mt-16">
              <fieldset className="mt-16">
                <label className="label-ip">
                  <p className="mb-8 text-small">Registered Email</p>
                  <input
                    type="text"
                    placeholder="example@gmail.com"
                    value={mail}
                    onChange={(e) => setMail(e.target.value)}
                    onKeyDown={(e) => {
                      if (["'"].includes(e.key)) {
                        e.preventDefault(); // block the character
                        alert("Character not allowed!");
                      }
                    }}
                    maxLength={30}
                  />
                </label>
              </fieldset>

              <div className="inner-bar d-flex justify-content-center">
                {isBusi ? (
                  <img
                    src="/images/magnify.gif"
                    alt="Loading.."
                    className="img_wait"
                  />
                ) : (
                  <button className="mt-20" onClick={onReset}>
                    Submit
                  </button>
                )}
              </div>
            </div>
            <p className="mt-20 text-center text-small">
              © 2025 Trade Buddy. tradebuddy.biz
            </p>
          </div>
        </div>
      </div>
      <div className="modal fade modalCenter" id="successModal" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content modal-sm">
            <div className="p-16 line-bt">
              <h4 className="text-center">Password Reset Link Sent</h4>
              <p className="mt-12 text-center text-small text-white">
                Please Check Your Mail Inbox / Spam. <br></br>Link Expire in 10
                min.
              </p>
            </div>
            <div className="grid-1">
              <p
                className="line-r text-center text-button fw-6 p-10"
                onClick={() => hideModal("successModal")}
              >
                OK
              </p>
            </div>
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
                onClick={() => hideModal("messageModal")}
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
