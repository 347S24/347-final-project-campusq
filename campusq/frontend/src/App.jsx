import { useState } from "react";
import "./App.css";

// function App({username}) {
function App() {
  console.log("username is ", username);
  console.log(window);
  const [count, setCount] = useState(0);

  return (
    <>
      <div>app</div>
    </>
  );
}

export default App;
