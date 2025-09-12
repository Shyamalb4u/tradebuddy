import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
export default function ClassRoom() {
  const navigate = useNavigate();
  const [currentVideo, setCurrentVideo] = useState("/Cryptocurrency_Basic.mp4");
  const videoRef = useRef(null);
  function onNavigate(pth) {
    navigate("/" + pth);
  }
  function handleVideoChange(videoPath) {
    setCurrentVideo(videoPath);
    // Scroll to video
    if (videoRef.current) {
      videoRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
  return (
    <>
      <div className="header fixed-top bg-surface d-flex justify-content-center align-items-center">
        <p className="left back-btn" onClick={() => onNavigate("menu")}>
          <i className="icon-left-btn"></i>
        </p>
      </div>
      <div ref={videoRef} className="pt-45 pb-16 mt-16">
        <div className="bg-menuDark tf-container">
          <div className="pt-12 pb-12 mt-4">
            <video
              key={currentVideo}
              width="100%"
              autoPlay
              controls
              controlsList="nodownload"
            >
              <source src={currentVideo} type="video/mp4" />
            </video>
          </div>
        </div>
      </div>
      <div className="pt-6 pb-16 mt-16">
        <div className="bg-menuDark tf-container">
          <div className="pt-12 pb-12 mt-4">
            <img
              src="/images/video-1.jpg"
              alt="img"
              onClick={() => handleVideoChange("/Cryptocurrency_Basic.mp4")}
            />
          </div>
        </div>
      </div>
      <div className="pt-6 pb-16 mt-16">
        <div className="bg-menuDark tf-container">
          <div className="pt-12 pb-12 mt-4">
            <img
              src="/images/video-2.jpg"
              alt="img"
              onClick={() => handleVideoChange("/NFT_Basic.mp4")}
            />
          </div>
        </div>
      </div>
      <div className="pt-6 pb-16 mt-16">
        <div className="bg-menuDark tf-container">
          <div className="pt-12 pb-12 mt-4">
            <img
              src="/images/video-3.jpg"
              alt="img"
              onClick={() => handleVideoChange("/Blockchain.mp4")}
            />
          </div>
        </div>
      </div>
      <div className="pt-6 pb-16 mt-16">
        <div className="bg-menuDark tf-container">
          <div className="pt-12 pb-12 mt-4">
            <img
              src="/images/video-4.jpg"
              alt="img"
              onClick={() => handleVideoChange("/Cryptocurrency_work.mp4")}
            />
          </div>
        </div>
      </div>
      <div className="pt-6 pb-16 mt-16">
        <div className="bg-menuDark tf-container">
          <div className="pt-12 pb-12 mt-4">
            <img
              src="/images/video-5.jpg"
              alt="img"
              onClick={() => handleVideoChange("/Blockchain_work.mp4")}
            />
          </div>
        </div>
      </div>
    </>
  );
}
