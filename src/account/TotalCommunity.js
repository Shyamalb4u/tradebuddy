import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TotalCommunity() {
  const navigate = useNavigate();
  const api_link = "https://trade-buddy-e63f6f3dce63.herokuapp.com/api/";
  const userInfo = JSON.parse(localStorage.getItem("user"));
  const address = userInfo.publicKey;
  const [packageData, setPackageData] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    async function getPackages() {
      try {
        let url = api_link + "getDownline/" + address;
        const result = await fetch(url);
        const reData = await result.json();
        setPackageData(reData.data);
        if (reData.data.length > 0) {
          const totalAmount = reData.data.reduce(
            (sum, item) => sum + Number(item.amount || 0),
            0
          );
          setTotal(totalAmount);
        }
      } catch (e) {
        console.log("Error!");
        return;
      }
    }
    getPackages();
  }, [address]);
  function onBackClick() {
    navigate("/menu");
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
          <div className="mt-32 text-center">
            <div className="mt-8">
              <h3 className="d-inline-block">Network Community</h3>
              <span className="text-xsmall">(10th Level)</span>
            </div>
            <span className="text-small">Total Subscription : ${total}</span>
          </div>
          <div className="mt-20">
            <div className="tab-content mt-16 mb-16">
              {packageData ? (
                <>
                  <ul>
                    {packageData.map((data, index) => (
                      <li key={data.Activation_sl} className="line-bt">
                        <a href="#" className="coin-item style-2 gap-12">
                          <span className="text-small">{index + 1}</span>
                          <div className="content">
                            <div className="title">
                              <p className="mb-4 text-button">
                                UID : {data.CODES}{" "}
                                <span className="text-xsmall text-warning">
                                  Level {data.lvl}
                                </span>
                              </p>
                              <span className="text-secondary">
                                {data.NAMES}
                              </span>
                            </div>
                            <div className="d-flex align-items-center gap-12">
                              <span className="text-small">{data.DATES}</span>
                              <span
                                className={`coin-btn ${
                                  data.amount > 0 ? "increase" : "decrease"
                                }`}
                              >
                                ${data.amount}
                              </span>
                            </div>
                          </div>
                        </a>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
