import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { gameId, updateRoundSettings } from "./gameSlice";
import { fetchCategories, categories } from "../categories/categoriesSlice";
import { Container, Form, Button, Table } from "react-bootstrap";

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
    <Container>
      <Link to={`/game/question/${id}`}>
        <Button>Start Game</Button>
      </Link>

      <Table responsive>
        <thead>
          <tr>
            <th>Round #</th>
            <th># Of Questions</th>
            <th>Timer</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          {roundSettings.map(
            ({ round, numOfQuestions, timer, category }, index) => (
              <tr>
                <td>{round}</td>
                <td>
                  <Form.Control
                    as="select"
                    onChange={updateSettingsField(index, "numOfQuestions")}
                    value={numOfQuestions}
                  >
                    {allowedRoundCounts.map(val => (
                      <option value={val}>{val}</option>
                    ))}
                  </Form.Control>
                </td>
                <td>
                  <Form.Control
                    as="select"
                    onChange={updateSettingsField(index, "timer")}
                    value={timer}
                  >
                    {allowedTimes.map(val => (
                      <option value={val}>{val}</option>
                    ))}
                  </Form.Control>
                </td>
                <td>
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
                </td>
              </tr>
            )
          )}
        </tbody>
        <tfoot>
          <tr>
            <th colSpan="4">
              <Button
                onClick={() => addRow()}
                variant="outline-secondary"
                block
              >
                Add Round
              </Button>
            </th>
          </tr>
        </tfoot>
      </Table>
      <Button onClick={startGame} block>
        Start Game
      </Button>
    </Container>
  );
}
