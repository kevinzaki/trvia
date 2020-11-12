import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  roundCount,
  questionCount,
  numberOfQuestionsPerRound,
  numberOfRounds,
  categories,
  incrementRound,
  incrementQuestion,
  setScores,
  setQuestionCount,
  setIsGameOver,
  setIsRoundOver
} from "../game/gameSlice";
import {
  setQuestion,
  currentQuestion,
  setCorrectAnswer,
  correctAns,
  setAnswers
} from "./questionsSlice";
import { useParams, useHistory } from "react-router-dom";
import { socket } from "../../api/socket";
import { Container, Button } from "react-bootstrap";
import Scores from "../scores/Scores";
import { Link } from "react-router-dom";
import SingleQuestion from "./SingleQuestion";
import CorrectAnswer from "./CorrectAnswer";
import ActionButton from "./ActionButton";

export default function Question() {
  const { id } = useParams();

  const dispatch = useDispatch();
  const questionPerRound = useSelector(numberOfQuestionsPerRound);
  const numOfRounds = useSelector(numberOfRounds);
  const categoryIds = useSelector(categories);
  const question = useSelector(currentQuestion);
  const answer = useSelector(correctAns);

  const currRoundCount = useSelector(roundCount);
  const currQuestionCount = useSelector(questionCount);

  const [timer, setTimer] = useState(-1);

  const [showScores, setShowScores] = useState(false);

  let history = useHistory();

  useEffect(() => {
    socket.emit("startGame", {
      roomId: id,
      numberOfRounds: numOfRounds,
      numberOfQuestionsPerRound: questionPerRound,
      categoryIds
    });
    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    socket.on("gameStarted", () => socket.emit("getQuestion", { roomId: id }));

    socket.on("question", q => {
      dispatch(setQuestion(q));
      setTimer(10);
    });

    socket.on("correctAnswer", data => {
      dispatch(setCorrectAnswer(data));
    });

    socket.on("scores", scores => {
      dispatch(setScores(scores.scores));
      setShowScores(true);
    });
  }, []);

  useInterval(() => {
    if (timer > 0) setTimer(timer - 1);
    else if (timer === 0) {
      socket.emit("getCorrectAnswer", { roomId: id });
      setTimer(-1);
    }
  }, 1000);

  useEffect(() => {
    dispatch(setCorrectAnswer(null));
    dispatch(setQuestion(null));

    if (currRoundCount > numOfRounds) {
      dispatch(setIsGameOver(true));
      socket.emit("endGame", { roomId: id });
    } else if (currQuestionCount > questionPerRound) {
      dispatch(setIsRoundOver(true));
      socket.emit("getScores", { roomId: id });
    } else {
      socket.emit("getQuestion", { roomId: id });
    }
  }, [currRoundCount, currQuestionCount]);

  function nextQuestion() {
    dispatch(incrementQuestion());
  }

  function nextRound() {
    dispatch(incrementRound());
    dispatch(setIsRoundOver(false));
    dispatch(setQuestionCount(1));
  }

  function endGame() {
    // reset game ID later
    history.push("/create");
  }

  return (
    <Container>
      timer {timer}
      Question {id}
      <SingleQuestion />
      <CorrectAnswer />
      <Scores />
      <ActionButton
        onQuestion={nextQuestion}
        onRound={nextRound}
        onGame={endGame}
      />
    </Container>
  );
}

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest function.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
