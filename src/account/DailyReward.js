import { useEffect, useState } from "react";

export default function DailyReward() {
  const api_link = "https://trade-buddy-e63f6f3dce63.herokuapp.com/api/";
  const [address, setAddress] = useState(null);
  const [dailyData, setDailyData] = useState([]);

  /////////////////////////////
  useEffect(() => {
    console.log("Rendering DailyReward");
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const userInfo = JSON.parse(userStr);
        setAddress(userInfo?.publicKey || null);
      }
    } catch (e) {
      console.error("Failed to parse localStorage user:", e);
    }
  }, []);

  useEffect(() => {
    console.log(address);
    if (!address) {
      console.log("No address found, skipping fetch");
      return;
    }
    async function getData() {
      try {
        let url = api_link + "getDailyRewardList/" + address;
        const result = await fetch(url);
        const reData = await result.json();
        setDailyData(reData.data);
        console.log(reData.data[0].STATUS);
      } catch (e) {
        console.log(e);
        return;
      }
    }
    getData();
  }, [address]);
  return (
    <>
      <div className="pb-16 mb-16">
        <div className="tf-container">
          <div className="mt-4 text-center">
            <div className="mt-8">
              <h5 className="d-inline-block">Crypto Purchasing Rewards</h5>
            </div>
          </div>
          <div className="mt-2">
            <div className="tab-content mt-16 mb-16">
              {dailyData.length > 0 ? (
                dailyData[0].STATUS === "OK" ? (
                  <ul>
                    {dailyData.map((data) => (
                      <li key={data.member_sl} className="line-bt">
                        <a href="#" className="coin-item style-2 gap-12">
                          <i
                            class="icon-star text-warning"
                            style={{ fontSize: 18 }}
                          ></i>
                          <div className="content">
                            <div className="title">
                              <p className="mb-4 text-zsmall">{data.DETAILS}</p>
                            </div>
                            <div className="align-items-center">
                              <p className="text-xsmall">
                                {new Date(data.DATES).toLocaleDateString(
                                  "en-GB",
                                  {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  }
                                )}
                              </p>

                              <p className="coin-btn increase">Credited</p>
                            </div>
                          </div>
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : dailyData[0].STATUS === "ON" ? (
                  <div
                    className="mt-5"
                    style={{
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: 38, fontWeight: 700 }}>👍</div>
                    <div
                      className="mt-10 text-warning"
                      style={{ fontSize: 22, fontWeight: 700 }}
                    >
                      Just Activated
                    </div>
                    <div style={{ marginTop: 6, opacity: 0.8 }}>
                      You'll get reward from tomorrow.
                    </div>
                  </div>
                ) : (
                  <div
                    className="mt-5"
                    style={{
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: 18, fontWeight: 500 }}>
                      Opps! You Missed The Opportunity
                    </div>
                    <div
                      className="mt-10 text-warning"
                      style={{ fontSize: 22, fontWeight: 700 }}
                    >
                      😕 Not Subscribed?
                    </div>
                    <div style={{ marginTop: 6, opacity: 0.8 }}>
                      You can start with our minimum packages.
                    </div>
                  </div>
                )
              ) : (
                "Loading..."
              )}
            </div>
          </div>
        </div>
      </div>
      <br></br>
      <br></br>
    </>
  );
}
