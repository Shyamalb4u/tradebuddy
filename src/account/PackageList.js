import { useNavigate } from "react-router-dom";
export default function PackageList() {
  const navigate = useNavigate();
  function onBackClick() {
    navigate("/home");
  }
  function onBuy() {
    navigate("/buy-package");
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
              <h3 className="d-inline-block">Choose Your Package</h3>
            </div>
          </div>
          <ul className="mt-20">
            <li>
              <p
                className="accent-box item-check-style3 bg-menuDark"
                onClick={onBuy}
              >
                <label
                  htmlFor="radio1"
                  className="content d-flex justify-content-between"
                >
                  <div className="flex-grow-1">
                    <h5 className="mt-8 d-flex align-items-center gap-4">
                      <i className="icon-wallet icon"></i> Essential
                    </h5>
                    <span className="text-small">
                      Daily <b>1-2</b> tips, 1 Portfolio Reward, Community
                      Reward
                    </span>
                  </div>
                  <h5 className="text-center text-primary">
                    $50<br></br>
                    <span className="text-small">to</span> <br></br>$450
                  </h5>
                </label>
              </p>
            </li>
            <li className="mt-12">
              <p
                className="accent-box item-check-style3 bg-menuDark"
                onClick={onBuy}
              >
                <label
                  for="radio1"
                  className="content d-flex justify-content-between"
                >
                  <div className="flex-grow-1">
                    <h5 className="mt-8 d-flex align-items-center gap-4">
                      <i className="icon-wallet icon"></i> Pro
                    </h5>
                    <span className="text-small">
                      Daily <b>1-5</b> tips, 1 Portfolio Reward, Community
                      Reward
                    </span>
                  </div>
                  <h5 className="text-center text-primary">
                    $500<br></br>
                    <span className="text-small">to</span> <br></br>$950
                  </h5>
                </label>
              </p>
            </li>
            <li className="mt-12">
              <p
                className="accent-box item-check-style3 bg-menuDark"
                onClick={onBuy}
              >
                <label
                  for="radio1"
                  className="content d-flex justify-content-between"
                >
                  <div className="flex-grow-1">
                    <h5 className="mt-8 d-flex align-items-center gap-4">
                      <i className="icon-wallet icon"></i> Elite
                    </h5>
                    <span className="text-small">
                      Daily <b>1-10</b> tips, 1 Portfolio Reward, Community
                      Reward
                    </span>
                  </div>
                  <h5 className="text-center text-primary">
                    $1000<br></br>
                    <span className="text-small">and</span> <br></br>Above
                  </h5>
                </label>
              </p>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
