import Cookies from "universal-cookie";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const cookies = new Cookies();
  const canvas_id = cookies.get("canvas_id");
  const sessin_token = cookies.get("session_token");
  console.log("canvas id from site: ", canvas_id);
  return (
    <div>
      <h1>Dashboard</h1>
    </div>
  );
}
