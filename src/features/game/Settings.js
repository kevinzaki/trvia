import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { gameId, updateRoundSettings } from "./gameSlice";
import { fetchCategories, categories } from "../categories/categoriesSlice";
import { Form, Button } from "react-bootstrap";
import "./settingsOption.css";

export default function Settings() {
  const dispatch = useDispatch();
  const history = useHistory();

  const id = useSelector(gameId);
  const allCategories = useSelector(categories);
  const categoryStatus = useSelector(state => state.categories.status);

  const [roundSettings, setRoundSettings] = useState([]);

  useEffect(() => {
    if (categoryStatus === "idle") {
      dispatch(fetchCategories());
    }
    if (categoryStatus === "succeeded") {
      addRow();
    }
  }, [categoryStatus, dispatch]);

  const updateSettingsField = (index, propertyName) => e => {
    const settings = [...roundSettings];
    settings[index][propertyName] = parseInt(e.target.value);
    setRoundSettings(settings);
  };

  const deleteRound = index => {
    const settings = [...roundSettings].filter((curr, idx) => idx !== index);
    settings.forEach((curr, idx) => (curr.round = idx + 1));
    setRoundSettings(settings);
  };

  const addRow = () => {
    setRoundSettings([
      ...roundSettings,
      {
        round: roundSettings.length + 1,
        numOfQuestions: 5,
        timer: 30,
        category: allCategories[0].id
      }
    ]);
  };

  const startGame = () => {
    dispatch(updateRoundSettings(roundSettings));
    history.push(`/game/question/${id}`);
  };

  const allowedRoundCounts = [1, 2, 3, 4, 5];
  const allowedTimes = [15, 30, 45, 60];

  return (
    <div>
      <div className="option-grid option-grid-bg">
        <div className="option-item">#</div>
        <div className="option-item-left">Questions</div>
        <div className="option-item-left">Timer</div>
        <div className="option-item-left">Category</div>
        <div className="option-item">
          <Button
            className="btn-width"
            size="sm"
            onClick={() => addRow()}
            variant="success"
          >
            +
          </Button>
        </div>
      </div>
      {roundSettings.map(
        ({ round, numOfQuestions, timer, category }, index) => (
          <div key={round} className="option-grid">
            <div className="option-item">{round}</div>
            <div className="option-item">
              <Form.Control
                as="select"
                onChange={updateSettingsField(index, "numOfQuestions")}
                value={numOfQuestions}
              >
                {allowedRoundCounts.map((val, idx) => (
                  <option key={`round${idx}`} value={val}>
                    {val}
                  </option>
                ))}
              </Form.Control>
            </div>
            <div className="option-item">
              <Form.Control
                as="select"
                onChange={updateSettingsField(index, "timer")}
                value={timer}
              >
                {allowedTimes.map((val, idx) => (
                  <option key={`time${idx}`} value={val}>
                    {val}
                  </option>
                ))}
              </Form.Control>
            </div>
            <div className="option-item">
              <Form.Control
                as="select"
                value={category}
                onChange={updateSettingsField(index, "category")}
              >
                {allCategories.map(category => (
                  <option
                    value={category.id}
                    key={category.id}
                    id={category.id}
                  >
                    {category.name}
                  </option>
                ))}
              </Form.Control>
            </div>
            <div className="option-item">
              <Button
                className="btn-width"
                size="sm"
                onClick={() => deleteRound(index)}
                variant="danger"
                disabled={roundSettings.length === 1 ? true : false}
              >
                -
              </Button>
            </div>
          </div>
        )
      )}
      <button className="start-button btn-grad " onClick={startGame}>
        Start Game
      </button>
    </div>
  );
}
