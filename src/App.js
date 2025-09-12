import { Route, Routes, HashRouter } from "react-router-dom";
import HomePage from "./home/HomePage";
import Signup from "./auth/Signup";
import Home from "./account/Home";
import Menu from "./account/Menu";
import Login from "./auth/Login";
import SendToken from "./account/SendToken";
import ReceivingQR from "./account/ReceivingQR";
import Profile from "./account/Profile";
import ChangePassword from "./account/ChangePassword";
import PackageList from "./account/PackageList";
import BuyPackage from "./account/BuyPackage";
import MyPackages from "./account/MyPackages";
import Tips from "./account/Tips";
import SendTips from "./account/SendTips";
import DRtips from "./account/DRtips";
import Withdraw from "./account/Withdraw";
import DirectCommunity from "./account/DirectCommunity";
import TotalCommunity from "./account/TotalCommunity";
import RDTipsReward from "./account/DRTipsReward";
import CommunityReward from "./account/CommunityReward";
import ClassRoom from "./account/ClassRoom";
import UplineBonus from "./account/UplineBonus";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/sendToken" element={<SendToken />} />
        <Route path="/receiveQR" element={<ReceivingQR />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/password" element={<ChangePassword />} />
        <Route path="/packages" element={<PackageList />} />
        <Route path="/buy-package" element={<BuyPackage />} />
        <Route path="/my-packages" element={<MyPackages />} />
        <Route path="/tips" element={<Tips />} />
        <Route path="/send-tips" element={<SendTips />} />
        <Route path="/dr-tips" element={<DRtips />} />
        <Route path="/withdraw" element={<Withdraw />} />
        <Route path="/direct" element={<DirectCommunity />} />
        <Route path="/community" element={<TotalCommunity />} />
        <Route path="/dr-reward" element={<RDTipsReward />} />
        <Route path="/level-reward" element={<CommunityReward />} />
        <Route path="/class-room" element={<ClassRoom />} />
        <Route path="/upline-bonus" element={<UplineBonus />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
