import { useNavigate } from "react-router-dom";

export default function Menu() {
  const navigate = useNavigate();
  function onBackClick() {
    navigate("/home");
  }
  function onProfileClick() {
    navigate("/profile");
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
        <p className="left back-btn" onClick={onBackClick}>
          <i className="icon-left-btn"></i>
        </p>
        <span
          className="right text-button mt-8 d-inline-block text-red fw-6"
          data-bs-toggle="modal"
          data-bs-target="#logout"
        >
          Log out
        </span>
        {/* <a href="/" className="right text-secondary">
          <i className="icon-close"></i>
        </a> */}
      </div>
      <div className="pt-45 pb-16 mt-16">
        <div className="bg-menuDark tf-container">
          <p
            onClick={onProfileClick}
            className="pt-12 pb-12 mt-4 d-flex justify-content-between align-items-center"
          >
            <div className="box-account">
              <img src="/logo192.png" alt="img" className="avt" />
              <div className="info">
                <h5>User Name</h5>
                <p className="text-small text-secondary mt-8 mb-8">
                  Profile and settings
                </p>
                <p className="tag-xs style-2 round-2 red text-white">Guest</p>
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
                <a
                  href="/"
                  className="tf-list-item d-flex flex-column gap-8 align-items-center text-break text-center"
                  data-bs-toggle="modal"
                >
                  <i className="icon icon-book"></i>
                  Subscribe
                </a>
              </li>
              <li>
                <a
                  href="/"
                  className="tf-list-item d-flex flex-column gap-8 align-items-center text-break text-center"
                >
                  <i className="icon icon-grid-nine"></i>
                  My Packages
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="bg-menuDark tf-container">
          <div className="pt-12 pb-12 mt-4">
            <h5>Community</h5>
            <ul className="mt-16 grid-3 gap-12">
              <li>
                <a
                  href="/"
                  className="tf-list-item d-flex flex-column gap-8 align-items-center text-center"
                >
                  <i className="icon icon-globe"></i>
                  Direct Community
                </a>
              </li>
              <li>
                <a
                  href="/"
                  className="tf-list-item d-flex flex-column gap-8 align-items-center text-center"
                >
                  <i className="icon icon-graph"></i>
                  Network Community
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="bg-menuDark tf-container">
          <div className="pt-12 pb-12 mt-4">
            <h5>Reward & Bonus</h5>
            <ul className="mt-16 grid-3 gap-12">
              <li>
                <a
                  href="/"
                  className="tf-list-item d-flex flex-column gap-8 align-items-center text-break text-center"
                >
                  <i className="icon icon-bank"></i>
                  Portfolio Reward
                </a>
              </li>
              <li>
                <a
                  href="/"
                  className="tf-list-item d-flex flex-column gap-8 align-items-center text-break text-center"
                >
                  <i className="icon icon-fileText"></i>
                  Community Reward
                </a>
              </li>
              <li>
                <a
                  href="/"
                  className="tf-list-item d-flex flex-column gap-8 align-items-center text-break text-center"
                >
                  <i className="icon icon-fileText"></i>
                  Upline Bonus
                </a>
              </li>
              <li>
                <a
                  href="/"
                  className="tf-list-item d-flex flex-column gap-8 align-items-center text-break text-center"
                >
                  <i className="icon icon-fileText"></i>
                  Performance Bonus
                </a>
              </li>
              <li>
                <a
                  href="/"
                  className="tf-list-item d-flex flex-column gap-8 align-items-center text-break text-center"
                >
                  <i className="icon icon-grid-nine"></i>
                  Statement
                </a>
              </li>
              <li>
                <a
                  href="/"
                  className="tf-list-item d-flex flex-column gap-8 align-items-center text-break text-center"
                >
                  <i className="icon icon-way"></i>
                  Withdraw
                </a>
              </li>
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
          <a
            href="/"
            className="pt-12 pb-12 mt-4 d-flex justify-content-between align-items-center"
          >
            <h5>Class Room</h5>
            <span className="arr-right">
              <i className="icon-arr-right"></i>
            </span>
          </a>
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
