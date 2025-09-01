import React, { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useNavigate } from "react-router-dom";
export default function ReceivingQR() {
  const userInfo = JSON.parse(localStorage.getItem("user"));
  const address = userInfo.publicKey;
  const navigate = useNavigate();
  function onBackClick() {
    navigate("/home");
  }
  const qrRef = useRef();
  const handleShare = async () => {
    try {
      const canvas = qrRef.current.querySelector("canvas");
      canvas.toBlob(async (blob) => {
        const file = new File([blob], "qrcode.png", { type: "image/png" });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: "Crypto Wallet QR Code",
            text: `Send Token Using Polygon Network To Wallet Address: ${address}`,
            files: [file],
          });
        } else {
          alert(
            "Sharing not supported on this browser. Use WhatsApp Web share link instead."
          );
        }
      });
    } catch (err) {
      console.error("Share failed:", err);
    }
  };
  return (
    <>
      <div className="header fixed-top bg-surface d-flex justify-content-center align-items-center">
        <p className="left back-btn" onClick={onBackClick}>
          <i className="icon-left-btn"></i>
        </p>
        <h3>Receive Token</h3>
      </div>
      <div className="pt-45 pb-16 d-flex justify-content-center mt-20">
        <div className="tf-container">
          <h3 className="mt-20 text-center">Your QR Code</h3>
          <div className="mt-40">
            <div ref={qrRef} className="banner-qr">
              <QRCodeCanvas value={address} size={250} includeMargin={true} />
              {/* <img src="/images/banner/banner-qrcode.png" alt="img" /> */}
            </div>
            <h5 className="mt-20 text-center">Polygon Network</h5>
          </div>
        </div>
      </div>
      <div className="menubar-footer footer-fixed bg-surface">
        <div className="inner-bar d-flex justify-content-center">
          <p className="tf-btn lg primary" onClick={handleShare}>
            Share Via Whats App
          </p>
        </div>
      </div>
    </>
  );
}
