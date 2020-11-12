import React from "react";
import { currentQuestion } from "./questionsSlice";
import { useSelector } from "react-redux";
import { Card } from "react-bootstrap";

export default function SingleQuestion() {
  const question = useSelector(currentQuestion);
  if (!question) return null;
  return <div>{question}</div>;
}
