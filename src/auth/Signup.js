import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { ethers } from "ethers";

const POLYGON_RPC = "https://polygon-rpc.com";

export default function Signup() {
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

  ////////////////////
  // function createWallet() {
  //   const w = ethers.Wallet.createRandom();
  //   setMnemonic(w.mnemonic?.phrase || "");
  //   setPrivateKey(w.privateKey);
  //   setAddress(w.address);
  //   setWallet(w.connect(provider));
  // }
  const hideModal = () => {
    console.log("hide clicked");
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
    //console.log(refer, name, mobile, mail, password);
    if (refer.length < 6) {
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
        setErrorMessage("Invalid Referral ID");
        new window.bootstrap.Modal(
          document.getElementById("messageModal")
        ).show();
        return;
      }
    } catch (e) {
      console.log(e);
      return;
    }

    if (name.length < 4) {
      setErrorMessage("Enter Full Name");
      const modalEl = document.getElementById("messageModal");
      const modal = new window.bootstrap.Modal(modalEl);
      modal.show();
      return;
    }
    if (mobile.length < 10) {
      setErrorMessage("Invalid Mobile No");
      const modalEl = document.getElementById("messageModal");
      const modal = new window.bootstrap.Modal(modalEl);
      modal.show();
      return;
    }
    if (!validateEmail(mail)) {
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
        setErrorMessage(`Mail ID ${mail} already exist. Try with another mail`);
        new window.bootstrap.Modal(
          document.getElementById("messageModal")
        ).show();
        return;
      }
    } catch (e) {
      console.log(e);
      return;
    }
    if (password.length < 6) {
      setErrorMessage("Minimum Password Length 6");
      const modalEl = document.getElementById("messageModal");
      const modal = new window.bootstrap.Modal(modalEl);
      modal.show();
      return;
    }
    if (!validatePassword(password)) {
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
      console.log(reData);
      navigate("/home");
    } catch (error) {
      console.log(error);
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
                    type="text"
                    value={refer}
                    onChange={(e) => setRefer(e.target.value)}
                    maxLength={6}
                  />
                </label>
              </fieldset>
              <fieldset className="mt-16">
                <label className="label-ip">
                  <p className="mb-8 text-small"> Name</p>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={25}
                  />
                </label>
              </fieldset>
              <fieldset className="mt-16">
                <label className="label-ip">
                  <p className="mb-8 text-small"> Mobile No.</p>
                  <PhoneInput
                    country={"in"} // default country India
                    value={mobile}
                    onChange={(val) => setMobile(val)}
                    inputClass="react-tel-input"
                    inputProps={{
                      required: true,
                      name: "phone",
                      autoFocus: true,
                      maxLength: 16,
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
                    placeholder="Example@gmail"
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
                      type="password"
                      required
                      placeholder="Your password"
                      className="password-field"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      maxLength={15}
                    />
                    <span className="show-pass">
                      <i className="icon-view"></i>
                      <i className="icon-view-hide"></i>
                    </span>
                  </div>
                </label>
              </fieldset>

              <button className="mt-20" onClick={onSignup}>
                Login
              </button>
              <p className="mt-20 text-center text-small">
                Already have a Account? &ensp;{" "}
                <label className="text-white" onClick={onLogin}>
                  Login
                </label>
              </p>
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
