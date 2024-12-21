import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import PageNotFound from "./pages/PageNotFound";
import Account from "./pages/Account";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Settings from "./pages/Settings";
import StockOrderList from "./pages/StockOrderList";
import Customers from "./pages/Customers";
import CustomerDetails from "./pages/CustomerDetails";
import AddCustomer from "./pages/AddCustomer";
import AddTransaction from "./pages/AddTransaction";
import GlobalStyles from "./styles/GlobalStyles";
import AppLayout from "./ui/AppLayout";

const App = () => {
  return (
    <>
      <GlobalStyles />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<Navigate replace to="customers" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="settings" element={<Settings />} />
            <Route path="account" element={<Account />} />
            <Route path="stockOrderList" element={<StockOrderList />} />
            <Route path="customers" element={<Customers />} />
            <Route path="customerDetails" element={<CustomerDetails />} />
            <Route path="addCustomer" element={<AddCustomer />} />
            <Route path="addTransaction" element={<AddTransaction />} />
          </Route>
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
