import { useState } from "react";
import "./App.css";
import { Navigate, Outlet } from "react-router-dom";
import Cookies from "universal-cookie";

// function App({username}) {
function App() {
  console.log("Checking cookie");
  const cookies = new Cookies();
  const cookie = cookies.get("session_token");
  if (cookie) {
    console.log("Cookie exists");

    return <Outlet />;
  } else {
    console.log("Cookie does not exist");
    return <Navigate to="/login" />;
  }
}

export default App;
