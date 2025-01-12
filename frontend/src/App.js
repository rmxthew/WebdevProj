import {
  BrowserRouter,
  Routes,
  Route,

} from "react-router-dom"
import { useEffect } from "react";
import Shoes from "./pages/Shoes";
import Add from "./pages/Add";
import Landingpage from "./pages/Landingpage";
import LandingPage2 from "./pages/LandingPage2";
import EditProfile from "./pages/EditProfile";
import SignUp from "./pages/SignUp"
import Update from "./pages/Update";
import LoginPage from "./pages/LoginPage";
import Products from "./pages/Products";
import CheckoutPage from "./pages/CheckoutPage";
import Cart from "./pages/Cart";
import UserOrders from"./pages/UserOrders";
import PendingOrders from"./pages/PendingOrders";
import ViewUsers from"./pages/viewusers";
import '@fortawesome/fontawesome-free/css/all.min.css';



function App() {

  useEffect(() => {
    localStorage.clear();
  }, []);


  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        <Route path = "/" element={<Landingpage/>}></Route>
        <Route path = "/LandingPage2" element={<LandingPage2/>}></Route>
        <Route path = "/EditProfile" element={<EditProfile/>}></Route>
        <Route path = "/Products" element={<Products/>}></Route>
        <Route path = "/Cart" element={<Cart/>}></Route>
        <Route path = "/checkoutpage" element={<CheckoutPage/>}></Route>
        <Route path = "/UserOrders" element={<UserOrders/>}></Route>
        <Route path = "/PendingOrders" element={<PendingOrders/>}></Route>
        <Route path = "/viewusers" element={<ViewUsers/>}></Route>
        <Route path="/login" element={<LoginPage/>} />
        <Route path = "/signup" element={<SignUp/>}></Route>
        <Route path = "/shoes" element={<Shoes/>}></Route>
        <Route path = "/add" element={<Add/>}></Route>
        <Route path = "/update/:id" element={<Update/>}></Route>
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
