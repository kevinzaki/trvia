import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  setNumberOfRounds,
  setNumberOfQuestionsPerRound,
  numberOfQuestionsPerRound,
  numberOfRounds,
  updateSelectedCategories,
  gameId
} from "./gameSlice";
import { fetchCategories, categories } from "../categories/categoriesSlice";
import { Container, Form, Button } from "react-bootstrap";
import { socket } from "../../api/socket";

export default function Settings() {
  const dispatch = useDispatch();
  const numOfQuestions = useSelector(numberOfQuestionsPerRound);
  const numOfRounds = useSelector(numberOfRounds);
  const id = useSelector(gameId);

  const allCategories = useSelector(categories);
  const categoryStatus = useSelector(state => state.categories.status);
  //const idStatus = useSelector(state => state.game.status);

  useEffect(() => {
    if (id)
      socket.emit("createRoom", {
        id,
        numberOfRounds: numOfRounds,
        numberOfQuestionsPerRound: numOfQuestions,
        categoryIds: allCategories
      });
  }, [id]);

  useEffect(() => {
    socket.on("newPlayer", data => {
      console.log(data);
    });
  }, []);

  //   useEffect(() => {
  //     if (idStatus === "idle") {
  //       dispatch(fetchGameId(socket.id));
  //     }
  //     //console.log(socket.id);
  //     socket.emit("YASHIMASH");
  //   }, [idStatus, dispatch]);

  useEffect(() => {
    if (categoryStatus === "idle") {
      dispatch(fetchCategories());
    }
  }, [categoryStatus, dispatch]);

  const selectedCategories = arr => {
    const selectedIds = Array.from(arr).map(item => parseInt(item.id));
    console.log(selectedIds);
    dispatch(updateSelectedCategories(selectedIds));
  };

  return (
    <Container>
      <Link to={`/game/question/${id}`}>
        <Button>Start Game</Button>
      </Link>
      <Form>
        <Form.Group>
          <Form.Label>Number Of Rounds</Form.Label>
          <Form.Control
            as="select"
            onChange={e =>
              dispatch(setNumberOfRounds(parseInt(e.target.value)))
            }
            value={numOfRounds}
          >
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5</option>
          </Form.Control>
        </Form.Group>
        <Form.Group>
          <Form.Label>Number Of Questions Per Round</Form.Label>
          <Form.Control
            as="select"
            onChange={e =>
              dispatch(setNumberOfQuestionsPerRound(parseInt(e.target.value)))
            }
            value={numOfQuestions}
          >
            <option>5</option>
            <option>6</option>
            <option>7</option>
            <option>8</option>
            <option>9</option>
            <option>10</option>
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="exampleForm.ControlSelect2">
          <Form.Label>Example multiple select</Form.Label>
          <Form.Control
            as="select"
            onChange={e => selectedCategories(e.target.selectedOptions)}
            multiple
          >
            {allCategories.map(category => (
              <option key={category.id} id={category.id}>
                {category.name}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
      </Form>
      <div>numberOfQuestionsPerRound: {numOfQuestions}</div>
      <div>numOfQuestions: {numOfRounds}</div>
    </Container>
  );
}
