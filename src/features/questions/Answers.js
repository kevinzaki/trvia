import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchGameId } from "../game/gameSlice";
import { setAnswers, allAnswers } from "./questionsSlice";
import { socket } from "../../api/socket";
import { Form, Container } from "react-bootstrap";
import Option from "./Option";
import "./answers.css";

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
  }, [idStatus, dispatch, id]);

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
    <div className="answer-bg">
      {!joinedRoom && (
        <Container className="answers-container">
          <h1 className="txt-center">Join Game</h1>
          <Form>
            <Form.Group controlId="formBasicEmail">
              <Form.Control
                className="answers-txt-box"
                value={name}
                onChange={e => setName(e.target.value)}
                type="text"
                placeholder="Enter a Name or Alias"
              />
            </Form.Group>
            <button
              className="action-button"
              type="submit"
              onClick={() => joinRoom()}
            >
              SUBMIT
            </button>
          </Form>
        </Container>
      )}
      {joinedRoom && (
        <Container className="answers-container">
          {answers.length > 0 &&
            answers.map((answer, idx) => (
              <Option
                key={idx}
                active={selectedAns === idx}
                disabled={finalAnswer && selectedAns !== idx}
                onClick={() => setSelectedAns(idx)}
              >
                {answer}
              </Option>
            ))}
          {answers.length > 0 && !finalAnswer && (
            <button className="action-button" onClick={() => submitAnswer()}>
              Final Answer
            </button>
          )}
        </Container>
      )}
    </div>
  );
}
