import React from "react";
import { correctAns } from "./questionsSlice";
import { useSelector } from "react-redux";
import "./question.css";

export default function CorrectAnswer() {
  const answer = useSelector(correctAns);
  if (!answer) return null;
  return <div className="answer">{answer}</div>;
}
