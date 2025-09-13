import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

export default function ChangePassword() {
  const userInfo = JSON.parse(localStorage.getItem("user"));
  const uid = userInfo.id;
  const navigate = useNavigate();
  const api_link = "https://trade-buddy-e63f6f3dce63.herokuapp.com/api/";
  const [newPass, setNewPass] = useState("");
  const [rePass, setRepass] = useState("");
  const [isView, setIsView] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [messageHeader, setMessageHeader] = useState("");
  //////////////////
  const hideModal = () => {
    //console.log("hide clicked");
    const modalEl = document.getElementById("messageModal");
    const modal =
      window.bootstrap.Modal.getInstance(modalEl) ||
      new window.bootstrap.Modal(modalEl);
    modal.hide();
  };
  async function onChangePassword() {
    setIsSaving(true);
    if (newPass.length < 6) {
      setIsSaving(false);
      setErrorMessage("Minimum Password Length 6");
      setMessageHeader("Error!");
      const modalEl = document.getElementById("messageModal");
      const modal = new window.bootstrap.Modal(modalEl);
      modal.show();
      return;
    }
    if (newPass !== rePass) {
      setIsSaving(false);
      setErrorMessage("Password Not Matched");
      setMessageHeader("Error!");
      const modalEl = document.getElementById("messageModal");
      const modal = new window.bootstrap.Modal(modalEl);
      modal.show();
      return;
    }
    const signUpurl = api_link + "changePassword";
    const data = {
      uid: uid,
      pass: newPass,
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
        setIsSaving(false);
        setErrorMessage("Password Not Changed");
        setMessageHeader("Error!");
        const modalEl = document.getElementById("messageModal");
        const modal = new window.bootstrap.Modal(modalEl);
        modal.show();
        throw new Error(`HTTP error! status: ${result.status}`);
      } else {
        const reData = await result.json();
        //console.log(reData);
        setIsSaving(false);
        setErrorMessage("Password Change Successful");
        setMessageHeader("Success");
        const modalEl = document.getElementById("messageModal");
        const modal = new window.bootstrap.Modal(modalEl);
        modal.show();
      }
    } catch (error) {
      console.log("Error!");
    }
  }
  function onSusscess() {
    hideModal();
    navigate("/profile");
  }
  function onBackClick() {
    navigate("/profile");
  }
  return (
    <>
      <div className="header fixed-top bg-surface d-flex justify-content-center align-items-center">
        <p className="left back-btn" onClick={onBackClick}>
          <i className="icon-left-btn"></i>
        </p>
        <h3>Change login password</h3>
      </div>
      <div className="pt-45 pb-16 mt-16">
        <div className="tf-container">
          <fieldset className="mt-16">
            <label className="mb-8">New login password</label>
            <div className="box-auth-pass">
              <input
                type={isView ? "text" : "password"}
                required
                placeholder="Enter your new password"
                className="password-field"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                onKeyDown={(e) => {
                  if (["'"].includes(e.key)) {
                    e.preventDefault(); // block the character
                    alert("Character not allowed!");
                  }
                }}
                maxLength={20}
              />
              <span className="show-pass">
                <i className="icon-view" onClick={() => setIsView(!isView)}></i>
                <i
                  className="icon-view-hide"
                  onClick={() => setIsView(!isView)}
                ></i>
              </span>
            </div>
          </fieldset>
          <fieldset className="mt-16">
            <label className="mb-8">Confirm new login password</label>
            <div className="box-auth-pass">
              <input
                type={isView ? "text" : "password"}
                required
                placeholder="Enter your new password"
                className="password-field"
                value={rePass}
                onChange={(e) => setRepass(e.target.value)}
                onKeyDown={(e) => {
                  if (["'"].includes(e.key)) {
                    e.preventDefault(); // block the character
                    alert("Character not allowed!");
                  }
                }}
                maxLength={20}
              />
              <span className="show-pass">
                <i className="icon-view" onClick={() => setIsView(!isView)}></i>
                <i
                  className="icon-view-hide"
                  onClick={() => setIsView(!isView)}
                ></i>
              </span>
            </div>
          </fieldset>
          <h5 className="mt-16">Password Must Contain</h5>
          <ul className="mt-16">
            <li className="d-flex gap-4 align-items-center">
              <input
                type="checkbox"
                className="tf-checkbox style-2"
                id="cb1"
                checked
              />
              <label className="text-small text-white" for="cb1">
                6 - 20 characters long
              </label>
            </li>
            <li className="mt-12 d-flex gap-4 align-items-center">
              <input
                type="checkbox"
                className="tf-checkbox style-2"
                id="cb2"
                checked
              />
              <label className="text-small text-white" for="cb2">
                1 lowercase character
              </label>
            </li>
            <li className="mt-12 d-flex gap-4 align-items-center">
              <input
                type="checkbox"
                className="tf-checkbox style-2"
                id="cb3"
                checked
              />
              <label className="text-small text-white" for="cb3">
                1 uppercase character
              </label>
            </li>
            <li className="mt-12 d-flex gap-4 align-items-center">
              <input
                type="checkbox"
                className="tf-checkbox style-2"
                id="cb4"
                checked
              />
              <label className="text-small text-white" for="cb4">
                1 number
              </label>
            </li>
            <li className="mt-12 d-flex gap-4 align-items-center">
              <input
                type="checkbox"
                className="tf-checkbox style-2"
                id="cb5"
                checked
              />
              <label className="text-small text-white" for="cb5">
                1 symbol
              </label>
            </li>
          </ul>
          <div className="d-flex justify-content-center">
            {isSaving ? (
              <img
                src="/images/wait.gif"
                alt="Loading.."
                className="img_wait"
              />
            ) : (
              <button className="mt-40 tf-btn lg" onClick={onChangePassword}>
                Confirm
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="modal fade modalCenter" id="messageModal" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content modal-sm">
            <div className="p-16 line-bt">
              <h4 className="text-center">{messageHeader}</h4>
              <p className="mt-12 text-center text-large text-red">
                {errorMessage}
              </p>
            </div>
            <div className="grid-1">
              <p
                className="line-r text-center text-button fw-6 p-10"
                onClick={messageHeader === "Error!" ? hideModal : onSusscess}
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
