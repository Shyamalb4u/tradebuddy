import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
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
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isBusi, setIsBusi] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const validateEmail = (email) => {
    // simple regex for email check
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };
  const hideModal = () => {
    // console.log("hide clicked");
    const modalEl = document.getElementById("messageModal");
    const modal =
      window.bootstrap.Modal.getInstance(modalEl) ||
      new window.bootstrap.Modal(modalEl);
    modal.hide();
  };
  async function onLogin() {
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
    if (password.length < 6) {
      setIsBusi(false);
      setErrorMessage("Minimum Password Length 6");
      const modalEl = document.getElementById("messageModal");
      const modal = new window.bootstrap.Modal(modalEl);
      modal.show();
      return;
    }
    try {
      let url =
        api_link + "login/" + mail.trim() + "/" + encodeURIComponent(password);
      console.log(url);
      const result = await fetch(url);
      const reData = await result.json();

      if (reData.data[0].CODES == "NO") {
        setIsBusi(false);
        setErrorMessage("Invalid Credintial");
        new window.bootstrap.Modal(
          document.getElementById("messageModal")
        ).show();
        return;
      } else {
        setIsBusi(false);
        const uid = reData.data[0].CODES;
        const name = reData.data[0].NAMES;
        const publicKey = reData.data[0].publicKey;
        const phrases = reData.data[0].phrases;
        const user = {
          id: uid,
          name: name,
          publicKey: publicKey,
          phrases: phrases,
        };
        localStorage.setItem("user", JSON.stringify(user));
        navigate("/home");
      }
    } catch (e) {
      setIsBusi(false);
      console.log("Error");
      return;
    }
  }
  function onNewAccount() {
    navigate("/signup");
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
              <h3 className="mt-20">Login To Account</h3>
            </p>
            <div className="mt-16">
              <fieldset className="mt-16">
                <label className="label-ip">
                  <p className="mb-8 text-small"> Email</p>
                  <input
                    type="text"
                    placeholder="Example@gmail"
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
              <fieldset className="mt-16 mb-12">
                <label className="label-ip">
                  <p className="mb-8 text-small">Password</p>
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
              {isBusi ? (
                ""
              ) : (
                <a href="/" className="text-secondary">
                  Forgot Password?
                </a>
              )}
              <div className="inner-bar d-flex justify-content-center">
                {isBusi ? (
                  <img
                    src="/images/magnify.gif"
                    alt="Loading.."
                    className="img_wait"
                  />
                ) : (
                  <button className="mt-20" onClick={onLogin}>
                    Login
                  </button>
                )}
              </div>
              {isBusi ? (
                ""
              ) : (
                <p className="mt-20 text-center text-small">
                  Create a new Account? &ensp;{" "}
                  <label className="text-white" onClick={onNewAccount}>
                    Sign up
                  </label>
                </p>
              )}
            </div>
            <p className="mt-20 text-center text-small">
              © 2025 Trade Buddy. tradebuddy.biz
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
