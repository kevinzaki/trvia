import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchGameId, gameId } from "../game/gameSlice";
import { setAnswers, allAnswers } from "./questionsSlice";
import { socket } from "../../api/socket";
import { Form, Button } from "react-bootstrap";

export default function Answers() {
  const [name, setName] = useState("");
  const [joinedRoom, setJoinedRoom] = useState(false);
  const { id } = useParams();
  const dispatch = useDispatch();
  const answers = useSelector(allAnswers);
  const idStatus = useSelector(state => state.game.status);
  const [selectedAns, setSelectedAns] = useState(null);
  const [finalAnswer, setFinalAnswer] = useState(false);
  useEffect(() => {
    if (idStatus === "idle") {
      dispatch(fetchGameId(id));
    }
  }, [idStatus, dispatch]);

  // useEffect(() => {
  //   if (id && name) {
  //     console.log(name);
  //     socket.emit("joinRoom", { id, name });
  //   }
  // }, []);

  useEffect(() => {
    socket.on("answers", data => {
      setFinalAnswer(false);
      setSelectedAns(null);
      dispatch(setAnswers(data));
    });
  });

  function joinRoom() {
    if (id && name) {
      socket.emit("joinRoom", { id, name });
      setJoinedRoom(true);
    }
  }

  function submitAnswer() {
    setFinalAnswer(true);
    socket.emit("submitAnswer", {
      roomId: id,
      userId: socket.id,
      ans: answers[selectedAns]
    });
  }

  return (
    <>
      {!joinedRoom && (
        <Form>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Name</Form.Label>
            <Form.Control
              value={name}
              onChange={e => setName(e.target.value)}
              type="text"
              placeholder="Enter name"
            />
            <Form.Text className="text-muted">
              Your name will be displayed to other players.
            </Form.Text>
          </Form.Group>
          <Button variant="primary" type="submit" onClick={() => joinRoom()}>
            Join Game
          </Button>
        </Form>
      )}
      {joinedRoom && (
        <div>
          {name} ANSWERS {id} {answers.length}
          {answers.length &&
            answers.map((answer, idx) => (
              <Button
                key={idx}
                variant="outline-secondary"
                size="lg"
                block={true}
                active={selectedAns === idx}
                disabled={finalAnswer && selectedAns !== idx}
                onClick={() => setSelectedAns(idx)}
              >
                {answer}
              </Button>
            ))}
          {answers.length && !finalAnswer && (
            <Button
              variant="primary"
              size="lg"
              block
              onClick={() => submitAnswer()}
            >
              Final Answer
            </Button>
          )}
        </div>
      )}
    </>
  );
}
