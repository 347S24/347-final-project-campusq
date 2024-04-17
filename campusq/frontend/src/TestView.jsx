import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

export default function TestView() {
  const { code } = useParams();

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);

  const getInfo = async () => {
    const response = await fetch(
      "http://localhost:8000/api/officehoursession?code=" + code,
      {
        method: "GET",
        headers: {
          "Content-Type": "text/plain",
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      console.log("response data for questions:", data);
      setQuestions(data.questions);
    }
  };

  useEffect(() => {
    getInfo();
  }, []);

  return (
    <div>
      {questions.map((question, index) => (
        <div key={index}>{question}</div>
      ))}

      {}
    </div>
  );
}
