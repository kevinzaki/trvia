import React from "react";
import "./answers.css";

export default function Option({
  disabled,
  active,
  select,
  onClick,
  children
}) {
  let classes = "option-btn";
  if (disabled) {
    classes += " disabled";
    onClick = null;
  }
  if (active) classes += " active";
  if (select) classes += " select";
  return (
    <div onClick={onClick} className={classes}>
      {children}
    </div>
  );
}
