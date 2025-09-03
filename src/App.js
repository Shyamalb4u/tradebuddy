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
      </Routes>
    </HashRouter>
  );
}

export default App;
