import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Menu() {
  const api_link = "https://trade-buddy-e63f6f3dce63.herokuapp.com/api/";
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("user"));
  const name = userInfo.name;
  const uid = userInfo.id;

  const [active, setIsActive] = useState("Inactive");
  const [admin, setAdmin] = useState("NO");

  useEffect(() => {
    async function getProfile() {
      // console.log(uid);
      try {
        let url = api_link + "getUser/" + uid;
        const result = await fetch(url);
        const reData = await result.json();

        if (reData.data !== "No Data") {
          setIsActive(reData.data[0].ACTIVATION_STATUS);
          setAdmin(reData.data[0].IS_ADMIN);
        }
      } catch (e) {
        console.log("Error!");
        return;
      }
    }
    getProfile();
  }, [uid]);

  function onNavigate(pth) {
    //console.log("/" + pth);
    navigate("/" + pth);
  }
  function logout() {
    const modalEl = document.getElementById("logout");
    const modal =
      window.bootstrap.Modal.getInstance(modalEl) ||
      new window.bootstrap.Modal(modalEl);
    modal.hide();
    localStorage.clear();
    navigate("/");
  }
  return (
    <>
      <div className="header fixed-top bg-surface d-flex justify-content-center align-items-center">
        <p className="left back-btn" onClick={() => onNavigate("home")}>
          <i className="icon-left-btn"></i>
        </p>
        <p className="right" onClick={() => onNavigate("home")}>
          <i className="icon-home2 fs-20"></i>
        </p>
        {/* <span
          className="right text-button mt-8 d-inline-block text-red fw-6"
          data-bs-toggle="modal"
          data-bs-target="#logout"
        >
          Log out
        </span> */}
        {/* <a href="/" className="right text-secondary">
          <i className="icon-close"></i>
        </a> */}
      </div>
      <div className="pt-45 pb-16 mt-16">
        <div className="bg-menuDark tf-container">
          <p
            onClick={() => onNavigate("profile")}
            className="pt-12 pb-12 mt-4 d-flex justify-content-between align-items-center"
          >
            <div className="box-account">
              <img src="/logo192.png" alt="img" className="avt" />
              <div className="info">
                <h5>{name}</h5>
                <p className="text-small text-secondary mt-8 mb-8">
                  Profile and settings
                </p>
                {active === "Inactive" ? (
                  <p className="tag-xs style-2 round-2 red text-white">Guest</p>
                ) : (
                  <p className="tag-xs style-2 round-2 primary text-white">
                    User
                  </p>
                )}
              </div>
            </div>
            <span className="arr-right">
              <i className="icon-arr-right"></i>
            </span>
          </p>
        </div>
        <div className="bg-menuDark tf-container">
          <div className="pt-12 pb-12 mt-4">
            <h5>Buy Package</h5>
            <ul className="mt-16 grid-3 gap-12">
              <li>
                <p
                  className="tf-list-item d-flex flex-column gap-8 align-items-center text-break text-center text-white"
                  onClick={() => onNavigate("packages")}
                >
                  <i className="icon icon-book"></i>
                  Subscribe
                </p>
              </li>
              <li>
                <p
                  className="tf-list-item d-flex flex-column gap-8 align-items-center text-break text-center text-white"
                  onClick={() => onNavigate("my-packages")}
                >
                  <i className="icon icon-grid-nine"></i>
                  My Packages
                </p>
              </li>
              {admin === "YES" ? (
                <li>
                  <Link
                    to="/send-tips"
                    className="tf-list-item d-flex flex-column gap-8 align-items-center text-break text-center"
                  >
                    <i className="icon icon-way"></i>
                    Send Tips
                  </Link>
                </li>
              ) : (
                ""
              )}
            </ul>
          </div>
        </div>
        <div className="bg-menuDark tf-container">
          <div className="pt-12 pb-12 mt-4">
            <h5>Community</h5>
            <ul className="mt-16 grid-3 gap-12">
              <li>
                <Link
                  to="/direct"
                  className="tf-list-item d-flex flex-column gap-8 align-items-center text-center"
                >
                  <i className="icon icon-globe"></i>
                  Direct Community
                </Link>
              </li>
              <li>
                <Link
                  to="/community"
                  className="tf-list-item d-flex flex-column gap-8 align-items-center text-center"
                >
                  <i className="icon icon-graph"></i>
                  Network Community
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="bg-menuDark tf-container">
          <div className="pt-12 pb-12 mt-4">
            <h5>Reward & Bonus</h5>
            <ul className="mt-16 grid-3 gap-12">
              <li>
                <Link
                  to="/dr-reward"
                  className="tf-list-item d-flex flex-column gap-8 align-items-center text-break text-center"
                >
                  <i className="icon icon-bank"></i>
                  DR Tips Reward
                </Link>
              </li>
              <li>
                <Link
                  to="/level-reward"
                  className="tf-list-item d-flex flex-column gap-8 align-items-center text-break text-center"
                >
                  <i className="icon icon-fileText"></i>
                  Community Reward
                </Link>
              </li>
              <li>
                <Link
                  to="/upline-bonus"
                  className="tf-list-item d-flex flex-column gap-8 align-items-center text-break text-center"
                >
                  <i className="icon icon-fileText"></i>
                  Upline Bonus
                </Link>
              </li>
              <li>
                <Link
                  to="/performance-bonus"
                  className="tf-list-item d-flex flex-column gap-8 align-items-center text-break text-center"
                >
                  <i className="icon icon-fileText"></i>
                  Performance Bonus
                </Link>
              </li>
              <li>
                <Link
                  to="/statement"
                  className="tf-list-item d-flex flex-column gap-8 align-items-center text-break text-center"
                >
                  <i className="icon icon-grid-nine"></i>
                  Statement
                </Link>
              </li>
              <li>
                <Link
                  to="/withdraw-status"
                  className="tf-list-item d-flex flex-column gap-8 align-items-center text-break text-center"
                >
                  <i className="icon icon-way"></i>
                  Withdraw
                </Link>
              </li>
              {admin === "YES" ? (
                <li>
                  <Link
                    to="/unpaid"
                    className="tf-list-item d-flex flex-column gap-8 align-items-center text-break text-center"
                  >
                    <i className="icon icon-way"></i>
                    Pay Unpaid
                  </Link>
                </li>
              ) : (
                ""
              )}
              {/* <li>
                <a
                  href="/"
                  className="tf-list-item d-flex flex-column gap-8 align-items-center text-break text-center"
                >
                  <i className="icon icon-game-control"></i>
                  Simulated trading
                </a>
              </li>
              <li>
                <a
                  href="/"
                  className="tf-list-item d-flex flex-column gap-8 align-items-center text-break text-center"
                >
                  <i className="icon icon-robot"></i>
                  Bot
                </a>
              </li>
              <li>
                <a
                  href="/"
                  className="tf-list-item d-flex flex-column gap-8 align-items-center text-break text-center"
                >
                  <i className="icon icon-database"></i>
                  Copy
                </a>
              </li> */}
            </ul>
          </div>
        </div>

        <div className="bg-menuDark tf-container">
          <Link
            to="/class-room"
            className="pt-12 pb-12 mt-4 d-flex justify-content-between align-items-center"
          >
            <h5>Class Room</h5>
            <span className="arr-right">
              <i className="icon-arr-right"></i>
            </span>
          </Link>
        </div>
        <div className="modal fade modalCenter" id="logout">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content modal-sm">
              <div className="p-16 line-bt">
                <h4 className="text-center">Log Out</h4>
                <p className="mt-12 text-center text-large">
                  Are you sure you want to sign out?
                </p>
              </div>
              <div className="grid-2">
                <p
                  className="line-r text-center text-button fw-6 p-10"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </p>
                <p
                  className="text-center text-button fw-6 p-10 text-red"
                  onClick={logout}
                >
                  Log Out
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
