import "./StudentBar.css";

export default function StudentBar({name}) {
  return (
    <div className="student-wrapper">
      <div className="item">
        <input type="checkbox" name="student" id="student" />
        <label id="name" for="student">{name}</label>
      </div>
    </div>
  );
}
