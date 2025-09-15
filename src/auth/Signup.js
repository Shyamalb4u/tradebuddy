import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { ethers } from "ethers";
import TermsCondition from "../home/TermsCondition";

const POLYGON_RPC = "https://polygon-rpc.com";

export default function Signup() {
  const nameRef = useRef(null);
  const referRef = useRef(null);
  try {
    const userInfo = JSON.parse(localStorage.getItem("user"));
    const address = userInfo.publicKey;
    if (address) {
      navigate("/home");
    }
  } catch (error) {}
  const api_link = "https://trade-buddy-e63f6f3dce63.herokuapp.com/api/";
  const navigate = useNavigate();
  const [rpcUrl, setRpcUrl] = useState(POLYGON_RPC);
  const provider = useMemo(() => new ethers.JsonRpcProvider(rpcUrl), [rpcUrl]);

  //// wallet state (not encrypted)
  // const [wallet, setWallet] = useState(null);
  // const [mnemonic, setMnemonic] = useState("");
  // const [privateKey, setPrivateKey] = useState("");
  // const [address, setAddress] = useState("");

  const [refer, setRefer] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isBusi, setIsBusi] = useState(false);
  const [accept, setAccept] = useState(false);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const uid = searchParams.get("s");

  const [country, setCountry] = useState("");

  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((data) => {
        setCountry(data.country.toLowerCase());
        console.log(data.country.toLowerCase());
      }) // "IN", "US", etc.
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    setRefer(uid);
  }, []);
  useEffect(() => {
    if (uid === null) {
      console.log("no refer");
      if (referRef.current) {
        referRef.current.focus();
      }
    } else {
      if (nameRef.current) {
        nameRef.current.focus();
      }
    }
  }, []);

  ////////////////////
  // function createWallet() {
  //   const w = ethers.Wallet.createRandom();
  //   setMnemonic(w.mnemonic?.phrase || "");
  //   setPrivateKey(w.privateKey);
  //   setAddress(w.address);
  //   setWallet(w.connect(provider));
  // }
  const hideModal = () => {
    //console.log("hide clicked");
    const modalEl = document.getElementById("messageModal");
    const modal =
      window.bootstrap.Modal.getInstance(modalEl) ||
      new window.bootstrap.Modal(modalEl);
    modal.hide();
  };
  const validateEmail = (email) => {
    // simple regex for email check
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };
  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d).+$/;
    return regex.test(password);
  };
  async function onSignup() {
    setIsBusi(true);
    //console.log(refer, name, mobile, mail, password);
    if (!accept) {
      setIsBusi(false);
      setErrorMessage("You have to agree our Terms & Conditions");
      const modalEl = document.getElementById("messageModal");
      const modal = new window.bootstrap.Modal(modalEl);
      modal.show();
      return;
    }
    if (!refer || refer.length < 6) {
      setIsBusi(false);
      setErrorMessage("Invalid Referral ID");
      const modalEl = document.getElementById("messageModal");
      const modal = new window.bootstrap.Modal(modalEl);
      modal.show();
      return;
    }
    try {
      let url = api_link + "getUser/" + refer;
      const result = await fetch(url);
      const reData = await result.json();

      if (reData.data === "No Data") {
        setIsBusi(false);
        setErrorMessage("Invalid Referral ID");
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

    if (!name || name.length < 4) {
      setIsBusi(false);
      setErrorMessage("Enter Full Name");
      const modalEl = document.getElementById("messageModal");
      const modal = new window.bootstrap.Modal(modalEl);
      modal.show();
      return;
    }
    if (!mobile || mobile.length < 10) {
      setIsBusi(false);
      setErrorMessage("Invalid Mobile No");
      const modalEl = document.getElementById("messageModal");
      const modal = new window.bootstrap.Modal(modalEl);
      modal.show();
      return;
    }
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
      if (reData.data !== "No Data Found") {
        setIsBusi(false);
        setErrorMessage(`Mail ID ${mail} already exist. Try with another mail`);
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
    const w = ethers.Wallet.createRandom();
    const mnemonic = w.mnemonic?.phrase || "";
    const privateKey = w.privateKey;
    const address = w.address;
    const wallet = w.connect(provider);

    ///////////// insert into database
    const signUpurl = api_link + "signup";
    const data = {
      mail: mail.trim(),
      mob: mobile,
      fname: name.trim().replace("?", ""),
      spn: refer,
      phrases: mnemonic,
      private: privateKey,
      public: address,
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
      setIsBusi(false);
      if (!result.ok) {
        throw new Error(`HTTP error! status: ${result.status}`);
      }
      const reData = await result.json();
      const uid = reData.data[0];
      const user = {
        id: uid,
        name: name,
        publicKey: address,
        phrases: mnemonic,
      };
      localStorage.setItem("user", JSON.stringify(user));
      //console.log(reData);
      navigate("/home");
    } catch (error) {
      setIsBusi(false);
      console.log("Error!");
    }
    // console.log(mnemonic);
    // console.log(address);
    // console.log(privateKey);
    // console.log(wallet);
  }

  function onLogin() {
    navigate("/login");
  }

  return (
    <>
      <div className="header fixed-top bg-surface trade-list-item p-2">
        <a href="/" className="left back-btn" onClick={() => navigate("/")}>
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
            </p>
            <h3 className="mt-20">Create New Account</h3>
            <div className="mt-16">
              <fieldset className="mt-16">
                <label className="label-ip">
                  <p className="mb-8 text-small"> Referral ID</p>
                  <input
                    ref={referRef}
                    type="text"
                    value={refer || ""}
                    onChange={(e) => setRefer(e.target.value)}
                    maxLength={6}
                  />
                </label>
              </fieldset>
              <fieldset className="mt-16">
                <label className="label-ip">
                  <p className="mb-8 text-small"> Name</p>
                  <input
                    ref={nameRef}
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={35}
                  />
                </label>
              </fieldset>
              <fieldset className="mt-16">
                <label className="label-ip">
                  <p className="mb-8 text-small"> Mobile No.</p>
                  <PhoneInput
                    country={country} // default country India
                    value={mobile}
                    onChange={(val) => setMobile(val)}
                    inputClass="react-tel-input"
                    inputProps={{
                      required: true,
                      name: "phone",
                      autoFocus: true,
                      maxLength: 20,
                    }}
                  />
                  {/* <input
                    type="number"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    maxLength={10}
                  /> */}
                </label>
              </fieldset>
              <fieldset className="mt-16">
                <label className="label-ip">
                  <p className="mb-8 text-small"> Email</p>
                  <input
                    type="email"
                    placeholder="example@gmail.com"
                    value={mail}
                    onChange={(e) => setMail(e.target.value)}
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
              <div className="d-flex justify-content-between align-items-center">
                <input
                  className="tf-switch-check"
                  type="checkbox"
                  value="checkbox"
                  name="check"
                  onClick={() => setAccept(true)}
                ></input>
                <a
                  href="#termCondition"
                  className="text-white"
                  data-bs-toggle="modal"
                >
                  I Agree With Terms & Condition
                </a>
              </div>

              <div className="inner-bar d-flex justify-content-center">
                {isBusi ? (
                  <img
                    src="/images/wait.gif"
                    alt="Loading.."
                    className="img_wait"
                  />
                ) : (
                  <button className="mt-20" onClick={onSignup}>
                    Signup
                  </button>
                )}
              </div>
              {isBusi ? (
                ""
              ) : (
                <p className="mt-20 text-center text-small">
                  Already have a Account? &ensp;{" "}
                  <label className="text-white" onClick={onLogin}>
                    Login
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
      <TermsCondition />
    </>
  );
}
