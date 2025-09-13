import { useNavigate } from "react-router-dom";
import ScratchCard from "../components/ScratchCard";
import { useEffect, useState } from "react";
import confetti from "canvas-confetti";

export default function DRtips() {
  const navigate = useNavigate();
  const api_link = "https://trade-buddy-e63f6f3dce63.herokuapp.com/api/";
  const userInfo = JSON.parse(localStorage.getItem("user"));
  const address = userInfo.publicKey;
  const [amt, setAmt] = useState(0);
  const [tipToken, setTipToken] = useState("Loading");
  const [isSunday, setIsSunday] = useState(false);

  useEffect(() => {
    let ignore = false;
    async function getTipsData() {
      try {
        if (!ignore) {
          let url = api_link + "getRewardTips/" + address;
          const result = await fetch(url);
          const reData = await result.json();

          if (reData.data !== "No Data") {
            setAmt(reData.data[0].amt);
            setTipToken(reData.data[0].token);
          }
        }
      } catch (e) {
        console.log("Error!");
        return;
      }
    }
    const dayName = new Date(Date.now()).toLocaleDateString("en-US", {
      weekday: "long",
    });
    if (dayName === "Sunday") {
      setIsSunday(true);
    } else {
      //console.log("Called me");
      getTipsData();
    }
    return () => {
      ignore = true; // cleanup avoids second call
    };
  }, []);
  async function insertDRtips() {
    console.log(tipToken);
    confetti({
      particleCount: 200,
      spread: 80,
      origin: { y: 0.6 },
    });
    const buyUpurl = api_link + "insertDReward";
    const data = {
      publicKey: address.trim(),
      token: tipToken,
    };
    const customHeaders = {
      "Content-Type": "application/json",
    };
    try {
      const result = await fetch(buyUpurl, {
        method: "POST",
        headers: customHeaders,
        body: JSON.stringify(data),
      });
      if (!result.ok) {
        throw new Error(`HTTP error! status: ${result.status}`);
      }
    } catch (error) {
      console.log("Error!");
    }
  }
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
          <div className="mt-32 text-center">
            <div className="mt-8">
              <h3 className="d-inline-block">Are you exited?</h3>
              <h5>Here is your today's Reward</h5>
            </div>
          </div>
          <div className="mt-20 d-flex justify-content-center align-items-center">
            {tipToken === "Loading" ? (
              <p className="accent-box item-check-style3 bg-menuDark">
                <h6 className="text-center text-remark">Loading ..... </h6>
              </p>
            ) : amt > 0 ? (
              <ScratchCard
                width={280}
                height={150}
                coverColor="#c5c5c5"
                coverImage="/images/tip-Cover.jpg" // optional
                radius={22}
                percentToFinish={50}
                onComplete={() => insertDRtips()}
              >
                <div
                  style={{
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: 18, fontWeight: 500 }}>
                    🎉 You have got{" "}
                    <span className="text-white">USDT {amt.toFixed(2)}</span>
                  </div>
                  <div
                    className="mt-10 text-primary"
                    style={{ fontSize: 22, fontWeight: 700 }}
                  >
                    Buy {tipToken}
                  </div>
                  <div style={{ marginTop: 6, opacity: 0.8 }}>
                    After buying {tipToken}, hold it until it doubles in value.{" "}
                  </div>
                </div>
              </ScratchCard>
            ) : isSunday ? (
              <p className="accent-box item-check-style3 bg-menuDark">
                <h5 className="text-center text-remark">😴 Opps! </h5>
                <h5 className="text-center text-primary">Sunday Off</h5>
              </p>
            ) : tipToken === "taken" ? (
              <p className="accent-box item-check-style3 bg-menuDark">
                <h5 className="text-center text-remark">👌Happy To See </h5>
                <h5 className="text-center text-primary">
                  Your Reward Credited
                </h5>
              </p>
            ) : tipToken === "just" ? (
              <p className="accent-box item-check-style3 bg-menuDark">
                <h5 className="text-center text-remark">👌Just Activated </h5>
                <h5 className="text-center text-primary">
                  Your Reward Will Apear From Tomorrow
                </h5>
              </p>
            ) : (
              <p className="accent-box item-check-style3 bg-menuDark">
                <h5 className="text-center text-remark">⚠️ Not Subscribed</h5>
                <h5 className="text-center text-primary">Please Subscribe</h5>
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
