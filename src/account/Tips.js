import { useNavigate } from "react-router-dom";
export default function Tips() {
  const navigate = useNavigate();
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
          <div className="accent-box-v5 bg-menuDark active mb-8">
            <span className="icon-box bg-icon1">
              <i className="icon-book"></i>
            </span>
            <div className="mt-12">
              <a href="#" className="text-small">
                Set up your wallet
              </a>
              <p className="mt-4">
                Click Create and set up your collection. Add social links, a
                description, profile & banner images, and set a secondary sales
                fee.
              </p>
            </div>
          </div>
          <div className="accent-box-v5 bg-menuDark active mb-8">
            <span className="icon-box bg-icon1">
              <i className="icon-book"></i>
            </span>
            <div className="mt-12">
              <a href="#" className="text-small">
                Set up your wallet
              </a>
              <p className="mt-4">
                Click Create and set up your collection. Add social links, a
                description, profile & banner images, and set a secondary sales
                fee.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
