import "./Student.css";

export default function Student() {
  return (
    <div id="wrapper">
      <div className="main-container">
        <div>Enter teacher office hours code:</div>
        <input id="input" type="text" name="code" maxLength={4} />
        <button for="code">Submit</button>
      </div>
    </div>
  );
}
