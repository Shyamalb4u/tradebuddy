import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Tips() {
  const navigate = useNavigate();
  const api_link = "https://trade-buddy-e63f6f3dce63.herokuapp.com/api/";
  const userInfo = JSON.parse(localStorage.getItem("user"));
  const address = userInfo.publicKey;
  const [tipsData, setTipsData] = useState([]);

  useEffect(() => {
    async function getTipsData() {
      try {
        let url = api_link + "getTips/" + address;
        const result = await fetch(url);
        const reData = await result.json();

        if (reData.data !== "No Data") {
          setTipsData(reData.data);
        }
      } catch (e) {
        console.log("Error!");
        return;
      }
    }
    getTipsData();
  }, []);

  function onBackClick() {
    navigate("/home");
  }
  return (
    <>
      <div className="header fixed-top bg-surface d-flex justify-content-center align-items-center">
        <p className="left back-btn" onClick={onBackClick}>
          <i className="icon-left-btn"></i>
        </p>
      </div>
      <div className="pt-45 pb-16">
        <div className="tf-container">
          <div className="mt-32 text-center mb-12">
            <div className="mt-8">
              <h3 className="d-inline-block">Trading Tips</h3>
            </div>
          </div>

          {tipsData
            ? tipsData.map((data) => (
                <div className="accent-box-v5 bg-menuDark active mb-8">
                  <div className="content d-flex justify-content-between">
                    <span className="icon-box bg-icon1 text-primary">
                      <i className="icon-earn"></i>
                    </span>
                    <p className="text-white">{data.dates}</p>
                  </div>

                  <div className="mt-12">
                    <p className="text-small text-white">{data.heading}</p>
                    <p className="mt-4" style={{ whiteSpace: "pre-line" }}>
                      {data.details}
                    </p>
                  </div>
                </div>
              ))
            : ""}
        </div>
      </div>
    </>
  );
}
