import React from "react";
import { correctAns } from "./questionsSlice";
import { useSelector } from "react-redux";

export default function CorrectAnswer() {
  const answer = useSelector(correctAns);
  if (!answer) return null;
  return <div>{answer}</div>;
}
