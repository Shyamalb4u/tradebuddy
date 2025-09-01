import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { format } from "date-fns";

export default function Profile() {
  const api_link = "https://trade-buddy-e63f6f3dce63.herokuapp.com/api/";
  const navigate = useNavigate();

  const [refer, setRefer] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [mail, setMail] = useState("");
  const [regDate, setRegDate] = useState("");

  const userInfo = JSON.parse(localStorage.getItem("user"));
  const uid = userInfo.id;

  async function getProfile() {
    console.log(uid);
    try {
      let url = api_link + "getUser/" + uid;
      const result = await fetch(url);
      const reData = await result.json();

      if (reData.data !== "No Data") {
        setName(reData.data[0].NAMES);
        setRefer(reData.data[0].upCode);
        setMobile(reData.data[0].MOB);
        setMail(reData.data[0].MAIL);
        setRegDate(format(new Date(reData.data[0].DATES), "dd-MMM-yyyy"));
      }
    } catch (e) {
      console.log(e);
      return;
    }
  }
  useEffect(() => {
    getProfile();
  }, []);
  function onBackClick() {
    navigate("/menu");
  }
  function onHomeClick() {
    navigate("/home");
  }
  function onPasswordClick() {
    navigate("/password");
  }
  return (
    <>
      <div className="header fixed-top bg-surface">
        <p className="left back-btn" onClick={onBackClick}>
          <i className="icon-left-btn"></i>
        </p>
        <p className="right" onClick={onHomeClick}>
          <i className="icon-home2 fs-20"></i>
        </p>
      </div>
      <div className="pt-45 pb-16 mt-32">
        <div className="tf-container">
          <ul className="mt-2 pb-2 line-bt">
            {" "}
            <li>
              <h5>Profile</h5>
            </li>
          </ul>
          <ul className="mt-16 pb-12 line-bt">
            <li>
              <h6 className="mt-16 d-flex justify-content-between align-items-center">
                <p className="text-large">UID</p>
                <span className="text-secondary d-flex gap-8 align-items-center menu-text">
                  {uid}
                </span>
              </h6>
            </li>
            <li>
              <h6 className="mt-16 d-flex justify-content-between align-items-center">
                <p className="text-small">Name</p>
                <span className="text-secondary d-flex gap-8 align-items-center">
                  {name}
                </span>
              </h6>
            </li>
            <li>
              <h6 className="mt-16 d-flex justify-content-between align-items-center">
                <p className="text-small">Introducer</p>
                <span className="text-secondary d-flex gap-12 align-items-center">
                  {refer}
                </span>
              </h6>
            </li>
            <li>
              <h6 className="mt-16 d-flex justify-content-between align-items-center">
                <p className="text-small">Mail</p>
                <span className="text-secondary d-flex gap-12 align-items-center">
                  {mail}
                </span>
              </h6>
            </li>
            <li>
              <h6 className="mt-16 d-flex justify-content-between align-items-center">
                <p className="text-small">Contact</p>
                <span className="text-secondary d-flex gap-12 align-items-center">
                  {mobile}
                </span>
              </h6>
            </li>
            <li>
              <h6 className="mt-16 d-flex justify-content-between align-items-center">
                <p className="text-small">Regd. date</p>
                <span className="text-secondary d-flex gap-12 align-items-center">
                  {regDate}
                </span>
              </h6>
            </li>
          </ul>
          <ul className="mt-16 pb-16">
            <li>
              <h5>Setting</h5>
            </li>
            <li>
              <h6
                className="mt-16 d-flex justify-content-between align-items-center"
                onClick={onPasswordClick}
              >
                <p className="text-small">Change Password</p>
                <span className="icon-arr-right text-secondary fs-12"></span>
              </h6>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
