import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isBusi, setIsBusi] = useState(false);
  const [params] = useSearchParams();
  const [errorMessage, setErrorMessage] = useState("");
  const token = params.get("token");
  const mail = params.get("email");

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
  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d).+$/;
    return regex.test(password);
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
    if (!password || password.length < 6) {
      setIsBusi(false);
      setErrorMessage("Minimum Password Length 6");
      const modalEl = document.getElementById("messageModal");
      const modal = new window.bootstrap.Modal(modalEl);
      modal.show();
      return;
    }
    if (!validatePassword(password)) {
      setIsBusi(false);
      setErrorMessage("Password Must Have At Least A Letter & A Digit");
      const modalEl = document.getElementById("messageModal");
      const modal = new window.bootstrap.Modal(modalEl);
      modal.show();
      return;
    }
    const signUpurl = api_link + "resetPassword";
    const data = {
      mail: mail.trim(),
      tolen: token,
      pass: password,
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
      console.log(error.response?.data?.error || "Error on change password");
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
              <h3 className="mt-20">Reset Password</h3>
              <h5>Regd. Mail : {mail}</h5>
            </p>
            <div className="mt-16">
              <fieldset className="mt-16 mb-12">
                <label className="label-ip">
                  <p className="mb-8 text-small">New Password</p>
                  <div className="box-auth-pass">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Your password"
                      className="password-field"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={(e) => {
                        if (["'"].includes(e.key)) {
                          e.preventDefault(); // block the character
                          alert("Character not allowed!");
                        }
                      }}
                      maxLength={15}
                    />
                    <span className="show-pass">
                      <i
                        className="icon-view"
                        onClick={() => setShowPassword(!showPassword)}
                      ></i>
                      <i
                        className="icon-view-hide"
                        onClick={() => setShowPassword(!showPassword)}
                      ></i>
                    </span>
                  </div>
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
                Please Check Your Mail Inbox / Spam
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
