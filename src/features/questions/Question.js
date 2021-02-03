import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  roundCount,
  questionCount,
  incrementRound,
  incrementQuestion,
  setScores,
  setQuestionCount,
  setIsRoundOver
} from "../game/gameSlice";
import {
  setQuestion,
  currentQuestion,
  setCorrectAnswer,
  correctAns
} from "./questionsSlice";
import { useParams, useHistory } from "react-router-dom";
import { socket } from "../../api/socket";
import { Container } from "react-bootstrap";
import Scores from "../scores/Scores";
import SingleQuestion from "./SingleQuestion";
import CorrectAnswer from "./CorrectAnswer";
import ActionButton from "./ActionButton";
import "./question.css";
import Timer from "./Timer";
import QuestionNumber from "./QuestionNumber";

export default function Question() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();

  const roundSettings = useSelector(state => state.game.roundSettings);
  const currRoundCount = useSelector(roundCount);
  const currQuestionCount = useSelector(questionCount);
  const question = useSelector(currentQuestion);

  const [timer, setTimer] = useState(-1);
  const [numOfQuestions, setNumOfQuestions] = useState(1);

  const rounds = roundSettings.length;

  useEffect(() => {
    socket.emit("startGame", {
      roomId: id,
      roundSettings
    });

    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    if (roundSettings.length)
      setNumOfQuestions(roundSettings[currRoundCount - 1].numOfQuestions);
  }, [currRoundCount]);

  useEffect(() => {
    socket.on(
      "gameStarted",
      () => dispatch(setQuestion(null))
      //socket.emit("getQuestion", { roomId: id, round: currRoundCount })
    );

    socket.on("question", q => {
      dispatch(setQuestion(q));
      console.log(roundSettings[currRoundCount - 1].timer);
      setTimer(roundSettings[currRoundCount - 1].timer);
    });

    socket.on("correctAnswer", data => {
      dispatch(setCorrectAnswer(data));
    });

    socket.on("scores", scores => {
      dispatch(setScores(scores.scores));
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
    if (question !== null) dispatch(setQuestion(null));

    if (currQuestionCount > roundSettings[currRoundCount - 1].numOfQuestions) {
      dispatch(setIsRoundOver(true));
      socket.emit("getScores", { roomId: id });
    } else {
      socket.emit("getQuestion", { roomId: id, round: currRoundCount });
    }
  }, [currRoundCount, currQuestionCount]);

  const nextQuestion = () => {
    dispatch(incrementQuestion());
  };

  const nextRound = () => {
    if (currRoundCount === rounds) {
      endGame();
    } else {
      dispatch(incrementRound());
      dispatch(setIsRoundOver(false));
      dispatch(setQuestionCount(1));
    }
  };

  const endGame = () => {
    socket.emit("endGame", { roomId: id });
    history.push("/");
  };

  return (
    <Container className="question-bg" fluid>
      <Timer
        currTime={timer}
        maxTime={roundSettings[currRoundCount - 1].timer}
      />
      <QuestionNumber
        currQuestion={currQuestionCount}
        numOfQuestions={numOfQuestions}
      />
      <SingleQuestion />
      <CorrectAnswer />
      <Scores />
      <ActionButton onQuestion={nextQuestion} onRound={nextRound} />
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
