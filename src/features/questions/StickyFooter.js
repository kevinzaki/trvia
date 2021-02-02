import React from "react";
import "./question.css";

export default function StickyFooter(props) {
  return <div className="sticky">{props.children}</div>;
}
